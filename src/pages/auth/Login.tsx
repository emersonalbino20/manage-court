import React, { useState } from 'react';
import { Eye, EyeOff, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import LOGO from '@/assets/images/LOGO.png';
import { useAuth } from "./../../hooks/AuthContext";
import { usePostLogin } from '@/api/userQuery';
import FeedbackDialog from '@/_components/FeedbackDialog'; 
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { schemeLogin } from '@/utils/validateForm.tsx';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

const Login = () => {

const { login } = useAuth();
const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);
const [password, setPassword] = useState('');

const form = useForm({
    resolver: zodResolver(schemeLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isLoading } = usePostLogin();
const [isFailedDialog, setFailedDialog] = useState(false);
  // Função modificada para prevenir explicitamente o comportamento padrão
  function onSubmit(data: any, event: React.FormEvent<HTMLFormElement> | undefined) {
    // Previne explicitamente o comportamento padrão
    if (event) {
      event.preventDefault();
    }
    
    mutate(data, {
      onSuccess: (response) => {
        login(response); // Salva o token e usuário no contexto e localStorage
        console.log(response)
        navigate("/");
        form.reset();
      },
      onError: (error) => {
        setFailedDialog(true);
        setFeedbackMessage("Crendiais Inválidas.");
        setDialogOpen(true);
      }
    });
    
    // Retorna false para garantir que não haja recarregamento
    return false;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* Logo e nome do sistema */}
      <div className="flex flex-col items-center space-x-3 text-md sm:text-xl md:text-2xl font-bold text-green-700">
        <img 
          src={LOGO} 
          className="h-12 w-12 sm:h-16 sm:w-16 md:h-28 md:w-28 object-contain" 
          alt="Logo" 
        />
        <span>AgendaQuadra</span>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-gray-800">Bem-vindo(a)</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Faça login para agendar sua quadra
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
           <Form {...form}>
            {/* Modificado para passar o evento para onSubmit */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit((data) => onSubmit(data, e))();
              }} 
              className="space-y-4"
            >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
              <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem >
                        <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com"
                        {...field}
                      />
                      <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-gray-700">Senha</Label>
                <Link to={'/forgot-password'} >
                  <span>
                  Esqueceu a senha?
                  </span>
                </Link>
              </div>
              <div className="relative">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem >
                        <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        {...field}
                      />
                      <FormMessage />
                      </FormItem>
                    )}
                  />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            {/*<div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Lembrar de mim
              </Label>
            </div>*/}
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Entrar
            </Button>
          </form>
          </Form>
        </CardContent>
         <Dialog open={isFailedDialog} onOpenChange={setFailedDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-red-600">Erro</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <AlertTriangle size={32} className="text-red-700" />
          </div>
          
          <p className="text-center text-gray-700">
            Credenciais Inválidas
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => setFailedDialog(false)}
            className="bg-red-700 hover:bg-red-600"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register">
            <a href="#" className="font-medium text-green-600 hover:text-green-700">
              Cadastre-se agora
            </a>
            </Link>
          </div>
          
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        © 2025 AgendaQuadra. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default Login;