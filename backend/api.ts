import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import { Connection, Message, Action } from '../types';

/**
 * This function simulates a secure, server-side API endpoint.
 * In a real application, this logic would run on a server, not in the client bundle.
 */

// FIX: Initialize the Gemini client using the API_KEY from environment variables as required by the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getActionGenerationPrompt = (activeConnections: Connection[], messages: Message[]) => {
    let systemInstruction = `You are FlowLink, an AI assistant that helps users connect their chat conversations to their apps.
- Your primary goal is to provide a helpful text response to the user's prompt.
- Based on the user's prompt and their active application connections, you can also suggest one or more "actions" they can take.
- Actions are things like drafting an email, creating a document, or posting a message.
- Only suggest actions for which the user has an active connection.
- If the user's prompt doesn't clearly imply an action, DO NOT suggest any. Just provide a text response.
- Your entire response MUST be in the JSON format defined in the schema.
- The 'text' field in the JSON response should contain your direct, conversational answer to the user's prompt.
- The 'actions' field should be an array of suggested actions, or an empty array if none are appropriate.
- For a 'gmail' action, the label should be like "Draft: [Email Subject]". The content should be the email body. The meta object should include the 'subject' and a potential 'to' address if mentioned.
- For a 'gdocs' action, the label should be like "Create: [Document Title]". The content should be the document's body. The meta object should include the 'documentTitle'.
- For a 'slack' action, the label should be like "Post to #[channel]". The content should be the message to post. The meta object should include the 'channel'.
- Be creative and helpful in the actions you suggest.`;

    if (activeConnections.length > 0) {
        systemInstruction += `\n\nThe user has the following apps connected: ${activeConnections.map(c => c.name).join(', ')}. Prioritize suggesting actions for these apps if relevant.`;
    } else {
        systemInstruction += `\n\nThe user has no apps connected, so you cannot suggest any actions.`;
    }

    if (messages.length > 1) { // more than just the user's latest prompt
        systemInstruction += `\n\nHere is the recent conversation history for context:\n${messages.slice(0, -1).map(m => `${m.role}: ${m.text}`).join('\n')}`;
    }

    return systemInstruction;
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        text: {
            type: Type.STRING,
            description: "Your conversational response to the user's prompt."
        },
        actions: {
            type: Type.ARRAY,
            description: "A list of suggested actions based on the prompt and connected apps. Can be empty.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        enum: ['gmail', 'gdocs', 'slack', 'instagram'],
                        description: "The type of action, corresponding to a connected app."
                    },
                    label: {
                        type: Type.STRING,
                        description: "A short, descriptive label for the action button (e.g., 'Draft: Project Update Email')."
                    },
                    content: {
                        type: Type.STRING,
                        description: "The main content for the action (e.g., email body, document content)."
                    },
                    meta: {
                        type: Type.OBJECT,
                        description: "Additional metadata for the action.",
                        properties: {
                            subject: { type: Type.STRING, description: "Email subject line." },
                            to: { type: Type.STRING, description: "Email recipient." },
                            documentTitle: { type: Type.STRING, description: "Title for the Google Doc." },
                            channel: { type: Type.STRING, description: "Slack channel name (e.g., 'general')." }
                        }
                    }
                },
                required: ['type', 'label', 'content']
            }
        }
    },
    required: ['text', 'actions']
};

export async function* getSecureApiResponse(
  prompt: string,
  activeConnections: Connection[],
  messages: Message[]
): AsyncGenerator<Partial<Message>> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: getActionGenerationPrompt(activeConnections, messages),
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        const responseData = JSON.parse(jsonText);
        
        const fullText = responseData.text || '';
        const actions: Action[] = (responseData.actions || []).map((a: any) => ({
            ...a,
            id: self.crypto.randomUUID()
        }));

        // Simulate a stream for the text part for better UX.
        let streamedText = '';
        const words = fullText.split(/(\s+)/); // Split by space, keeping spaces
        for (const word of words) {
            await new Promise(res => setTimeout(res, 30)); // Simulate typing
            streamedText += word;
            yield { text: streamedText };
        }
        
        // Finally, yield the complete message with actions.
        yield { text: fullText, actions: actions };

    } catch (e) {
        console.error("Error generating chat response:", e);
        const errorMessage = "I'm sorry, I encountered an error. Please try again.";
        yield { text: errorMessage, actions: [] };
    }
}
