import React, { useState } from 'react';
import { CalendarIcon, CalendarCheck, Clock, MapPin, ArrowLeft, CheckCircle, Calendar, AlertTriangle } from 'lucide-react';
import { ShoppingCart, Search, Menu, X, ChevronDown, ChevronLeft, ChevronRight, User, Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Futebol_2 from '@/assets/images/court-football-full.jpg';
import Futebol_1 from '@/assets/images/court-football-small.jpg';
import Header from '@/_components/Header.tsx';
import Footer from '@/_components/Footer.tsx';
import { PiCourtBasketballFill } from "react-icons/pi";
import { Link } from 'react-router-dom';
import UserBookingsSection from '@/layouts/UserBookingsSection';
import LOGO from '@/assets/images/LOGO.png';
import { Navigation } from "swiper/modules";
import { useSearchParams } from "react-router-dom";
import { useGetCourtId } from '@/api/courtQuery';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useGetCourtsTypeQuery } from '@/api/courtQuery';
import {receiveCentFront, sendCoinBeck} from '@/utils/methods';
import { useGetCourtIdAvailabilities } from '@/api/courtQuery';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetProvincesQuery } from '@/api/provinceQuery';
import { useGetCitiesQuery } from '@/api/cityQuery';
import { useGetPaymentMethodsQuery } from '@/api/paymentMethodsQuery';
import { schemeBooking } from '@/utils/validateForm';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, parse, isBefore, startOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { getCurrentAngolaDate,  formatToAngolaTime, convertToUtc} from '@/utils/methods'
import { usePostReserve } from '@/api/reserveQuery'
import { useAuth } from "@/hooks/AuthContext";

