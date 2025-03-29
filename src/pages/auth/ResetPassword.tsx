import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from 'react-router-dom';
import LOGO from '@/assets/images/LOGO.png';

// Zod schema for password reset validation
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
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
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");

  // Extrair o token da URL quando o componente é montado
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get("token");
    
    if (!tokenParam) {
      setTokenError("Token de recuperação não encontrado. Solicite um novo link de recuperação.");
      return;
    }
    
    // Validar o token (opcionalmente, você pode verificar se ele existe no backend)
    setToken(tokenParam);
    
    // Opcional: Verificar se o token é válido no backend
    // validateToken(tokenParam);
  }, [location]);

  // Função opcional para validar o token no backend
  /*
  const validateToken = async (token) => {
    try {
      const response = await fetch(`/api/auth/validate-reset-token?token=${token}`);
      if (!response.ok) {
        const data = await response.json();
        setTokenError(data.message || "Token inválido ou expirado");
      }
    } catch (error) {
      console.error("Erro ao validar token:", error);
      setTokenError("Erro ao validar o token. Tente novamente.");
    }
  };
  */

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    },
  });

  const onSubmit = async (data: { newPassword: string, confirmPassword: string }) => {
    if (!token) {
      setTokenError("Token não encontrado. Solicite um novo link de recuperação.");
      return;
    }

    setLoading(true);

    // Preparar os dados para envio à API
    const resetData = {
      token: token,
      newPassword: data.newPassword
    };

    try {
      // Chamada à API para redefinir a senha
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.message || 'Erro ao redefinir senha');
      }

      // Mostrar mensagem de sucesso
      setResetSuccess(true);
      
      // Após 3 segundos, redirecionar para o login
      setTimeout(() => {
        setIsDialogOpen(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      alert("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setLoading(false);
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

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        // Só permitir fechar se não estiver carregando
        if (!loading) setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-gray-800">Redefinir Senha</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Digite sua nova senha
            </DialogDescription>
          </DialogHeader>
          
          {tokenError ? (
            <div className="text-center">
              <p className="text-red-600 mb-4">{tokenError}</p>
              <Button 
                onClick={() => navigate("/forgot-password")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Solicitar novo link
              </Button>
            </div>
          ) : resetSuccess ? (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-2">Senha redefinida com sucesso!</p>
              <p className="text-gray-600">Você será redirecionado para a página de login em instantes...</p>
            </div>
          ) : (
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
                  disabled={loading}
                >
                  {loading ? 'Processando...' : 'Redefinir Senha'}
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        © 2025 AgendaQuadra. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default ResetPassword;