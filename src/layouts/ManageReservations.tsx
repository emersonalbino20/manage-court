import React, { useState } from 'react';
import { Calendar, ShieldX, CheckCircle } from 'lucide-react';
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
import { useGetUserResevationsQuery, usePatchCancelReservation } from '@/api/reserveQuery';
import { useAuth } from "@/hooks/AuthContext";
import { receiveCentFront, formatToAngolaTime } from '@/utils/methods';
import { useGetCourtsQuery, useGetCourtIdAvailabilities } from '@/api/courtQuery';
import {useGetIdAvailabilities} from '@/api/reserveQuery';

const ManageReservations = () => {
  // States for dialogs and feedback
  const { user, logout, token } = useAuth();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [confirmationReason, setConfirmationReason] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [erro, setErro] = useState('');
  // Fetch reservations query
  const { data: reservationsData, isLoading, error } = useGetUserResevationsQuery();
  const { data: courts } = useGetCourtsQuery();
  const { data: reservations} = useGetUserResevationsQuery();
  //const time_reservations = reservations?.data?.fieldReservations.find(r => r.id === reservation?.id);
  
  //console.log(time_reservations);

  // Patch reservation mutation
  const { mutate: patchReservation } = usePatchCancelReservation();

  // Open cancel confirmation dialog
  const openCancelDialog = (reservationId) => {
    setReservationId(reservationId);
    setCancelDialogOpen(true);
    setCancellationReason("");
  };

  // Open confirm reservation dialog
  const openConfirmDialog = (reservationId) => {
    setReservationId(reservationId);
    setConfirmDialogOpen(true);
    setConfirmationReason("");
  };

 // Confirm cancellation of reservation
  const confirmCancelReservation = () => {
    if (reservationId) {
      patchReservation({
        id: reservationId,
        status: "cancelled",
        cancellationReason: cancellationReason || "Reserva cancelada pelo usuário"
        
      }, {
        onSuccess: () => {
          setIsSuccess(true);
          setFeedbackMessage("Reserva cancelada com sucesso!");
          setDialogOpen(true);
          setCancelDialogOpen(false);
        },
        onError: (error) => {
          setIsSuccess(false);
          setErro(error)
          setFeedbackMessage("Não foi possível cancelar a reserva. Tente novamente.");
          setDialogOpen(true);
          setCancelDialogOpen(false);
        }
      });
    }
  };

// Confirm cancellation of reservation
  const confirmReservation = () => {
    if (reservationId) {
      patchReservation({
        id: reservationId,
        status: "confirmed",
        cancellationReason: cancellationReason || "Reserva confirmada pelo usuário"
        
      }, {
        onSuccess: () => {
          setIsSuccess(true);
          setFeedbackMessage("Reserva cancelada com sucesso!");
          setDialogOpen(true);
          setCancelDialogOpen(false);
        },
        onError: (error) => {
          setIsSuccess(false);
          setErro(error)
          setFeedbackMessage("Não foi possível cancelar a reserva. Tente novamente.");
          setDialogOpen(true);
          setCancelDialogOpen(false);
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
      'confirmed': 'Confirmado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2" /> Minhas Reservas
        </h1>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Reservas Realizadas</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Carregando reservas...</p>
          ) : error ? (
            <p className="text-center text-red-500">Erro ao carregar reservas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Quadra
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Horário
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Preço
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
                  {reservationsData?.data?.fieldReservations.map((reservation) => {
                    const court_data = courts?.data.data.fields.find(p => p.id === reservation?.fieldId);
                    const { data: time_reservations} = useGetIdAvailabilities(reservation?.fieldId);
                    //const time = time_reservations?.data?.data?.fieldAvailabities?.find(p => p.id === reservation?.fieldId);
                    return (
                    <tr key={reservation.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {court_data?.name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {time_reservations?.data?.data?.fieldAvailabities?.startTime[0]}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {time_reservations?.data?.data?.fieldAvailabities?.map(v=>v.startTime)} - {time_reservations?.data?.data?.fieldAvailabities?.map(v=>v.endTime)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        Kz {receiveCentFront(reservation.price)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}
                        `}>
                          {translateStatus(reservation.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right">
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openConfirmDialog(reservation.id)}
                              className="text-green-600 hover:text-green-800 flex items-center mr-2"
                            >
                              <CheckCircle size={16} className="mr-1" /> Confirmar
                            </button>
                            <button
                              onClick={() => openCancelDialog(reservation.id)}
                              className="text-red-600 hover:text-red-800 flex items-center"
                            >
                              <ShieldX size={16} className="mr-1" /> Cancelar
                            </button>
                          </>
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
            <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Informe o motivo do cancelamento da reserva.
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
              onClick={confirmCancelReservation}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Cancelar Reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Reservation */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Informe o motivo da confirmação da reserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <Textarea 
              placeholder="Descreva o motivo da confirmação (opcional)"
              value={confirmationReason}
              onChange={(e) => setConfirmationReason(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmReservation}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirmar Reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageReservations;