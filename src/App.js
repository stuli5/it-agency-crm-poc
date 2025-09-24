import React, { useState } from 'react';
import { Plus, Search, Users, Briefcase, User, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';

const CRM = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const [clients, setClients] = useState([
    { id: 1, name: 'TechCorp s.r.o.', contact: 'Jan Novák', email: 'jan@techcorp.sk', phone: '+421 901 123 456', type: 'Korporácia', projects: 3 },
    { id: 2, name: 'StartupXY', contact: 'Mária Svoboda', email: 'maria@startupxy.com', phone: '+421 902 654 321', type: 'Startup', projects: 1 },
    { id: 3, name: 'E-shop Plus', contact: 'Peter Kováč', email: 'peter@eshopplus.sk', phone: '+421 903 789 012', type: 'E-commerce', projects: 2 }
  ]);

  const [projects, setProjects] = useState([
    { id: 1, name: 'Webová aplikácia pre HR', client: 'TechCorp s.r.o.', status: 'V realizácii', budget: '€15,000', tech: ['React', 'Node.js', 'PostgreSQL'], assignedPeople: ['Jana Nováková', 'Tomáš Veselý'] },
    { id: 2, name: 'Mobile app pre delivery', client: 'StartupXY', status: 'Návrh', budget: '€25,000', tech: ['React Native', 'Firebase'], assignedPeople: [] },
    { id: 3, name: 'E-commerce platforma', client: 'E-shop Plus', status: 'Lead', budget: '€40,000', tech: ['Next.js', 'Shopify API'], assignedPeople: [] },
    { id: 4, name: 'API integrácia', client: 'TechCorp s.r.o.', status: 'Dokončené', budget: '€8,000', tech: ['Python', 'FastAPI'], assignedPeople: ['Michal Horák'] }
  ]);

  const [people, setPeople] = useState([
    { id: 1, name: 'Jana Nováková', skills: ['React', 'TypeScript', 'Node.js'], availability: 'Obsadená', currentProject: 'Webová aplikácia pre HR', rate: '€50/hod' },
    { id: 2, name: 'Tomáš Veselý', skills: ['Vue.js', 'Python', 'PostgreSQL'], availability: 'Obsadený', currentProject: 'Webová aplikácia pre HR', rate: '€45/hod' },
    { id: 3, name: 'Michal Horák', skills: ['Python', 'Django', 'FastAPI'], availability: 'Voľný', currentProject: null, rate: '€55/hod' },
    { id: 4, name: 'Lucia Bartošová', skills: ['React Native', 'Flutter', 'Firebase'], availability: 'Voľná', currentProject: null, rate: '€48/hod' },
    { id: 5, name: 'Dominik Slávik', skills: ['Next.js', 'GraphQL', 'AWS'], availability: 'Voľný', currentProject: null, rate: '€52/hod' }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Lead': return 'bg-blue-100 text-blue-800';
      case 'Návrh': return 'bg-yellow-100 text-yellow-800';
      case 'V realizácii': return 'bg-green-100 text-green-800';
      case 'Dokončené': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability) => {
    return availability.includes('Voľný') || availability.includes('Voľná') 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const deleteClient = (clientId) => {
  if (window.confirm('Naozaj chcete vymazať tohto klienta? Táto akcia sa nedá vrátiť späť.')) {
    setClients(clients.filter(client => client.id !== clientId));
    // Môžeme pridať toast notifikáciu
    alert('Klient bol úspešne vymazaný!');
  };
  const Dashboard = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'V realizácii').length;
    const availablePeople = people.filter(p => p.availability.includes('Voľný') || p.availability.includes('Voľná')).length;
    const totalBudget = projects.reduce((sum, p) => sum + parseInt(p.budget.replace(/[€,]/g, '')), 0);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Celkom projektov</p>
                <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktívne projekty</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Voľní ľudia</p>
                <p className="text-2xl font-bold text-gray-900">{availablePeople}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Celkový rozpočet</p>
                <p className="text-2xl font-bold text-gray-900">€{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Aktuálne projekty</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {projects.filter(p => p.status !== 'Dokončené').slice(0, 3).map(project => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{project.budget}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available People */}
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Dostupní ľudia</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {people.filter(p => p.availability.includes('Voľný') || p.availability.includes('Voľná')).map(person => (
                <div key={person.id} className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{person.name}</h4>
                  <p className="text-sm text-gray-600">{person.skills.join(', ')}</p>
                  <p className="text-sm font-medium text-green-600 mt-1">{person.rate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ClientsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Klienti</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nový klient
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Hľadať klientov..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontakt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projekty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcie</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.contact}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {client.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.projects}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4"
                    onClick={() => alert('Úprava klienta - zatiaľ nie je implementovaná')}>Upraviť</button>
                    <button className="text-red-600 hover:text-red-900"
                    onClick={() => deleteClient(client.id)}>Vymazať</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Projekty</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nový projekt
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Hľadať projekty..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projekt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rozpočet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technológie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tím</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.client}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.budget}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.map((tech, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {project.assignedPeople.length > 0 ? project.assignedPeople.join(', ') : 'Nepriradené'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PeopleTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">IT Kapacity</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Pridať osobu
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Hľadať ľudí alebo skillsety..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skillsety</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dostupnosť</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktuálny projekt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sadzba</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPeople.map(person => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{person.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {person.skills.map((skill, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(person.availability)}`}>
                      {person.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {person.currentProject || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {person.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Calendar },
    { id: 'clients', name: 'Klienti', icon: Users },
    { id: 'projects', name: 'Projekty', icon: Briefcase },
    { id: 'people', name: 'IT Kapacity', icon: User }
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
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm('');
                  }}
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
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'clients' && <ClientsTab />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'people' && <PeopleTab />}
        </div>
      </main>
    </div>
  );
};

export default CRM;
