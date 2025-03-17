import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Star, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Basquete_1 from './assets/images/court-basketball.jpg';
import Hoquei_2 from './assets/images/court-hockey-patines-cold.jpg';
import Futebol_1 from './assets/images/court-football-full.jpg';
import Futebol_2 from './assets/images/court-football-small.jpg';
import Hoquei_1 from './assets/images/court-hockey-patines.jpg';
import Volei_2 from './assets/images/court-volleyball-blue.jpg';
import Tenis_1 from './assets/images/court-tennis.jpg';
import Tenis_2 from './assets/images/court-tennis-zoom-out.jpg';
import Volei_1 from './assets/images/court-volleyball.jpg';
import LOGO from './assets/images/LOGO.png';
import { IoMdFootball } from "react-icons/io";
import { FaVolleyball } from "react-icons/fa6";
<FaVolleyball />
import { MdSportsHandball } from "react-icons/md";
<MdSportsHandball />
import { FaBasketballBall } from "react-icons/fa";
<FaBasketballBall />
import { IoIosTennisball } from "react-icons/io";
<IoIosTennisball />
import { PiCourtBasketballFill } from "react-icons/pi";
import Account from './Account.tsx';
import validadeForm from './../utils/validateForm.tsx';
import { Link } from 'react-router-dom';
import { FaTrophy } from "react-icons/fa6";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { GiHockey } from "react-icons/gi";
import { FaBaseball } from "react-icons/fa6";
import { FaHandPaper } from "react-icons/fa";


const Format = () => {
    const [activeCategory, setActiveCategory] = useState('destaques');
   const categories = [
    { id: 'destaques', name: 'Destaques' },
    { id: 'futebol', icon: <IoMdFootball />, name: 'Futebol' },
    { id: 'basquete', icon: <FaBasketballBall />, name: 'Basquete' },
    { id: 'futsal', icon: <FaTrophy />, name: 'Futsal' },
    { id: 'volei', icon: <FaVolleyball />, name: 'Vôlei' },
    { id: 'tenis', icon: <FaTableTennisPaddleBall />, name: 'Tênis' },
    { id: 'hoquei', icon: <GiHockey />, name: 'Hóquei Patins' },
    { id: 'basebol', icon: <FaBaseball />, name: 'Basebol' },
    { id: 'hendbol', icon: <FaHandPaper />, name: 'Handebol' },
    
    
  ];

  const products = [
    { id: 1, name: 'Quadra de Futebol', price: 'Kz 89.000,90', image: Futebol_1, discount: '20%' },
    { id: 2, name: 'Quadra de Tênis', price: 'Kz 59.0000,90', image: Tenis_1 },
    { id: 3, name: 'Quadra de Hóquei', price: 'Kz 35.000,90', image: Hoquei_1, discount: '15%' },
    { id: 4, name: 'Quadra de Vôlei', price: 'Kz 159.000,90', image: Volei_1 },
    { id: 5, name: 'Quadra de Basquete', price: 'Kz 189.000,90', image: Basquete_1, discount: '10%' },
    { id: 6, name: 'Quadra de Hoquei', price: 'Kz 49.000,90', image: Hoquei_2 },
    { id: 7, name: 'Quadra de Futebol', price: 'R$ 129.000,90', image: Futebol_2 },
    { id: 8, name: 'Quadra de Tênis', price: 'Kz 39.000,90', image: Tenis_2, discount: '25%' },
  ];

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSportType, setSelectedSportType] = useState('todas');
  const [showDiscount, setShowDiscount] = useState(false);
  const [minRating, setMinRating] = useState(0);

const locations = [
  'Kilamba Kiaxe',
  'Talatona',
  'Viana',
  'Cacuaco',
  'Belas'
];

