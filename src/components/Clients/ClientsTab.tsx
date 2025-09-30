import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Building2, Mail, Phone, FileText, Save, X } from 'lucide-react';
import { api } from '../../services/api';

interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  ico?: string;
  dic?: string;
  ic_dph?: string;
  created_at?: string;
  updated_at?: string;
}

export const ClientsTab: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    ico: '',
    dic: '',
    ic_dph: ''
  });

  // Načítanie klientov z API
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await api.clients.getAll();
      setClients(data);
      setError(null);
    } catch (err) {
      setError('Nepodarilo sa načítať klientov');
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrovanie klientov
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Otvoriť formulár pre pridanie
  const handleAddClick = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      ico: '',
      dic: '',
      ic_dph: ''
    });
    setEditingClient(null);
    setShowAddForm(true);
  };

  // Otvoriť formulár pre editáciu
  const handleEditClick = (client: Client) => {
    setFormData(client);
    setEditingClient(client);
    setShowAddForm(true);
  };

  // Uložiť klienta
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        // Update existujúceho klienta
        const updated = await api.clients.update(editingClient.id, formData);
        setClients(clients.map(c => c.id === editingClient.id ? updated : c));
      } else {
        // Vytvorenie nového klienta
        const newClient = await api.clients.create(formData as any);
        setClients([newClient, ...clients]);
      }
      
      setShowAddForm(false);
      setEditingClient(null);
      setFormData({});
    } catch (err) {
      alert('Nepodarilo sa uložiť klienta');
      console.error('Error saving client:', err);
    }
  };

  // Zmazať klienta
  const handleDeleteClient = async (id: number) => {
    if (window.confirm('Naozaj chcete zmazať tohto klienta?')) {
      try {
        await api.clients.delete(id);
        setClients(clients.filter(c => c.id !== id));
      } catch (err) {
        alert('Nepodarilo sa zmazať klienta');
        console.error('Error deleting client:', err);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Načítavam klientov...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {error}
        <button onClick={loadClients} className="ml-4 text-red-600 underline">
          Skúsiť znova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Klienti</h2>
            <p className="text-gray-600 mt-1">Databáza firemných klientov</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Pridať klienta
          </button>
        </div>

        {/* Štatistiky */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Celkový počet</div>
            <div className="text-2xl font-bold text-gray-900">{clients.length}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-600">Firmy</div>
            <div className="text-2xl font-bold text-blue-900">
              {clients.filter(c => c.company).length}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm text-green-600">Súkromné osoby</div>
            <div className="text-2xl font-bold text-green-900">
              {clients.filter(c => !c.company).length}
            </div>
          </div>
        </div>
      </div>

      {/* Vyhľadávanie */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Vyhľadať podľa mena, emailu alebo firmy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Zoznam klientov */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Klient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontakt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Firma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IČO / DIČ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcie
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  {client.address && (
                    <div className="text-sm text-gray-500">{client.address}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {client.email}
                    </div>
                    {client.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {client.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {client.company && (
                    <div className="flex items-center text-sm text-gray-900">
                      <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                      {client.company}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {client.ico && <div>IČO: {client.ico}</div>}
                    {client.dic && <div>DIČ: {client.dic}</div>}
                    {client.ic_dph && <div>IČ DPH: {client.ic_dph}</div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(client)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Žiadni klienti nenájdení</p>
          </div>
        )}
      </div>

      {/* Formulár pre pridanie/editáciu */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingClient ? 'Upraviť klienta' : 'Pridať nového klienta'}
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSaveClient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meno *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefón
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firma
                    </label>
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresa
                    </label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IČO
                    </label>
                    <input
                      type="text"
                      value={formData.ico || ''}
                      onChange={(e) => setFormData({...formData, ico: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DIČ
                    </label>
                    <input
                      type="text"
                      value={formData.dic || ''}
                      onChange={(e) => setFormData({...formData, dic: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IČ DPH
                    </label>
                    <input
                      type="text"
                      value={formData.ic_dph || ''}
                      onChange={(e) => setFormData({...formData, ic_dph: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Zrušiť
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    {editingClient ? 'Uložiť zmeny' : 'Pridať klienta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};