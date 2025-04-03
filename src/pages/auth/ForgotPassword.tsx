import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LOGO from '@/assets/images/LOGO.png';

// Zod schema para validação do email
const requestResetSchema = z.object({
  email: z.string().email("Digite um email válido"),
});

// Componente de solicitação de reset de senha
const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: { email: string }) => {
    setIsSubmitting(true);
    try {
      // Chamar a API para solicitar o reset de senha
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.message || 'Erro ao solicitar redefinição de senha');
      }

      // Mostrar mensagem de sucesso
      setRequestSent(true);
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      alert('Ocorreu um erro ao solicitar a redefinição de senha. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* Logo e nome do sistema */}
      <div className="flex flex-col items-center mb-6">
        <img 
          src={LOGO} 
          className="h-12 w-12 sm:h-16 sm:w-16 md:h-28 md:w-28 object-contain" 
          alt="Logo" 
        />
        <span className="mt-2 text-md sm:text-xl md:text-2xl font-bold text-green-700">AgendaQuadra</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-800">Recuperação de Senha</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Digite seu email para receber o link de redefinição de senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestSent ? (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-2">Email enviado com sucesso!</p>
              <p className="text-gray-600">
                Verifique sua caixa de entrada e siga as instruções enviadas para o email {form.getValues().email}.
                O link expirará em 10 minutos.
              </p>
              <Link to={'/'}>
              <Button 
                className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setRequestSent(false)}
              >
                Voltar pra Login
              </Button>
              </Link>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email" className="text-gray-700">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="Seu email de cadastro"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </Button>

                <div className="text-center mt-4">
                  <a 
                    href="/login" 
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Voltar para o login
                  </a>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        © 2025 AgendaQuadra. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default ForgotPassword;