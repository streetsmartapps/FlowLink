import { Message, Connection } from '../types';
import { getSecureApiResponse } from '../backend/api';

/**
 * Fetches a streaming chat response by calling the secure, simulated backend API.
 * This function no longer contains the direct Gemini API call, enhancing security.
 *
 * @param prompt The user's input message.
 * @param activeConnections A list of the user's active connections.
 * @param messages The current chat history.
 * @returns An async generator that yields partial message updates from the backend.
 */
export async function* getChatResponseStream(
  prompt: string,
  activeConnections: Connection[],
  messages: Message[]
): AsyncGenerator<Partial<Message>> {
  // Delegate the call to the secure backend simulation
  yield* getSecureApiResponse(prompt, activeConnections, messages);
}
