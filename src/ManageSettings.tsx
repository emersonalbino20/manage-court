import React, { useState, useEffect } from 'react';
import { MapPin, Edit, Trash2, Save, Layers, PlusCircle, CheckCircle2, Building, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  usePostCourt,
  usePutCourt
} from '@/api/courtQuery';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FeedbackDialog from './_components/FeedbackDialog'; // Ajuste o caminho conforme necessário
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemeCourt } from './utils/validateForm.tsx';

const ManageSettings = () => {

  const formCourt = useForm({
    resolver: zodResolver(schemeCourt),
    defaultValues: {
      nome: "",
    },
  });

  // Estados para controlar o diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const { mutateCourt:  mutate , loadCourt: isLoading } = usePostCourt();

  // Função modificada para prevenir explicitamente o comportamento padrão
  function onSubmit(data: any, event) {
    // Previne explicitamente o comportamento padrão
    if (event) {
      event.preventDefault();
    }
    
    // Chama a mutação, mas não permite que o formulário seja enviado tradicionalmente
    mutateCourt(data, {
      onSuccess: (response) => {
        console.log("Quadra cadastrada com sucesso!", response);
        setIsSuccess(true);
        setFeedbackMessage("Sua quadra foi criada com sucesso!.");
        setDialogOpen(true);
        formCourt.reset();
      },
      onError: (error) => {
        console.error("Erro ao cadastrar quadra:", error);
        setIsSuccess(false);
        setFeedbackMessage("Não foi possível criar quadra. Verifique seus dados e tente novamente.");
        setDialogOpen(true);
      }
    });
    
    // Retorna false para garantir que não haja recarregamento
    return false;
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Estado para controlar qual tab está ativa
  const [activeTab, setActiveTab] = useState('tipos');

  // Estados para os dados
  const [tiposCampo, setTiposCampo] = useState([
    { id: 1, nome: 'Futebol' },
    { id: 2, nome: 'Basquete' },
    { id: 3, nome: 'Vôlei' },
    { id: 4, nome: 'Tênis' },
    { id: 5, nome: 'Futsal' }
  ]);

  const [provincias, setProvincias] = useState([
    { id: 1, nome: 'Luanda' },
    { id: 2, nome: 'Bengo' },
    { id: 3, nome: 'Benguela' },
  ]);

  const [cidades, setCidades] = useState([
    { id: 1, fk_provincia: 1, nome: 'Luanda' },
    { id: 2, fk_provincia: 1, nome: 'Cacuaco' },
    { id: 3, fk_provincia: 2, nome: 'Caxito' },
    { id: 4, fk_provincia: 3, nome: 'Benguela' },
    { id: 5, fk_provincia: 3, nome: 'Lobito' },
  ]);

  // Estados para formulários
  const [novoTipoCampo, setNovoTipoCampo] = useState('');
  const [novaProvincia, setNovaProvincia] = useState('');
  const [novaCidade, setNovaCidade] = useState({ nome: '', fk_provincia: '' });

  // Estados para edição
  const [editandoTipo, setEditandoTipo] = useState(null);
  const [editandoProvincia, setEditandoProvincia] = useState(null);
  const [editandoCidade, setEditandoCidade] = useState(null);

  // Estados para diálogos de confirmação
  const [dialogoConfirmacao, setDialogoConfirmacao] = useState({
    aberto: false,
    tipo: '',
    id: null,
    mensagem: ''
  });

  // Estados para seleção
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [provinciaSelecionada, setProvinciaSelecionada] = useState('');
  const [cidadeSelecionada, setCidadeSelecionada] = useState('');

  // Funções para tipos de campo
  const adicionarTipoCampo = () => {
    if (!novoTipoCampo.trim()) return;

    if (editandoTipo) {
      // Atualizar tipo existente
      setTiposCampo(tiposCampo.map(tipo => 
        tipo.id === editandoTipo.id ? { ...tipo, nome: novoTipoCampo } : tipo
      ));
      setEditandoTipo(null);
    } else {
      // Adicionar novo tipo
      const novoId = tiposCampo.length > 0 ? Math.max(...tiposCampo.map(t => t.id)) + 1 : 1;
      setTiposCampo([...tiposCampo, { id: novoId, nome: novoTipoCampo }]);
    }
    setNovoTipoCampo('');
    setTipoSelecionado('');
  };

  const editarTipoCampo = (tipo) => {
    setNovoTipoCampo(tipo.nome);
    setEditandoTipo(tipo);
    setTipoSelecionado('');
  };

  const excluirTipoCampo = (id) => {
    setDialogoConfirmacao({
      aberto: true,
      tipo: 'tipo',
      id: id,
      mensagem: 'Tem certeza que deseja excluir este tipo de campo?'
    });
  };

  // Funções para províncias
  const adicionarProvincia = () => {
    if (!novaProvincia.trim()) return;

    if (editandoProvincia) {
      // Atualizar província existente
      setProvincias(provincias.map(prov => 
        prov.id === editandoProvincia.id ? { ...prov, nome: novaProvincia } : prov
      ));
      setEditandoProvincia(null);
    } else {
      // Adicionar nova província
      const novoId = provincias.length > 0 ? Math.max(...provincias.map(p => p.id)) + 1 : 1;
      setProvincias([...provincias, { id: novoId, nome: novaProvincia }]);
    }
    setNovaProvincia('');
    setProvinciaSelecionada('');
  };

  const editarProvincia = (provincia) => {
    setNovaProvincia(provincia.nome);
    setEditandoProvincia(provincia);
    setProvinciaSelecionada('');
  };

  const excluirProvincia = (id) => {
    // Verificar se existem cidades associadas a esta província
    const cidadesAssociadas = cidades.filter(cidade => cidade.fk_provincia === id);
    
    if (cidadesAssociadas.length > 0) {
      setDialogoConfirmacao({
        aberto: true,
        tipo: 'provinciaComCidades',
        id: id,
        mensagem: `Esta província possui ${cidadesAssociadas.length} cidade(s) associada(s). Excluir a província também excluirá todas as cidades associadas. Deseja continuar?`
      });
    } else {
      setDialogoConfirmacao({
        aberto: true,
        tipo: 'provincia',
        id: id,
        mensagem: 'Tem certeza que deseja excluir esta província?'
      });
    }
  };

  // Funções para cidades
  const adicionarCidade = () => {
    if (!novaCidade.nome.trim() || !novaCidade.fk_provincia) return;

    if (editandoCidade) {
      // Atualizar cidade existente
      setCidades(cidades.map(cidade => 
        cidade.id === editandoCidade.id ? { ...cidade, nome: novaCidade.nome, fk_provincia: parseInt(novaCidade.fk_provincia) } : cidade
      ));
      setEditandoCidade(null);
    } else {
      // Adicionar nova cidade
      const novoId = cidades.length > 0 ? Math.max(...cidades.map(c => c.id)) + 1 : 1;
      setCidades([...cidades, { id: novoId, nome: novaCidade.nome, fk_provincia: parseInt(novaCidade.fk_provincia) }]);
    }
    setNovaCidade({ nome: '', fk_provincia: '' });
    setCidadeSelecionada('');
  };

  const editarCidade = (cidade) => {
    setNovaCidade({ nome: cidade.nome, fk_provincia: cidade.fk_provincia.toString() });
    setEditandoCidade(cidade);
    setCidadeSelecionada('');
  };

  const excluirCidade = (id) => {
    setDialogoConfirmacao({
      aberto: true,
      tipo: 'cidade',
      id: id,
      mensagem: 'Tem certeza que deseja excluir esta cidade?'
    });
  };

  // Função para confirmar exclusão
  const confirmarExclusao = () => {
    const { tipo, id } = dialogoConfirmacao;
    
    if (tipo === 'tipo') {
      setTiposCampo(tiposCampo.filter(t => t.id !== id));
    } else if (tipo === 'provincia' || tipo === 'provinciaComCidades') {
      setProvincias(provincias.filter(p => p.id !== id));
      
      if (tipo === 'provinciaComCidades') {
        // Excluir também as cidades associadas
        setCidades(cidades.filter(c => c.fk_provincia !== id));
      }
    } else if (tipo === 'cidade') {
      setCidades(cidades.filter(c => c.id !== id));
    }
    
    fecharDialogoConfirmacao();
  };

  const fecharDialogoConfirmacao = () => {
    setDialogoConfirmacao({ aberto: false, tipo: '', id: null, mensagem: '' });
  };

  // Efeitos para carregar item selecionado para edição
  useEffect(() => {
    if (tipoSelecionado) {
      const tipo = tiposCampo.find(t => t.id === parseInt(tipoSelecionado));
      if (tipo) {
        setNovoTipoCampo(tipo.nome);
        setEditandoTipo(tipo);
      }
    }
  }, [tipoSelecionado]);

  useEffect(() => {
    if (provinciaSelecionada) {
      const provincia = provincias.find(p => p.id === parseInt(provinciaSelecionada));
      if (provincia) {
        setNovaProvincia(provincia.nome);
        setEditandoProvincia(provincia);
      }
    }
  }, [provinciaSelecionada]);

  useEffect(() => {
    if (cidadeSelecionada) {
      const cidade = cidades.find(c => c.id === parseInt(cidadeSelecionada));
      if (cidade) {
        setNovaCidade({
          nome: cidade.nome,
          fk_provincia: cidade.fk_provincia.toString()
        });
        setEditandoCidade(cidade);
      }
    }
  }, [cidadeSelecionada]);

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <Layers className="mr-2" /> Configurações Modular
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
          Tipos de Campo
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeTab === 'provincias'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('provincias')}
        >
          Províncias
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${
            activeTab === 'cidades'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('cidades')}
        >
          Cidades
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'tipos' && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center">
              <Layers size={18} className="mr-2" /> Gerenciar Tipos de Campo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Cadastro */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {editandoTipo ? 'Editar Tipo de Campo' : 'Novo Tipo de Campo'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="tipo-campo">Nome do Tipo</Label>
                      <Input
                        id="tipo-campo"
                        value={novoTipoCampo}
                        onChange={(e) => setNovoTipoCampo(e.target.value)}
                        placeholder="Ex: Basquete"
                      />
                    </div>
                    <Button 
                      onClick={adicionarTipoCampo}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} className="mr-1" />
                      {editandoTipo ? 'Atualizar' : 'Salvar'}
                    </Button>
                  </div>

                  {/* Seleção para edição rápida */}
                  <div>
                    <Label htmlFor="tipo-select">Editar Existente</Label>
                    <Select 
                      value={tipoSelecionado} 
                      onValueChange={setTipoSelecionado}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposCampo.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {tipo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Lista de Tipos de Campo */}
              <div>
                <h3 className="text-lg font-medium mb-4">Tipos Cadastrados</h3>
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                  {tiposCampo.length > 0 ? (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Nome</th>
                          <th className="text-right pb-2 text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {tiposCampo.map((tipo) => (
                          <tr key={tipo.id}>
                            <td className="py-2">{tipo.nome}</td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => editarTipoCampo(tipo)}
                                className="text-blue-600 hover:text-blue-800 mr-2"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => excluirTipoCampo(tipo.id)}
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
                      Nenhum tipo de campo cadastrado
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'provincias' && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center">
              <Building size={18} className="mr-2" /> Gerenciar Províncias
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Cadastro */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {editandoProvincia ? 'Editar Província' : 'Nova Província'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="provincia">Nome da Província</Label>
                      <Input
                        id="provincia"
                        value={novaProvincia}
                        onChange={(e) => setNovaProvincia(e.target.value)}
                        placeholder="Ex: Luanda"
                      />
                    </div>
                    <Button 
                      onClick={adicionarProvincia}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} className="mr-1" />
                      {editandoProvincia ? 'Atualizar' : 'Salvar'}
                    </Button>
                  </div>

                  {/* Seleção para edição rápida */}
                  <div>
                    <Label htmlFor="provincia-select">Editar Existente</Label>
                    <Select 
                      value={provinciaSelecionada} 
                      onValueChange={setProvinciaSelecionada}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma província" />
                      </SelectTrigger>
                      <SelectContent>
                        {provincias.map((provincia) => (
                          <SelectItem key={provincia.id} value={provincia.id.toString()}>
                            {provincia.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Lista de Províncias */}
              <div>
                <h3 className="text-lg font-medium mb-4">Províncias Cadastradas</h3>
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                  {provincias.length > 0 ? (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Nome</th>
                          <th className="text-right pb-2 text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {provincias.map((provincia) => (
                          <tr key={provincia.id}>
                            <td className="py-2">{provincia.nome}</td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => editarProvincia(provincia)}
                                className="text-blue-600 hover:text-blue-800 mr-2"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => excluirProvincia(provincia.id)}
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
                      Nenhuma província cadastrada
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'cidades' && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center">
              <Home size={18} className="mr-2" /> Gerenciar Cidades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulário de Cadastro */}
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {editandoCidade ? 'Editar Cidade' : 'Nova Cidade'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cidade-provincia">Província</Label>
                    <Select 
                      value={novaCidade.fk_provincia} 
                      onValueChange={(value) => setNovaCidade({...novaCidade, fk_provincia: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma província" />
                      </SelectTrigger>
                      <SelectContent>
                        {provincias.map((provincia) => (
                          <SelectItem key={provincia.id} value={provincia.id.toString()}>
                            {provincia.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!novaCidade.fk_provincia && (
                      <p className="text-xs text-amber-600 mt-1">
                        É necessário selecionar uma província primeiro
                      </p>
                    )}
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="cidade-nome">Nome da Cidade</Label>
                      <Input
                        id="cidade-nome"
                        value={novaCidade.nome}
                        onChange={(e) => setNovaCidade({...novaCidade, nome: e.target.value})}
                        placeholder="Ex: Luanda"
                        disabled={!novaCidade.fk_provincia}
                      />
                    </div>
                    <Button 
                      onClick={adicionarCidade}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!novaCidade.fk_provincia || !novaCidade.nome.trim()}
                    >
                      <Save size={16} className="mr-1" />
                      {editandoCidade ? 'Atualizar' : 'Salvar'}
                    </Button>
                  </div>

                  {/* Seleção para edição rápida */}
                  <div>
                    <Label htmlFor="cidade-select">Editar Existente</Label>
                    <Select 
                      value={cidadeSelecionada} 
                      onValueChange={setCidadeSelecionada}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma cidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {cidades.map((cidade) => {
                          const provincia = provincias.find(p => p.id === cidade.fk_provincia);
                          return (
                            <SelectItem key={cidade.id} value={cidade.id.toString()}>
                              {cidade.nome} ({provincia ? provincia.nome : 'Província desconhecida'})
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Lista de Cidades */}
              <div>
                <h3 className="text-lg font-medium mb-4">Cidades Cadastradas</h3>
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                  {cidades.length > 0 ? (
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Nome</th>
                          <th className="text-left pb-2 text-xs font-medium text-gray-500 uppercase">Província</th>
                          <th className="text-right pb-2 text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cidades.map((cidade) => {
                          const provincia = provincias.find(p => p.id === cidade.fk_provincia);
                          return (
                            <tr key={cidade.id}>
                              <td className="py-2">{cidade.nome}</td>
                              <td className="py-2">{provincia ? provincia.nome : 'Desconhecida'}</td>
                              <td className="py-2 text-right">
                                <button
                                  onClick={() => editarCidade(cidade)}
                                  className="text-blue-600 hover:text-blue-800 mr-2"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => excluirCidade(cidade.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nenhuma cidade cadastrada
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de Confirmação */}
      <Dialog open={dialogoConfirmacao.aberto} onOpenChange={fecharDialogoConfirmacao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">{dialogoConfirmacao.mensagem}</div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={fecharDialogoConfirmacao}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={confirmarExclusao}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSettings;