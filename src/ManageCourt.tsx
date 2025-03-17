import React, { useState } from 'react';
import { MapPin, Edit, Trash2, Save, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ManageCourt = () => {
  const [activeTab, setActiveTab] = useState('cadastrar');
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Futebol',
    local: '',
    capacidade: '',
    preco: '',
    descricao: ''
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [quadraEditando, setQuadraEditando] = useState(null);

  // Dados simulados de quadras
  const [quadras, setQuadras] = useState([
    { id: 1, nome: 'Quadra Central', tipo: 'Futebol', local: 'Zona Sul', capacidade: '22 pessoas', preco: 'Kz 120/hora', status: 'Disponível' },
    { id: 2, nome: 'Quadra Coberta', tipo: 'Basquete', local: 'Zona Oeste', capacidade: '10 pessoas', preco: 'Kz 100/hora', status: 'Em manutenção' },
    { id: 3, nome: 'Arena Beach', tipo: 'Vôlei', local: 'Zona Norte', capacidade: '12 pessoas', preco: 'Kz 90/hora', status: 'Disponível' }
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'cadastrar') {
      setModoEdicao(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'Futebol',
      local: '',
      capacidade: '',
      preco: '',
      descricao: ''
    });
    setQuadraEditando(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modoEdicao && quadraEditando) {
      // Atualizar quadra existente
      const updatedQuadras = quadras.map(q => 
        q.id === quadraEditando.id ? 
        { 
          ...q, 
          nome: formData.nome, 
          tipo: formData.tipo, 
          local: formData.local, 
          capacidade: formData.capacidade, 
          preco: formData.preco 
        } : 
        q
      );
      setQuadras(updatedQuadras);
      setModoEdicao(false);
    } else {
      // Adicionar nova quadra
      const novaQuadra = {
        id: quadras.length + 1,
        nome: formData.nome,
        tipo: formData.tipo,
        local: formData.local,
        capacidade: formData.capacidade,
        preco: formData.preco,
        status: 'Disponível'
      };
      setQuadras([...quadras, novaQuadra]);
    }

    resetForm();
    setActiveTab('listar');
  };

  const iniciarEdicao = (quadra) => {
    setFormData({
      nome: quadra.nome,
      tipo: quadra.tipo,
      local: quadra.local,
      capacidade: quadra.capacidade.replace(' pessoas', ''),
      preco: quadra.preco.replace('Kz ', '').replace('/hora', ''),
      descricao: ''
    });
    setQuadraEditando(quadra);
    setModoEdicao(true);
    setActiveTab('cadastrar');
  };

  const excluirQuadra = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta quadra?')) {
      setQuadras(quadras.filter(q => q.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <MapPin className="mr-2" /> Gerenciar Quadras
        </h1>
      </div>

      {/* Abas */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'cadastrar'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('cadastrar')}
        >
          {modoEdicao ? 'Editar Quadra' : 'Cadastrar Quadra'}
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'listar'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('listar')}
        >
          Quadras Cadastradas
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'cadastrar' ? (
        <Card>
          <CardHeader className="p-4">
            <CardTitle>
              {modoEdicao ? 'Editar Quadra' : 'Cadastrar Nova Quadra'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Quadra
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Futebol">Futebol</option>
                    <option value="Basquete">Basquete</option>
                    <option value="Vôlei">Vôlei</option>
                    <option value="Tênis">Tênis</option>
                    <option value="Futsal">Futsal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    name="local"
                    value={formData.local}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacidade (pessoas)
                  </label>
                  <input
                    type="number"
                    name="capacidade"
                    value={formData.capacidade}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço por hora (Kz)
                  </label>
                  <input
                    type="text"
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Save size={16} className="inline mr-1" />
                  {modoEdicao ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Quadras Cadastradas</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Local
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Capacidade
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Preço
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quadras.map((quadra) => (
                    <tr key={quadra.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {quadra.nome}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="flex items-center">
                          <Layers size={14} className="mr-1" />
                          {quadra.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {quadra.local}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {quadra.capacidade}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {quadra.preco}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          quadra.status === 'Disponível' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {quadra.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <button
                          onClick={() => iniciarEdicao(quadra)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => excluirQuadra(quadra.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageCourt