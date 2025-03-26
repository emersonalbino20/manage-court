import React, { useState } from 'react';
import { DollarSign, ShieldX, CheckCircle } from 'lucide-react';
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
import FeedbackDialog from '@/_components/FeedbackDialog';
import { useGetUserPaymentsQuery, usePatchPaymentStatusQuery } from '@/api/paymentQuery';
import { useAuth } from "@/hooks/AuthContext";
import { receiveCentFront } from '@/utils/methods';
import { MdPayment } from "react-icons/md";

const ManagePayments = () => {
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

  // Fetch payments query
  const { data: paymentsData, isLoading, error } = useGetUserPaymentsQuery();
  console.log(paymentsData)

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
        cancellationReason: cancellationReason || "Pagamento cancelado pelo usuário"
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
        status: "completed",
        cancellationReason: ""
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

  // Status translation
  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Pendente',
      'success': 'Concluído',
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
                      ID da Reserva
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
                      Status
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentsData?.data?.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {payment.fieldReservationId}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {payment.paymentMethodId}
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
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}
                        `}>
                          {translateStatus(payment.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        {payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openConfirmDialog(payment.id)}
                              className="text-green-600 hover:text-green-800 flex items-center mr-2"
                            >
                              <CheckCircle size={16} className="mr-1" /> Confirmar
                            </button>
                            <button
                              onClick={() => openCancelDialog(payment.id)}
                              className="text-red-600 hover:text-red-800 flex items-center"
                            >
                              <ShieldX size={16} className="mr-1" /> Cancelar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
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