import React, { useState } from 'react';
import { MapPin, Edit, Trash2, Save, Layers, PlusCircle, CheckCircle2, Building, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usePostCourtAvailabilities,
  usePutCourtAvailabilities,
  useGetCourtIdAvailabilities
} from '@/api/courtQuery';
import { Link } from 'react-router-dom';
import FeedbackDialog from './_components/FeedbackDialog'; // Ajuste o caminho conforme necessário
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod"; // Importando zod explicitamente
import { schemeCourtAvailability } from '@/utils/validateForm'

const CourtAvaibility = () => {

  // Alterado para usar o novo esquema de validação
  const formCourt = useForm({
    resolver: zodResolver(schemeCourtAvailability),
    defaultValues: {
      fieldId: "01JPTVP35HHXXZ7786ZXXAZ3WP",
      day: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
      startTime: "",
      endTime: ""
    },
  });

  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [editandoTipo, setEditandoTipo] = useState("");

  const { mutate: mutatePostCourt } = usePostCourtAvailabilities();
  const { mutate: mutatePutCourt } = usePutCourtAvailabilities();

 function submitCourt(data: any, event?: React.FormEvent<HTMLFormElement>) {
  event?.preventDefault(); // Garante que o evento seja prevenido se for passado
  
  // Formatar os dados conforme o objeto esperado
  const formattedData = {
    fieldId: "01JPTVP35HHXXZ7786ZXXAZ3WP",
    id: data.id,
    day: data.day,
    startTime: data.startTime,
    endTime: data.endTime
  };
  if (editandoTipo) {
    mutatePutCourt({
          id: data.id,
          day: data.day,
          startTime: data.startTime,
          endTime: data.endTime
        }, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("O agendamento foi editado com sucesso!");
        setDialogOpen(true);
        setEditandoTipo(null); // Reseta o estado após edição
      },
      onError: (error) => {
        console.log(error);
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível editar o agendamento.");
        setDialogOpen(true);
      }
    });

  } else {
    mutatePostCourt({
            fieldId: "01JPTVP35HHXXZ7786ZXXAZ3WP",
            day: data.day,
            startTime: data.startTime,
            endTime: data.endTime
          }, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("O agendamento foi cadastrado com sucesso!");
        setDialogOpen(true);
        formCourt.reset({
          day: new Date().toISOString().split('T')[0],
          startTime: "",
          endTime: ""
        });
      },
      onError: (error) => {
        console.log(error);
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível cadastrar o agendamento.");
        setDialogOpen(true);
      }
    });
  }
}

const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  // Estados para os dados 
  const { data: courtData } = useGetCourtIdAvailabilities("01JPTVP35HHXXZ7786ZXXAZ3WP");

  const editarAgendamento = (agendamento) => {
    setEditandoTipo(agendamento)
    formCourt.setValue("id", agendamento.id)
    formCourt.setValue("day", agendamento.day);
    formCourt.setValue("startTime", agendamento.startTime);
    formCourt.setValue("endTime", agendamento.endTime);
  };
const today = new Date().toISOString().split("T")[0]; 
  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <Layers className="mr-2" /> Configurações de Agendamento
        </h1>
      </div>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center">
              <Layers size={18} className="mr-2" /> Gerenciar Disponibilidade
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Agendamento */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {editandoTipo ? 'Editar Agendamento' : 'Novo Agendamento'}
                </h3>
                <div className="space-y-4">
            <Form {...formCourt}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                formCourt.handleSubmit((data) => submitCourt(data, e))();
              }} 
             
            >
                  <div className="space-y-4">
                    <FormField
                      control={formCourt.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <Input type="date"  min={today} {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formCourt.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de Início</FormLabel>
                          <Input type="time" step="1"  {...field} 
                           onChange={(e) => {
                            let [hours, ,] = e.target.value.split(":");
                            hours = String(hours).padStart(2, "0"); // Garante duas casas para horas
                            const newStartTime = `${hours}:00:00`;
                            field.onChange(newStartTime); // Ajusta automaticamente para uma hora pontual
                            
                            // Define a hora de término automaticamente (1 hora depois)
                            const newEndTime = `${String(Number(hours) + 1).padStart(2, "0")}:00:00`;
                            formCourt.setValue("endTime", newEndTime);
                          }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={formCourt.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora de Término</FormLabel>
                          <Input type="time" step="1" {...field} readOnly />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 w-full"
                    >
                      <Save size={16} className="mr-1" />
                      { editandoTipo ?  'Atualizar' : 'Salvar' }
                    </Button>
                  </div>
                  </form>
                  </Form>
                </div>
              </div>

              {/* Lista de Agendamentos */}
              <div>
                <h3 className="text-lg font-medium mb-4">Horários Disponíveis</h3>
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                  {courtData?.data?.data?.length > 0 ? (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Data</th>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Início</th>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Término</th>
                          <th className="text-right pb-2 text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {courtData?.data?.data?.fieldAvailabilities?.map((agendamento) => (
                          <tr key={agendamento.id}>
                            <td className="py-2">{agendamento.day}</td>
                            <td className="py-2">{agendamento.startTime}</td>
                            <td className="py-2">{agendamento.endTime}</td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => editarAgendamento(agendamento)}
                                className="text-blue-600 hover:text-blue-800 mr-2"
                              >
                                <Edit size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nenhum horário disponível cadastrado
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Diálogo de feedback */}
      <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
      />
    </div>
  );
};

export default CourtAvaibility;