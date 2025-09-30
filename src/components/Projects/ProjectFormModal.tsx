import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

// Typy
export interface Project {
  id: number;
  name: string;
  client: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  teamSize: number;
  description: string;
  technologies: string[];
}

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
  project: Project | null;
  availableClients: string[];
  availableTechnologies: string[];
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
  availableClients,
  availableTechnologies
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    client: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: 0,
    spent: 0,
    progress: 0,
    teamSize: 1,
    description: '',
    technologies: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Načítanie dát pri editácii
  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      // Reset formulára pre nový projekt
      setFormData({
        name: '',
        client: '',
        status: 'planning',
        startDate: '',
        endDate: '',
        budget: 0,
        spent: 0,
        progress: 0,
        teamSize: 1,
        description: '',
        technologies: []
      });
    }
    setErrors({});
  }, [project, isOpen]);

  // Validácia formulára
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Názov projektu je povinný';
    }

    if (!formData.client) {
      newErrors.client = 'Klient je povinný';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Dátum začiatku je povinný';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Dátum ukončenia je povinný';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'Dátum ukončenia musí byť po dátume začiatku';
    }

    if (formData.spent! > formData.budget!) {
      newErrors.spent = 'Minuté prostriedky nemôžu prekročiť rozpočet';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Odoslanie formulára
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  // Toggle technológie
  const toggleTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...(prev.technologies || []), tech]
    }));
  };

  // Automatická aktualizácia progressu podľa statusu
  const handleStatusChange = (status: Project['status']) => {
    setFormData(prev => ({
      ...prev,
      status,
      progress: status === 'completed' ? 100 : 
                status === 'cancelled' ? prev.progress : 
                status === 'planning' ? 0 : 
                prev.progress
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {project ? 'Upraviť projekt' : 'Nový projekt'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Základné informácie */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Základné informácie</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Názov projektu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Názov projektu *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Zadajte názov projektu"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Klient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Klient *
                </label>
                <select
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.client ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Vyberte klienta</option>
                  {availableClients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
                {errors.client && (
                  <p className="text-red-500 text-xs mt-1">{errors.client}</p>
                )}
              </div>
            </div>
          </div>

          {/* Časový rámec a status */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Časový rámec a status</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Dátum začiatku */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dátum začiatku *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                )}
              </div>

              {/* Dátum ukončenia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dátum ukončenia *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  min={formData.startDate}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleStatusChange(e.target.value as Project['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planning">Plánovanie</option>
                  <option value="active">Aktívny</option>
                  <option value="on-hold">Pozastavený</option>
                  <option value="completed">Dokončený</option>
                  <option value="cancelled">Zrušený</option>
                </select>
              </div>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress: {formData.progress}%
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                  className="flex-1"
                  disabled={formData.status === 'completed' || formData.status === 'planning'}
                />
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      formData.progress === 100 ? 'bg-green-500' : 
                      formData.progress! >= 70 ? 'bg-blue-500' :
                      formData.progress! >= 40 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${formData.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rozpočet a tím */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Rozpočet a tím</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Rozpočet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rozpočet (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Minuté */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minuté (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  max={formData.budget}
                  value={formData.spent}
                  onChange={(e) => setFormData({...formData, spent: parseFloat(e.target.value) || 0})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.spent ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.spent && (
                  <p className="text-red-500 text-xs mt-1">{errors.spent}</p>
                )}
                {formData.budget! > 0 && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          (formData.spent! / formData.budget!) > 0.9 ? 'bg-red-500' :
                          (formData.spent! / formData.budget!) > 0.7 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (formData.spent! / formData.budget!) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Veľkosť tímu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veľkosť tímu
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({...formData, teamSize: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Popis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Popis projektu
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Zadajte popis projektu..."
            />
          </div>

          {/* Technológie */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Technológie
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTechnologies.map(tech => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTechnology(tech)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    formData.technologies?.includes(tech)
                      ? 'bg-blue-500 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
            {formData.technologies && formData.technologies.length > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                Vybrané: {formData.technologies.join(', ')}
              </div>
            )}
          </div>

          {/* Tlačidlá */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Zrušiť
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              {project ? 'Uložiť zmeny' : 'Vytvoriť projekt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};