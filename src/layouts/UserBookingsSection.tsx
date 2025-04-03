import React, { useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, X, Alert, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Volei_1 from '@/assets/images/court-volleyball.jpg';
import {
  useGetClientResevationsQuery, usePatchCancelReservationClient
} from '@/api/reserveQuery';
import { useGetCourtsQuery } from '@/api/courtQuery';
import { receiveCentFront, sendCoinBeck } from '@/utils/methods';
import {
  useGetProvincesQuery
} from '@/api/provinceQuery';
import {
  useGetCitiesQuery
} from '@/api/cityQuery';
import FeedbackDialog from '@/_components/FeedbackDialog'; // Ajuste o caminho conforme necessário
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';


const UserBookingsSection = () => {
  
  const { data: myResevations } = useGetClientResevationsQuery();
  const { data: courts } = useGetCourtsQuery();
  const { data: provinceData } = useGetProvincesQuery();
  const { data: cityData } = useGetCitiesQuery();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [erro, setErro] = useState('');
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  const [id, setId] = useState('');
  const {mutate: cancelReservations} = usePatchCancelReservationClient();
  const handleCancelBooking = (bookingId) => {
    // Validate that cancellation reason is provided
    if (!cancellationReason.trim()) {
      setReasonError(true);
      return;
    }
    
    cancelReservations({id: bookingId, status: "cancelled", cancellationReason: cancellationReason},{
      onSuccess: (response) => {
        setIsSuccess(true);
        setFeedbackMessage("A sua reserva foi cancelada!");
        setDialogOpen(true);
        setIsCancelDialogOpen(false);
        setCancellationReason(""); // Reset reason after successful cancellation
        setReasonError(false);
      },
      onError: (error) => {
        setErro(error);
        setIsSuccess(false);
        setDialogOpen(true);
        setFeedbackMessage("Erro ao cancelar a sua reserva");
        console.log(error);
      }})
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const openCancelDialog = (booking) => {
    setBookingToCancel(booking);
    setId(booking.id);
    setCancellationReason(""); // Clear any previous reason
    setReasonError(false); // Reset error state
    setIsCancelDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    if (status === 'confirmed') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Confirmado</span>;
    } else if (status === 'pending') {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pendente</span>;
    } else {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Cancelado</span>;
    }
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Meus Agendamentos</h2>
      </div>

      {myResevations?.data.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum agendamento encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Você ainda não tem agendamentos de quadras.</p>
          <div className="mt-6">
            <Button className="bg-green-700 hover:bg-green-600">
              Agendar agora
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {myResevations?.data.map((booking) => {
            const court_data = courts?.data.data.fields.find(p => p.id === booking?.fieldId);
            const province = provinceData?.data?.data?.find(p => p.id === court_data?.address.provinceId);
            const city = cityData?.data?.data?.find(p => p.id === court_data?.address.cityId);
            console.log(court_data)
            return (
                     <Card key={booking.id} className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-0 pt-[52%]">
              {court_data?.thumbnailUrl && (
                <img 
                  src={court_data?.thumbnailUrl} 
                  alt={"Imagem da quadra"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2">
                {getStatusBadge(booking.status)}
              </div>
              {booking.status === 'cancelled' && (
                <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                  <div className="bg-white/90 px-4 py-2 rounded-md shadow-md">
                    <span className="font-semibold text-red-600">Agendamento Cancelado</span>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">{court_data?.name}</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{city?.name} - {province?.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{booking.fieldAvailability.day}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{booking.fieldAvailability.startTime} - {booking.fieldAvailability.endTime}</span>
                </div>
              </div>
              <div className="mt-3 text-lg font-bold text-green-700">Kz {receiveCentFront(booking.price)}</div>
              
              <div className="mt-4">
                {booking.status === 'cancelled' ? (
                  <div className="border border-red-100 bg-red-50 rounded-md p-3">
                    <div className="flex space-x-2">
                      <div className="flex-shrink-0 pt-0.5">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Motivo do cancelamento:</h4>
                        <p className="text-sm text-red-700 mt-1">
                          {booking.cancellationReason || "Nenhum motivo fornecido"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : booking.status === 'confirmed' ? (
                  <div className="border border-green-100 bg-green-50 rounded-md p-3">
                    <div className="flex space-x-2">
                      <div className="flex-shrink-0 pt-0.5">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Confirmação:</h4>
                        <p className="text-sm text-green-700 mt-1">
                          {booking.cancellationReason || "Agendamento confirmado"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-white text-red-700 border border-red-700 hover:bg-red-50"
                    variant="outline"
                    onClick={() => openCancelDialog(booking)}
                    disabled={booking.status === 'cancelado'}
                  >
                    Cancelar Agendamento
                  </Button>
                )}
              </div>
            </CardContent>
            </Card>
          )})}
        </div>
      )}

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
  <DialogContent className="sm:max-w-md md:max-w-lg p-0 overflow-hidden rounded-lg">
    <DialogHeader className="px-6 pt-6 pb-3 bg-white border-b">
      <DialogTitle className="text-xl font-bold flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        Cancelar Agendamento
      </DialogTitle>
      <DialogDescription className="mt-1 text-gray-600">
        Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
      </DialogDescription>
    </DialogHeader>
    
    {bookingToCancel && (
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
                   
          <div className="flex-grow space-y-3">
            <div className="space-y-1">
              <Label htmlFor="cancellation-reason" className="text-sm font-medium text-gray-700 flex items-center">
                Motivo do cancelamento
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea 
                id="cancellation-reason"
                placeholder="Descreva o motivo do cancelamento (obrigatório)"
                value={cancellationReason}
                onChange={(e) => {
                  setCancellationReason(e.target.value);
                  setReasonError(e.target.value.trim() === '');
                }}
                className={`w-full min-h-24 resize-y border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all rounded-md ${
                  reasonError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                required
              />
              {reasonError && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  O motivo do cancelamento é obrigatório
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    
    <DialogFooter className="px-6 py-4 bg-gray-50 border-t flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setIsCancelDialogOpen(false)}
        className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 transition-colors"
      >
        Voltar
      </Button>
      <Button 
        type="button" 
        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white transition-colors focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        onClick={() => bookingToCancel && handleCancelBooking(bookingToCancel.id)}
      >
        Confirmar Cancelamento
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      <FeedbackDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        success={isSuccess}
        message={feedbackMessage}
        errorData={erro}
      />
    </div>
  );
};

export default UserBookingsSection;