import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, Connection, Message, ToastMessage, Action } from '../types';
import { PaperAirplaneIcon, CopyIcon } from './Icons';
import { useModal } from './Modal';

const EmptyState: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => {
    const prompts = [
        "Write a professional email to my team about the project deadline",
        "Brainstorm a few names for a new coffee brand",
        "Draft a Slack message announcing the new feature launch"
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="text-4xl font-bold text-gray-800 mb-2">FlowLink</div>
            <p className="mb-8">Your AI assistant for seamless workflows.</p>
            <div className="w-full max-w-md space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Try a prompt:</h4>
                {prompts.map(p => (
                    <button key={p} onClick={() => onPromptClick(p)} className="w-full bg-white hover:bg-gray-100 text-left text-sm text-gray-700 p-3 rounded-lg border border-gray-200 transition-colors">
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
};

const LoadingIndicator = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);


const MessageBubble: React.FC<{ message: Message; onActionClick: (action: Action) => void; onCopy: (text: string) => void }> = ({ message, onActionClick, onCopy }) => {
    const isModel = message.role === 'model';
    return (
        <div className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
            <div className={`group relative max-w-2xl rounded-2xl px-4 py-3 ${isModel ? 'bg-white border border-gray-200 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                <div className="whitespace-pre-wrap">{message.text || <LoadingIndicator />}</div>
                {message.actions && message.actions.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-3 flex flex-wrap gap-2">
                        {message.actions.map(action => (
                            <button
                                key={action.id}
                                onClick={() => onActionClick(action)}
                                className="px-3 py-1.5 text-xs bg-gray-100 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
                 {isModel && message.text && (
                    <button
                        onClick={() => onCopy(message.text)}
                        className="absolute top-2 right-2 p-1.5 bg-white/50 rounded-full text-gray-500 hover:bg-gray-200/80 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy message"
                    >
                        <CopyIcon className="w-4 h-4" />
                    </button>
                 )}
            </div>
        </div>
    );
};


interface ChatInterfaceProps {
  user: User;
  connections: Connection[];
  onActionUsed: () => void;
  messages: Message[];
  showToast: (options: { message: string; type?: ToastMessage['type'] }) => void;
  onSendMessage: (text: string) => Promise<void>;
  onUpgrade: () => void;
}

export default function ChatInterface({ user, connections, onActionUsed, messages, onSendMessage, showToast, onUpgrade }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { showModal } = useModal();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
          textarea.style.height = 'auto';
          const scrollHeight = textarea.scrollHeight;
          textarea.style.height = `${scrollHeight}px`;
      }
  }, [input]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    
    const textToSend = input;
    setInput('');
    setIsSending(true);
    
    await onSendMessage(textToSend);

    setIsSending(false);
  };
  
  const handleActionClick = (action: Action) => {
    if (user.tier === 'free' && user.actionsUsed >= user.actionsLimit) {
        showToast({ message: "You've reached your action limit. Upgrade to Pro for unlimited actions.", type: 'error' });
        return;
    }

    switch (action.type) {
        case 'gmail':
            showModal({
                title: 'Draft Email',
                confirmText: 'Create Draft',
                renderContent: (inputs, setInputs) => (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">Review and edit the email before creating a draft.</p>
                        <input type="text" value={inputs.to || action.meta?.to || ''} onChange={(e) => setInputs(p => ({...p, to: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Recipient" />
                        <input type="text" value={inputs.subject || action.meta?.subject || ''} onChange={(e) => setInputs(p => ({...p, subject: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Subject" />
                        <textarea value={inputs.content || action.content} onChange={(e) => setInputs(p => ({...p, content: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={6} />
                    </div>
                ),
                onConfirm: (inputs) => {
                    onActionUsed();
                    showToast({ message: `Email draft for "${inputs?.subject || action.meta?.subject}" created.` });
                },
            });
            break;

        case 'gdocs':
            showModal({
                title: 'Create Google Doc',
                confirmText: 'Create Document',
                renderContent: (inputs, setInputs) => (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">Review and edit the document before saving to Google Docs.</p>
                        <input type="text" value={inputs.documentTitle || action.meta?.documentTitle || ''} onChange={(e) => setInputs(p => ({...p, documentTitle: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Document Title" />
                        <textarea value={inputs.content || action.content} onChange={(e) => setInputs(p => ({...p, content: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={8} />
                    </div>
                ),
                onConfirm: (inputs) => {
                    onActionUsed();
                    showToast({ message: `Document "${inputs?.documentTitle || action.meta?.documentTitle}" created.` });
                },
            });
            break;

        case 'slack':
            showModal({
                title: `Post to Slack`,
                confirmText: 'Post',
                renderContent: (inputs, setInputs) => (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">Review the message and specify a channel to post to.</p>
                         <textarea value={inputs.content || action.content} onChange={(e) => setInputs(p => ({...p, content: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={5} />
                        <input type="text" value={inputs.channel || action.meta?.channel || ''} onChange={(e) => setInputs(p => ({...p, channel: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="#general" />
                    </div>
                ),
                onConfirm: (inputs) => {
                    const channel = inputs?.channel || 'general';
                    onActionUsed();
                    showToast({ message: `Message posted to #${channel} in Slack.` });
                },
            });
            break;

        default:
             showModal({
                title: `Confirm Action: ${action.label}`,
                confirmText: 'Confirm',
                renderContent: () => <p className="text-sm text-gray-600">Do you want to proceed with this action?</p>,
                onConfirm: () => {
                    onActionUsed();
                    showToast({ message: `Action "${action.label}" was successfully simulated.` });
                },
            });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({ message: "Copied to clipboard!" });
  };

  const showUpgradePrompt = user.tier === 'free' && user.actionsLimit > 0 && user.actionsUsed >= user.actionsLimit - 2;
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
            <EmptyState onPromptClick={(p) => setInput(p)}/>
        ) : (
             messages.map((message) => (
                <MessageBubble key={message.id} message={message} onActionClick={handleActionClick} onCopy={handleCopy}/>
            ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-200 p-6 bg-white">
        {showUpgradePrompt && (
          <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-lg mb-4 text-center">
            <p className="text-sm text-yellow-800">
              ⚠️ You have {user.actionsLimit - user.actionsUsed} free actions left. 
              <button 
                onClick={onUpgrade}
                className="ml-2 text-blue-600 underline font-semibold"
              >
                Upgrade to Pro for unlimited actions
              </button>
            </p>
          </div>
        )}
        <form onSubmit={handleSend} className="flex items-start space-x-4">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                }
            }}
            placeholder="Ask FlowLink to do something for you..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-hidden"
            style={{maxHeight: '150px'}}
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
