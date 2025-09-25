import React, { useState } from 'react';
import { Calendar, Users, Briefcase, User } from 'lucide-react';
import { ClientsTab } from './components/Clients/ClientsTab';
// Ostatné moduly zatiaľ ponechaj ako boli

const CRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Calendar },
    { id: 'clients', name: 'Klienti', icon: Users },
    { id: 'projects', name: 'Projekty', icon: Briefcase },
    { id: 'people', name: 'IT Kapacity', icon: User },
    { id: 'bodyshop', name: 'Bodyshop', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'clients' && <ClientsTab />}
          {/* Ostatné taby zatiaľ ponechaj */}
        </div>
      </main>
    </div>
  );
};

export default CRM;