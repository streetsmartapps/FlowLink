import React from 'react';

export default function AffiliateRecommendations() {
  const recommendations = [
    {
      name: "Grammarly",
      description: "Enhance your writing with AI",
      link: "https://grammarly.com",
      icon: "✍️"
    },
    {
      name: "Notion",
      description: "All-in-one workspace",
      link: "https://notion.com",
      icon: "📝"
    },
    {
      name: "ChatGPT Plus",
      description: "Advanced AI capabilities",
      link: "https://chat.openai.com",
      icon: "🤖"
    }
  ];

  return (
    <div>
      <h3 className="font-semibold mb-4 text-gray-800">Tools We Love ❤️</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((tool) => (
          <a
            key={tool.name}
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">{tool.icon}</div>
            <h4 className="font-semibold">{tool.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
