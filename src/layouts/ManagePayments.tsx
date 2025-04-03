import React, { useState } from 'react';
import { DollarSign, ShieldX, CheckCircle, Search, CalendarIcon, FilterIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeedbackDialog from '@/_components/FeedbackDialog';
import { useGetPaymentsQuery, usePatchPaymentStatusQuery } from '@/api/paymentQuery';
import { useGetPaymentMethodsQuery } from '@/api/paymentMethodsQuery';
import { useAuth } from "@/hooks/AuthContext";
import { receiveCentFront } from '@/utils/methods';
import { MdPayment } from "react-icons/md";
import { useGetClientsQuery } from '@/api/userQuery';

const ManagePayments = () => {
  // Função para formatar a data atual no formato YYYY-MM-DD para o input
  const formatCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // States for dialogs and feedback
  const { user, logout, token } = useAuth();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [erro, setErro] = useState('');

  // States for filters - usando a data atual como valor padrão para fromDate
  const [fromDate, setFromDate] = useState(formatCurrentDate());
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Fetch payments query
  const { data: paymentsData, isLoading, error } = useGetPaymentsQuery(fromDate, toDate, statusFilter);
  const { data: userData } = useGetClientsQuery();
  const { data: methodsData } = useGetPaymentMethodsQuery();

  // Patch payment status mutation
  const { mutate: patchPaymentStatus } = usePatchPaymentStatusQuery();

  // Open cancel confirmation dialog
  const openCancelDialog = (paymentId) => {
    setPaymentId(paymentId);
    setCancelDialogOpen(true);
    setCancellationReason("");
  };

  // Open confirm payment dialog
  const openConfirmDialog = (paymentId) => {
    setPaymentId(paymentId);
    setConfirmDialogOpen(true);
  };

  // Confirm cancellation of payment
  const confirmCancelPayment = () => {
    if (paymentId) {
      patchPaymentStatus({
        id: paymentId,
        status: "failed",
        cancellationReason: cancellationReason || "Pagamento cancelado pela assistência da QuadraWeb."
      }, {
        onSuccess: () => {
          setIsSuccess(true);
          setFeedbackMessage("Pagamento cancelado com sucesso!");
          setDialogOpen(true);
          setCancelDialogOpen(false);
        },
        onError: (error) => {
          setIsSuccess(false);
          setErro(error);
          setFeedbackMessage("Não foi possível cancelar o pagamento. Tente novamente.");
          setDialogOpen(true);
          setCancelDialogOpen(false);
        }
      });
    }
  };

  // Confirm payment
  const confirmPayment = () => {
    if (paymentId) {
      patchPaymentStatus({
        id: paymentId,
        status: "success",
        cancellationReason: "Pagamento confirmado pela assistência da QuadraWeb."
      }, {
        onSuccess: () => {
          setIsSuccess(true);
          setFeedbackMessage("Pagamento confirmado com sucesso!");
          setDialogOpen(true);
          setConfirmDialogOpen(false);
        },
        onError: (error) => {
          setIsSuccess(false);
          setErro(error);
          setFeedbackMessage("Não foi possível confirmar o pagamento. Tente novamente.");
          setDialogOpen(true);
          setConfirmDialogOpen(false);
        }
      });
    }
  };

  // Close feedback dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Apply filters function - you'll connect this to your API later
  const applyFilters = () => {
    // This is just a placeholder for now
    console.log("Applying filters:", { fromDate, toDate, statusFilter });
    // You'll implement the actual API call here
  };

  // Reset filters
  const resetFilters = () => {
    setFromDate(formatCurrentDate()); // Resetar para a data atual, não para string vazia
    setToDate('');
    setStatusFilter('all');
  };

  // Status translation
  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Pendente',
      'success': 'Concluído',
      'Success': 'Concluído',
      'failed': 'Falhou',
      'Failed': 'Falhou'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <MdPayment size={20} className="mr-2" /> Pagamentos
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFilters}
            className="flex items-center gap-1"
          >
            <FilterIcon size={16} />
            {filtersVisible ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>
        </CardHeader>
        {filtersVisible && (
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Data Inicial</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="pl-10"
                  />
                  <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Data Final</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="pl-10"
                  />
                  <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <Select value={statusFilter} onValueChange={setStatusFilter} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="success">Concluído</SelectItem>
                    <SelectItem value="failed">Falhou</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/*<div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetFilters}>Limpar</Button>
              <Button onClick={applyFilters} className="flex items-center gap-1">
                <Search size={16} />
                Aplicar Filtros
              </Button>
            </div>*/}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Pagamentos Realizados</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Carregando pagamentos...</p>
          ) : error ? (
            <p className="text-center text-red-500">Erro ao carregar pagamentos</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Cliente
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Método de Pagamento
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Valor
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentsData?.data?.payments.map((payment) => {
                    const users = userData?.data?.users?.find(u => u.id === payment?.clientId);
                    const methods = methodsData?.data?.data?.find(m => m.id === payment?.paymentMethodId);
                    return(
                    <tr key={payment.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {users?.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {methods?.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        Kz {receiveCentFront(payment.amount)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            payment.status === 'completed' || payment.status === 'success' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}
                        `}>
                          {translateStatus(payment.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        {payment.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openConfirmDialog(payment.id)}
                              className="text-green-600 hover:text-green-800 flex items-center"
                            >
                              <CheckCircle size={16} className="mr-1" /> Confirmar
                            </button>
                            <button
                              onClick={() => openCancelDialog(payment.id)}
                              className="text-red-600 hover:text-red-800 flex items-center"
                            >
                              <ShieldX size={16} className="mr-1" /> Cancelar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        errorData={erro}
        message={feedbackMessage}
      />

      {/* Confirmation Dialog for Cancellation */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cancelamento de Pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Informe o motivo do cancelamento do pagamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <Textarea 
              placeholder="Descreva o motivo do cancelamento (opcional)"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelPayment}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cancelar Pagamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Payment */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja confirmar este pagamento?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPayment}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirmar Pagamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManagePayments;