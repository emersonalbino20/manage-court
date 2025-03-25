import React, { useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Volei_1 from '@/assets/images/court-volleyball.jpg';
import {
  useGetUserResevationsQuery, usePatchCancelReservation
} from '@/api/reserveQuery';
import {useGetCourtsQuery} from '@/api/courtQuery';
import {receiveCentFront, sendCoinBeck} from '@/utils/methods';
import {
  useGetProvincesQuery
} from '@/api/provinceQuery';
import {
  useGetCitiesQuery
} from '@/api/cityQuery';
import FeedbackDialog from '@/_components/FeedbackDialog'; // Ajuste o caminho conforme necessário

const UserBookingsSection = () => {
  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      courtName: 'Quadra de Futebol', 
      location: 'Kilamba Kiaxe - Avenida de Moçamedes', 
      date: '18/03/2025', 
      time: '15:00 - 16:00',
      price: 'Kz 89.000,90',
      image: Volei_1,
      status: 'confirmado'
    },
    { 
      id: 2, 
      courtName: 'Quadra de Tênis', 
      location: 'Talatona - Rua dos Coqueiros', 
      date: '20/03/2025', 
      time: '18:00 - 19:00',
      price: 'Kz 59.000,90',
      image: Volei_1,
      status: 'confirmado'
    },
    { 
      id: 3, 
      courtName: 'Quadra de Basquete', 
      location: 'Maianga - Avenida Comandante Valódia', 
      date: '22/03/2025', 
      time: '10:00 - 11:00',
      price: 'Kz 189.000,90',
      image: Volei_1,
      status: 'pendente'
    }
  ]);
  const { data: myResevations } = useGetUserResevationsQuery();
  const { data: courts } = useGetCourtsQuery();
  const { data: provinceData } = useGetProvincesQuery();
  const { data: cityData } = useGetCitiesQuery();

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [id, setId] = useState('');
  const {mutate: cancelReservations} = usePatchCancelReservation();
  const handleCancelBooking = (bookingId) => {
     cancelReservations({id: bookingId},{
      onSuccess: (response) => {
        setFeedbackMessage("A sua reserva foi cancelada!");
        setDialogOpen(true);
        setIsCancelDialogOpen(false);
      },
      onError: (error) => {
          setIsSuccess(false);
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
            
            return (
            <Card key={booking.id} className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-0 pt-[52%]">
                <img 
                  src={Volei_1} 
                  alt={"Nothing"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(booking.status)}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{court_data?.name}</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{city.name} - {province.name}</span>
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
                <div className="mt-4 space-y-2">
                  <Button 
                    className="w-full bg-white text-red-700 border border-red-700 hover:bg-red-50"
                    variant="outline"
                    onClick={()=>{openCancelDialog(booking)}}
                    disabled={booking.status === 'cancelado'}
                  >
                    Cancelar Agendamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
      )}

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Cancelar Agendamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {bookingToCancel && (
            <div className="py-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-16 h-16 relative">
                  <img 
                    src={Volei_1} 
                
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                {/*<div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">campo nome</p>
                  <p className="text-sm text-gray-700">{bookingToCancel.fieldAvailability.startTime} - {bookingToCancel.fieldAvailability.endTime}</p>
                  <p className="text-sm text-gray-700">local</p>
                  <p className="text-sm font-bold text-green-700">Kz {receiveCentFront(bookingToCancel.price)}</p>
                </div>*/}
              </div>
              
              <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                  Política de cancelamento: Cancelamentos com até 24h de antecedencia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Voltar
            </Button>
            <Button 
              type="button" 
              className="bg-red-600 hover:bg-red-700 text-white"
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
      />
    </div>
  );
};

export default UserBookingsSection;