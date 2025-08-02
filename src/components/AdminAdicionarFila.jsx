import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { filaService, barbeariasService } from '@/services/api.js';
import { 
  UserPlus, 
  ArrowLeft, 
  Shield, 
  Users, 
  Building2, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminAdicionarFila = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clienteAdicionado, setClienteAdicionado] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    barbeariaId: '',
    barbeiroId: 'geral'
  });

  const [barbeariasDisponiveis, setBarbeariasDisponiveis] = useState([]);
  const [barbeirosDisponiveis, setBarbeirosDisponiveis] = useState([]);
  const [loadingBarbearias, setLoadingBarbearias] = useState(true);

  useEffect(() => {
    console.log('AdminAdicionarFila - Componente carregado');
    console.log('AdminAdicionarFila - User:', user);
    carregarBarbeariasDisponiveis();
  }, [user]);

  // Carregar barbeiros quando barbearia for selecionada
  useEffect(() => {
    if (formData.barbeariaId && barbeariasDisponiveis.length > 0) {
      console.log('🔄 useEffect: Carregando barbeiros para barbearia selecionada:', formData.barbeariaId);
      carregarBarbeirosDisponiveis(formData.barbeariaId);
    }
  }, [formData.barbeariaId, barbeariasDisponiveis]);

  const carregarBarbeariasDisponiveis = async () => {
    try {
      setLoadingBarbearias(true);
      setError('');
      
      console.log('🔄 Carregando barbearias disponíveis...');
      
      // Primeiro, carregar todas as barbearias
      const response = await barbeariasService.listarBarbearias();
      
      console.log('📊 Resposta do endpoint /barbearias:', response);
      
      if (response.success && response.data) {
        console.log('📋 Dados das barbearias:', response.data);
        
        // Verificar barbeiros ativos para cada barbearia
        const barbeariasComBarbeirosAtivos = [];
        
        for (const barbearia of response.data) {
          try {
            console.log(`🔍 Verificando barbeiros ativos para ${barbearia.nome} (ID: ${barbearia.id})`);
            
            // Buscar barbeiros ativos desta barbearia
            const barbeirosResponse = await barbeariasService.listarBarbeirosAtivos(barbearia.id);
            
            if (barbeirosResponse.success && barbeirosResponse.data && barbeirosResponse.data.barbeiros) {
              const barbeirosAtivos = barbeirosResponse.data.barbeiros;
              console.log(`✅ ${barbearia.nome}: ${barbeirosAtivos.length} barbeiro(s) ativo(s)`);
              
              if (barbeirosAtivos.length > 0) {
                // Adicionar barbearia com barbeiros ativos
                barbeariasComBarbeirosAtivos.push({
                  ...barbearia,
                  barbeiros_ativos: barbeirosAtivos.length,
                  barbeiros: barbeirosAtivos
                });
              } else {
                console.log(`⚠️ ${barbearia.nome}: Nenhum barbeiro ativo`);
              }
            } else {
              console.log(`⚠️ ${barbearia.nome}: Erro ao buscar barbeiros ativos`);
            }
          } catch (error) {
            console.error(`❌ Erro ao verificar barbeiros de ${barbearia.nome}:`, error);
          }
        }
        
        console.log('📋 Barbearias com barbeiros ativos:', barbeariasComBarbeirosAtivos);
        
        if (barbeariasComBarbeirosAtivos.length > 0) {
          setBarbeariasDisponiveis(barbeariasComBarbeirosAtivos);
          
          // Definir primeira barbearia como padrão
          if (!formData.barbeariaId) {
            const primeiraBarbearia = barbeariasComBarbeirosAtivos[0].id.toString();
            console.log('🎯 Definindo primeira barbearia como padrão:', primeiraBarbearia);
            setFormData(prev => ({ ...prev, barbeariaId: primeiraBarbearia }));
            // Carregar barbeiros da primeira barbearia
            await carregarBarbeirosDisponiveis(primeiraBarbearia);
          }
          
          console.log(`✅ ${barbeariasComBarbeirosAtivos.length} barbearia(s) com barbeiros ativos carregada(s)`);
        } else {
          setBarbeariasDisponiveis([]);
          setError('Nenhuma barbearia com barbeiros ativos encontrada. As barbearias podem estar fechadas ou sem barbeiros disponíveis no momento. Não é possível adicionar clientes à fila.');
        }
      } else {
        console.error('❌ Resposta sem sucesso:', response);
        setError('Erro ao carregar barbearias disponíveis');
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar barbearias disponíveis:', error);
      setError('Erro ao carregar barbearias disponíveis: ' + error.message);
    } finally {
      setLoadingBarbearias(false);
    }
  };

  const carregarBarbeirosDisponiveis = async (barbeariaId) => {
    if (!barbeariaId) return;
    
    try {
      console.log(`🔄 Carregando barbeiros para barbearia ${barbeariaId}...`);
      
      // Converter para número para comparação correta
      const barbeariaIdNum = parseInt(barbeariaId);
      console.log('🔢 ID da barbearia convertido:', barbeariaIdNum, 'tipo:', typeof barbeariaIdNum);
      
      // Encontrar a barbearia selecionada
      const barbeariaSelecionada = barbeariasDisponiveis.find(b => b.id === barbeariaIdNum);
      
      console.log('🎯 Barbearia selecionada:', barbeariaSelecionada);
      
      if (barbeariaSelecionada && barbeariaSelecionada.barbeiros) {
        console.log(`✅ ${barbeariaSelecionada.barbeiros.length} barbeiro(s) encontrado(s) para ${barbeariaSelecionada.nome}`);
        console.log('📋 Lista de barbeiros:', barbeariaSelecionada.barbeiros);
        setBarbeirosDisponiveis(barbeariaSelecionada.barbeiros);
      } else {
        console.log('⚠️ Nenhum barbeiro encontrado para esta barbearia');
        setBarbeirosDisponiveis([]);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar barbeiros:', error);
      setBarbeirosDisponiveis([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getRoleDisplay = (role) => {
    const roles = {
      admin: { label: 'Administrador', color: 'bg-red-100 text-red-800' },
      gerente: { label: 'Gerente', color: 'bg-blue-100 text-blue-800' },
      barbeiro: { label: 'Barbeiro', color: 'bg-green-100 text-green-800' }
    };
    return roles[role] || { label: role, color: 'bg-gray-100 text-gray-800' };
  };

  const handleAddToQueue = async () => {
    if (!formData.nome || !formData.telefone || !formData.barbeariaId) {
      setError('Por favor, preencha nome, telefone e selecione uma barbearia');
      return;
    }

    // Verificar se há barbeiros ativos na barbearia selecionada
    const barbeariaSelecionada = barbeariasDisponiveis.find(b => b.id === parseInt(formData.barbeariaId));
    if (!barbeariaSelecionada || !barbeariaSelecionada.barbeiros || barbeariaSelecionada.barbeiros.length === 0) {
      setError('Não é possível adicionar clientes à fila. Esta barbearia não possui barbeiros ativos no momento.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setClienteAdicionado(null);

    try {
      // Preparar dados para o endpoint /api/fila/entrar
      const dadosCliente = {
        nome: formData.nome,
        telefone: formData.telefone,
        barbearia_id: parseInt(formData.barbeariaId)
      };

      // Adicionar barbeiro_id apenas se não for fila geral
      if (formData.barbeiroId && formData.barbeiroId !== 'geral') {
        dadosCliente.barbeiro_id = formData.barbeiroId;
      }

      console.log('🔄 Adicionando cliente à fila:', dadosCliente);
      
      // Usar o endpoint correto conforme demanda
      const response = await filaService.entrarNaFila(dadosCliente);

      if (response.success) {
        const barbeariaNome = barbeariasDisponiveis.find(b => b.id === parseInt(formData.barbeariaId))?.nome || 'Barbearia selecionada';
        const barbeiroNome = formData.barbeiroId === 'geral' 
          ? 'Fila Geral' 
          : barbeirosDisponiveis.find(b => b.id === formData.barbeiroId)?.nome || 'Barbeiro selecionado';
        
        setSuccess('Cliente adicionado à fila com sucesso!');
        setClienteAdicionado({
          nome: formData.nome,
          telefone: formData.telefone,
          barbearia: barbeariaNome,
          barbeiro: barbeiroNome
        });
      
        // Limpar formulário
        setFormData({
          nome: '',
          telefone: '',
          barbeariaId: formData.barbeariaId, // Manter barbearia selecionada
          barbeiroId: 'geral' // Reset para fila geral
        });
      } else {
        setError('Erro ao adicionar cliente: ' + (response.message || 'Erro desconhecido'));
      }
      
    } catch (error) {
      console.error('❌ Erro ao adicionar cliente:', error);
      setError('Erro ao adicionar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimularClienteAleatorio = () => {
    const nomes = ['João Silva', 'Pedro Santos', 'Carlos Ferreira', 'Miguel Costa', 'Lucas Oliveira'];
    const telefones = ['(81) 99999-9999', '(21) 88888-8888', '(31) 77777-7777', '(41) 66666-6666', '(51) 55555-5555'];
    
    const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)];
    const telefoneAleatorio = telefones[Math.floor(Math.random() * telefones.length)];
    
    // Escolher aleatoriamente entre fila geral ou barbeiro específico
    const opcoesBarbeiro = ['geral', ...barbeirosDisponiveis.map(b => b.id)];
    const barbeiroAleatorio = opcoesBarbeiro[Math.floor(Math.random() * opcoesBarbeiro.length)];
    
    setFormData({
      ...formData,
      nome: nomeAleatorio,
      telefone: telefoneAleatorio,
      barbeiroId: barbeiroAleatorio
    });
  };

  const roleInfo = getRoleDisplay(user?.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Painel Administrativo
              </h1>
            </div>
            
            <div className="flex items-center">
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Confirmação de Cliente Adicionado */}
        {clienteAdicionado && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-1">
                <p className="font-medium">✅ Cliente adicionado com sucesso!</p>
                <p className="text-sm"><strong>Nome:</strong> {clienteAdicionado.nome}</p>
                <p className="text-sm"><strong>Telefone:</strong> {clienteAdicionado.telefone}</p>
                <p className="text-sm"><strong>Barbearia:</strong> {clienteAdicionado.barbearia}</p>
                <p className="text-sm"><strong>Barbeiro:</strong> {clienteAdicionado.barbeiro}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Adicionar Cliente à Fila
          </h2>
          <p className="text-gray-600">
            Adicione clientes às filas das barbearias de forma rápida e eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Dados do Cliente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-sm font-medium">
                      Nome do Cliente *
                    </Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Nome completo do cliente"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefone" className="text-sm font-medium">
                      Telefone *
                    </Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      placeholder="(81) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="barbearia" className="text-sm font-medium">
                      Barbearia *
                    </Label>
                    <Select 
                      value={formData.barbeariaId} 
                      onValueChange={async (value) => {
                        console.log('🔄 Barbearia selecionada:', value);
                        setFormData({...formData, barbeariaId: value, barbeiroId: 'geral'});
                        // Carregar barbeiros disponíveis na barbearia selecionada
                        await carregarBarbeirosDisponiveis(value);
                      }}
                      disabled={loadingBarbearias}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={
                          loadingBarbearias ? "Carregando barbearias..." : 
                          barbeariasDisponiveis.length === 0 ? "Nenhuma barbearia disponível" :
                          "Selecione uma barbearia"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {barbeariasDisponiveis.map(barbearia => (
                          <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{barbearia.nome}</span>
                              <Badge variant="secondary" className="ml-2">
                                {barbearia.barbeiros_ativos} ativo{barbearia.barbeiros_ativos > 1 ? 's' : ''}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="barbeiro" className="text-sm font-medium">
                      Barbeiro {barbeirosDisponiveis.length > 0 && `(${barbeirosDisponiveis.length} disponível${barbeirosDisponiveis.length > 1 ? 'eis' : 'el'})`}
                    </Label>
                    <Select 
                      value={formData.barbeiroId} 
                      onValueChange={(value) => setFormData({...formData, barbeiroId: value})}
                      disabled={!formData.barbeariaId}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={
                          !formData.barbeariaId ? "Selecione uma barbearia primeiro" : 
                          barbeirosDisponiveis.length === 0 ? "Nenhum barbeiro disponível" :
                          "Selecione um barbeiro"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geral">Fila Geral (qualquer barbeiro ativo)</SelectItem>
                        {barbeirosDisponiveis.map(barbeiro => {
                          console.log('🎨 Renderizando barbeiro:', barbeiro);
                          return (
                            <SelectItem key={barbeiro.id} value={barbeiro.id}>
                              {barbeiro.nome} {barbeiro.especialidade && `(${barbeiro.especialidade})`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {barbeariasDisponiveis.length === 0 && !loadingBarbearias && (
                      <p className="text-xs text-orange-600 mt-1">
                        ⚠️ Nenhuma barbearia com barbeiros ativos encontrada
                      </p>
                    )}
                    {formData.barbeariaId && barbeirosDisponiveis.length === 0 && !loadingBarbearias && (
                      <p className="text-xs text-red-600 mt-1">
                        🚫 Esta barbearia não possui barbeiros ativos no momento
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleAddToQueue}
                    disabled={loading || barbeariasDisponiveis.length === 0 || barbeirosDisponiveis.length === 0}
                    className="flex-1"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Adicionando...
                      </>
                    ) : barbeariasDisponiveis.length === 0 || barbeirosDisponiveis.length === 0 ? (
                      <>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Barbearia Fechada
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Adicionar à Fila
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSimularClienteAleatorio}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Cliente Aleatório</span>
                  </Button>
                </div>
                
                {/* Botão de teste temporário */}
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      console.log('=== TESTE DE DADOS ===');
                      console.log('Barbearias disponíveis:', barbeariasDisponiveis);
                      console.log('Barbeiros disponíveis:', barbeirosDisponiveis);
                      console.log('Barbearia selecionada:', formData.barbeariaId);
                      console.log('Barbeiro selecionado:', formData.barbeiroId);
                      
                      if (barbeariasDisponiveis.length > 0) {
                        const barbearia = barbeariasDisponiveis[0];
                        console.log('Primeira barbearia:', barbearia);
                        console.log('Barbeiros da primeira barbearia:', barbearia.barbeiros);
                      }
                    }}
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs"
                  >
                    🔧 Testar Dados (Console)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com informações */}
          <div className="space-y-6">
            {/* Informações do usuário */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informações do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{roleInfo.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estatísticas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Barbearias disponíveis:</span>
                  <Badge variant="secondary">{loadingBarbearias ? '...' : barbeariasDisponiveis.length}</Badge>
                </div>
                {formData.barbeariaId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Barbeiros ativos:</span>
                    <Badge variant="secondary">{barbeirosDisponiveis.length}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Dicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Preencha nome e telefone obrigatoriamente</p>
                  <p>• Selecione uma barbearia com barbeiros ativos</p>
                  <p>• Escolha "Fila Geral" ou um barbeiro específico</p>
                  <p>• Apenas barbearias com barbeiros ativos são mostradas</p>
                  <p>• Use "Cliente Aleatório" para testes rápidos</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAdicionarFila; 