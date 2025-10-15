import React from 'react';
import { User, Page } from '../types';
import { ChatIcon, ConnectionsIcon, SettingsIcon, LogoutIcon, UpgradeIcon } from './Icons';

interface AppSidebarProps {
  user: User;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export default function AppSidebar({ user, currentPage, onNavigate, onLogout }: AppSidebarProps) {
  const usagePercentage = user.actionsLimit > 0 ? (user.actionsUsed / user.actionsLimit) * 100 : 0;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      <div className="flex items-center mb-8">
        <h1 className="text-xl font-bold text-gray-900">FlowLink</h1>
      </div>

      <nav className="flex-grow space-y-2">
        <NavItem
          icon={<ChatIcon className="w-5 h-5" />}
          label="Chat"
          isActive={currentPage === Page.CHAT}
          onClick={() => onNavigate(Page.CHAT)}
        />
        <NavItem
          icon={<ConnectionsIcon className="w-5 h-5" />}
          label="Connections"
          isActive={currentPage === Page.CONNECTIONS}
          onClick={() => onNavigate(Page.CONNECTIONS)}
        />
        <NavItem
          icon={<SettingsIcon className="w-5 h-5" />}
          label="Settings"
          isActive={currentPage === Page.SETTINGS}
          onClick={() => onNavigate(Page.SETTINGS)}
        />
      </nav>
      
      {user.tier === 'free' && (
        <div className="my-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800">Actions Used</h4>
          <p className="text-xs text-gray-600 mt-1">{user.actionsUsed} of {user.actionsLimit} used</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
          </div>
          <button
            onClick={() => onNavigate(Page.SETTINGS)}
            className="w-full mt-3 flex items-center justify-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md py-2 transition-colors"
          >
            <UpgradeIcon className="w-4 h-4 mr-2"/>
            Upgrade
          </button>
        </div>
      )}
      
      <div className="mt-auto pt-4 space-y-2 text-center text-xs text-gray-500">
        <div className="flex justify-center gap-4">
            <button onClick={() => onNavigate(Page.TERMS)} className="hover:underline">Terms</button>
            <button onClick={() => onNavigate(Page.PRIVACY)} className="hover:underline">Privacy</button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <div className="flex items-center mb-4">
          <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
        >
          <LogoutIcon className="w-5 h-5" />
          <span className="ml-3">Log Out</span>
        </button>
      </div>
    </div>
  );
}
