import React, { useState } from 'react';
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
import { Project, PROJECT_STATUSES, AVAILABLE_CLIENTS, AVAILABLE_TECHNOLOGIES } from './types';
import { 
  formatCurrency, 
  formatDate, 
  calculateDaysLeft, 
  getDaysLeftText,
  getProgressColor,
  getBudgetStatusColor 
} from './utils';

// Mock data
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'E-commerce Platform',
    client: 'TechCorp s.r.o.',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    budget: 45000,
    spent: 28000,
    progress: 65,
    teamSize: 4,
    description: 'Vývoj e-commerce platformy s integráciou platobnej brány',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe']
  },
  {
    id: 2,
    name: 'Mobilná aplikácia pre fitness',
    client: 'FitLife SK',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-07-31',
    budget: 38000,
    spent: 15000,
    progress: 40,
    teamSize: 3,
    description: 'iOS a Android aplikácia pre sledovanie tréningov',
    technologies: ['React Native', 'Firebase', 'TypeScript']
  },
  {
    id: 3,
    name: 'CRM systém',
    client: 'GlobalSales a.s.',
    status: 'planning',
    startDate: '2024-04-01',
    endDate: '2024-12-31',
    budget: 75000,
    spent: 0,
    progress: 0,
    teamSize: 5,
    description: 'Komplexný CRM systém s AI funkciami',
    technologies: ['Vue.js', 'Python', 'MongoDB', 'TensorFlow']
  },
  {
    id: 4,
    name: 'Redesign webovej stránky',
    client: 'StartupHub',
    status: 'completed',
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    budget: 12000,
    spent: 11500,
    progress: 100,
    teamSize: 2,
    description: 'Kompletný redesign firemnej prezentácie',
    technologies: ['Next.js', 'Tailwind CSS', 'Contentful']
  },
  {
    id: 5,
    name: 'API integrácia',
    client: 'DataFlow s.r.o.',
    status: 'on-hold',
    startDate: '2024-03-01',
    endDate: '2024-05-15',
    budget: 18000,
    spent: 8000,
    progress: 45,
    teamSize: 2,
    description: 'Integrácia s externými API službami',
    technologies: ['Node.js', 'Express', 'Redis']
  }
];

export const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Filtrovanie projektov
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => 
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

  const handleDeleteProject = (id: number) => {
    if (window.confirm('Naozaj chcete zmazať tento projekt?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (editingProject) {
      // Update existing project
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...projectData, id: editingProject.id } as Project
          : p
      ));
    } else {
      // Add new project
      const newProject: Project = {
        ...projectData,
        id: Math.max(...projects.map(p => p.id), 0) + 1
      } as Project;
      setProjects([...projects, newProject]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  // Pomocné funkcie pre ikony
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
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0)
  };

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
                const daysLeft = calculateDaysLeft(project.endDate);
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
                          {project.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="bg-gray-100 px-2 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-gray-400">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.client}</div>
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
                        <span className="text-sm text-gray-900">{project.teamSize}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatCurrency(project.spent)}
                        </div>
                        <div className="text-xs text-gray-500">
                          z {formatCurrency(project.budget)}
                        </div>
                        <div className="mt-1">
                          <div className="w-20 bg-gray-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${getBudgetStatusColor(project.spent, project.budget)}`}
                              style={{ width: `${Math.min(100, (project.spent / project.budget) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatDate(project.endDate)}
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
                          onClick={() => handleEditProject(project)}
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
        project={editingProject}
        availableClients={AVAILABLE_CLIENTS}
        availableTechnologies={AVAILABLE_TECHNOLOGIES}
      />
    </div>
  );
};