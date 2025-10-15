import React from 'react';
import { User, Page, Connection, Message, ToastMessage } from '../types';
import AppSidebar from './AppSidebar';
import ChatInterface from './ChatInterface';
import ConnectionsManager from './ConnectionsManager';
import SettingsManager from './SettingsManager';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';

interface AppLayoutProps {
  user: User;
  connections: Connection[];
  currentPage: Page;
  messages: Message[];
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onToggleConnection: (connectionId: Connection['id']) => void;
  onActionUsed: () => void;
  onUpgrade: () => void;
  showToast: (options: { message: string; type?: ToastMessage['type'] }) => void;
  onSendMessage: (text: string) => Promise<void>;
}

export default function AppLayout({
  user,
  connections,
  currentPage,
  messages,
  onNavigate,
  onLogout,
  onToggleConnection,
  onActionUsed,
  onUpgrade,
  showToast,
  onSendMessage,
}: AppLayoutProps) {

  const renderCurrentPage = () => {
    switch (currentPage) {
      case Page.CHAT:
        return <ChatInterface user={user} connections={connections} onActionUsed={onActionUsed} messages={messages} showToast={showToast} onSendMessage={onSendMessage} onUpgrade={onUpgrade} />;
      case Page.CONNECTIONS:
        return <ConnectionsManager connections={connections} onToggleConnection={onToggleConnection} />;
      case Page.SETTINGS:
        return <SettingsManager user={user} onUpgrade={onUpgrade} />;
      case Page.PRIVACY:
        return <PrivacyPage onNavigate={onNavigate} isEmbedded={true} />;
      case Page.TERMS:
        return <TermsPage onNavigate={onNavigate} isEmbedded={true} />;
      default:
        return <ChatInterface user={user} connections={connections} onActionUsed={onActionUsed} messages={messages} showToast={showToast} onSendMessage={onSendMessage} onUpgrade={onUpgrade} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar
        user={user}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {renderCurrentPage()}
      </main>
    </div>
  );
}
