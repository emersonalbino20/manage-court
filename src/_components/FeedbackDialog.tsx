import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message?: string;
  errorData?: any; // O erro será passado nesse prop
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  success,
  message,
  errorData
}) => {
  const defaultSuccessMessage = "Conta criada com sucesso! Você já pode fazer login.";
  const defaultErrorMessage = "Ocorreu um erro ao criar sua conta. Por favor, tente novamente.";

  // Função para extrair mensagens de erro corretamente
  const extractErrorMessage = (errorObj: any): string | null => {
    if (!errorObj) return null;

    const errors = errorObj?.response?.data?.data?.errors; // Pegamos os erros da estrutura correta

    if (!errors) return "Erro desconhecido."; // Fallback se não existir erros

    if (Array.isArray(errors)) {
      return errors.join(", "); // Se for um array, junta as mensagens
    }

    if (typeof errors === "object") {
      return Object.values(errors).flat().join(", "); // Junta mensagens de um objeto
    }

    return typeof errors === "string" ? errors : null;
  };

  const errorMessage = extractErrorMessage(errorData);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${success ? 'bg-green-100' : 'bg-red-100'}`}>
            {success ? (
              <Check className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-gray-900 mt-4">
            {success ? "Operação Sucedida" : "Operação Falhada"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {message || (success ? defaultSuccessMessage : defaultErrorMessage)}
          </DialogDescription>

          {/* Mostra os erros corretamente */}
          {!success && errorMessage && (
            <p className="text-red-500 text-sm mt-2 text-center line-clamp-2">
              Motivo: {errorMessage}
            </p>
          )}
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className={success ? "bg-green-700 hover:bg-green-600" : "bg-red-600 hover:bg-red-700"}>
            {success ? "Ok" : "Tentar Novamente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
