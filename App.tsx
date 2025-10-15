import React, { useState, useEffect, useCallback } from 'react';
import { Page, User, Connection, Message, ToastMessage, Action, ToastType } from './types';
import LandingPage from './components/LandingPage';
import AppLayout from './components/AppLayout';
import {
  ChatIcon,
  ConnectionsIcon,
  DocsIcon,
  GmailIcon,
  InstagramIcon,
  SettingsIcon,
  SlackIcon,
} from './components/Icons';
import { ToastContainer } from './components/Toast';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import { getChatResponseStream } from './services/geminiService';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { STRIPE_PUBLISHABLE_KEY } from './lib/stripe';

const initialConnections: Connection[] = [
    { id: 'gmail', name: 'Gmail', icon: <GmailIcon className="w-5 h-5" />, description: 'Draft emails directly from AI conversations.', connected: false },
    { id: 'gdocs', name: 'Google Docs', icon: <DocsIcon className="w-5 h-5" />, description: 'Save content directly to Google Docs.', connected: false },
    { id: 'slack', name: 'Slack', icon: <SlackIcon className="w-5 h-5" />, description: 'Post messages to your Slack channels.', connected: false, teamName: "ACME Inc." },
    { id: 'instagram', name: 'Instagram', icon: <InstagramIcon className="w-5 h-5" />, description: 'Draft and schedule social media posts.', connected: false, comingSoon: true },
];

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = self.crypto.randomUUID();
    setToasts(toasts => [...toasts, { id, message, type }]);
  }, []);

  const fetchData = useCallback(async (session: Session) => {
    setIsLoading(true);
    if (!session.user) {
        setIsLoading(false);
        return;
    }

    // Fetch user, connections, and messages in parallel for faster loading
    const [userResponse, connectionData, messageData] = await Promise.all([
        supabase.from('users').select('*').eq('id', session.user.id).single(),
        supabase.from('connections').select('*').eq('userId', session.user.id),
        supabase.from('messages').select('*').eq('userId', session.user.id).order('createdAt', { ascending: true })
    ]);

    // Process user profile
    let finalUserData: User;
    if (userResponse.error && userResponse.error.code === 'PGRST116') { // Not found
        const newUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata.full_name || 'New User',
            image: session.user.user_metadata.avatar_url,
            tier: 'free',
            actionsUsed: 0,
            actionsLimit: 10,
        };
        const { data: createdUserData, error: createUserError } = await supabase
            .from('users').insert(newUser).select().single();
        if (createUserError) {
            console.error("Error creating user:", createUserError);
            addToast('Error setting up your account.', 'error');
            setIsLoading(false); return;
        }
        finalUserData = createdUserData as User;
    } else if (userResponse.error) {
        console.error("Error fetching user:", userResponse.error);
        addToast('Error fetching your profile.', 'error');
        setIsLoading(false); return;
    } else {
        finalUserData = userResponse.data as User;
    }
    setUser(finalUserData);

    // Process connections
    if (connectionData.error) {
        console.error("Error fetching connections:", connectionData.error);
    } else if (connectionData.data) {
        const updatedConnections = initialConnections.map(c => {
            const savedConn = connectionData.data.find(sc => sc.platform === c.id);
            return savedConn ? { ...c, connected: savedConn.connected, teamName: savedConn.teamName || c.teamName } : c;
        });
        setConnections(updatedConnections);
    }
    
    // Process messages
    if (messageData.error) {
        console.error("Error fetching messages:", messageData.error);
    } else if (messageData.data) {
        const loadedMessages = messageData.data.map((m: any) => ({
            id: m.id,
            role: m.role,
            text: m.content,
            actions: m.actions || [],
        }));
        setMessages(loadedMessages);
    }

    setIsLoading(false);
  }, [addToast]);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchData(session);
        setCurrentPage(Page.CHAT);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchData(session);
        setCurrentPage(Page.CHAT);
      } else {
        setUser(null);
        setMessages([]);
        setConnections(initialConnections);
        setCurrentPage(Page.LOGIN);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
        addToast('Failed to log in.', 'error');
        console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };
  
  const handleToggleConnection = async (connectionId: Connection['id']) => {
    if (!user || !session) return;
    const connection = connections.find(c => c.id === connectionId);
    if (!connection || connection.comingSoon) return;

    const newConnectedState = !connection.connected;
    
    // Optimistic UI update
    setConnections(conns => conns.map(c => c.id === connectionId ? { ...c, connected: newConnectedState } : c));

    const { error } = await supabase
        .from('connections')
        .upsert({ 
            userId: user.id, 
            platform: connectionId, 
            connected: newConnectedState 
        }, { onConflict: 'userId, platform' });

    if (error) {
        addToast(`Failed to update ${connection.name} connection.`, 'error');
        // Revert UI update on error
        setConnections(conns => conns.map(c => c.id === connectionId ? { ...c, connected: !newConnectedState } : c));
    } else {
        addToast(`${connection.name} ${newConnectedState ? 'connected' : 'disconnected'}.`);
    }
  };
  
  const handleActionUsed = async () => {
    if (!user) return;
    const newCount = user.actionsUsed + 1;
    setUser({ ...user, actionsUsed: newCount });
    await supabase.from('users').update({ actionsUsed: newCount }).eq('id', user.id);
  };

  const handleUpgrade = () => {
    if (!STRIPE_PUBLISHABLE_KEY) {
      addToast("Stripe payments are not configured.", 'error');
      return;
    }
    // This is where you would trigger the Stripe Checkout flow.
    // It requires creating a checkout session on the server with your secret key.
    // Since this is a client-only demo, we'll log to the console and show a toast.
    console.log("Initiating upgrade with Stripe key:", STRIPE_PUBLISHABLE_KEY);
    addToast("Redirecting to Stripe checkout is a premium feature in this demo.");
  };
  
  const handleSendMessage = async (text: string) => {
    if (!user) return;

    const userMessage: Message = {
      id: self.crypto.randomUUID(),
      role: 'user',
      text,
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    await supabase.from('messages').insert({
        id: userMessage.id,
        userId: user.id,
        role: userMessage.role,
        content: userMessage.text,
        actions: [],
    });
    
    const modelMessage: Message = {
      id: self.crypto.randomUUID(),
      role: 'model',
      text: '',
      actions: [],
    };
    
    setMessages(prev => [...prev, modelMessage]);

    try {
      const activeConnections = connections.filter(c => c.connected);
      const stream = getChatResponseStream(text, activeConnections, newMessages);

      let finalMessageState: Message | null = null;
      
      for await (const chunk of stream) {
        setMessages(prev => prev.map(m => 
            m.id === modelMessage.id 
            ? { ...m, text: chunk.text ?? m.text, actions: chunk.actions ?? m.actions } 
            : m
        ));
        finalMessageState = { 
            ...modelMessage, 
            text: chunk.text ?? finalMessageState?.text ?? '', 
            actions: chunk.actions ?? finalMessageState?.actions ?? []
        };
      }
      
      if(finalMessageState) {
          await supabase.from('messages').insert({
            id: finalMessageState.id,
            userId: user.id,
            role: finalMessageState.role,
            content: finalMessageState.text,
            actions: finalMessageState.actions,
        });
      }

    } catch (error) {
      console.error("Error getting chat response:", error);
      const errorMessage = "I'm having trouble connecting. Please try again.";
      addToast("Sorry, something went wrong with the AI.", 'error');
       setMessages(prev => prev.map(m => 
            m.id === modelMessage.id 
            ? { ...m, text: errorMessage }
            : m
        ));
        await supabase.from('messages').insert({
            id: modelMessage.id,
            userId: user.id,
            role: 'model',
            content: errorMessage,
            actions: [],
        });
    }
  };


  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-600">Loading FlowLink...</div>;
  }
  
  if (!session || !user) {
    if (currentPage === Page.PRIVACY) return <PrivacyPage onNavigate={handleNavigate} />;
    if (currentPage === Page.TERMS) return <TermsPage onNavigate={handleNavigate} />;
    return <LandingPage onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  return (
    <>
      <AppLayout
        user={user}
        connections={connections}
        currentPage={currentPage}
        messages={messages}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onToggleConnection={handleToggleConnection}
        onActionUsed={handleActionUsed}
        onUpgrade={handleUpgrade}
        showToast={({ message, type }) => addToast(message, type)}
        onSendMessage={handleSendMessage}
      />
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(toast => toast.id !== id))} />
    </>
  );
}