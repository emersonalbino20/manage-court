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
  usePostPaymentMethods,
  usePutPaymentMethods,
  useGetPaymentMethodsQuery
} from '@/api/paymentMethodsQuery';
import { Link } from 'react-router-dom';
import FeedbackDialog from '@/_components/FeedbackDialog'; // Ajuste o caminho conforme necessário
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { schemePaymentMethods } from '@/utils/validateForm.tsx';
import { MdPayment } from "react-icons/md";

const PaymentMethods = () => {

  const formMethods = useForm({
    resolver: zodResolver(schemePaymentMethods),
    defaultValues: {
      name: "",
    },
  });


  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [editandoTipo, setEditandoTipo] = useState("");

  const { mutate: mutatePostMethods } = usePostPaymentMethods();
  const { mutate: mutatePutCourt } = usePutPaymentMethods();

 function submitCourt(data: any, event?: React.FormEvent<HTMLFormElement>) {
  event?.preventDefault(); // Garante que o evento seja prevenido se for passado
  if (editandoTipo) {
    mutatePutCourt(data, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("O método de pagamento foi editado com sucesso!");
        setDialogOpen(true);
        setEditandoTipo(null); // Reseta o estado após edição
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível editar o método de pagamento.");
        setDialogOpen(true);
      }
    });

  } else {
    mutatePostMethods(data, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("O método foi cadastrado com sucesso!");
        setDialogOpen(true);
        formMethods.reset();
      },
      onError: (error) => {
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível cadastrar o método.");
        setDialogOpen(true);
      }
    });

  }
}

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Estado para controlar qual tab está ativa
  const [activeTab, setActiveTab] = useState('tipos');

  // Estados para os dados
  const { data: methodsData } = useGetPaymentMethodsQuery();
  const editarTipoCampo = (tipo) => {
    setEditandoTipo(tipo)
    formMethods.setValue("id", tipo.id);
    formMethods.setValue("name", tipo.name);
  };


  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <MdPayment size={20} className="mr-2"/> Gerenciar Pagamentos
        </h1>
      </div>

      {/* Abas */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeTab === 'tipos'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('tipos')}
        >
          Métodos de Pagamentos
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'tipos' && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center">
              <Layers size={18} className="mr-2" /> Gerenciar Métodos de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Cadastro */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {editandoTipo ? 'Editar Método de Pagamento' : 'Novo Método de Pagamento'}
                </h3>
                <div className="space-y-4">
            <Form {...formMethods}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                formMethods.handleSubmit((data) => submitCourt(data, e))();
              }} 
             
            >
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                     <FormField
                    control={formMethods.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Método</FormLabel>
                        <Input {...field} placeholder="Ex: Cash"/>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    </div>
                    <Button 
                    type="submit" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} className="mr-1" />
                      { editandoTipo ?  'Actualizar' : 'Salvar' }
                    </Button>
                  </div>
                  </form>
                  </Form>
                </div>
              </div>

              {/* Lista de Tipos de Campo */}
              <div>
                <h3 className="text-lg font-medium mb-4">Métodos Cadastrados</h3>
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                  {methodsData?.data?.data?.length > 0 ? (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Nome</th>
                          <th className="text-right pb-2 text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {methodsData?.data?.data?.map((tipo) => (
                          <tr key={tipo.id}>
                            <td className="py-2">{tipo.name}</td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => editarTipoCampo(tipo)}
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
                      Nenhum Método de pagamento cadastrado
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

export default PaymentMethods;