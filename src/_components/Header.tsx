import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Star, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { IoMdFootball } from "react-icons/io";
import { FaVolleyball } from "react-icons/fa6";
import { MdSportsHandball } from "react-icons/md";
import { FaBasketballBall } from "react-icons/fa";
import { IoIosTennisball } from "react-icons/io";
import { PiCourtBasketballFill } from "react-icons/pi";
import Footer from './_components/Footer.tsx';
import Account from './../Account.tsx';
import validadeForm from './../utils/validateForm.tsx';
import { Link } from 'react-router-dom';

const Header = ({ onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('destaques');
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  

  const categories = [
    { id: 'destaques', name: 'Destaques' },
    { id: 'futebol', icon: <IoMdFootball />, name: 'Futebol' },
    { id: 'hendbol', icon: <MdSportsHandball />, name: 'Hendbol' },
    { id: 'basquete', icon: <FaBasketballBall />, name: 'Basquete' },
    { id: 'volei', icon: <FaVolleyball />, name: 'Vôlei' },
    { id: 'tenis', icon: <IoIosTennisball />, name: 'Tênis' }
  ];

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
	return (
		<div>
		 <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3">
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="flex items-center text-2xl font-bold text-green-700">
              <PiCourtBasketballFill /> <span>Agenda de Quadra</span>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Input 
                  type="text" 
                  placeholder="Buscar quadras..." 
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg w-full"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
            <p class="underline cursor-pointer">Como agendar?</p>
              <Account onSubmit={handleSubmit}/>
              <Link to={'/Login'}>
                <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Entrar</button>
                {/* Adicionado botão de usuário para mobile */}
              </Link>
            </div>
          </div>
          
          {/* Search Bar Mobile */}
          <div className="pb-3 md:hidden">
            <div className="relative w-full">
              <Input 
                type="text" 
                placeholder="Buscar quadras..." 
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg w-full"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex py-3">
            <ul className="flex space-x-6">
              {categories.map((category) => (
                <li key={category.id}>
                  <button 
                    className={`flex items-center gap-2 font-medium relative ${activeCategory === category.id ? 'text-green-700' : 'text-gray-700 hover:text-green-700'}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                    {activeCategory === category.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-700"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 px-4 md:hidden">
          <div className="space-y-4 py-4 text-lg">
            <div className="border-b pb-2">
              <button 
                className="flex items-center space-x-2 text-gray-700 hover:text-green-700"
                onClick={() => {
                  setIsSignupDialogOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <User size={20} />
                <span>Cadastrar / Entrar</span>
              </button>
            </div>
            <div className="border-b pb-2">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-green-700">
                <Heart size={20} />
                <span>Favoritos</span>
              </button>
            </div>
            
            <div className="text-lg font-medium text-gray-900 pb-1">Categorias</div>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <button 
                    className={`${activeCategory === category.id ? 'text-green-700 font-medium' : 'text-gray-700'}`}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}</div>
      
		);
}

export default Header;