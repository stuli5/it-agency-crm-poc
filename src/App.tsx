import React, { useState } from 'react';
import { Calendar, Users, Briefcase, User } from 'lucide-react';
import { ClientsTab } from './components/Clients/ClientsTab';

// Zatiaľ ponecháme starý kód pre ostatné moduly
const Dashboard = () => {
  // Skopíruj pôvodný Dashboard komponent sem
  return <div>Dashboard content...</div>
};

const ProjectsTab = () => {
  // Skopíruj pôvodný ProjectsTab komponent sem
  return <div>Projects content...</div>
};

const PeopleTab = () => {
  // Skopíruj pôvodný PeopleTab komponent sem  
  return <div>People content...</div>
};

const BodyshopTab = () => {
  // Skopíruj pôvodný BodyshopTab komponent sem
  return <div>Bodyshop content...</div>
};

const CRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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

      {/* Navigation - toto som zabudol */}
      
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