const filteredProducts = products.filter(product => {
  // Filtro por categoria
  if (activeCategory !== 'destaques' && product.type !== activeCategory) {
    return false;
  }
  
  // Filtro por tipo de esporte (do formulário)
  if (selectedSportType !== 'todas' && product.type !== selectedSportType) {
    return false;
  }
  
  // Filtro por localização
  if (selectedLocation && selectedLocation !== "todas" && product.location !== selectedLocation) {
    return false;
  }
  // Filtro por desconto
  if (showDiscount && !product.discount) {
    return false;
  }
  
  // Filtro por avaliação mínima
  if (product.rating < minRating) {
    return false;
  }
  
  return true;
});

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400 w-4 h-4" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400 w-4 h-4" fill="url(#half)" />);
    } else {
      stars.push(<Star key={i} className="text-gray-300 w-4 h-4" />);
    }
  }
  
  return (
    <div className="flex items-center">
      {stars}
      <span className="ml-1 text-sm text-gray-600">({rating})</span>
    </div>
  );
};

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);

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
 <main className="container mx-auto px-4 pt-32 pb-16">
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
            <p class="underline cursor-pointer">Como agendar?</p>
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
    {/* Categorias visíveis apenas em dispositivos móveis */}
    <div className="flex overflow-x-auto pb-4 md:hidden space-x-2">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${
            activeCategory === category.id
              ? 'bg-green-700 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => setActiveCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
    
    {/* Layout principal - Formulário à esquerda e Produtos à direita */}
    <div className="flex flex-col md:flex-row gap-6">
      {/* Formulário de Filtro (à esquerda) */}
      <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Filter className="mr-2 h-5 w-5" /> Filtrar Quadras
            </h2>
            
            <div className="space-y-6">
              {/* Data */}
              <div className="space-y-2">
                <Label className="font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> Data
                </Label>
                <Input 
                  type="date" 
                  className="w-full" 
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
            {/* Localização */}
            <div className="space-y-2">
              <Label className="font-medium flex items-center">
                <MapPin className="mr-2 h-4 w-4" /> Localização
              </Label>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a província" />
                </SelectTrigger>
                <SelectContent>
                  {/* Corrigido para usar "todas" em vez de string vazia */}
                  <SelectItem value="todas">províncias</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  {/* Corrigido para usar "todas" em vez de string vazia */}
                  <SelectItem value="todas">cidades</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
              
              {/* Tipo de Quadra */}
              <div className="space-y-2">
                <Label className="font-medium">Tipo de Quadra</Label>
                <Select 
                  value={selectedSportType} 
                  onValueChange={setSelectedSportType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as quadras</SelectItem>
                    {categories.filter(c => c.id !== 'destaques').map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filtrar por Desconto 
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="discount" 
                  checked={showDiscount}
                  onCheckedChange={setShowDiscount}
                />
                <Label htmlFor="discount" className="cursor-pointer">
                  Apenas com desconto
                </Label>
              </div>*/}
              
              {/* Classificação Mínima */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-medium">Classificação Mínima</Label>
                  <span className="text-sm font-medium">{minRating} estrelas</span>
                </div>
                <Slider
                  defaultValue={[0]}
                  max={5}
                  step={0.5}
                  value={[minRating]}
                  onValueChange={(value) => setMinRating(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star 
                        key={num}
                        className={`w-4 h-4 cursor-pointer ${
                          num <= minRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => setMinRating(num)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Botão de Aplicar Filtros */}
              <Button className="w-full bg-green-700 hover:bg-green-600">
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      </aside>
      
      {/* Seção de Produtos (à direita) */}
      <div className="flex-1">
        
        {/* Grade de Produtos */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden p-0 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-0 pt-[75%]">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/*product.discount && (
                    <Badge className="absolute top-2 left-2 bg-green-700 hover:bg-green-600">
                      -{product.discount}
                    </Badge>
                  )*/}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.location} - Avenida de Moçamedes</p>
                  {/* Adicionando a classificação por estrelas */}
                  {renderStars(product.rating)}
                  <div className="text-lg font-bold text-green-700 mt-1">{product.price}/Hora</div>
                  <Link to="/quadra">
                    <Button className="w-full mt-3 bg-green-700 hover:bg-green-600">
                      Ver Mais
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Nenhuma quadra encontrada com os filtros selecionados.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setActiveCategory('destaques');
                setSelectedLocation('');
                setSelectedSportType('todas');
                setShowDiscount(false);
                setMinRating(0);
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  </main>
);
  
}

export default Format;