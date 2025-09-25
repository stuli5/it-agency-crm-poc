import React, { useState } from 'react';
import { Calendar, Users, Briefcase, User, LayoutDashboard } from 'lucide-react';
import { ClientsTab } from './components/Clients/ClientsTab';

// Zatiaľ ponecháme starý kód pre ostatné moduly
const Dashboard = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="text-gray-600">Dashboard content coming soon...</p>
    </div>
  );
};

export default App;

const ProjectsTab = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Projekty</h2>
      <p className="text-gray-600">Projects content coming soon...</p>
    </div>
  );
};

const PeopleTab = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Ľudia</h2>
      <p className="text-gray-600">People content coming soon...</p>
    </div>
  );
};

const BodyshopTab = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Bodyshop</h2>
      <p className="text-gray-600">Bodyshop content coming soon...</p>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', name: 'Klienti', icon: Users },
    { id: 'projects', name: 'Projekty', icon: Briefcase },
    { id: 'people', name: 'Ľudia', icon: User },
    { id: 'bodyshop', name: 'Bodyshop', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">IT Agentúra CRM</h1>
            <div className="text-sm text-gray-500">POC verzia</div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-3 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'clients' && <ClientsTab />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'people' && <PeopleTab />}
          {activeTab === 'bodyshop' && <BodyshopTab />}
        </div>
      </main>
    </div>
  );
};