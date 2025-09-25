import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CreateClientRequest, ClientType, Client } from '../../types/Client';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: CreateClientRequest) => Promise<boolean>;
  editClient?: Client | null;
  loading?: boolean;
}

const CLIENT_TYPES: ClientType[] = ['Korporácia', 'Startup', 'E-commerce', 'Nezisková'];

export const ClientForm: React.FC<ClientFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editClient = null,
  loading = false 
}) => {
  const [formData, setFormData] = useState<CreateClientRequest>({
    name: editClient?.name || '',
    contact: editClient?.contact || '',
    email: editClient?.email || '',
    phone: editClient?.phone || '',
    type: editClient?.type || 'Korporácia'
  });
  
  const [errors, setErrors] = useState<Partial<CreateClientRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateClientRequest> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Názov je povinný';
    }
    
    if (!formData.contact.trim()) {
      newErrors.contact = 'Kontaktná osoba je povinná';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Neplatný formát emailu';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefón je povinný';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await onSubmit(formData);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      contact: '',
      email: '',
      phone: '',
      type: 'Korporácia'
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof CreateClientRequest) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editClient ? 'Upraviť klienta' : 'Nový klient'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Názov klienta *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="napr. TechCorp s.r.o."
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kontaktná osoba *
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={handleInputChange('contact')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.contact ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="napr. Jan Novák"
                  disabled={loading}
                />
                {errors.contact && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="jan@techcorp.sk"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefón *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+421 901 123 456"
                  disabled={loading}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Client Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Typ klienta *
                </label>
                <select
                  value={formData.type}
                  onChange={handleInputChange('type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {CLIENT_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Ukladá sa...
                </>
              ) : (
                editClient ? 'Aktualizovať' : 'Pridať'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zrušiť
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};