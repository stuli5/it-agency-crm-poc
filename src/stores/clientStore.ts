import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Client, ClientsStore, CreateClientRequest, UpdateClientRequest } from '../types/Client';

// Mock data
const initialClients: Client[] = [
  { 
    id: 1, 
    name: 'TechCorp s.r.o.', 
    contact: 'Jan Novák', 
    email: 'jan@techcorp.sk', 
    phone: '+421 901 123 456', 
    type: 'Korporácia', 
    projects: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-20')
  },
  { 
    id: 2, 
    name: 'StartupXY', 
    contact: 'Mária Svoboda', 
    email: 'maria@startupxy.com', 
    phone: '+421 902 654 321', 
    type: 'Startup', 
    projects: 1,
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2024-11-15')
  },
  { 
    id: 3, 
    name: 'E-shop Plus', 
    contact: 'Peter Kováč', 
    email: 'peter@eshopplus.sk', 
    phone: '+421 903 789 012', 
    type: 'E-commerce', 
    projects: 2,
    createdAt: new Date('2024-03-22'),
    updatedAt: new Date('2024-12-01')
  }
];

export const useClientsStore = create<ClientsStore>()(
  devtools(
    (set, get) => ({
      // State
      clients: initialClients,
      loading: false,
      error: null,
      searchTerm: '',
      
      // Computed
      get filteredClients() {
        const { clients, searchTerm } = get();
        if (!searchTerm) return clients;
        
        return clients.filter(client => 
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      },

      // Actions
      setClients: (clients) => set({ clients }),
      
      addClient: (clientData: CreateClientRequest) => {
        const newClient: Client = {
          id: Date.now(), // In real app, this would come from API
          ...clientData,
          projects: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({ 
          clients: [...state.clients, newClient],
          error: null 
        }));
      },

      updateClient: (updatedClient: UpdateClientRequest) => {
        set(state => ({
          clients: state.clients.map(client => 
            client.id === updatedClient.id 
              ? { ...client, ...updatedClient, updatedAt: new Date() }
              : client
          ),
          error: null
        }));
      },

      deleteClient: (id: number) => {
        set(state => ({
          clients: state.clients.filter(client => client.id !== id),
          error: null
        }));
      },

      setSearchTerm: (searchTerm) => set({ searchTerm }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error })
    }),
    {
      name: 'clients-store', // for devtools
    }
  )
);