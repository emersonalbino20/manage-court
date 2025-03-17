import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Clock, CheckCircle, User, Calendar as CalendarIcon, MapPin, CreditCard, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Booking = () => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(null);
  
  const goToNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Selecione a quadra desejada</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="cursor-pointer hover:border-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Quadra de Tênis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Área Externa</p>
                      <p className="mt-1">Kz 80,00/hora</p>
                    </div>
                    <Button variant="outline" size="sm">Selecionar</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:border-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Quadra de Futsal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <p className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Ginásio Coberto</p>
                      <p className="mt-1">Kz 120,00/hora</p>
                    </div>
                    <Button variant="outline" size="sm">Selecionar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Escolha a data e horário</h3>
            <div className="grid gap-6 md:grid-cols-2">
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
                      <SelectItem value="08:00">08:00 - 09:00</SelectItem>
                      <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                      <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                      <SelectItem value="11:00">11:00 - 12:00</SelectItem>
                      <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                      <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                      <SelectItem value="16:00">16:00 - 17:00</SelectItem>
                      <SelectItem value="17:00">17:00 - 18:00</SelectItem>
                      <SelectItem value="18:00">18:00 - 19:00</SelectItem>
                      <SelectItem value="19:00">19:00 - 20:00</SelectItem>
                      <SelectItem value="20:00">20:00 - 21:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">Duração</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora</SelectItem>
                      <SelectItem value="2">2 horas</SelectItem>
                      <SelectItem value="3">3 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Forneça seus dados</h3>
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" placeholder="Digite seu nome completo" />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(+244) 000-000-000" />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Revisão e pagamento</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo da reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Quadra:</span>
                  <span>Quadra de Tênis</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Data:</span>
                  <span>17/03/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Horário:</span>
                  <span>16:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> Responsável:</span>
                  <span>Seu Nome</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Valor total:</span>
                  <span>Kz 80,00</span>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2"><CreditCard className="w-4 h-4" /> Forma de pagamento</h4>
              <Select>
                <SelectTrigger>
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
        );
      default:
        return null;
    }
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
              {[1, 2, 3, 4].map((stepNumber) => (
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
                    {stepNumber === 1 ? 'Quadra' : 
                     stepNumber === 2 ? 'Data/Hora' : 
                     stepNumber === 3 ? 'Dados' : 'Pagamento'}
                  </span>
                </div>
              ))}
              
              <div className="absolute top-4 left-0 right-0 h-px bg-muted -z-0">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${(step - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="min-h-64">
            {renderStepContent()}
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
            onClick={step === 4 ? () => alert('Agendamento concluído!') : goToNextStep}
          >
            {step === 4 ? 'Confirmar Reserva' : 'Continuar'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="flex items-center gap-2 text-sm font-medium mb-2">
          <Info className="w-4 h-4" /> Informações importantes
        </h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Cancelamentos devem ser feitos com no mínimo 24h de antecedência</li>
          <li>• Em caso de chuva, as quadras externas podem ser fechadas</li>
          <li>• Traga seu próprio equipamento ou alugue na recepção</li>
          <li>• Para mais informações, entre em contato pelo telefone (+244) 000-000-000</li>
        </ul>
      </div>
    </div>
  );
};

export default Booking;