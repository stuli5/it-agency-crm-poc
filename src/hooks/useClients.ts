import { useCallback } from 'react';
import { useClientsStore } from '../stores/clientStore';
import { CreateClientRequest, UpdateClientRequest } from '../types/Client';

export const useClients = () => {
  const store = useClientsStore();

  // Memoized actions
  const handleDeleteClient = useCallback(async (id: number, clientName: string) => {
    const confirmed = window.confirm(
      `Naozaj chcete vymazať klienta "${clientName}"? Táto akcia sa nedá vrátiť späť.`
    );
    
    if (confirmed) {
      try {
        store.setLoading(true);
        // In real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        store.deleteClient(id);
        
        // Success notification (you could use a toast library here)
        alert(`Klient "${clientName}" bol úspešne vymazaný!`);
      } catch (error) {
        store.setError(error instanceof Error ? error.message : 'Chyba pri vymazávaní klienta');
      } finally {
        store.setLoading(false);
      }
    }
  }, [store]);

  const handleAddClient = useCallback(async (clientData: CreateClientRequest) => {
    try {
      store.setLoading(true);
      store.setError(null);
      
      // Validation
      if (!clientData.name.trim()) {
        throw new Error('Názov klienta je povinný');
      }
      if (!clientData.email.includes('@')) {
        throw new Error('Neplatný email');
      }
      
      // In real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      store.addClient(clientData);
      
      // Success notification
      alert(`Klient "${clientData.name}" bol úspešne pridaný!`);
      return true;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Chyba pri pridávaní klienta');
      return false;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const handleUpdateClient = useCallback(async (clientData: UpdateClientRequest) => {
    try {
      store.setLoading(true);
      store.setError(null);
      
      // Validation
      if (clientData.name && !clientData.name.trim()) {
        throw new Error('Názov klienta nesmie byť prázdny');
      }
      if (clientData.email && !clientData.email.includes('@')) {
        throw new Error('Neplatný email');
      }
      
      // In real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      store.updateClient(clientData);
      
      // Success notification
      alert(`Klient bol úspešne aktualizovaný!`);
      return true;
    } catch (error) {
      store.setError(error instanceof Error ? error.message : 'Chyba pri aktualizácii klienta');
      return false;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Statistics
  const clientStats = {
    total: store.clients.length,
    byType: store.clients.reduce((acc, client) => {
      acc[client.type] = (acc[client.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalProjects: store.clients.reduce((sum, client) => sum + client.projects, 0),
    averageProjects: store.clients.length > 0 
      ? (store.clients.reduce((sum, client) => sum + client.projects, 0) / store.clients.length).toFixed(1)
      : '0'
  };

  return {
    // State
    clients: store.clients,
    filteredClients: store.filteredClients,
    loading: store.loading,
    error: store.error,
    searchTerm: store.searchTerm,
    
    // Actions
    setSearchTerm: store.setSearchTerm,
    handleAddClient,
    handleUpdateClient,
    handleDeleteClient,
    clearError: () => store.setError(null),
    
    // Computed
    clientStats,
    hasClients: store.clients.length > 0,
    hasFilteredResults: store.filteredClients.length > 0,
  };
};