import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import validadeForm from './utils/validateForm.tsx';

const Account = ({ onSubmit }) => {
	const [passwordVisible, setPasswordVisible] = useState(false);
 	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
 	const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nome) errors.nome = "Nome é obrigatório";
    if (!formData.sobrenome) errors.sobrenome = "Sobrenome é obrigatório";
    
    if (!formData.email) {
      errors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }
    
    if (!formData.senha) {
      errors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      errors.senha = "Senha deve ter pelo menos 6 caracteres";
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      errors.confirmarSenha = "As senhas não coincidem";
    }
    
    return errors;
  };

	 const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      // Aqui seria feita a chamada para API para registrar o usuário
      alert("Cadastro realizado com sucesso!");
      setIsSignupDialogOpen(false);
      // Limpar formulário
      setFormData({
        nome: '',
        sobrenome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
      });
      setFormErrors({});
    } else {
      setFormErrors(errors);
    }
  };

return (<>
	<button 
        className="text-gray-700 hidden md:block"
        onClick={() => setIsSignupDialogOpen(true)}
      >
        Criar Conta
      </button>
 <Dialog open={isSignupDialogOpen} onOpenChange={setIsSignupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Criar conta</DialogTitle>
            <DialogDescription className="text-center">
              Preencha os campos abaixo para se cadastrar
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={formErrors.nome ? "border-red-700" : ""}
                />
                {formErrors.nome && <p className="text-red-700 text-xs">{formErrors.nome}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sobrenome">Sobrenome</Label>
                <Input
                  id="sobrenome"
                  name="sobrenome"
                  value={formData.sobrenome}
                  onChange={handleInputChange}
                  className={formErrors.sobrenome ? "border-red-700" : ""}
                />
                {formErrors.sobrenome && <p className="text-red-700 text-xs">{formErrors.sobrenome}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={formErrors.email ? "border-red-700" : ""}
              />
              {formErrors.email && <p className="text-red-700 text-xs">{formErrors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  name="senha"
                  type={passwordVisible ? "text" : "password"}
                  value={formData.senha}
                  onChange={handleInputChange}
                  className={formErrors.senha ? "border-red-700 pr-10" : "pr-10"}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-700"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formErrors.senha && <p className="text-red-700 text-xs">{formErrors.senha}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                  className={formErrors.confirmarSenha ? "border-red-700 pr-10" : "pr-10"}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-700"
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                  {confirmPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formErrors.confirmarSenha && <p className="text-red-700 text-xs">{formErrors.confirmarSenha}</p>}
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSignupDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-green-700 hover:bg-green-600"
              >
                Cadastrar
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-700 mt-4">
              Já tem uma conta? <button type="button" className="text-green-700 hover:underline">Entrar</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
 </>     
	);

}
export default Account;