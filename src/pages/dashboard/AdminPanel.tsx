import React, { useState } from 'react';
import { BarChart3, Users, Calendar, Settings, LogOut, Home, Trophy, Activity, TrendingUp, Menu, X } from 'lucide-react';
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
import { MdPayment } from "react-icons/md";
import { useAuth } from "@/hooks/AuthContext";
import {jwtDecode} from "jwt-decode";

const AdminPanel = () => {
  const { user, logout, token } = useAuth();
  const decodedToken = jwtDecode(token);
  const userType = decodedToken?.user?.type;

  const { data, isError, isLoading } = useGetUsersQuery();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dados estatísticos simulados
  const stats = [
    { title: "Usuários Ativos", value: "5,823", percentagem: "+12%", icon: <Users size={20} /> },
    { title: "Quadras Agendadas", value: "246", percentagem: "+8%", icon: <Calendar size={20} /> },
    
  ];

  // Dados dos esportes mais populares
  const popularSports = [
    { nome: "Futebol", percentagem: 42 },
    { nome: "Basquete", percentagem: 28 },
    { nome: "Tênis", percentagem: 15 },
    { nome: "Vôlei", percentagem: 10 },
    { nome: "Natação", percentagem: 5 }
  ];

  // Dados recentes simulados
  const eventosRecentes = [
    { nome: "Torneio Regional de Futebol", data: "15/03", local: "Estádio Municipal" },
    { nome: "Campeonato de Basquete", data: "18/03", local: "Arena Desportiva" },
    { nome: "Corrida Beneficente", data: "20/03", local: "Parque Central" },
    { nome: "Torneio de Tênis", data: "25/03", local: "Clube Atlético" }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show content on screen when an menu item is selected
  const [select, setSelect] = useState('dashboard');
  // Componente do Sidebar para reutilização
  const SidebarContent = () => (
    <>
      <div className="p-4 flex items-center space-x-2">
        <Trophy size={24} className="text-green-500" />
        <h1 className="font-bold text-xl">QuadraAgenda</h1>
      </div>
      
      <nav className="mt-8 flex-1">
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Principal</div>
        <a href="#" onClick={()=>{setSelect('dashboard')}} className={`flex items-center px-4 py-3 ${select === 'dashboard' ? 'text-white bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-white transition-colors'}`}>
          <BarChart3 size={20} className="mr-3" />
          <span>Dashboard</span>
        </a>
        {userType === 'operator' ? 
      (  <a href="#"  onClick={()=>{setSelect('reservations')}} className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
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
        
        {userType === 'operator' || userType === 'administrator' ? (
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
                <Trophy size={20} className="text-green-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">QuadraAgenda</h2>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 hidden lg:block">Painel Administrativo</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-2 rounded-full">
                <Users size={20} className="text-gray-600" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        {select == 'dashboard' && (
        <main className="p-4 md:p-6 overflow-x-hidden">
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Bem-vindo ao Painel Administrativo</h1>
            <p className="text-gray-600">Visão geral da sua agenda desportiva</p>
          </div>
          
          {/* Estatísticas - Layout responsivo aprimorado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <p className="text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="bg-green-100 p-2 md:p-3 rounded-full">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-3 md:mt-4">
                    <span className="text-xs inline-flex items-center font-medium text-green-600">
                      <TrendingUp size={14} className="mr-1" />
                      {stat.percentagem}
                    </span>
                    <span className="text-xs ml-1 text-gray-500">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Gráficos e Tabelas - Layout responsivo aprimorado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Esportes Populares */}
            <Card className="lg:col-span-1">
              <CardHeader className="p-4 md:p-6">
                <CardTitle>Quadras Populares</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3 md:space-y-4">
                  {popularSports.map((sport, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{sport.nome}</span>
                        <span className="text-sm text-gray-500">{sport.percentagem}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${sport.percentagem}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Eventos Recentes - Com scroll interno quando necessário */}
            <Card className="lg:col-span-2">
              <CardHeader className="p-4 md:p-6">
                <CardTitle>Reservas Recentes</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="md:p-6 p-4 pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="pb-3 pr-2">Nome do Evento</th>
                          <th className="pb-3 px-2">Data</th>
                          <th className="pb-3 pl-2">Local</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {eventosRecentes.map((evento, index) => (
                          <tr key={index}>
                            <td className="py-3 pr-2 text-sm font-medium">{evento.nome}</td>
                            <td className="py-3 px-2 text-sm text-gray-500">{evento.data}</td>
                            <td className="py-3 pl-2 text-sm text-gray-500">{evento.local}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Status Mensal - Gráfico responsivo */}
          <Card className="mb-6 md:mb-8">
            <CardHeader className="p-4 md:p-6">
              <CardTitle>Visão Geral Mensal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="h-48 md:h-64 overflow-x-auto lg:overflow-x-hidden">
                <div className="flex items-end space-x-2 md:space-x-6 min-w-max lg:min-w-0 justify-center lg:justify-between w-full">
                  {[40, 65, 75, 50, 80, 60, 90, 70, 85, 55, 45, 70].map((height, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-green-500 rounded-t-md w-6 md:w-8" 
                        style={{ height: `${height * 0.4}vh` }}
                      ></div>
                      <span className="text-xs mt-2 text-gray-500">
                        {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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