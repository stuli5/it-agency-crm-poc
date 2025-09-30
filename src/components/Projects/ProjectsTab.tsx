import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { ProjectFormModal } from './ProjectFormModal';
import { PROJECT_STATUSES, AVAILABLE_TECHNOLOGIES } from './types';
import { 
  formatCurrency, 
  formatDate, 
  calculateDaysLeft, 
  getDaysLeftText,
  getProgressColor,
  getBudgetStatusColor 
} from './utils';
import { api } from '../../services/api';

// Upravený interface pre databázu
interface Project {
  id: number;
  name: string;
  client_id: number;
  client_name?: string;
  client_company?: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  budget: number;
  spent: number;
  progress: number;
  team_size: number;
  description: string;
  technologies: string[];
}

interface Client {
  id: number;
  name: string;
  company?: string;
  email: string;
}

export const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Načítanie dát z databázy pri načítaní komponenty
  useEffect(() => {
    loadData();
  }, []);

  // Načítanie projektov a klientov z API
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Paralelné načítanie projektov a klientov
      const [projectsData, clientsData] = await Promise.all([
        api.projects.getAll(),
        api.clients.getAll()
      ]);
      
      setProjects(projectsData);
      setClients(clientsData);
    } catch (err) {
      setError('Nepodarilo sa načítať dáta z databázy');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrovanie projektov
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies?.some(tech => 
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleAddProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Naozaj chcete zmazať tento projekt?')) {
      try {
        await api.projects.delete(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        alert('Nepodarilo sa zmazať projekt');
        console.error('Error deleting project:', err);
      }
    }
  };

  const handleSaveProject = async (projectData: any) => {
    try {
      // Získanie client_id podľa mena klienta
      const client = clients.find(c => 
        (c.company || c.name) === projectData.client
      );
      
      if (!client) {
        alert('Klient nebol nájdený');
        return;
      }

      // Príprava dát pre API
      const apiData = {
        name: projectData.name,
        client_id: client.id,
        status: projectData.status,
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        budget: projectData.budget || 0,
        spent: projectData.spent || 0,
        progress: projectData.progress || 0,
        team_size: projectData.teamSize || 1,
        description: projectData.description || '',
        technologies: projectData.technologies || []
      };

      if (editingProject) {
        // Update existujúceho projektu
        const updated = await api.projects.update(editingProject.id, apiData);
        setProjects(projects.map(p => 
          p.id === editingProject.id ? {
            ...updated,
            client_name: client.name,
            client_company: client.company
          } : p
        ));
      } else {
        // Vytvorenie nového projektu
        const newProject = await api.projects.create(apiData);
        // Pridáme info o klientovi pre zobrazenie
        const projectWithClient = {
          ...newProject,
          client_name: client.name,
          client_company: client.company
        };
        setProjects([projectWithClient, ...projects]);
      }
      
      setShowModal(false);
      setEditingProject(null);
    } catch (err) {
      alert('Nepodarilo sa uložiť projekt');
      console.error('Error saving project:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  // Pomocné funkcie
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'on-hold': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Štatistiky
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    totalSpent: projects.reduce((sum, p) => sum + (p.spent || 0), 0)
  };

  // Príprava dát pre modal - konverzia client_id na client name
  const prepareProjectForEdit = (project: Project) => {
    const client = clients.find(c => c.id === project.client_id);
    return {
      ...project,
      client: client ? (client.company || client.name) : '',
      startDate: project.start_date,
      endDate: project.end_date,
      teamSize: project.team_size
    };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Načítavam projekty...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
        <button onClick={loadData} className="ml-4 text-red-600 underline">
          Skúsiť znova
        </button>
      </div>
    );
  }

  // Získanie názvov klientov pre dropdown v modáli
  const availableClients = clients.map(c => c.company || c.name);

  return (
    <div className="space-y-6">
      {/* Header s tlačidlami */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Projekty</h2>
            <p className="text-gray-600 mt-1">Správa firemných projektov</p>
          </div>
          <button
            onClick={handleAddProject}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nový projekt
          </button>
        </div>

        {/* Štatistiky */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Celkovo</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-600">Aktívne</div>
            <div className="text-2xl font-bold text-blue-900">{stats.active}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-green-600">Dokončené</div>
            <div className="text-2xl font-bold text-green-900">{stats.completed}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-sm text-purple-600">Rozpočet</div>
            <div className="text-xl font-bold text-purple-900">{formatCurrency(stats.totalBudget)}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-sm text-orange-600">Minuté</div>
            <div className="text-xl font-bold text-orange-900">{formatCurrency(stats.totalSpent)}</div>
          </div>
        </div>
      </div>

      {/* Filtrovanie a vyhľadávanie */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Hľadať projekt, klienta alebo technológiu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Všetky stavy</option>
            <option value="planning">Plánovanie</option>
            <option value="active">Aktívne</option>
            <option value="on-hold">Pozastavené</option>
            <option value="completed">Dokončené</option>
            <option value="cancelled">Zrušené</option>
          </select>
        </div>
      </div>

      {/* Tabuľka projektov */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projekt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Klient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tím
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rozpočet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Termín
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcie
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => {
                const daysLeft = calculateDaysLeft(project.end_date);
                const isOverdue = daysLeft < 0 && project.status === 'active';
                const statusConfig = PROJECT_STATUSES[project.status];
                
                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-1">
                          {project.technologies?.slice(0, 3).map(tech => (
                            <span key={tech} className="bg-gray-100 px-2 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                          {project.technologies?.length > 3 && (
                            <span className="text-gray-400">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {project.client_company || project.client_name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(project.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{project.team_size}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatCurrency(project.spent || 0)}
                        </div>
                        <div className="text-xs text-gray-500">
                          z {formatCurrency(project.budget || 0)}
                        </div>
                        {project.budget > 0 && (
                          <div className="mt-1">
                            <div className="w-20 bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${getBudgetStatusColor(project.spent || 0, project.budget)}`}
                                style={{ width: `${Math.min(100, ((project.spent || 0) / project.budget) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatDate(project.end_date)}
                        </div>
                        {project.status === 'active' && (
                          <div className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                            {getDaysLeftText(daysLeft, project.status)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProject(prepareProjectForEdit(project) as any)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Upraviť projekt"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Zmazať projekt"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Žiadne projekty nenájdené</p>
          </div>
        )}
      </div>

      {/* Modal pre pridanie/editáciu */}
      <ProjectFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        Project={editingProject}
        availableClients={availableClients}
        availableTechnologies={AVAILABLE_TECHNOLOGIES}
      />
    </div>
  );
};