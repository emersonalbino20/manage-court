import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import validadeForm from './utils/validateForm.tsx';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import {
  usePostUser,
  usePutUser
} from '@/api/userQuery';
import { Link } from 'react-router-dom';

const Account = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const { mutate } = usePostUser();

	 const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      // Aqui seria feita a chamada para API para registrar o usuário
      console.log(formData)
      mutate({name: formData?.nome, nickname: formData?.sobrenome, 
              email: formData?.email, password: formData?.senha});
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
   <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* Logo e nome do sistema */}
      <div className="flex items-center mb-8">
        <Calendar className="h-8 w-8 text-green-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">QuadraFácil</h1>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-gray-800">Criar Conta</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Preencha os campos abaixo para se cadastrar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Link to="/">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSignupDialogOpen(false)}
              >
                Cancelar
              </Button>
            </Link>
              <Button 
                type="submit" 
                className="bg-green-700 hover:bg-green-600"
              >
                Cadastrar
              </Button>
            </div>
            
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login">
            <a href="#" className="font-medium text-green-600 hover:text-green-700">
              Entrar
            </a>
            </Link>
          </div>
          
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        © 2025 QuadraFácil. Todos os direitos reservados.
      </p>
    </div>
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
              Já tem uma conta? <Link to={'/Login'}><button type="button" className="text-green-700 hover:underline">Entrar</button></Link>
            </div>
          </form>
        </DialogContent>
      </Dialog>
 </>     
	);

}
export default Account;