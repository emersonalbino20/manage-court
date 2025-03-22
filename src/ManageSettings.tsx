import React, { useState } from 'react';
import { MapPin, Edit, Trash2, Save, Layers, PlusCircle, CheckCircle2, Building, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usePostCourtType,
  usePutCourtType,
  useGetCourtsTypeQuery
} from '@/api/courtQuery';
import {
  usePostProvince,
  usePutProvince,
  useGetProvincesQuery
} from '@/api/provinceQuery';
import {
  usePostCity,
  usePutCity,
  useGetCitiesQuery
} from '@/api/cityQuery';
import { Link } from 'react-router-dom';
import FeedbackDialog from './_components/FeedbackDialog'; // Ajuste o caminho conforme necessário
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { schemeCourtType } from './utils/validateForm.tsx';
import { schemeProvince } from './utils/validateForm.tsx';
import { schemeCity } from './utils/validateForm.tsx';

const ManageSettings = () => {

  const formCourt = useForm({
    resolver: zodResolver(schemeCourtType),
    defaultValues: {
      name: "",
    },
  });

const formProvince = useForm({
    resolver: zodResolver(schemeProvince),
    defaultValues: {
      name: "",
    },
  });

const formCity = useForm({
    resolver: zodResolver(schemeCity),
    defaultValues: {
      name: "",
    },
  });

  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [editandoTipo, setEditandoTipo] = useState("");

  const { mutate: mutatePostCourt } = usePostCourtType();
  const { mutate: mutatePutCourt } = usePutCourtType();

 function submitCourt(data: any, event?: React.FormEvent<HTMLFormElement>) {
  event?.preventDefault(); // Garante que o evento seja prevenido se for passado
  if (editandoTipo) {
    mutatePutCourt(data, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("A quadra foi editada com sucesso!");
        setDialogOpen(true);
        setEditandoTipo(null); // Reseta o estado após edição
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível editar a quadra.");
        setDialogOpen(true);
      }
    });

  } else {
    mutatePostCourt(data, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("A quadra foi cadastrada com sucesso!");
        setDialogOpen(true);
        formCourt.reset();
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível cadastrar a quadra.");
        setDialogOpen(true);
      }
    });

  }
}

const [editandoProvincia, setEditandoProvincia] = useState(null);
const { mutate: mutatePostProvince } = usePostProvince();
const { mutate: mutatePutProvince } = usePutProvince();
function submitProvince(data: any, event: React.FormEvent<HTMLFormElement> | undefined) {
     event?.preventDefault(); // Garante que o evento seja prevenido se for passado
  if (editandoProvincia) {
    mutatePutProvince(data, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("A pronvíncia foi actualizada com sucesso!");
        setDialogOpen(true);
        setEditandoProvincia(null); // Reseta o estado após edição
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível actualizar a província. Verifique os dados e tente novamente.");
        setDialogOpen(true);
      }
    });
  }else{
    mutatePostProvince(data, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("A pronvíncia foi cadastrada com sucesso!");
        setDialogOpen(true);
        formProvince.reset();
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível cadastra a província. Verifique os dados e tente novamente.");
        setDialogOpen(true);
      }
    });
  }}

const [editandoCidade, setEditandoCidade] = useState(null);
const { mutate: mutatePostCity } = usePostCity();
const { mutate: mutatePutCity } = usePutCity();
function submitCity(data: any, event: React.FormEvent<HTMLFormElement> | undefined) {
   event?.preventDefault(); // Garante que o evento seja prevenido se for passado
  if (editandoCidade) {
    mutatePutCity(data, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("A cidade foi actualizada com sucesso!");
        setDialogOpen(true);
        formCity.reset();
        setEditandoProvincia(null); // Reseta o estado após edição
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível actualizar a cidade. Verifique os dados e tente novamente.");
        setDialogOpen(true);
      }
    });
  }else{
    mutatePostCity(data, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("A cidade foi cadastrada com sucesso!");
        setDialogOpen(true);
        formCity.reset();
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível cadastra a cidade. Verifique os dados e tente novamente.");
        setDialogOpen(true);
      }
    });
  }}

