// src/services/api.ts
const API_URL = 'http://localhost:5000/api';

// Pomocná funkcia pre fetch
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  // Pre DELETE nemusíme parsovať JSON
  if (options?.method === 'DELETE') {
    return { success: true };
  }

  return response.json();
}

// API Service
export const api = {
  // ============ CLIENTS ============
  clients: {
    getAll: () => fetchAPI('/clients'),
    
    getById: (id: number) => fetchAPI(`/clients/${id}`),
    
    create: (data: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
      address?: string;
      ico?: string;
      dic?: string;
      ic_dph?: string;
    }) => fetchAPI('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => fetchAPI(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (id: number) => fetchAPI(`/clients/${id}`, {
      method: 'DELETE',
    }),
  },

  // ============ PROJECTS ============
  projects: {
    getAll: () => fetchAPI('/projects'),
    
    getById: (id: number) => fetchAPI(`/projects/${id}`),
    
    create: (data: {
      name: string;
      client_id: number;
      status: string;
      start_date: string;
      end_date: string;
      budget?: number;
      spent?: number;
      progress?: number;
      team_size?: number;
      description?: string;
      technologies?: string[];
    }) => fetchAPI('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => fetchAPI(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (id: number) => fetchAPI(`/projects/${id}`, {
      method: 'DELETE',
    }),
  },

  // ============ PEOPLE ============
  people: {
    getAll: () => fetchAPI('/people'),
    
    getById: (id: number) => fetchAPI(`/people/${id}`),
    
    create: (data: {
      name: string;
      email: string;
      phone?: string;
      role?: string;
      department?: string;
      hourly_rate?: number;
      skills?: string[];
      available?: boolean;
    }) => fetchAPI('/people', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    update: (id: number, data: any) => fetchAPI(`/people/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
    delete: (id: number) => fetchAPI(`/people/${id}`, {
      method: 'DELETE',
    }),
  },
};