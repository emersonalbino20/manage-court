import React, { useState } from 'react';
import { Users, Edit, Trash2, Save, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useGetUsersQuery,
  usePostUsers,
} from '@/api/userQuery';
import FeedbackDialog from '@/_components/FeedbackDialog';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemeUser } from '@/utils/validateForm.tsx';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
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

const ManageUsers = () => {

  const formUser = useForm({
    resolver: zodResolver(schemeUser),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      type: 'client',
      password: ''
    },
  });

  const [activeTab, setActiveTab] = useState('cadastrar');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Dados da API
  const { data: userData } = useGetUsersQuery();
  console.log(userData)
  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [erro, setErro] = useState("");
  // Estados para o diálogo de confirmação de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  const { mutate: mutateUser } = usePostUsers();
  //const { mutate: putUser } = usePutUser();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'cadastrar') {
      setModoEdicao(false);
      formUser.reset();
    }
  };

  //Patch
  /*const { mutate: patchUser } = usePatchUser();

  const handleSubmitPatchUser = (id) => {
    patchUser({ id: id, isDeleted: true }, {
      onSuccess: () => {
        setIsSuccess(true);
        setFeedbackMessage("O usuário foi deletado com sucesso!");
        setDialogOpen(true);
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível deletar o usuário. Tente novamente mais tarde.");
        setDialogOpen(true);
      }
    });
  };*/

  // Função para abrir o diálogo de confirmação
  const openDeleteDialog = (usuario) => {
    setUsuarioParaExcluir(usuario);
    setDeleteDialogOpen(true);
  };

  // Função para confirmar a exclusão
  const confirmDelete = () => {
    if (usuarioParaExcluir) {
      //handleSubmitPatchUser(usuarioParaExcluir.id);
    }
    setDeleteDialogOpen(false);
  };

  function submitUser(data: any, event: React.FormEvent<HTMLFormElement> | undefined) {
    event?.preventDefault(); 

    /*if (modoEdicao) {
      putUser(data, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("O usuário foi atualizado com sucesso!");
          setDialogOpen(true);
          formUser.reset();
          setActiveTab('listar');
        },
        onError: (error) => {
          console.log(error);
          setIsSuccess(false);
          setFeedbackMessage("Não foi possível atualizar o usuário. Verifique seus dados e tente novamente.");
          setDialogOpen(true);
          setModoEdicao(true);
          setActiveTab('cadastrar');
        }
      });
      setModoEdicao(false);
    } else {*/
      mutateUser({ 
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        type: data?.type,
        password: data?.password
      }, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("O usuário foi cadastrado com sucesso!");
          setDialogOpen(true);
          formUser.reset();
          setActiveTab('listar');
        },
        onError: (error) => {
          setErro(error);
          setIsSuccess(false);
          setFeedbackMessage("Não foi possível cadastrar o usuário. Verifique seus dados e tente novamente.");
          setDialogOpen(true);
        }
      });
    //}
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const iniciarEdicao = (user) => {
    setUsuarioEditando(user);
    formUser.setValue("id", user.id);
    formUser.setValue("name", user.name);
    formUser.setValue("email", user.email);
    formUser.setValue("phone", user.phone);
    formUser.setValue("type", user.type);
    // Não configuramos a senha para edição por motivos de segurança
    formUser.setValue("password", "");
    setModoEdicao(true);
    setActiveTab('cadastrar');
  };

  // Tipos de usuário disponíveis
  const userTypes = [
    { id: 'administrator', name: 'Administrador' },
    { id: 'operator', name: 'Operador' }
  ];

return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <Users className="mr-2" /> Gerenciar Usuários
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
          {modoEdicao ? 'Editar Usuário' : 'Cadastrar Usuário'}
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'listar'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('listar')}
        >
          Usuários Cadastrados
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'cadastrar' ? (
        <Card>
          <CardHeader className="p-4">
            <CardTitle>
              {modoEdicao ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
          <Form {...formUser}>
            <form onSubmit={(e) => {
                e.preventDefault();
                formUser.handleSubmit((data) => submitUser(data, e))();
              }} 
             >
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={formUser.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</FormLabel>
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
                    control={formUser.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuário</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                           className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Selecione o tipo de usuário</option>
                            {userTypes.map((type) => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={formUser.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Email</FormLabel>
                        <FormControl>
                        <Input {...field} type="email"
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
                    control={formUser.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Telefone</FormLabel>
                        <FormControl>
                        <Input {...field} 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        maxLength={9}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9);
                        }}
                        />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={formUser.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          {modoEdicao ? 'Nova Senha (deixe em branco para manter atual)' : 'Senha'}
                        </FormLabel>
                        <FormControl>
                        <Input {...field} type="password"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            <CardTitle>Usuários Cadastrados</CardTitle>
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
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Telefone
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Data de Cadastro
                    </th>
                    {/*<th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>*/}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userData?.data?.users?.map((usuario) => {
                    const userType = userTypes.find(type => type.id === usuario?.type);
                    return(
                    <tr key={usuario.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {usuario.name.length > 30 ? 
                          `${usuario.name.substring(0, 30)}...` : 
                          usuario.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {usuario.email}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {usuario.phone}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="flex items-center">
                          <Shield size={14} className="mr-1" />
                          {userType ? userType.name : usuario.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      {/*<td className="px-4 py-2 whitespace-nowrap text-right">
                        <button
                          onClick={() => iniciarEdicao(usuario)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(usuario)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>*/}
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null} 

      {/* Feedback Dialog */}
      <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
        errorData={erro}
      />

      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o usuário "{usuarioParaExcluir?.name?.substring(0, 20)}..."? 
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

export default ManageUsers;

