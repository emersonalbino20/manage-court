import React, { useState } from 'react';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
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
  User, 
  Phone, 
  Mail, 
  Key, 
  Save,
  ShieldCheck
} from 'lucide-react';
import { useGetClientsQuery } from '@/api/userQuery';

const EditProfile = () => {
  // Dados simulados do usuário
  const { data: profileData} = useGetClientsQuery();
  console.log(profileData)
  const [userData, setUserData] = useState({
    nome: 'Carlos Silva',
    telefone: '(11) 98765-4321',
    email: 'carlos.silva@exemplo.com',
    senha: '',
    confirmarSenha: ''
  });

  // Estado para confirmação de salvamento
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Função para lidar com alterações de input
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  // Função para salvar alterações
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setShowConfirmation(true);
  };

  // Função para fechar o diálogo de confirmação
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6" /> Editar Perfil
          </CardTitle>
          <CardDescription>
            Atualize suas informações pessoais
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Nome Completo
                </Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  value={userData.nome} 
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Telefone
                </Label>
                <Input 
                  id="telefone" 
                  name="telefone" 
                  value={userData.telefone} 
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={userData.email} 
                  onChange={handleChange}
                  placeholder="seu.email@exemplo.com"
                  required
                />
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <ShieldCheck className="h-4 w-4" /> 
                  Preencha os campos abaixo apenas se desejar alterar sua senha
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senha" className="flex items-center gap-2">
                    <Key className="h-4 w-4" /> Nova Senha
                  </Label>
                  <Input 
                    id="senha" 
                    name="senha" 
                    type="password" 
                    value={userData.senha} 
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="confirmarSenha" className="flex items-center gap-2">
                    <Key className="h-4 w-4" /> Confirmar Nova Senha
                  </Label>
                  <Input 
                    id="confirmarSenha" 
                    name="confirmarSenha" 
                    type="password" 
                    value={userData.confirmarSenha} 
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pt-4 flex justify-between">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Salvar Alterações
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      
      {/* Diálogo de confirmação */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dados atualizados com sucesso!</AlertDialogTitle>
            <AlertDialogDescription>
              Suas informações pessoais foram atualizadas no sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseConfirmation}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditProfile;