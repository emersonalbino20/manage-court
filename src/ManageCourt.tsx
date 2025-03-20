import React, { useState } from 'react';
import { MapPin, Edit, Trash2, Save, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  usePostCourt,
  usePutCourt,
  useGetCourtsQuery
} from '@/api/courtQuery';
import {
  useGetCourtsTypeQuery
} from '@/api/courtQuery';
import FeedbackDialog from './_components/FeedbackDialog';
import {receiveCentFront, sendCoinBeck} from './utils/methods';
import {
  useGetProvincesQuery
} from '@/api/provinceQuery';
import {
  useGetCitiesQuery
} from '@/api/cityQuery';

const ManageCourt = () => {

  const [activeTab, setActiveTab] = useState('cadastrar');
  const [formData, setFormData] = useState({
    fieldTypeId: 1,
    name: '',
    description: '',
    hourlyRate: 0,
    address: {
      street: '',
      cityId: 1,
      provinceId: 1,
      latitude: 0,
      longitude: 0
    },
    thumbnailUrl: ''
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [quadraEditando, setQuadraEditando] = useState(null);

  // Dados da API
  const { data: courtData } = useGetCourtsQuery();
  console.log(courtData?.data)
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
      fieldTypeId: 1,
      name: '',
      description: '',
      hourlyRate: 0,
      address: {
        street: '',
        cityId: 1,
        provinceId: 1,
        latitude: 0,
        longitude: 0
      },
      thumbnailUrl: ''
    });
    setQuadraEditando(null);
  };

const [thumbnailUrl, setThumbnailUrl] = useState('');
const handleInputChange = (e) => {
  const { name, value, files } = e.target;
  if (name === 'thumbnailUrl' && files) {
    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
      setFormData(prev => ({ ...prev, [name]: url }));
    }
  } else if (name === 'address.cityId') {
    // Encontrar a província associada à cidade selecionada
    const selectedCity = cityData?.data?.data?.find(city => city.id === parseInt(value));
    const provinceId = selectedCity ? selectedCity.provinceId : "";

    // Atualizar cityId e provinceId no formData
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        cityId: parseInt(value),
        provinceId: provinceId
      }
    }));
  } else if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: ["address.latitude", "address.longitude", "address.cityId", "address.provinceId"].includes(name) 
          ? parseFloat(value) 
          : value
      }
    }));
  } else if (name === 'hourlyRate' || name === 'fieldTypeId') {
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
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
        ...formData
      };

      putCourt(quadraEditada, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("A quadra foi atualizada com sucesso!");
          setDialogOpen(true);
          resetForm();
          setActiveTab('listar');
        },
        onError: (error) => {
          console.log(error)
          setIsSuccess(false);
          setFeedbackMessage("Não foi possível atualizar a quadra. Verifique seus dados e tente novamente.");
          setDialogOpen(true);
        }
      });
      setModoEdicao(false);
    } else {
      // Adicionar nova quadra
      const novaQuadra = {
        ...formData,
        id: courtData?.data?.data?.fields?.length + 1
      };
      
      const value = sendCoinBeck(formData?.hourlyRate);
      console.log(sendCoinBeck)
      mutateCourt({
      fieldTypeId: formData?.fieldTypeId,
      name: formData?.name,
      description: formData?.description,
      hourlyRate: value,
      address: {
        street: formData?.address?.street,
        cityId: 1,
        provinceId: 1,
        latitude: formData?.address?.latitude,
        longitude: formData?.address?.longitude
      },
      thumbnailUrl: formData?.thumbnailUrl}, {
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
const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const iniciarEdicao = (quadra) => {
    setFormData({
      fieldTypeId: quadra.fieldTypeId || 1,
      name: quadra.name || '',
      description: quadra.description || '',
      hourlyRate: quadra.hourlyRate || 0,
      address: {
        street: quadra.address?.street || '',
        cityId: quadra.address?.cityId || 1,
        provinceId: quadra.address?.provinceId || 1,
        latitude: quadra.address?.latitude || 0,
        longitude: quadra.address?.longitude || 0
      },
      thumbnailUrl: quadra.thumbnailUrl || ''
    });
    setQuadraEditando(quadra);
    setModoEdicao(true);
    setActiveTab('cadastrar');
  };

  const { data: typeData } = useGetCourtsTypeQuery();
  const { data: provinceData } = useGetProvincesQuery();
  const { data: cityData } = useGetCitiesQuery();

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
                    name="name"
                    value={formData.name}
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
                    name="fieldTypeId"
                    value={formData.fieldTypeId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                   <option value="">Selecione o tipo de quadra</option>
                      {typeData?.data?.data?.map((courttype)=>{
                          return(
                            <option value={courttype?.id}>{courttype?.name}</option>
                          )}
                        )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor por Hora (Kz)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagem da Quadra
                  </label>
                  <input
                    type="file"
                    name="thumbnailUrl"
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
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-700 mb-2">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rua
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade /provincia
                      </label>
                      <select
                        name="address.cityId"
                        value={formData.address.cityId}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                      <option value="">Selecione a cidade</option>
                      {cityData?.data?.data?.map((cidade)=>{
                        const provincia = provinceData?.data?.data?.find(p => p.id === cidade?.provinceId);
                          return(
                            <option value={cidade?.id}>{cidade?.name} ({provincia ? provincia?.name : 'Desconhecida'})</option>
                          )}
                        )}
                       </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        name="address.latitude"
                        value={formData.address.latitude}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="-90"
                        max="90"
                        step="0.000001"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        name="address.longitude"
                        value={formData.address.longitude}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        min="-180"
                        max="180"
                        step="0.000001"
                        required
                      />
                    </div>
                  </div>
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
                      Valor/Hora
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Endereço
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
                  {courtData?.data?.data?.fields?.map((quadra) => {
                    const court_type = typeData?.data?.data?.find(p => p.id === quadra?.fieldTypeId);
                    return(
                    <tr key={quadra.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {quadra.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="flex items-center">
                          <Layers size={14} className="mr-1" />
                          {court_type.name}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        Kz {quadra.hourlyRate?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {quadra.address?.street}
                      </td>
                      <td className="px-4 py-2">
                        {quadra.description ? 
                          (quadra.description.length > 50 ? 
                            `${quadra.description.substring(0, 50)}...` : 
                            quadra.description) : 
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
                  )})}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Dialog */}
    <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
      />
    </div>
  );
};

// Helper functions to get names from IDs
const getFieldTypeName = (id) => {
  const types = {
    1: 'Futebol',
    2: 'Basquete',
    3: 'Vôlei',
    4: 'Tênis',
    5: 'Futsal'
  };
  return types[id] || 'Desconhecido';
};



export default ManageCourt;