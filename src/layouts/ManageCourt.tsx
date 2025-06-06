import React, { useState } from 'react';
import { MapPin, Edit, Trash2, Save, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useGetProvincesQuery, useGetProvinceCityId
} from '@/api/provinceQuery';
import {
  useGetCitiesQuery
} from '@/api/cityQuery';
import {
  usePostCourt,
  usePatchFields,
  usePutCourt,
  useGetCourtsQuery,
  usePostImage
} from '@/api/courtQuery';
import {
  useGetCourtsTypeQuery
} from '@/api/courtQuery';
import FeedbackDialog from '@/_components/FeedbackDialog';
import {receiveCentFront, sendCoinBeck} from '@/utils/methods';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemeCourt } from '@/utils/validateForm.tsx';
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
import CourtAvailability from '@/_components/CourtAvailability';
import { MdOutlineWatchLater } from "react-icons/md";
import ImageUploader from '@/_components/ImageUploader';
import { Image } from 'lucide-react';
import FieldImagesDialog from '@/_components/FieldImagesDialog';

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
      cityId: '',
      provinceId: '',
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

  // Estados para o diálogo de imagens
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  
  // Estado para o ID da quadra selecionada - agora com nome mais descritivo
  const [selectedCourtId, setSelectedCourtId] = useState(null);

// Função para abrir o diálogo de imagens
const openImagesDialog = (fieldId) => {
  setSelectedFieldId(fieldId);
  // Atualizar também o selectedCourtId para manter consistência
  setSelectedCourtId(fieldId);
  setImagesDialogOpen(true);
};

