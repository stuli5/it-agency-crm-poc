export interface Client {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  type: ClientType;
  projects: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClientType = 'Korporácia' | 'Startup' | 'E-commerce' | 'Nezisková';

export interface CreateClientRequest {
  name: string;
  contact: string;
  email: string;
  phone: string;
  type: ClientType;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  id: number;
}

export interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filteredClients: Client[];
}

export interface ClientsActions {
  setClients: (clients: Client[]) => void;
  addClient: (client: CreateClientRequest) => void;
  updateClient: (client: UpdateClientRequest) => void;
  deleteClient: (id: number) => void;
  setSearchTerm: (term: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type ClientsStore = ClientsState & ClientsActions;