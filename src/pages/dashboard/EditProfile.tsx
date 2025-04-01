import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  Phone, 
  Mail, 
  Key, 
  Save,
  ShieldCheck,
  Home,
  Calendar,
  LogOut,
  Menu,
  ChevronDown
} from 'lucide-react';
import { useGetClientsQuery, usePutClient } from '@/api/userQuery';
import { useForm } from "react-hook-form";
import FeedbackDialog from '@/_components/FeedbackDialog';
import { zodResolver } from "@hookform/resolvers/zod";
import { schemeMyProfile } from '@/utils/validateForm.tsx';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "@/hooks/AuthContext";

const EditProfile = () => {
  // Dados do usuário
  const { data: profileData, isLoading } = useGetClientsQuery();
//  console.log(profileData)
  const formProfile = useForm({
    resolver: zodResolver(schemeMyProfile),
    defaultValues: {
      password: ''
    },
  });
  
  const { logout } = useAuth();

  // Estado para confirmação de salvamento
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [erro, setErro] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { mutate, isLoading: isSaving } = usePutClient();
  
  // Função para salvar alterações
  function submitProfile(data, event) {
    event?.preventDefault(); 
    mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
        setFeedbackMessage("Os seus dados foram actualizados com sucesso!");
        setDialogOpen(true);
      },
      onError: (error) => {
        setErro(error)
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível actualizar os seus dados.");
        setDialogOpen(true);
      }
    });
  };

const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com navegação */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Minha Conta</h1>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                <span className="hidden md:inline">Menu</span>
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Menu de navegação</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link to={'/'}>
              <DropdownMenuItem >
                <Home className="mr-2 h-4 w-4" />
                <span>Página Inicial</span>
              </DropdownMenuItem>
              </Link>
              <Link to={'/courtdetails'}>
              <DropdownMenuItem >
                <Calendar className="mr-2 h-4 w-4" />
                <span>Minhas Reservas</span>
              </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6 text-primary" /> Editar Perfil
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Form {...formProfile}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  formProfile.handleSubmit((data) => submitProfile(data, e))();
                }} 
                className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <FormField
                        control={formProfile.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="name" className="flex items-center gap-2">
                              <User className="h-4 w-4" />Nome Completo
                            </FormLabel>
                            <FormControl>
                              <Input 
                                id="name" 
                                {...field} 
                                placeholder="Digite seu nome completo"
                                className="focus:ring-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <FormField
                        control={formProfile.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="phone" className="flex items-center gap-2">
                              <Phone className="h-4 w-4" /> Telefone
                            </FormLabel>
                            <FormControl>
                              <Input 
                                id="phone" 
                                {...field} 
                                maxLength={9}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9);
                                }}
                                className="focus:ring-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  
                    <div className="space-y-2">
                      <FormField
                        control={formProfile.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="email" className="flex items-center gap-2">
                              <Mail className="h-4 w-4" /> Email
                            </FormLabel>
                            <FormControl>
                              <Input 
                                id="email" 
                                {...field} 
                                type="email"
                                placeholder="seu.email@exemplo.com"
                                className="focus:ring-primary"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4 border-t mt-4">
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                        <ShieldCheck className="h-4 w-4" /> 
                        Preencha os campos abaixo apenas se desejar alterar sua senha
                      </div>
                      
                      <div className="space-y-2">
                        <FormField
                          control={formProfile.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="password" className="flex items-center gap-2">
                                <Key className="h-4 w-4" /> Nova Senha
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  id="password" 
                                  {...field}
                                  type="password" 
                                  placeholder="••••••••"
                                  className="focus:ring-primary"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                          <Key className="h-4 w-4" /> Confirmar Nova Senha
                        </Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword" 
                          type="password" 
                          placeholder="••••••••"
                          className="focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <CardFooter className="px-0 pt-4 flex flex-col sm:flex-row justify-between gap-4">
                  <Link to={'/'}>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      className="flex items-center justify-center gap-2 w-full sm:w-auto"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Salvar Alterações
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
        
       {/* Feedback Dialog */}
      <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
        errorData={erro}
      />
      
      </div>
    </div>
  );
};

export default EditProfile;