import React from 'react';
import { GoogleIcon } from './Icons';
import { Page } from '../types';
import AffiliateRecommendations from './AffiliateRecommendations';

interface LandingPageProps {
  onLogin: () => void;
  onNavigate: (page: Page) => void;
}

export default function LandingPage({ onLogin, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <h1 className="text-2xl font-bold text-gray-900">FlowLink</h1>
                <button onClick={onLogin} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                    Get Started
                </button>
            </div>
        </nav>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            You chat. <span className="text-blue-600">We act.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop copying & pasting AI content between apps. FlowLink turns your AI conversations into one-click actions.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
                onClick={onLogin}
                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold inline-flex items-center justify-center"
              >
              <GoogleIcon className="w-5 h-5 mr-3 -ml-1" />
              Sign In & Start Free
            </button>
            <button className="w-full sm:w-auto border border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-semibold">
              Watch Demo
            </button>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            ⬇️ Add to Home Screen for app-like experience
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Chat Naturally</h3>
              <p className="text-gray-600">Use AI like you always do. No new commands to learn.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">One-Click Actions</h3>
              <p className="text-gray-600">Draft emails, create docs, post content with a single click.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Connected Apps</h3>
              <p className="text-gray-600">Works with Gmail, Google Docs, Slack, and more.</p>
            </div>
          </div>
        </section>

        {/* Affiliate Recommendations */}
        <section className="py-16 px-4 max-w-6xl mx-auto">
            <div className="p-6 bg-white/50 rounded-lg">
               <AffiliateRecommendations />
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-semibold mb-2">Is it really free?</h3>
              <p className="text-gray-600">Yes! Start with 10 free actions per month. Upgrade anytime for unlimited access.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do I add it to my phone?</h3>
              <p className="text-gray-600">Visit this site on your phone's browser (like Safari or Chrome) and use the "Add to Home Screen" option in the share menu for an app-like experience.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What apps do you integrate with?</h3>
              <p className="text-gray-600">Currently, FlowLink integrates with Gmail, Google Docs, and Slack, with more coming soon!</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} FlowLink. All rights reserved.</p>
           <div className="mt-2 space-x-4">
              <button onClick={() => onNavigate(Page.TERMS)} className="hover:underline">Terms of Service</button>
              <span>&bull;</span>
              <button onClick={() => onNavigate(Page.PRIVACY)} className="hover:underline">Privacy Policy</button>
            </div>
        </div>
      </footer>
    </div>
  );
}
