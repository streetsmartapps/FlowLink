import React from 'react';
import { Page } from '../types';

interface LegalPageProps {
  onNavigate: (page: Page) => void;
  isEmbedded?: boolean;
}

export default function TermsPage({ onNavigate, isEmbedded }: LegalPageProps) {
    const content = (
    <>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2 className="mt-6 text-xl font-semibold">Acceptance of Terms</h2>
      <p>By accessing and using FlowLink, you accept and agree to be bound by the terms and provision of this agreement. This is a simulation, and no real service is provided.</p>
      <h2 className="mt-6 text-xl font-semibold">Use License</h2>
      <p>Permission is granted to temporarily use FlowLink for personal or business demonstration purposes. This is the grant of a license, not a transfer of title.</p>
      <h2 className="mt-6 text-xl font-semibold">Subscription Terms</h2>
      <p>Pro subscriptions are simulated and do not involve real payments. They can be canceled at any time from the settings page.</p>
      <h2 className="mt-6 text-xl font-semibold">Contact</h2>
      <p>For any questions regarding these terms, please contact us at legal@flowlink.example.com</p>
    </>
  );

  if (isEmbedded) {
    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
                <div className="prose prose-blue max-w-none">
                    {content}
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <h1 className="text-2xl font-bold text-gray-900">FlowLink</h1>
                <button onClick={() => onNavigate(Page.LOGIN)} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    &larr; Back to Home
                </button>
            </div>
        </nav>
      </header>
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <div className="prose prose-blue max-w-none space-y-4">
              {content}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
