import React, { useState } from 'react';
import { Plus, Search, Users, TrendingUp, Building2, AlertCircle } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { ClientsList } from './ClientsList';
import { ClientForm } from './ClientForm';
import { Client } from '../../types/Client';

export const ClientsTab: React.FC = () => {
  const {
    filteredClients,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    handleAddClient,
    handleUpdateClient,
    handleDeleteClient,
    clearError,
    clientStats,
    hasClients,
    hasFilteredResults
  } = useClients();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleOpenForm = (client?: Client) => {
    if (client) {
      setEditingClient(client);
    } else {
      setEditingClient(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const handleFormSubmit = async (clientData: any) => {
    if (editingClient) {
      return handleUpdateClient({ ...clientData, id: editingClient.id });
    } else {
      return handleAddClient(clientData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Klienti</h2>
          <p className="mt-1 text-sm text-gray-500">
            Správa klientov a ich kontaktných údajov
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nový klient
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Chyba</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-3">
                <button
                  onClick={clearError}
                  className="text-sm bg-red-100 text-red-800 rounded-md px-2 py-1 hover:bg-red-200 transition-colors"
                >
                  Zavrieť
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {hasClients && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Celkom klientov</p>
                <p className="text-2xl font-bold text-gray-900">{clientStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Korporácie</p>
                <p className="text-2xl font-bold text-gray-900">{clientStats.byType['Korporácia'] || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Celkom projektov</p>
                <p className="text-2xl font-bold text-gray-900">{clientStats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Priemer projektov</p>
                <p className="text-2xl font-bold text-gray-900">{clientStats.averageProjects}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Hľadať klientov..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="mt-2 sm:mt-0 sm:ml-4 text-sm text-gray-500">
                Nájdené: {filteredClients.length} z {clientStats.total}
              </div>
            )}
          </div>
        </div>

        {/* Results Info */}
        {searchTerm && !hasFilteredResults && !loading && (
          <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
            <p className="text-sm text-yellow-800">
              Pre výraz "{searchTerm}" neboli nájdení žiadni klienti.
            </p>
          </div>
        )}
      </div>

      {/* Clients List */}
      <ClientsList
        clients={filteredClients}
        loading={loading}
        onEdit={handleOpenForm}
        onDelete={handleDeleteClient}
      />

      {/* Client Form Modal */}
      <ClientForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editClient={editingClient}
        loading={loading}
      />
    </div>
  );
};