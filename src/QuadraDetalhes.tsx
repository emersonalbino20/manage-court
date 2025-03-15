import React, { useState } from 'react';
import { CalendarIcon, Clock, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Heart, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import Futebol_2 from './assets/images/teste.jpg';
import Futebol_1 from './assets/images/court-football-small.jpg';
import Header from './_components/Header.tsx';
import Footer from './_components/Footer.tsx';

const QuadraDetalhes = () => {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('destaques');
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
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

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={setTermoPesquisa}/>
      {/* Page Content */}
      <main className="container mx-auto px-4 pt-32 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <Button variant="ghost" className="p-0 mr-2">
            <ArrowLeft size={16} className="mr-1" />
            Voltar
          </Button>
          <span className="text-gray-500">
            Home / Futebol / Quadra de Futebol
          </span>
        </div>
        
        {/* Detalhes da Quadra */}
        <div className="grid grid-cols-1  md:grid-cols-2 gap-8">
          {/* Card da Quadra */}
          <div>
            <Card className="overflow-hidden p-0 border border-gray-200">
              <div className="relative pt-[60%]">
                <img 
                  src={Futebol_1} 
                  alt="Quadra de Futebol"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-700 hover:bg-green-600">
                  -20%
                </Badge>
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
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="descricao">Descrição</TabsTrigger>
                    <TabsTrigger value="caracteristicas">Características</TabsTrigger>
                    <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
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
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" placeholder="Seu nome completo" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" placeholder="(+244) 000 000 000" required />
                  </div>
                  
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="participantes">Número de Participantes</Label>
                    <Input 
                      id="participantes" 
                      type="number" 
                      min="1" 
                      placeholder="Número de jogadores" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações Adicionais</Label>
                    <textarea 
                      id="observacoes" 
                      className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                      rows="3"
                      placeholder="Alguma informação adicional?"
                    ></textarea>
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