const [novaCidade, setNovaCidade] = useState({ nome: '', fk_provincia: '' });
React.useEffect(() => {
  if (novaCidade?.fk_provincia) {
    formCity.setValue('provinceId', parseInt(novaCidade.fk_provincia, 10));
  }
}, [novaCidade?.fk_provincia]);
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Estado para controlar qual tab está ativa
  const [activeTab, setActiveTab] = useState('tipos');

  // Estados para os dados
  const { data: courtData } = useGetCourtsTypeQuery();
  const { data: provinceData } = useGetProvincesQuery();
  const { data: cityData } = useGetCitiesQuery();

  const editarTipoCampo = (tipo) => {
    setEditandoTipo(tipo)
    formCourt.setValue("id", tipo.id);
    formCourt.setValue("name", tipo.name);
  };
  const editarProvincia = (province) => {
     setEditandoProvincia(province)
    formProvince.setValue("id", province.id);
    formProvince.setValue("name", province.name);
  };
  
  const editarCidade = (cidade, pr) => {
    setEditandoCidade(cidade)
    formCity.setValue("id", cidade.id);
    formCity.setValue("provinceId", pr);
    formCity.setValue("name", cidade.name);
  };


  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <Layers className="mr-2" /> Configurações do Sistema
        </h1>
      </div>

      {/* Abas */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeTab === 'tipos'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('tipos')}
        >
          Tipos de Campo
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeTab === 'provincias'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('provincias')}
        >
          Províncias
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeTab === 'cidades'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('cidades')}
        >
          Cidades
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'tipos' && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center">
              <Layers size={18} className="mr-2" /> Gerenciar Tipos de Campo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Cadastro */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {editandoTipo ? 'Editar Tipo de Campo' : 'Novo Tipo de Campo'}
                </h3>
                <div className="space-y-4">
            <Form {...formCourt}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                formCourt.handleSubmit((data) => submitCourt(data, e))();
              }} 
             
            >
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                     <FormField
                    control={formCourt.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Tipo</FormLabel>
                        <Input {...field} placeholder="Ex: Basquete"/>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    </div>
                    <Button 
                    type="submit" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} className="mr-1" />
                      { editandoTipo ?  'Actualizar' : 'Salvar' }
                    </Button>
                  </div>
                  </form>
                  </Form>
                </div>
              </div>

              {/* Lista de Tipos de Campo */}
              <div>
                <h3 className="text-lg font-medium mb-4">Tipos Cadastrados</h3>
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                  {courtData?.data?.data?.length > 0 ? (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Nome</th>
                          <th className="text-right pb-2 text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {courtData?.data?.data?.map((tipo) => (
                          <tr key={tipo.id}>
                            <td className="py-2">{tipo.name}</td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => editarTipoCampo(tipo)}
                                className="text-blue-600 hover:text-blue-800 mr-2"
                              >
                                <Edit size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nenhum tipo de campo cadastrado
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'provincias' && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center">
              <Building size={18} className="mr-2" /> Gerenciar Províncias
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Cadastro */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {editandoProvincia ? 'Editar Província' : 'Nova Província'}
                </h3>
                <div className="space-y-4">
               <Form {...formProvince}>
                  <form 
                    onSubmit={(e) => {   
                      e.preventDefault();
                      formProvince.handleSubmit((data) => submitProvince(data, e))();
                    }} 
                  >
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <FormField
                          control={formProvince.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome da Província</FormLabel>
                              <Input {...field} placeholder="Ex: Luanda"/>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        <Save size={16} className="mr-1" />
                        {editandoProvincia ? 'Atualizar' : 'Salvar'}
                      </Button>
                    </div>
                  </form>
                </Form>

                </div>
              </div>

              {/* Lista de Províncias */}
              <div>
                <h3 className="text-lg font-medium mb-4">Províncias Cadastradas</h3>
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                  {provinceData?.data?.data?.length > 0 ? (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Nome</th>
                          <th className="text-right pb-2 text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {provinceData?.data?.data?.map((provincia) => (
                          <tr key={provincia.id}>
                            <td className="py-2">{provincia.name}</td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => editarProvincia(provincia)}
                                className="text-blue-600 hover:text-blue-800 mr-2"
                              >
                                <Edit size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nenhuma província cadastrada
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'cidades' && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center">
              <Home size={18} className="mr-2" /> Gerenciar Cidades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Cadastro */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {editandoCidade ? 'Editar Cidade' : 'Nova Cidade'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cidade-provincia">Província</Label>
                    <Select 
                      value={novaCidade.fk_provincia} 
                      onValueChange={(value) => setNovaCidade({...novaCidade, fk_provincia: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma província" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinceData?.data?.data?.map((provincia) => (
                          <SelectItem key={provincia.id} value={provincia.id.toString()}>
                            {provincia.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!novaCidade.fk_provincia && (
                      <p className="text-xs text-amber-600 mt-1">
                        É necessário selecionar uma província primeiro
                      </p>
                    )}
                  </div>
                <Form {...formCity}>
                    <form 
                        onSubmit={(e) => {   // ✅ Correto! Use `onSubmit`
                       e.preventDefault();
                         formCity.handleSubmit((data) => submitCity(data, e))();
                    }} 
              >
                  <div className="flex items-end gap-2">
                  
                    <div className="flex-1">
                      <FormField
                        control={formCity.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Cidade</FormLabel>
                            <Input {...field} placeholder="Ex: Talatona"/>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formCity.control}
                        name="provinceId"
                        render={({ field }) => (
                          <FormItem>
                            <Input 
                            type="hidden" 
                            value={novaCidade?.fk_provincia}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} // ⬅️ Evita `NaN`
                          />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      </div>
                    <Button 
                      type='submit'
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} className="mr-1" />
                      {editandoCidade ? 'Atualizar' : 'Salvar'}
                    </Button>
                    
                    </div>
                    </form>
                    </Form>
                  

                </div>
              </div>

              {/* Lista de Cidades */}
              <div>
                <h3 className="text-lg font-medium mb-4">Cidades Cadastradas</h3>
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                  {cityData?.data?.data?.length > 0 ? (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Nome</th>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Província</th>
                          <th className="text-right pb-2 text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cityData?.data?.data?.map((cidade) => {
                          const provincia = provinceData?.data?.data?.find(p => p.id === cidade?.provinceId);
                          return (
                            <tr key={cidade.id}>
                              <td className="py-2">{cidade.name}</td>
                              <td className="py-2">{provincia ? provincia?.name : 'Desconhecida'}</td>
                              <td className="py-2 text-right">
                                <button
                                  onClick={() => editarCidade(cidade, provincia.provinceId)}
                                  className="text-blue-600 hover:text-blue-800 mr-2"
                                >
                                  <Edit size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nenhuma cidade cadastrada
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de feedback */}
      <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
      />
    </div>
  );
};

export default ManageSettings;