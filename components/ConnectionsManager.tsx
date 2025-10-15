import React from 'react';
import { Connection } from '../types';

interface ConnectionsManagerProps {
  connections: Connection[];
  onToggleConnection: (connectionId: Connection['id']) => void;
}

const ConnectionCard: React.FC<{
  connection: Connection;
  onToggle: () => void;
}> = ({ connection, onToggle }) => {
  const isConnected = connection.connected;
  const isComingSoon = connection.comingSoon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 flex items-center justify-center mr-4 bg-gray-100 rounded-full">{connection.icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{connection.name}</h3>
          {connection.teamName && isConnected && (
            <p className="text-sm text-gray-500">Connected to {connection.teamName}</p>
          )}
        </div>
        {isComingSoon && (
          <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Coming Soon
          </span>
        )}
      </div>
      <p className="text-gray-600 flex-grow mb-6">{connection.description}</p>
      <button
        onClick={onToggle}
        disabled={isComingSoon}
        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
          isComingSoon
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : isConnected
            ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
};


export default function ConnectionsManager({ connections, onToggleConnection }: ConnectionsManagerProps) {
  return (
    <div className="p-6 h-full bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">App Connections</h1>
            <p className="text-gray-600 mt-2">Connect FlowLink to your favorite apps to unlock powerful actions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map(conn => (
                <ConnectionCard 
                    key={conn.id} 
                    connection={conn} 
                    onToggle={() => onToggleConnection(conn.id)} 
                />
            ))}
        </div>
      </div>
    </div>
  );
}