const CourtDetails = () => {
  const { user, logout, token } = useAuth();
  console.log(localStorage.getItem("token"));
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

 // Estado para controlar a abertura do popover do calendário
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const today = startOfDay(new Date()); 

  const todayFormatted = getCurrentAngolaDate();

  const formBooking = useForm({
    resolver: zodResolver(schemeBooking),
    defaultValues: {
      fieldId: id,
      day: todayFormatted,
    },
  });

  const { watch } = formBooking;
  const [ fieldDate ] = watch(['day']);

  const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  
  const { data: courtData } = useGetCourtId(id);
  const { data: typeData } = useGetCourtsTypeQuery();
  const { data: provinceData } = useGetProvincesQuery();
  const { data: cityData } = useGetCitiesQuery();

  const position = [courtData?.data?.data.address.latitude, courtData?.data?.data.address.longitude];
  const typeField = typeData?.data?.data?.find(t => t.id === courtData?.data?.data?.fieldType.id);
  const price = receiveCentFront(courtData?.data?.data.hourlyRate);
  const { data: courtAvailabilities } = useGetCourtIdAvailabilities(id);


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('agendar');

  const categories = [
    { id: 'agendar', name: 'Agendar' },
    { id: 'agendadas', name: 'Quadras Agendadas' },
    ];

  const [isReservaDialogOpen, setIsReservaDialogOpen] = useState(false);
  const [isFailedDialog, setFailedDialog] = useState(false);
  const [log, setLog] = useState('');
  
 const { mutate: postReserve } = usePostReserve();
  function submitBooking(data, event) {
    event?.preventDefault();
    postReserve({fieldId: data?.fieldId, 
                fieldAvailabilityId: data?.fieldAvailabilityId, 
                paymentMethodId: data?.paymentMethodId},{
      onSuccess: (response) => {
        setIsReservaDialogOpen(true);
        setLog(response);
      },
      onError: (error) => {
        setFailedDialog(true);
        console.log(error);
      }
    })
  }

  const { data: courtAvailabilityData } = useGetCourtIdAvailabilities(id, fieldDate);
  const { data: methods} = useGetPaymentMethodsQuery();
   const handleDateSelect = (date) => {
    if (date) {
      const formattedDate = convertToUtc(date);
      formBooking.setValue("day", formattedDate);
      setCalendarOpen(false);
    }
  }
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
                className="h-12 w-12 sm:h-7 sm:w-7 md:h-10 md:w-10 object-contain" 
                alt="Logo" 
              />
              <span>AgendaQuadra</span>
            </div>
            
            <div className="flex items-center space-x-3">
            <Link to="/booking">
            <p class="underline cursor-pointer">Como agendar?</p>
              </Link>
              {token ? (
                    <Button variant="destructive" onClick={logout}>Sair</Button>
                  ) :
                <Link to={'/Login'}>
                  <Button variant="outline">Entrar</Button>
                </Link>
              }
            </div>
          </div>
          
          {/* Search Bar Mobile */}
          
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
            <div className="text-lg font-medium text-gray-900 pb-1">Menu</div>
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
      <main className="container mx-auto px-4 pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
        <Link to="/">
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={16} className="mr-1" />
            Voltar
          </Button>
        </Link>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{courtData?.data?.data.name}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin size={16} className="mr-1" />
              <span>{courtData?.data?.data?.address.city.name} - {courtData?.data?.data?.address.province.name}</span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold text-green-700">Kz {price}/Hora</div>
              <div className="line-through text-gray-500">Kz {price*2}</div>
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
                {courtData?.data?.data?.description}
                  {/*Quadra de futebol profissional com gramado sintético de alta qualidade. 
                                    Ideal para jogos com amigos, treinos e pequenos campeonatos.
                                    Ambiente seguro e bem iluminado para jogos diurnos e noturnos.*/}
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
                    <div className="relative w-full h-[400px] overflow-hidden rounded-lg border border-gray-200">
                      <MapContainer 
                        center={position} 
                        zoom={13} 
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                        className="z-10"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={position} icon={customIcon}>
                          <Popup>{courtData?.data?.data.name}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-700">
                        <MapPin size={16} className="inline mr-1" />
                        {courtData?.data?.data?.address.street}, {courtData?.data?.data?.address.number} - {courtData?.data?.data?.address.city.name}, {courtData?.data?.data?.address.province.name}
                      </p>
                    </div>
                  </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Formulário de Agendamento */}
      <div>
     <Card className="border border-gray-200 shadow-sm">
  <CardContent className="p-6 md:p-8">
    <h2 className="text-xl font-bold text-gray-900 mb-8">Agendar Quadra</h2>
    
    <Form {...formBooking}>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          formBooking.handleSubmit((data) => submitBooking(data, e))();
        }}
        className="space-y-6"
      >
        {/* Campo de Data */}
        <div className="mb-6">
          <FormField
            control={formBooking.control}
            name="day"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <FormLabel className="font-medium text-gray-700">Data</FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-11 border-gray-300"
                    >
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      {field.value ? (
                        format(parse(field.value, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
                      ) : (
                        <span className="text-gray-500">Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < today}
                      initialFocus
                      locale={pt}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-sm text-red-500" />
              </FormItem>
            )}
          />
        </div>
        
        {/* Campo de Horário */}
        <div className="mb-6">
          <FormField
              control={formBooking.control}
              name="fieldAvailabilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block font-medium text-gray-700 mb-2">Horário</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                     className="w-full border border-gray-300 rounded-md px-4 py-2.5 h-11 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
                     onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}>
                        <option value="">Selecione um horário</option>
                          {courtAvailabilityData?.data?.data?.fieldAvailabilities.map((horario) => (
                            <option key={horario.id} value={horario.id}>{horario.startTime} - {horario.endTime}</option>
                          ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {/* Campo de Pagamento */}
        <div className="mb-8">
         <FormField
              control={formBooking.control}
              name="paymentMethodId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block font-medium text-gray-700 mb-2">Forma de Pagamento</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                     className="w-full border border-gray-300 rounded-md px-4 py-2.5 h-11 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
                     onChange={(e) => {
                              field.onChange(parseInt(e.target.value));
                            }}>
                        <option value="">Selecione um método</option>
                          {methods?.data?.data?.map((paym) => (
                            <option key={paym.id} value={paym.id}>{paym.name}</option>
                          ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        {/* Botão de Agendar */}
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-green-700 hover:bg-green-600 text-white font-medium py-3 h-12 rounded-md transition duration-200"
          >
            Agendar Agora
          </Button>
        </div>
      </form>
    </Form>
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
      <DialogTitle className="text-xl font-bold text-center">Detalhes do Agendamento</DialogTitle>
      <DialogDescription className="text-center">
        Informações da sua reserva
      </DialogDescription>
    </DialogHeader>
    
    <div className="py-6 space-y-4">
      <div className="flex items-center justify-center mb-4">
        <div className="rounded-full bg-green-100 p-3">
          <CalendarCheck size={32} className="text-green-700" />
        </div>
      </div>
      
      <div className="space-y-3 text-center">
        <div>
          <p className="font-medium text-lg">Quadra de Futebol</p>
          <p className="text-gray-600">Campo Society</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center justify-center">
            <CalendarIcon size={16} className="mr-2" />
            Data
          </div>
          <div className="flex items-center justify-center">
            <Clock size={16} className="mr-2" />
            Horário
          </div>
        </div>
        
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="flex justify-between mb-1">
            <span className="text-gray-700">Total a Pagar:</span>
            <span className="font-semibold">Kz 75,00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Status:</span>
            <span className="font-semibold text-yellow-600">Pendente</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Email: joao.silva@exemplo.com</p>
        </div>
      </div>
    </div>
    
    <div className="flex justify-center">
      <Button 
        onClick={() => setIsReservaDialogOpen(false)}
        className="bg-green-700 hover:bg-green-600 text-white font-medium"
      >
        Fechar
      </Button>
    </div>
  </DialogContent>
</Dialog>

    <Dialog open={isFailedDialog} onOpenChange={setFailedDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-red-600">Erro</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <AlertTriangle size={32} className="text-red-700" />
          </div>
          
          <p className="text-center text-gray-700">
            Operação não realizada
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsReservaDialogOpen(false)}
            className="bg-red-700 hover:bg-red-600"
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

export default CourtDetails;