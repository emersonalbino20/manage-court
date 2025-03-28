import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { schemeRegister } from '@/utils/validateForm.tsx';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LOGO from '@/assets/images/LOGO.png';
import { usePostClient } from '@/api/userQuery';
import FeedbackDialog from '@/_components/FeedbackDialog'; // Ajuste o caminho conforme necessário
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSearchParams } from "react-router-dom";
import { Link, useNavigate } from 'react-router-dom';

const Account = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const form = useForm({
    resolver: zodResolver(schemeRegister),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });
  const navigate = useNavigate();

  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [erro, setErro] = useState('');
  const { mutate, isLoading } = usePostClient();

  // Função modificada para prevenir explicitamente o comportamento padrão
  function onSubmit(data: any, event: React.FormEvent<HTMLFormElement> | undefined) {
    // Previne explicitamente o comportamento padrão
    if (event) {
      event.preventDefault();
    }
    
    // Chama a mutação, mas não permite que o formulário seja enviado tradicionalmente
    mutate(data, {
      onSuccess: (response) => {
        console.log("Usuário cadastrado com sucesso!", response);
        setIsSuccess(true);
        setFeedbackMessage("Sua conta foi criada com sucesso! Você já pode acessar a plataforma AgendaQuadra.");
        setDialogOpen(true);
        navigate("/login")
        form.reset();
      },
      onError: (error) => {
        console.error("Erro ao cadastrar usuário:", error);
        setErro(error);
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível criar sua conta. Verifique seus dados e tente novamente.");
        setDialogOpen(true);
      }
    });
    
    // Retorna false para garantir que não haja recarregamento
    return false;
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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
          <CardTitle className="text-2xl text-center text-gray-800">Criar Conta</CardTitle>
          <CardDescription className="text-center text-gray-500">
           {status ? 'Cria à sua conta faça o Login e prossiga com o agendamento' : 'Preencha os campos abaixo para se cadastrar'} 
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <Input
                        type="tel"
                        {...field}
                        maxLength={9}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9);
                        }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <Input type="email" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <Input type="password" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <Input type="password" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Link to="/">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>

                <Button 
                  type="submit" 
                  className="bg-green-700 hover:bg-green-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Processando..." : "Cadastrar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-700">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>

      <p className="mt-8 text-center text-sm text-gray-500">
        © 2025 AgendaQuadra. Todos os direitos reservados.
      </p>
      
      {/* Diálogo de feedback */}
      <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
        errorData={erro}
      />
    </div>
  );
};

export default Account;