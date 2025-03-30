import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Heart, Eye, EyeOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Star, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import LOGO from '@/assets/images/LOGO.png';
import { IoMdFootball } from "react-icons/io";
import { FaVolleyball } from "react-icons/fa6";
import { FaBasketballBall } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa6";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { GiHockey } from "react-icons/gi";
import { FaBaseball } from "react-icons/fa6";
import { FaHandPaper } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useGetProvincesQuery, useGetProvinceCityId } from '@/api/provinceQuery';
import { useGetCitiesQuery } from '@/api/cityQuery';
import { useGetCourtsTypeQuery } from '@/api/courtQuery';
import { useGetCourtsQuery, useGetImagesId } from '@/api/courtQuery';
import { receiveCentFront } from '@/utils/methods';
import { useAuth } from "./../hooks/AuthContext";
import { format, parse, isBefore, startOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { getCurrentAngolaDate,  formatToAngolaTime, convertToUtc} from '@/utils/methods'
import FieldImageGallery from './FieldImageGallery'

const ContentHome = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const today = startOfDay(new Date()); 
  const todayFormatted = getCurrentAngolaDate();

  const [activeCategory, setActiveCategory] = useState('destaques');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = [
    { id: 'destaques', name: 'Todas' },
    { id: 'Futebol', icon: <IoMdFootball />, name: 'Futebol' },
    { id: 'Futsal', icon: <FaTrophy />, name: 'Futsal' },
    { id: 'Basquete', icon: <FaBasketballBall />, name: 'Basquete' },
    { id: 'Vôlei', icon: <FaVolleyball />, name: 'Vôlei' },
    { id: 'Tênis', icon: <FaTableTennisPaddleBall />, name: 'Tênis' },
    { id: 'Hóquei', icon: <GiHockey />, name: 'Hóquei' },
    { id: 'Basebol', icon: <FaBaseball />, name: 'Basebol' },
    { id: 'Handebol', icon: <FaHandPaper />, name: 'Handebol' },
  ];

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSportType, setSelectedSportType] = useState('todas');
  const [minRating, setMinRating] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: provinceData } = useGetProvincesQuery();
  const { data: cityData } = useGetCitiesQuery();
  const { data: typeData } = useGetCourtsTypeQuery();
  const { data: courtData } = useGetCourtsQuery();
  const [province, setProvince] = useState('');
  const {data: cities} = useGetProvinceCityId(province);

  console.log(cities);
  // Sync category nav with sport type filter
  useEffect(() => {
    if (activeCategory !== 'destaques') {
      setSelectedSportType(activeCategory);
    }
  }, [activeCategory]);

  // Sync sport type filter with category nav
  useEffect(() => {
    if (selectedSportType !== 'todas' && selectedSportType !== activeCategory) {
      setActiveCategory(selectedSportType);
    } else if (selectedSportType === 'todas' && activeCategory !== 'destaques') {
      setActiveCategory('destaques');
    }
  }, [selectedSportType]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMyBookings = () => {
    navigate('/courtdetails');
  };

  const clearFilters = () => {
    setActiveCategory('destaques');
    setSelectedLocation('');
    setSelectedCity('');
    setSelectedSportType('todas');
    setMinRating(0);
    setSearchTerm('');
  };

  const filteredProducts = courtData?.data?.data?.fields?.filter(product => {
    if (!product) return false;
    
    const type = typeData?.data?.data?.find(t => t.id === product.fieldTypeId);
    const city = cityData?.data?.data?.find(t => t.id === product.address.cityId);
    
    // Filtro por termo de busca
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtro por categoria
    if (activeCategory !== 'destaques' && type?.name !== activeCategory) {
      return false;
    }
    
    // Filtro por tipo de esporte (do formulário)
    if (selectedSportType !== 'todas' && type?.name !== selectedSportType) {
      return false;
    }
    
    // Filtro por localização
    if (selectedCity && selectedCity !== "todas" && city?.name !== selectedCity) {
      return false;
    }
    
    // Filtro por avaliação mínima
    if (product.rating < minRating) {
      return false;
    }
    
    return true;
  }) || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Header com z-index elevado e posição fixa */}
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
            <Link to={'/'}>
            <div className="flex items-center space-x-3 text-lg sm:text-xl md:text-2xl font-bold text-green-700">
              <img 
                src={LOGO} 
                className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain" 
                alt="Logo" 
              />
              <span>AgendaQuadra</span>
            </div>
            </Link>
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Input 
                  type="text" 
                  placeholder="Buscar quadras..." 
                  className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg w-full"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/booking">
                <p className="underline cursor-pointer">Como agendar?</p>
              </Link>
             {token ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="p-2">
                      <User size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer font-bold text-gray-800 flex items-center">
                      <Heart className="mr-2 h-4 w-4" /> <Link to={'/courtdetails'}>
                        Minhas Reservas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) :
              (<Link to={'/Login'}>
                                <Button variant="outline">Entrar</Button>
                              </Link>)}
          </div>
          </div>
          
          {/* Search Bar Mobile */}
          <div className="pb-3 md:hidden">
            <div className="relative w-full">
              <Input 
                type="text" 
                placeholder="Buscar quadras..." 
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg w-full"
                value={searchTerm}
                onChange={handleSearch}
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

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 px-4 md:hidden">
          <div className="space-y-4 py-4 text-lg">
            <div className="border-b pb-2">
              {/*<Link to={'/Login'}>
                <button 
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Cadastrar / Entrar</span>
                </button>
              </Link>*/}
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

      {/* Conteúdo principal com padding-top para compensar o header fixo */}
      <div className="pt-32 md:pt-44 px-4 md:px-6 container mx-auto">
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
            <Card className="sticky top-48">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                   Filtrar Quadras
                </h2>
                
                <div className="space-y-6">
                  {/* Tipo de Quadra */}
                  <div className="space-y-2">
                    <Label className="font-medium flex items-center">
                      <IoMdFootball className="mr-2 h-4 w-4" /> Tipo de Quadra
                    </Label>
                    <Select 
                      value={selectedSportType} 
                      onValueChange={setSelectedSportType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo de quadra" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-50">
                        <SelectItem value="todas">Todos os tipos</SelectItem>
                        {typeData?.data?.data?.map(type => (
                          <SelectItem key={type?.id} value={type?.name}>
                            {type?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Localização */}
                  <div className="space-y-2">
                    <Label className="font-medium flex items-center">
                      <MapPin className="mr-2 h-4 w-4" /> Localização
                    </Label>
                    <Select 
                      value={selectedLocation} 
                      onValueChange={(value)=>{
                        setSelectedLocation(value)
                        setProvince(value)
                    }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a província" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-50">
                        <SelectItem value="todas" >Todas as províncias</SelectItem>
                        {provinceData?.data?.data?.map(location => (
                          <SelectItem key={location?.id} value={location?.id}>
                            {location?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={selectedCity} 
                      onValueChange={setSelectedCity}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a cidade" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-50">
                        <SelectItem value="todas">Todas as cidades</SelectItem>
                        {cities?.data?.data?.map(location => (
                          <SelectItem key={location?.id} value={location?.name}>
                            {location?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Botão para limpar filtros */}
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={clearFilters}
                  >
                    Limpar filtros
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
                {filteredProducts?.map((product) => {
                  const cidade = cityData?.data?.data?.find(c => c.id === product.address.cityId);
                  const province = provinceData?.data?.data?.find(c => c.id === product.address.provinceId);
                  const price = receiveCentFront(product.hourlyRate);
                  return (
                    <Card key={product.id} className="overflow-hidden p-0 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-0 pt-[75%]">
                      <img 
                       src={product.thumbnailUrl} 
                       alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500">{cidade?.name || 'N/A'} - {province?.name || 'N/A'}</p>
                        <div className="text-lg font-bold text-green-700 mt-1">{price}/Hora</div>
                        <Link to={`/courtdetails?id=${product.id}`}>
                          <Button className="w-full mt-3 bg-green-700 hover:bg-green-600">
                            Ver Mais
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">Nenhuma quadra encontrada com os filtros selecionados.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ContentHome;