// Função para fechar o diálogo de imagens
const closeImagesDialog = () => {
  setImagesDialogOpen(false);
  // Não resetamos o selectedFieldId/selectedCourtId aqui para manter a referência
};

  const { data: typeData } = useGetCourtsTypeQuery();
  const { data: provinceData } = useGetProvincesQuery();
  const { data: cityData } = useGetCitiesQuery();
  const [province, setProvince] = useState('');
  const {data: cities} = useGetProvinceCityId(province);

  const { mutate: mutateCourt } = usePostCourt();
  const { mutate: putCourt } = usePutCourt();
  const [erro, setErro] = useState('');
  
  // Função modificada para tratar mudança de abas preservando o ID da quadra selecionada
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'cadastrar') {
      setModoEdicao(false);
      formCourt.reset();
      // Não resetamos o selectedCourtId aqui para preservar a referência
    }
  };

  // Função para abrir a aba de disponibilidade da quadra
  const openCourtAvailability = (courtId) => {
    // Primeiro atualizamos o ID da quadra
    setSelectedCourtId(courtId);
    // Depois mudamos para a aba de disponibilidade
    setActiveTab('disponibilidade');
  };

  //Patch para deletar quadra
  const { mutate: patchFields } = usePatchFields();

  const handleSubmitPatchFields = (id) => {
    patchFields({ id: id, isDeleted: true }, {
      onSuccess: () => {
        setIsSuccess(true);
        setFeedbackMessage("A quadra foi deletada com sucesso!");
        setDialogOpen(true);
        // Se a quadra deletada for a atualmente selecionada, resetamos o ID
        if (selectedCourtId === id) {
          setSelectedCourtId(null);
        }
      },
      onError: (error) => {
        setErro(error)
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível deletar a quadra. Tente novamente mais tarde.");
        setDialogOpen(true);
      }
    });
  };

  // Função para abrir o diálogo de confirmação de exclusão
  const openDeleteDialog = (quadra) => {
    setQuadraParaExcluir(quadra);
    // Atualizamos também o selectedCourtId para manter consistência
    setSelectedCourtId(quadra.id);
    setDeleteDialogOpen(true);
  };

  // Função para confirmar a exclusão
  const confirmDelete = () => {
    if (quadraParaExcluir) {
      handleSubmitPatchFields(quadraParaExcluir.id);
    }
    setDeleteDialogOpen(false);
  };

  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const { mutate: mutateImage } = usePostImage();
  
  function submitCourt(data: any, event: React.FormEvent<HTMLFormElement> | undefined) {
    event?.preventDefault(); 

    const courtData = {
      ...data,
      thumbnailUrl: thumbnailUrls.length > 0 ? thumbnailUrls[0] : '', // Use a primeira imagem como thumbnail
      additionalImages: thumbnailUrls.slice(1) // Imagens adicionais, se houver
    };

    if (modoEdicao) {
      mutateImage({fieldType: data.fieldTypeId, url: data.thumbnailUrl});
      putCourt(data, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("A quadra foi atualizada com sucesso!");
          setDialogOpen(true);
          formCourt.reset();
          // Preservamos o ID da quadra mesmo após salvar
          setSelectedCourtId(data.id);
          setActiveTab('listar');
        },
        onError: (error) => {
          console.log(error)
          setIsSuccess(false);
          setErro(error);
          setFeedbackMessage("Não foi possível atualizar a quadra. Verifique seus dados e tente novamente.");
          setDialogOpen(true);
          setModoEdicao(true);
          setActiveTab('cadastrar');
        }
      });
      setModoEdicao(false);
    } else {
      const value = sendCoinBeck(data?.hourlyRate);
      mutateCourt({ 
        fieldTypeId: data?.fieldTypeId,
        name: data?.name,
        description: data?.description,
        hourlyRate: value,
        address: {
          street: data?.address?.street,
          cityId: data?.address?.cityId,
          provinceId: province,
          latitude: data?.address?.latitude,
          longitude: data?.address?.longitude
        },
        thumbnailUrl: data?.thumbnailUrl
      }, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("A quadra foi cadastrada com sucesso!");
          setDialogOpen(true);
          // Atualiza o ID da quadra com o ID da nova quadra criada (se disponível na resposta)
          if (response?.data?.data?.id) {
            setSelectedCourtId(response.data.data.id);
          }
          formCourt.reset();
          setActiveTab('listar');
        },
       onError: (error) => {
        console.log(error.response?.data?.data?.errors); 
        setErro(error);
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
    const value = receiveCentFront(court?.hourlyRate);
    setQuadraEditando(court);
    // Atualiza o ID da quadra sendo editada
    setSelectedCourtId(court.id);
    
    formCourt.setValue("id", court.id);
    formCourt.setValue("name", court.name);
    formCourt.setValue("description", court.description);
    formCourt.setValue("hourlyRate", parseInt(value));
    formCourt.setValue("address.street", court.address.street);
    formCourt.setValue("address.latitude", court.address.latitude);
    formCourt.setValue("address.longitude", court.address.longitude);
    formCourt.setValue("address.cityId", court.address.cityId);
    formCourt.setValue("address.provinceId", court.address.provinceId);
    formCourt.setValue("thumbnailUrl", court.thumbnailUrl);
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
        {activeTab === 'disponibilidade' &&
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'disponibilidade'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('disponibilidade')}
        >
          Disponibilidade
        </button>
      }
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
                        Imagem de Capa
                      </FormLabel>
                      <ImageUploader 
                        onImageUpload={(urls) => {
                          setThumbnailUrls(urls);
                          field.onChange(urls.length > 0 ? urls[0] : '');
                        }}
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
                    <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Província</Label>
                     <select
                             onChange={(e) => {
                                      setProvince(parseInt(e.target.value))
                                    }}
                           className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                             <option value="">Selecione a província</option>
                              {provinceData?.data?.data?.map((cidade)=>{
                                return(
                                    <option key={cidade?.id} value={cidade.id}>{cidade?.name}</option>
                                  )}
                                )}
                          </select>
                          </div>
                    </div>
                    <div>
                     <FormField
                    control={formCourt.control}
                    name="address.cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Cidade</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                             onChange={(e) => {
                                      field.onChange(parseInt(e.target.value));
                                    }}
                           className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                           
                              {cities?.data?.data?.map((cidade)=>{
                                console.log(cidade)
                                return(
                                    <option key={cidade?.id} value={`${cidade?.id}`}>{cidade?.name}</option>
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
      ) : activeTab === 'listar' ? (
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
                    <tr key={quadra.id} className={selectedCourtId === quadra.id ? "bg-green-50" : ""}>
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
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        <button
                          onClick={() => iniciarEdicao(quadra)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(quadra)}
                          className="text-red-600 hover:text-red-800 mr-3"
                        >
                          <Trash2 size={16} />
                        </button>
                      
                        <button
                          onClick={() => openCourtAvailability(quadra.id)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <MdOutlineWatchLater />
                        </button>

                        <button
                            onClick={() => openImagesDialog(quadra.id)}
                            className="text-purple-600 hover:text-purple-800 ml-3"
                            title="Gerenciar Imagens"
                          >
                            <Image size={16} />
                          </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Conteúdo da aba Disponibilidade - Adicionado key prop para forçar re-render
        <CourtAvailability 
          key={`court-availability-${selectedCourtId}`} 
          ulid={selectedCourtId}
        />
      )}

      {/* Feedback Dialog */}
      <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
        errorData={erro}
      />
      
      {/* Field Images Dialog */}
      <FieldImagesDialog 
        isOpen={imagesDialogOpen}
        onClose={closeImagesDialog}
        fieldId={selectedFieldId}
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