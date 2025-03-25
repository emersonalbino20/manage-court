import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from 'react-router-dom';
import LOGO from '@/assets/images/LOGO.png';

// Zod schema for email validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Por favor, insira um email válido")
});

const ForgotPassword = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: { email: string }) => {
    // Here you would typically call an API to send password reset request
    console.log("Password reset requested for:", data);
    
    // Example of how you might send the data
    const resetData = {
      email: data.email
    };

    try {
      // Show success message
      alert("Um link de redefinição de senha foi enviado para o seu email.");
      // Close dialog and navigate back to login
      setIsDialogOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      alert("Ocorreu um erro. Por favor, tente novamente.");
    }
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-gray-800">Esqueceu a Senha?</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Digite seu email para receber um link de redefinição de senha
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
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
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Enviar Link de Redefinição
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        © 2025 AgendaQuadra. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default ForgotPassword;