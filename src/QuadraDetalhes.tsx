import React, { useState } from 'react';
import { CalendarIcon, Clock, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import { ShoppingCart, Search, Menu, X, ChevronDown, ChevronLeft, ChevronRight, User, Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import Futebol_2 from './assets/images/court-football-full.jpg';
import Futebol_1 from './assets/images/court-football-small.jpg';
import Header from './_components/Header.tsx';
import Footer from './_components/Footer.tsx';
import { PiCourtBasketballFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import UserBookingsSection from './UserBookingsSection';
import LOGO from './assets/images/LOGO.png';
import { Navigation } from "swiper/modules";

const QuadraDetalhes = () => {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('agendar');
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const categories = [
    { id: 'agendar', name: 'Agendar' },
    { id: 'agendadas', name: 'Quadras Agendadas' },
    ];



  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isReservaDialogOpen, setIsReservaDialogOpen] = useState(false);
  
  // Horários disponíveis
  const horarios = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  const handleReserva = (e) => {
    e.preventDefault();
    setIsReservaDialogOpen(true);
  };

    // State for image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    Futebol_1, // Replace with your actual image paths
    Futebol_2,
  ];

 const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };


  return (
    <div className="min-h-screen bg-white">
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
            
            <div className="flex items-center space-x-3 text-lg sm:text-xl md:text-2xl font-bold text-green-700">
              <img 
                src={LOGO} 
                className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain" 
                alt="Logo" 
              />
              <span>AgendaQuadra</span>
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
            <Link to="/booking">
            <p class="underline cursor-pointer">Como agendar?</p>
              </Link>
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
      )}
      {/* Page Content */}
      <main className="container mx-auto px-4 pt-48 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
        <Link to="/">
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={16} className="mr-1" />
            Voltar
          </Button>
        </Link>
          <span className="text-gray-500">
            Home / Futebol / Quadra de Futebol
          </span>
        </div>
        {/* Detalhes da Quadra */}
        {activeCategory === 'agendar' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Card da Quadra */}
      <div>
        <Card className="overflow-hidden p-0 border border-gray-200">
          {/* Image carousel */}
          <div className="relative pt-[60%]">
            {images.map((img, index) => (
              <div 
                key={index} 
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img 
                  src={img} 
                  alt={`Quadra de Futebol ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
            
            {/* Navigation arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button 
                onClick={goToPrevious} 
                variant="ghost" 
                className="bg-white rounded-full p-2"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button 
                onClick={goToNext} 
                variant="ghost" 
                className="bg-white rounded-full p-2"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Image indicator dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quadra de Futebol</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin size={16} className="mr-1" />
              <span>Kilamba Kiaxe - Avenida de Moçamedes</span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold text-green-700">Kz 89.000,90/Hora</div>
              <div className="line-through text-gray-500">Kz 111.250,00</div>
            </div>
            
            <Tabs defaultValue="descricao">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="descricao">Descrição</TabsTrigger>
                <TabsTrigger value="caracteristicas">Características</TabsTrigger>
                <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
                <TabsTrigger value="localizacao">Localização</TabsTrigger>
              </TabsList>
              
              <TabsContent value="descricao" className="text-gray-700">
                <p>
                  Quadra de futebol profissional com gramado sintético de alta qualidade. 
                  Ideal para jogos com amigos, treinos e pequenos campeonatos.
                  Ambiente seguro e bem iluminado para jogos diurnos e noturnos.
                </p>
              </TabsContent>
              
              <TabsContent value="caracteristicas">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-green-700 mr-2" />
                    <span>Dimensões: 90m x 45m</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-green-700 mr-2" />
                    <span>Gramado sintético de alta qualidade</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-green-700 mr-2" />
                    <span>Iluminação para jogos noturnos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-green-700 mr-2" />
                    <span>Vestiários com chuveiros</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-green-700 mr-2" />
                    <span>Estacionamento gratuito</span>
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="avaliacoes">
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">João Silva</span>
                      <span className="text-gray-500">12/03/2025</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-yellow-500">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700">Excelente quadra! Gramado em ótimas condições e atendimento muito bom.</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Maria Oliveira</span>
                      <span className="text-gray-500">08/03/2025</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4].map((star) => (
                        <span key={star} className="text-yellow-500">★</span>
                      ))}
                      <span className="text-gray-300">★</span>
                    </div>
                    <p className="text-gray-700">Boa quadra, mas o vestiário poderia ser melhor.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="localizacao">
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d504611.99701970594!2d12.955099362113803!3d-8.853388698461458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f15cdc8d2c7d%3A0x850c1c5c5ecc5a92!2sLuanda!5e0!3m2!1spt-PT!2sao!4v1742207738636!5m2!1spt-PT!2sao" width="400" height="300" style={{ border: "0" }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Formulário de Agendamento */}
      <div>
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Agendar Quadra</h2>
            
            <form onSubmit={handleReserva} className="space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <div className="relative">
                  <Input 
                    id="data" 
                    type="date" 
                    min={format(new Date(), 'yyyy-MM-dd')}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required 
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="horario">Horário</Label>
                <select 
                  id="horario"
                  className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">Selecione um horário</option>
                  {horarios.map((horario) => (
                    <option key={horario} value={horario}>{horario}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (horas)</Label>
                <select 
                  id="duracao"
                  className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                  required
                >
                  <option value="1">1 hora</option>
                  <option value="2">2 horas</option>
                  <option value="3">3 horas</option>
                  <option value="4">4 horas</option>
                </select>
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-green-700 hover:bg-green-600 text-white font-medium py-3"
                >
                  Agendar Agora
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
        
        )}
      {activeCategory === 'agendadas' && (
        <UserBookingsSection/>
        )}
      </main>
      
      {/* Dialog de Confirmação */}
      <Dialog open={isReservaDialogOpen} onOpenChange={setIsReservaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Agendamento Realizado!</DialogTitle>
            <DialogDescription className="text-center">
              Sua reserva foi registrada com sucesso
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="flex items-center justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle size={32} className="text-green-700" />
              </div>
            </div>
            
            <div className="space-y-3 text-center">
              <p className="font-medium">Quadra de Futebol</p>
              <p className="flex items-center justify-center">
                <CalendarIcon size={16} className="mr-2" />
                {selectedDate ? format(new Date(selectedDate), 'dd/MM/yyyy') : 'Data selecionada'}
              </p>
              <p className="flex items-center justify-center">
                <Clock size={16} className="mr-2" />
                {selectedTime || 'Horário selecionado'}
              </p>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Enviamos um e-mail com os detalhes da sua reserva.<br />
                Um código de confirmação será enviado 30 minutos antes do horário agendado.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => setIsReservaDialogOpen(false)}
              className="bg-green-700 hover:bg-green-600"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
     <Footer />
    </div>
  );
};

export default QuadraDetalhes;