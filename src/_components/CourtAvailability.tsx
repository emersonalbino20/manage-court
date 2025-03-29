import React, { useState } from 'react';
import { MapPin, Edit, Trash2, Save, Layers, PlusCircle, CheckCircle2, Building, Home, Calendar } from 'lucide-react';
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
  useGetCourtIdAvailabilities,
  useDeleteCourtAvailabilities // Nova query para deletar agendamentos
} from '@/api/courtQuery';
import { Link } from 'react-router-dom';
import FeedbackDialog from '@/_components/FeedbackDialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { schemeCourtAvailability } from '@/utils/validateForm';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, parse, isBefore, startOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { getCurrentAngolaDate,  formatToAngolaTime, convertToUtc} from '@/utils/methods'

const CourtAvailability = ({ulid}) => {
  // Estado para controlar a abertura do popover do calendário
  const [calendarOpen, setCalendarOpen] = useState(false);
  

  const today = startOfDay(new Date()); 

  const todayFormatted = getCurrentAngolaDate();
  
  const formCourt = useForm({
    resolver: zodResolver(schemeCourtAvailability),
    defaultValues: {
      fieldId: ulid,
      day: todayFormatted,
      startTime: "",
      endTime: ""
    },
  });

  const { watch } = formCourt;
  const [ fieldDate ] = watch(['day']);
  
  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [editandoTipo, setEditandoTipo] = useState("");
  const [erro, setErro] = useState('');
  const { mutate: mutatePostCourt } = usePostCourtAvailabilities();
  const { mutate: mutatePutCourt } = usePutCourtAvailabilities();
  const { mutate: mutateDeleteCourt } = useDeleteCourtAvailabilities(); // Hook para deletar agendamento

  // Estado para controlar o diálogo de confirmação de exclusão
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [agendamentoToDelete, setAgendamentoToDelete] = useState(null);

  function submitCourt(data, event) {
    event?.preventDefault();
    
    if (editandoTipo) {
      mutatePutCourt({
        id: data.id,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime
      }, {
        onSuccess: (response) => {
          console.log(response)
          setIsSuccess(true);
          setFeedbackMessage("O agendamento foi editado com sucesso!");
          setDialogOpen(true);
          setEditandoTipo(null);
        },
        onError: (error) => {
          console.log(error);
          setErro(error)
          setIsSuccess(false);
          setFeedbackMessage("Não foi possível editar o agendamento.");
          setDialogOpen(true);
        }
      });
    } else {

      mutatePostCourt({
        fieldId: ulid,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime
      }, {
        onSuccess: (response) => {
          setIsSuccess(true);
          setFeedbackMessage("O agendamento foi cadastrado com sucesso!");
          setDialogOpen(true);
          formCourt.reset({
            day: todayFormatted,
            startTime: "",
            endTime: ""
          });
        },
        onError: (error) => {
          console.log(error);
          setErro(error)
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
  
  const { data: courtData } = useGetCourtIdAvailabilities(ulid, fieldDate);
  
  const editarAgendamento = (agendamento) => {
    setEditandoTipo(agendamento);
    const formattedDate = convertToUtc(agendamento.day);
    formCourt.setValue("id", agendamento.id);
    formCourt.setValue("day", formattedDate);
    formCourt.setValue("startTime", agendamento.startTime);
    formCourt.setValue("endTime", agendamento.endTime);
  };

  // Função para mostrar o diálogo de confirmação de exclusão
  const confirmDeleteAgendamento = (agendamento) => {
    setAgendamentoToDelete(agendamento);
    setDeleteConfirmDialogOpen(true);
  };

  // Função para executar a exclusão do agendamento após confirmação
  const deleteAgendamento = () => {
    if (agendamentoToDelete) {
      console.log(agendamentoToDelete)
      mutateDeleteCourt(agendamentoToDelete.id, {
        onSuccess: () => {
          setIsSuccess(true);
          setFeedbackMessage("O agendamento foi excluído com sucesso!");
          setDialogOpen(true);
          setDeleteConfirmDialogOpen(false);
          setAgendamentoToDelete(null);
          
          // Se o agendamento que está sendo editado for excluído, limpar o formulário
          if (editandoTipo && editandoTipo.id === agendamentoToDelete.id) {
            setEditandoTipo(null);
            formCourt.reset({
              day: todayFormatted,
              startTime: "",
              endTime: ""
            });
          }
        },
        onError: (error) => {
          console.log(error);
          setErro(error);
          setIsSuccess(false);
          setFeedbackMessage("Não foi possível excluir o agendamento.");
          setDialogOpen(true);
          setDeleteConfirmDialogOpen(false);
        }
      });
    }
  };

  const handleDateSelect = (date) => {
    if (date) {
      const formattedDate = convertToUtc(date);
      formCourt.setValue("day", formattedDate);
      setCalendarOpen(false);
    }
  };

  return (
    <div>
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
                          <FormItem className="flex flex-col">
                            <FormLabel>Data</FormLabel>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    // Converter a string de data de volta para objeto Date para exibição
                                    format(parse(field.value, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                                  onSelect={handleDateSelect}
                                  disabled={(date) => isBefore(startOfDay(date), today)} // Desabilita datas menores que hoje
                                  initialFocus
                                  locale={pt}
                                />;
                              </PopoverContent>
                            </Popover>
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
                            <Input type="time" step="1" {...field} 
                              onChange={(e) => {
                                let [hours] = e.target.value.split(":");
                                hours = String(hours).padStart(2, "0");
                                const newStartTime = `${hours}:00:00`;
                                field.onChange(newStartTime);
                                
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
                        {editandoTipo ? 'Atualizar' : 'Salvar'}
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
                {courtData?.data?.data?.fieldAvailabilities?.length > 0 ? (
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
                          <td className="py-2">
                            {format(parse(agendamento.day, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')}
                          </td>
                          <td className="py-2">{agendamento.startTime.substring(0, 5)}</td>
                          <td className="py-2">{agendamento.endTime.substring(0, 5)}</td>
                          <td className="py-2 text-right">
                            <button
                              onClick={() => editarAgendamento(agendamento)}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => confirmDeleteAgendamento(agendamento)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
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
        errorData={erro}
      />

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Tem certeza que deseja excluir este horário disponível?</p>
            {agendamentoToDelete && (
              <div className="mt-2 p-3 bg-gray-100 rounded-md">
                <p><strong>Data:</strong> {format(parse(agendamentoToDelete.day, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')}</p>
                <p><strong>Horário:</strong> {agendamentoToDelete.startTime.substring(0, 5)} - {agendamentoToDelete.endTime.substring(0, 5)}</p>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={deleteAgendamento}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourtAvailability;