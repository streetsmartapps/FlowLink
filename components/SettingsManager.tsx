import React from 'react';
import { User } from '../types';
import AffiliateRecommendations from './AffiliateRecommendations';

interface SettingsManagerProps {
  user: User;
  onUpgrade: () => void;
}

export default function SettingsManager({ user, onUpgrade }: SettingsManagerProps) {
  const isPro = user.tier === 'pro';

  return (
    <div className="p-6 h-full bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account and subscription plan.</p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Account Information</h2>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium text-gray-800">{user.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-800">{user.email}</span>
                </div>
            </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Subscription Plan</h2>
            <div className={`p-4 rounded-lg flex items-center justify-between ${isPro ? 'bg-green-100' : 'bg-blue-100'}`}>
                <div>
                    <h3 className="font-bold text-lg">{isPro ? 'Pro Plan' : 'Free Plan'}</h3>
                    <p className="text-sm text-gray-700">
                        {isPro ? 'You have unlimited access to all features.' : `You have used ${user.actionsUsed} of ${user.actionsLimit} actions.`}
                    </p>
                </div>
                {!isPro && (
                    <button 
                        onClick={onUpgrade}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Upgrade to Pro
                    </button>
                )}
            </div>
            {isPro && (
                 <div className="mt-4 text-center">
                    <p className="text-gray-600">You are on the Pro plan. Thank you for your support!</p>
                    <button className="mt-2 text-sm text-gray-500 hover:underline">Manage Subscription</button>
                </div>
            )}
        </div>

        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
            <AffiliateRecommendations />
        </div>
      </div>
    </div>
  );
}
