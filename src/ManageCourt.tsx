import React, { useState } from 'react';
import { MapPin, Edit, Trash2, Save, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useGetProvincesQuery
} from '@/api/provinceQuery';
import {
  useGetCitiesQuery
} from '@/api/cityQuery';
import {
  usePostCourt,
  usePatchFields,
  usePutCourt,
  useGetCourtsQuery
} from '@/api/courtQuery';
import {
  useGetCourtsTypeQuery
} from '@/api/courtQuery';
import FeedbackDialog from './_components/FeedbackDialog';
import {receiveCentFront, sendCoinBeck} from './utils/methods';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemeCourt } from './utils/validateForm.tsx';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ManageCourt = () => {

const formCourt = useForm({
    resolver: zodResolver(schemeCourt),
    defaultValues: {
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
    },
  });

  const [activeTab, setActiveTab] = useState('cadastrar');
  
  const [modoEdicao, setModoEdicao] = useState(false);
  const [quadraEditando, setQuadraEditando] = useState(null);

  // Dados da API
  const { data: courtData } = useGetCourtsQuery();
  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Estados para o diálogo de confirmação de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quadraParaExcluir, setQuadraParaExcluir] = useState(null);

  const { data: typeData } = useGetCourtsTypeQuery();
  const { data: provinceData } = useGetProvincesQuery();
  const { data: cityData } = useGetCitiesQuery();

  const { mutate: mutateCourt } = usePostCourt();
  const { mutate: putCourt } = usePutCourt();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'cadastrar') {
      setModoEdicao(false);
      formCourt.reset();
    }
  };

  //Patch
  const { mutate: patchFields } = usePatchFields();

  const handleSubmitPatchFields = (id) => {
    patchFields({ id: id, isDeleted: true }, {
      onSuccess: () => {
        setIsSuccess(true);
        setFeedbackMessage("A quadra foi deletada com sucesso!");
        setDialogOpen(true);
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível deletar a quadra. Tente novamente mais tarde.");
        setDialogOpen(true);
      }
    });
  };

  // Função para abrir o diálogo de confirmação
  const openDeleteDialog = (quadra) => {
    setQuadraParaExcluir(quadra);
    setDeleteDialogOpen(true);
  };

  // Função para confirmar a exclusão
  const confirmDelete = () => {
    if (quadraParaExcluir) {
      handleSubmitPatchFields(quadraParaExcluir.id);
    }
    setDeleteDialogOpen(false);
  };

  function submitCourt(data: any, event: React.FormEvent<HTMLFormElement> | undefined) {
    event?.preventDefault(); 

    if (modoEdicao) {
      
      putCourt(data, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("A quadra foi atualizada com sucesso!");
          setDialogOpen(true);
          formCourt.reset();
          setActiveTab('listar');
        },
        onError: (error) => {
          console.log(error)
          setIsSuccess(false);
          setFeedbackMessage("Não foi possível atualizar a quadra. Verifique seus dados e tente novamente.");
          setDialogOpen(true);
          setModoEdicao(true);
          setActiveTab('cadastrar');
        }
      });
      setModoEdicao(false);
    } else {
      const value = sendCoinBeck(data?.hourlyRate);
      mutateCourt({ fieldTypeId: data?.fieldTypeId,
                    name: data?.name,
                    description: data?.description,
                    hourlyRate: value,
                    address: {
                      street: data?.address?.street,
                      cityId: data?.address?.cityId,
                      provinceId: data?.address?.provinceId,
                      latitude: data?.address?.latitude,
                      longitude: data?.address?.longitude
                    },
                    thumbnailUrl: data?.thumbnailUrl
                    }, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("A quadra foi cadastrada com sucesso!");
          setDialogOpen(true);
          formCourt.reset();
          setActiveTab('listar');
        },
        onError: (error) => {
          console.log(error)
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

  const iniciarEdicao = (court) => {
    setQuadraEditando(court);
    formCourt.setValue("id", court.id);
    formCourt.setValue("name", court.name);
    formCourt.setValue("description", court.description);
    formCourt.setValue("hourlyRate", court.hourlyRate);
    formCourt.setValue("address.street", court.address.street);
    formCourt.setValue("address.latitude", court.address.latitude);
    formCourt.setValue("address.longitude", court.address.longitude);
    formCourt.setValue("address.cityId", court.address.cityId);
    formCourt.setValue("address.provinceId", court.address.provinceId);
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
          <Form {...formCourt}>
            <form onSubmit={(e) => {
                e.preventDefault();
                formCourt.handleSubmit((data) => submitCourt(data, e))();
              }} 
             >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={formCourt.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Nome da Quadra</FormLabel>
                        <FormControl>
                        <Input {...field} 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                 <FormField
                    control={formCourt.control}
                    name="fieldTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Tipo de Quadra</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                           className="w-full p-2 border border-gray-300 rounded-md"
                           onChange={(e) => {
                                    field.onChange(parseInt(e.target.value));
                                  }}>
                             <option value="">Selecione o tipo de quadra</option>
                              {typeData?.data?.data?.map((courttype)=>{
                                  return(
                                    <option key={courttype?.id} value={courttype?.id}>{courttype?.name}</option>
                                  )}
                                )}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                <FormField
                  control={formCourt.control}
                  name="hourlyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Valor por Hora (Kz)</FormLabel>
                      <FormControl>
                      <Input type="number" {...field}
                      step={0.01}
                      onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div>
                 <FormField
                  control={formCourt.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Imagem da Quadra</FormLabel>
                      <Input type="file" {...field} multiple
                      className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>

                <div className="md:col-span-2">
                 <FormField
                  control={formCourt.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição</FormLabel>
                     <Textarea 
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                  />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-medium text-gray-700 mb-2">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <FormField
                        control={formCourt.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                            Rua</FormLabel>
                           <Input type="text" 
                          {...field}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                     <FormField
                    control={formCourt.control}
                    name="address.cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Cidade / Província</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                             onChange={(e) => {
                                      field.onChange(parseInt(e.target.value));
                                    }}
                           className="w-full p-2 border border-gray-300 rounded-md"
                            
                          >
                             <option value="">Selecione a cidade</option>
                              {cityData?.data?.data?.map((cidade)=>{
                                const provincia = provinceData?.data?.data?.find(p => p.id === cidade?.provinceId);
                                return(
                                    <option key={cidade?.id} value={`${cidade?.id}`}>{cidade?.name} ({provincia ? provincia?.name : 'Desconhecida'})</option>
                                  )}
                                )}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    </div>

                    <div>
                     <FormField
                        control={formCourt.control}
                        name="address.latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude</FormLabel>
                           <Input type="number" 
                          {...field}
                          min={-90}
                          max={90}
                          step="0.000001"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={formCourt.control}
                        name="address.longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude</FormLabel>
                           <Input type="number" 
                          {...field}
                          min={-180}
                          max={180}
                          step="0.000001"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                            <FormMessage />
                          </FormItem>
                        )}
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
            </Form>
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
                    const price = receiveCentFront(quadra.hourlyRate);
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
                        Kz {price}
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
                        <button
                          onClick={() => openDeleteDialog(quadra)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
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

      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a quadra "{quadraParaExcluir?.name}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageCourt;