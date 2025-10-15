import React from 'react';
import { Page } from '../types';

interface LegalPageProps {
  onNavigate: (page: Page) => void;
  isEmbedded?: boolean;
}

export default function PrivacyPage({ onNavigate, isEmbedded }: LegalPageProps) {
  const content = (
    <>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2 className="mt-6 text-xl font-semibold">Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. For this simulation, we only use mock data and do not collect or store any personal information.</p>
      <h2 className="mt-6 text-xl font-semibold">How We Use Your Information</h2>
      <p>In a real application, we would use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect FlowLink and our users. All data processing would be handled with utmost care for your privacy.</p>
      <h2 className="mt-6 text-xl font-semibold">Data Security</h2>
      <p>We would implement appropriate technical and organizational security measures to protect your data.</p>
      <h2 className="mt-6 text-xl font-semibold">Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@flowlink.example.com</p>
    </>
  );

  if (isEmbedded) {
    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <div className="prose prose-blue max-w-none space-y-4">
              {content}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
