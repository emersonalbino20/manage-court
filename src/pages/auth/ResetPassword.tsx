import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

// Zod schema for password reset validation
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[!@#$%^&*()]/, "A senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    },
  });

  const onSubmit = (data: { newPassword: string, confirmPassword: string }) => {
    // Prepare data for API submission
    const resetData = {
      newPassword: data.newPassword
    };

    // Here you would typically call an API to reset the password
    console.log("Password reset data:", resetData);
    
    try {
      // Uncomment and replace with actual API call
      // const response = await apiCall(resetData);
      
      // Show success message
      alert("Senha redefinida com sucesso!");
      
      // Close dialog and navigate to login
      setIsDialogOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
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
            <DialogTitle className="text-2xl text-center text-gray-800">Redefinir Senha</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Digite sua nova senha
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-700">Nova Senha</Label>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Input 
                          id="newPassword" 
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Nova senha"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirmar Nova Senha</Label>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Input 
                          id="confirmPassword" 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme a nova senha"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Redefinir Senha
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

export default ResetPassword;