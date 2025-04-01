import React, { useState } from 'react';
import { BarChart3, Users, Calendar, Settings, LogOut, Home, Trophy, Activity, TrendingUp, TrendingDown, Menu, X, DollarSign } from 'lucide-react';
import { PiCourtBasketballFill } from "react-icons/pi";
import { PiGlobeHemisphereWestFill } from "react-icons/pi";
import { MdCategory } from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ManageUsers from '@/layouts/ManageUsers'
import ManageCourt from '@/layouts/ManageCourt'
import ManageSettings from '@/layouts/ManageSettings'
import ManageReservations from '@/layouts/ManageReservations'
import ManagePayments from '@/layouts/ManagePayments'
import { useGetUsersQuery } from '@/api/userQuery';
import { useGetAdminStatsQuery, useGetOperatorStatsQuery } from '@/api/statsQuery';
import { MdPayment } from "react-icons/md";
import { useAuth } from "@/hooks/AuthContext";
import {jwtDecode} from "jwt-decode";
import LOGO from '@/assets/images/LOGO.png';

const AdminPanel = () => {
  const { user, logout, token } = useAuth();
  const decodedToken = jwtDecode(token);
  const userType = decodedToken?.user?.type;

  const { data, isError, isLoading } = useGetUsersQuery();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch stats based on user type
  const { data: admin } = useGetAdminStatsQuery();
  const { data: operator } = useGetOperatorStatsQuery();
  console.log(operator)
  // Function to safely calculate percentages when data is not yet loaded
  const safeCalculatePercentage = (part, total) => {
    if (!total || total === 0) return 0;
    return Math.round((part / total) * 100);
  };

  // Process fields data if available for admin
  const fieldsWithPercentage = React.useMemo(() => {
    if (!admin?.data?.popularFields?.length) return [];
    
    const maxReservations = Math.max(...admin.data.popularFields.map(field => field.reservations));
    return admin.data.popularFields.map(field => ({
      ...field,
      percentagem: maxReservations > 0 ? (field.reservations / maxReservations) * 100 : 0
    }));
  }, [admin?.data?.popularFields]);

  // Process fields data if available for operator - UPDATED for new structure
  const operatorFieldsWithPercentage = React.useMemo(() => {
    if (!operator?.data?.popularFields?.thisMonth?.length) return [];
    
    const thisMonthFields = operator.data.popularFields.thisMonth;
    const maxReservations = Math.max(...thisMonthFields.map(field => field.reservations));
    
    return thisMonthFields.map(field => {
      // Find the same field in last month's data to calculate growth
      const lastMonthField = operator.data.popularFields.lastMonth?.find(f => f.fieldId === field.fieldId);
      const lastMonthReservations = lastMonthField ? lastMonthField.reservations : 0;
      
      // Calculate growth percentage
      const growth = lastMonthReservations > 0 
        ? ((field.reservations - lastMonthReservations) / lastMonthReservations) * 100 
        : field.reservations > 0 ? 100 : 0;
      
      return {
        ...field,
        percentagem: maxReservations > 0 ? (field.reservations / maxReservations) * 100 : 0,
        growth: growth.toFixed(1),
        lastMonthReservations
      };
    });
  }, [operator?.data?.popularFields]);

  // Stats cards data for admin
  const statsCards = React.useMemo(() => {
    if (!admin?.data) return [];
    
    return [
      { 
        title: "Usuários Ativos", 
        value: admin.data.users.active.toLocaleString(), 
        percentagem: `+${admin.data.users.active.toLocaleString() * 100 / 100}%`, 
        icon: <Users size={20} />,
        color: "bg-blue-100",
        textColor: "text-blue-600"
      },
      { 
        title: "Reservas Confirmadas", 
        value: admin.data.reservations.confirmed.toLocaleString(), 
        percentagem: `+${admin.data.reservations.confirmed.toLocaleString()  * 100 / 100 }%`, 
        icon: <Calendar size={20} />,
        color: "bg-green-100",
        textColor: "text-green-600"
      },
      { 
        title: "Receita Total", 
        value: `Kz ${admin.data.revenue.total.toLocaleString()}`, 
        percentagem: "+15%", 
        icon: <MdPayment size={20} />,
        color: "bg-purple-100",
        textColor: "text-purple-600"
      },
      { 
        title: "Novos Usuários", 
        value: admin.data.users.newThisMonth.toLocaleString(), 
        percentagem: "+22%", 
        icon: <Activity size={20} />,
        color: "bg-orange-100",
        textColor: "text-orange-600"
      }
    ];
  }, [admin?.data]);

  // Stats cards data for operator - UPDATED for new structure
  const operatorStatsCards = React.useMemo(() => {
    if (!operator?.data) return [];
    
    // Calculate total reservations this month
    const thisMonthReservations = operator.data.popularFields.thisMonth?.reduce(
      (total, field) => total + field.reservations, 0
    ) || 0;
    
    // Calculate total reservations last month
    const lastMonthReservations = operator.data.popularFields.lastMonth?.reduce(
      (total, field) => total + field.reservations, 0
    ) || 0;
    
    // Calculate growth percentage
    const reservationsGrowth = lastMonthReservations > 0 
      ? ((thisMonthReservations - lastMonthReservations) / lastMonthReservations) * 100 
      : thisMonthReservations > 0 ? 100 : 0;
    
    // Determine if growth is positive or negative
    const isPositiveGrowth = reservationsGrowth >= 0;
    
    return [
      { 
        title: "Reservas Pendentes", 
        value: operator.data.pendingReservations.toLocaleString(), 
        percentagem: isPositiveGrowth ? `+${reservationsGrowth.toFixed(1)}%` : `${reservationsGrowth.toFixed(1)}%`, 
        icon: <Calendar size={20} />,
        growthIcon: isPositiveGrowth ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />,
        color: "bg-yellow-100",
        textColor: isPositiveGrowth ? "text-green-600" : "text-red-600"
      },
      { 
        title: "Quadras Disponíveis", 
        value: operator.data.scheduledFields?.length.toLocaleString() || "0", 
        percentagem: isPositiveGrowth ? `+${Math.abs(reservationsGrowth).toFixed(1)}%` : `${reservationsGrowth.toFixed(1)}%`,
        icon: <PiCourtBasketballFill size={20} />,
        growthIcon: isPositiveGrowth ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />,
        color: "bg-blue-100",
        textColor: isPositiveGrowth ? "text-green-600" : "text-red-600"
      },
      { 
        title: "Reservas Recentes", 
        value: operator.data.recentReservations?.length.toLocaleString() || "0", 
        percentagem: isPositiveGrowth ? `+${Math.abs(reservationsGrowth).toFixed(1)}%` : `${reservationsGrowth.toFixed(1)}%`,
        icon: <Activity size={20} />,
        growthIcon: isPositiveGrowth ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />,
        color: "bg-green-100",
        textColor: isPositiveGrowth ? "text-green-600" : "text-red-600"
      }
    ];
  }, [operator?.data]);

  // Status color mapping
  const statusColors = {
    "confirmed": "bg-green-100 text-green-800",
    "pending": "bg-yellow-100 text-yellow-800",
    "cancelled": "bg-red-100 text-red-800"
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show content on screen when an menu item is selected
  const [select, setSelect] = useState('dashboard');
  
  // Componente do Sidebar para reutilização
  const SidebarContent = () => (
    <>
      <div className="p-4 flex items-center space-x-2">
         <img 
          src={LOGO} 
          className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 object-contain" 
          alt="Logo" 
        />
        <h1 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">AgendaQuadra</h1>
      </div>
      
      <nav className="mt-8 flex-1">
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Principal</div>
        <a href="#" onClick={()=>{setSelect('dashboard')}} className={`flex items-center px-4 py-3 ${select === 'dashboard' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'}`}>
          <BarChart3 size={20} className="mr-3" />
          <span>Dashboard</span>
        </a>
        {userType === 'operator' ? 
      (  <a href="#"  onClick={()=>{setSelect('reservations')}} className={`flex items-center px-4 py-3 ${select === 'reservations' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'}`}>
                <Calendar size={20} className="mr-3" />
                <span>Reservas</span>
              </a>) :
      (<div></div>)
      }{userType === 'administrator' ? (
        <a href="#" onClick={()=>{setSelect('users')}} className={`flex items-center px-4 py-3 ${select === 'users' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'}`}>
          <Users size={20} className="mr-3" />
          <span>Usuários</span>
        </a>
        
        ): <div></div>}
        
        {userType === 'administrator' ? (
        <a href="#" onClick={()=>{setSelect('quadras')}} className={`flex items-center px-4 py-3 ${select === 'quadras' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'}`}>
          <PiCourtBasketballFill size={20} className="mr-3" />
          <span>Quadras</span>
        </a>
        ): <div></div>}
        
        
        {userType === 'administrator' ? (
        <a href="#" onClick={()=>{setSelect('modulo')}} className={`flex items-center px-4 py-3 ${select === 'modulo' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'}`}>
          <MdCategory size={20} className="mr-3" />
          <span>Módulos</span>
        </a>
        ): <div></div>}
        
        {userType === 'operator' ? (
        <a href="#" onClick={()=>{setSelect('pagamentos')}} className={`flex items-center px-4 py-3 ${select === 'pagamentos' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'}`}>
          <MdPayment size={20} className="mr-3" />
          <span>Pagamentos</span>
        </a>
        ): <div></div>}
        <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase">Configurações</div>
        <a href="#" onClick={logout} className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-auto">
          <LogOut size={20} className="mr-3" />
          <span>Sair</span>
        </a>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-xs text-gray-400">Logado como</p>
          <p className="font-medium">{userType === 'administrator' ? 'Admin' : 'Operador'}</p>
        </div>
      </div>
    </>
  );

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Format time helper
  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Sidebar (overlay) */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={toggleSidebar}></div>
        
        {/* Sidebar */}
        <div className="relative flex flex-col w-64 h-full bg-gray-900 text-white">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={toggleSidebar} className="text-gray-300 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>
      
      {/* Desktop Sidebar (permanent) */}
      <div className="hidden lg:flex flex-col w-64 bg-gray-900 text-white fixed h-full">
        <SidebarContent />
      </div>
      
      {/* Main Content */}
      <div className="lg:ml-64 flex-1">
        {/* Top Navigation for Mobile */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="lg:hidden text-gray-600 p-2 hover:text-gray-900 mr-2">
                <Menu size={24} />
              </button>
              <div className="flex items-center lg:hidden">
                <img 
                  src={LOGO} 
                  className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12" 
                  alt="Logo" 
                />
                <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 ml-2">AgendaQuadra</h2>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 hidden lg:block">Painel Administrativo</h2>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        {select === 'dashboard' && (
          <main className="p-4 md:p-6 overflow-x-hidden">
            <div className="mb-6 md:mb-8">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Estatísticas da Plataforma</h1>
              <p className="text-gray-600">Visão geral do desempenho da sua agenda desportiva</p>
            </div>
            
            {/* Admin Statistics */}
            {userType === 'administrator' && admin?.data && (
              <>
                {/* Estatísticas Principais - Admin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                  {statsCards.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
                          </div>
                          {/*<div className={`${stat.color} p-2 md:p-3 rounded-full`}>
                            {stat.icon}
                          </div>*/}
                        </div>
                        <div className="mt-3 md:mt-4">
                          <span className={`text-xs inline-flex items-center font-medium ${stat.textColor}`}>
                            <TrendingUp size={14} className="mr-1" />
                            {stat.percentagem}
                          </span>
                          <span className="text-xs ml-1 text-gray-500">vs mês anterior</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Gráficos e Tabelas - Admin */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  {/* Tipos de Usuários */}
                  <Card className="lg:col-span-1">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle>Distribuição de Usuários</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-4">
                        {Object.entries(admin.data.users.byType).map(([type, count], index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium capitalize">{type}</span>
                              <span className="text-sm text-gray-500">
                                {safeCalculatePercentage(count, admin.data.users.total)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-purple-600' : 'bg-green-600'}`} 
                                style={{ width: `${safeCalculatePercentage(count, admin.data.users.total)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Quadras Populares */}
                  <Card className="lg:col-span-1">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle>Quadras Populares</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-3 md:space-y-4">
                        {fieldsWithPercentage.map((field, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{field.name}</span>
                              <span className="text-sm text-gray-500">{field.reservations}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${field.percentagem}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Status das Reservas */}
                  <Card className="lg:col-span-1">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle>Estado das Reservas</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-3 md:space-y-4">
                        {Object.entries(admin.data.reservations)
                          .filter(([key]) => key !== 'total')
                          .map(([status, count], index) => (
                            <div key={index} className="flex flex-col">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium capitalize">{status}</span>
                                <span className="text-sm text-gray-500">
                                  {count.toLocaleString()} ({safeCalculatePercentage(count, admin.data.reservations.total)}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    status === 'confirmed' ? 'bg-green-600' : 
                                    status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`} 
                                  style={{ width: `${safeCalculatePercentage(count, admin.data.reservations.total)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            
            {/* Operator Statistics - UPDATED */}
            {userType === 'operator' && operator?.data && (
              <>
                {/* Estatísticas Principais - Operator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  {operatorStatsCards.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
                          </div>
                          <div className={`${stat.color} p-2 md:p-3 rounded-full`}>
                            {stat.icon}
                          </div>
                        </div>
                        <div className="mt-3 md:mt-4">
                          <span className={`text-xs inline-flex items-center font-medium ${stat.textColor}`}>
                            {stat.growthIcon}
                            {stat.percentagem}
                          </span>
                          <span className="text-xs ml-1 text-gray-500">vs mês anterior</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Quadras e Reservas - Operator */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  {/* Quadras Populares - UPDATED */}
                  <Card className="lg:col-span-1">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle>Quadras Populares (Mês Atual)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="space-y-3 md:space-y-4">
                        {operatorFieldsWithPercentage.map((field, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{field.name}</span>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">{field.reservations} reservas</span>
                                {field.growth > 0 ? (
                                  <span className="text-xs text-green-600 flex items-center">
                                    <TrendingUp size={12} className="mr-1" />
                                    {field.growth}%
                                  </span>
                                ) : field.growth < 0 ? (
                                  <span className="text-xs text-red-600 flex items-center">
                                    <TrendingDown size={12} className="mr-1" />
                                    {field.growth}%
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-600">0%</span>
                                )}
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${field.percentagem}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Reservas Recentes */}
                  <Card className="lg:col-span-1">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle>Reservas Recentes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quadra</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {operator?.data?.recentReservations.map((reservation, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{reservation?.client?.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">{reservation?.field?.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">Kz {reservation?.price.toLocaleString()}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[reservation?.status]}`}>
                                    {reservation?.status === 'confirmed' ? 'Confirmado' : 
                                     reservation?.status === 'pending' ? 'Pendente' : 'Cancelado'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Quadras Agendadas */}
                <Card className="mb-6 md:mb-8">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle>Quadras Agendadas Hoje</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quadra</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {operator?.data?.scheduledFields.map((schedule, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{schedule?.name}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                {schedule?.address?.city?.name}, {schedule?.address?.province?.name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                {formatTime(schedule?.availability?.startTime)} - {formatTime(schedule?.availability?.endTime)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </main>
        )}
        
        {/*Resevas Content*/}  
        {select === 'reservations' && (
          <ManageReservations/>
        )}
        
        {/*Usuário Content*/}
        {select === 'users' && (
          <ManageUsers/>
        )}

        {/*Quadras Content*/}
        {select === 'quadras' && (
          <ManageCourt/>
        )}

        {/*Módulos Content*/}
        {select === 'modulo' && (
          <ManageSettings/>
        )}

        {/*Payments Content*/}
        {select === 'pagamentos' && (
          <ManagePayments/>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;