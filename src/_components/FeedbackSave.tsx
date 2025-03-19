import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message?: string;
}

const FeedbackSave: React.FC<FeedbackDialogProps> = ({
  isOpen,
  onClose,
  success,
  message
}) => {
  const defaultSuccessMessage = "Conta criada com sucesso! Você já pode fazer login.";
  const defaultErrorMessage = "Ocorreu um erro ao criar sua conta. Por favor, tente novamente.";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            {success ? (
              <Check className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-gray-900 mt-4">
            {success ? "Cadastro Realizado" : "Erro no Cadastro"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {message || (success ? defaultSuccessMessage : defaultErrorMessage)}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-center">
          {success ? (
            <Link to="/login">
              <Button className="bg-green-700 hover:bg-green-600">
                Fazer Login
              </Button>
            </Link>
          ) : (
            <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
              Tentar Novamente
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackSave;