import React, { useState } from 'react';
import { MapPin, Edit, Trash2, Save, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  usePostCourt,
  usePutCourt,
  useGetCourtsQuery
} from '@/api/courtQuery';
import FeedbackDialog from './_components/FeedbackDialog';

const ManageCourt = () => {
  const [activeTab, setActiveTab] = useState('cadastrar');
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Futebol',
    disponibilidade: 'Disponível',
    descricao: '',
    imagem: null
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [quadraEditando, setQuadraEditando] = useState(null);

  // Dados da API
  const { data: courtData } = useGetCourtsQuery();

  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { mutate: mutateCourt } = usePostCourt();
  const { mutate: putCourt } = usePutCourt();

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
      disponibilidade: 'Disponível',
      descricao: '',
      imagem: null
    });
    setQuadraEditando(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'imagem' && files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modoEdicao && quadraEditando) {
      // Criando o objeto da quadra editada
      const quadraEditada = {
        ...quadraEditando, 
        nome: formData.nome, 
        tipo: formData.tipo, 
        disponibilidade: formData.disponibilidade,
        descricao: formData.descricao
        // A imagem seria tratada em um contexto real com upload
      };

      console.log("editado", quadraEditada);
      putCourt(quadraEditada, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("A quadra foi atualizada com sucesso!");
          setDialogOpen(true);
          resetForm();
          setActiveTab('listar');
        },
        onError: (error) => {
          setIsSuccess(false);
          setFeedbackMessage("Não foi possível atualizar a quadra. Verifique seus dados e tente novamente.");
          setDialogOpen(true);
        }
      });
      setModoEdicao(false);
    } else {
      // Adicionar nova quadra
      const novaQuadra = {
        id: courtData?.data?.length + 1,
        nome: formData.nome,
        tipo: formData.tipo,
        disponibilidade: formData.disponibilidade,
        descricao: formData.descricao,
        // Em um caso real, aqui trataria o upload da imagem e salvaria o URL
      };

      mutateCourt(novaQuadra, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("A quadra foi cadastrada com sucesso!");
          setDialogOpen(true);
          resetForm();
          setActiveTab('listar');
        },
        onError: (error) => {
          setIsSuccess(false);
          setFeedbackMessage("Não foi possível cadastrar a quadra. Verifique seus dados e tente novamente.");
          setDialogOpen(true);
        }
      });
    }
  };

  const iniciarEdicao = (quadra) => {
    setFormData({
      nome: quadra.nome,
      tipo: quadra.tipo,
      disponibilidade: quadra.disponibilidade || 'Disponível',
      descricao: quadra.descricao || '',
      imagem: null // Não podemos definir o arquivo diretamente
    });
    setQuadraEditando(quadra);
    setModoEdicao(true);
    setActiveTab('cadastrar');
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
                    Tipo de Quadra
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
                    Disponibilidade
                  </label>
                  <select
                    name="disponibilidade"
                    value={formData.disponibilidade}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Indisponível">Indisponível</option>
                    <option value="Em Manutenção">Em Manutenção</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagem
                  </label>
                  <input
                    type="file"
                    name="imagem"
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    accept="image/*"
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
                      Disponibilidade
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Descrição
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courtData?.data?.map((quadra) => (
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
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          quadra.disponibilidade === 'Disponível' ? 'bg-green-100 text-green-800' : 
                          quadra.disponibilidade === 'Em Manutenção' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {quadra.disponibilidade || 'Disponível'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {quadra.descricao ? 
                          (quadra.descricao.length > 50 ? 
                            `${quadra.descricao.substring(0, 50)}...` : 
                            quadra.descricao) : 
                          '—'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <button
                          onClick={() => iniciarEdicao(quadra)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit size={16} />
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

      {/* Feedback Dialog */}
      {dialogOpen && (
        <FeedbackDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          isSuccess={isSuccess}
          message={feedbackMessage}
        />
      )}
    </div>
  );
};

export default ManageCourt;