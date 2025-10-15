import React from 'react';

export enum Page {
  LOGIN,
  CHAT,
  CONNECTIONS,
  SETTINGS,
  PRIVACY,
  TERMS,
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  tier: 'free' | 'pro';
  actionsUsed: number;
  actionsLimit: number;
}

export interface Connection {
  id: 'gmail' | 'gdocs' | 'slack' | 'instagram';
  name: string;
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  comingSoon?: boolean;
  teamName?: string;
}

export interface Action {
  id: string;
  type: 'gmail' | 'gdocs' | 'slack' | 'instagram';
  label: string;
  content: string;
  meta?: {
    subject?: string;
    to?: string;
    documentTitle?: string;
    channel?: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  actions?: Action[];
}

export type ToastType = 'success' | 'error';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

export interface ModalConfig {
  title: string;
  onConfirm: (inputs?: { [key: string]: string }) => void;
  confirmText?: string;
  renderContent?: (
    inputs: { [key: string]: string },
    setInputs: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  ) => React.ReactNode;
}