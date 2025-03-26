import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Clock, CheckCircle, User, Calendar as CalendarIcon, MapPin, CreditCard, Info, LogIn, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Booking = () => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const goToNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const renderAuthStep = () => {
    return (
      <div className="space-y-4">
        <Tabs value={authMode} onValueChange={setAuthMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </TabsTrigger>
            <TabsTrigger value="register">
              <UserPlus className="mr-2 h-4 w-4" /> Registrar
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-login">E-mail</Label>
                <Input id="email-login" type="email" placeholder="seu@email.com" />
              </div>
              <div>
                <Label htmlFor="password-login">Senha</Label>
                <Input id="password-login" type="password" placeholder="Digite sua senha" />
              </div>
              <Button className="w-full">Entrar</Button>
            </div>
          </TabsContent>
          <TabsContent value="register">
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome-registro">Nome completo</Label>
                <Input id="nome-registro" placeholder="Digite seu nome completo" />
              </div>
              <div>
                <Label htmlFor="email-registro">E-mail</Label>
                <Input id="email-registro" type="email" placeholder="seu@email.com" />
              </div>
              <div>
                <Label htmlFor="telefone-registro">Telefone</Label>
                <Input id="telefone-registro" placeholder="(+244) 000-000-000" />
              </div>
              <div>
                <Label htmlFor="password-registro">Senha</Label>
                <Input id="password-registro" type="password" placeholder="Crie uma senha" />
              </div>
              <div>
                <Label htmlFor="confirm-password-registro">Confirmar Senha</Label>
                <Input id="confirm-password-registro" type="password" placeholder="Confirme sua senha" />
              </div>
              <Button className="w-full">Registrar</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderCourtSelectionStep = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Selecione a quadra, data e horário</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card 
            className={`cursor-pointer ${selectedCourt === 'tennis' ? 'border-primary' : ''}`} 
            onClick={() => setSelectedCourt('tennis')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quadra de Tênis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Área Externa</p>
                  <p className="mt-1">Kz 80,00/hora</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${selectedCourt === 'futsal' ? 'border-primary' : ''}`} 
            onClick={() => setSelectedCourt('futsal')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quadra de Futsal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Ginásio Coberto</p>
                  <p className="mt-1">Kz 120,00/hora</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-4">
          <div>
            <Label className="mb-2 block">Data</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-3"
            />
          </div>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Horário</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(time => (
                    <SelectItem key={time} value={time}>{time} - {String(parseInt(time) + 1).padStart(2, '0')}:00</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Forma de Pagamento</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                  <SelectItem value="local">Pagamento no local</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleBookingConfirmation = () => {
    setBookingConfirmed(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-center">Agendamento de Quadra</CardTitle>
          <CardDescription className="text-center">Complete o passo a passo para realizar sua reserva</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between relative mb-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center z-10">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stepNumber < step ? 'bg-green-500 text-white' : 
                      stepNumber === step ? 'bg-primary text-white' : 
                      'bg-muted text-muted-foreground'
                    }`}
                  >
                    {stepNumber < step ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                  </div>
                  <span className={`text-xs mt-1 hidden md:block ${stepNumber === step ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                    {stepNumber === 1 ? 'Autenticação' : 
                     stepNumber === 2 ? 'Agendamento' : 'Confirmação'}
                  </span>
                </div>
              ))}
              
              <div className="absolute top-4 left-0 right-0 h-px bg-muted -z-0">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${(step - 1) * 50}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="min-h-64">
            {step === 1 && renderAuthStep()}
            {step === 2 && renderCourtSelectionStep()}
            {step === 3 && (
              <Dialog open={true}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reserva Pendente</DialogTitle>
                    <DialogDescription>
                      Sua reserva foi recebida e está pendente de confirmação.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Quadra:</span>
                      <span>{selectedCourt === 'tennis' ? 'Quadra de Tênis' : 'Quadra de Futsal'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor:</span>
                      <span>Kz {selectedCourt === 'tennis' ? '80,00' : '120,00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-yellow-600 font-medium">Pendente</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={goToPreviousStep}
            disabled={step === 1}
          >
            Voltar
          </Button>
          
          <Button
            onClick={step === 3 ? handleBookingConfirmation : goToNextStep}
            disabled={step === 2 && (!selectedCourt || !date)}
          >
            {step === 3 ? 'Concluir' : 'Continuar'}
          </Button>
        </CardFooter>
      </Card>
      
    </div>
  );
};

export default Booking;