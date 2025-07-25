import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { useAuthBackend } from '@/hooks/useAuthBackend.js';
import { filaService, barbeariasService, usuariosService } from '@/services/api.js';
import { 
  UserPlus, 
  ArrowLeft, 
  Shield, 
  Users, 
  Building2, 
  Clock,
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';

const AdminAdicionarFila = () => {
  const { user, logout } = useAuthBackend();
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

  const [barbearias, setBarbearias] = useState([]);
  const [barbeariasComBarbeiros, setBarbeariasComBarbeiros] = useState([]);
  const [barbeirosDisponiveis, setBarbeirosDisponiveis] = useState([]);
  const [loadingBarbearias, setLoadingBarbearias] = useState(true);
  const [loadingBarbeiros, setLoadingBarbeiros] = useState(false);

  useEffect(() => {
    console.log('AdminAdicionarFila - Componente carregado');
    console.log('AdminAdicionarFila - User:', user);
    carregarDados();
  }, [user]);

  const carregarDados = async () => {
    try {
      setLoadingBarbearias(true);
      
      // Carregar barbearias
      const barbeariasResponse = await barbeariasService.listarBarbearias();
      if (barbeariasResponse.success && barbeariasResponse.data) {
        setBarbearias(barbeariasResponse.data);
        
        // Filtrar barbearias que têm barbeiros ativos
        const barbeariasComBarbeirosAtivos = [];
        
        for (const barbearia of barbeariasResponse.data) {
          try {
            console.log(`🔍 Verificando barbeiros ativos na barbearia ${barbearia.nome} (ID: ${barbearia.id})...`);
            const barbeirosResponse = await usuariosService.listarBarbeirosAtivos(barbearia.id);
            
            if (barbeirosResponse.success && barbeirosResponse.data && barbeirosResponse.data.length > 0) {
              console.log(`✅ Barbearia ${barbearia.nome} tem ${barbeirosResponse.data.length} barbeiro(s) ativo(s)`);
              barbeariasComBarbeirosAtivos.push(barbearia);
            } else {
              console.log(`❌ Barbearia ${barbearia.nome} não tem barbeiros ativos`);
            }
          } catch (error) {
            console.warn(`⚠️ Erro ao verificar barbeiros da barbearia ${barbearia.nome}:`, error);
            // Se não conseguir verificar, não incluir na lista
          }
        }
        
        console.log(`📊 Barbearias com barbeiros ativos: ${barbeariasComBarbeirosAtivos.length} de ${barbeariasResponse.data.length}`);
        setBarbeariasComBarbeiros(barbeariasComBarbeirosAtivos);
        
        // Definir primeira barbearia com barbeiros como padrão
        if (barbeariasComBarbeirosAtivos.length > 0 && !formData.barbeariaId) {
          const primeiraBarbearia = barbeariasComBarbeirosAtivos[0].id.toString();
          setFormData(prev => ({ ...prev, barbeariaId: primeiraBarbearia }));
          // Carregar barbeiros da primeira barbearia
          await carregarBarbeirosDisponiveis(primeiraBarbearia);
        } else if (barbeariasComBarbeirosAtivos.length === 0) {
          setError('Nenhuma barbearia com barbeiros ativos encontrada');
        }
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados das barbearias');
    } finally {
      setLoadingBarbearias(false);
    }
  };

  const carregarBarbeirosDisponiveis = async (barbeariaId) => {
    if (!barbeariaId) return;
    
    try {
      setLoadingBarbeiros(true);
      
      console.log(`Carregando barbeiros ativos para barbearia ${barbeariaId}...`);
      
      // Tentar primeiro o novo endpoint
      try {
        console.log(`🔍 Tentando endpoint /users/barbeiros/ativos para barbearia ${barbeariaId}...`);
        const response = await usuariosService.listarBarbeirosAtivos(parseInt(barbeariaId));
        console.log('📋 Resposta do endpoint /users/barbeiros/ativos:', response);
        
        if (response.success && response.data) {
          console.log(`✅ Barbeiros ativos encontrados: ${response.data.length}`);
          console.log('📊 Estrutura dos dados:', response.data);
          setBarbeirosDisponiveis(response.data);
          return;
        } else {
          console.log('⚠️ Resposta sem sucesso ou sem dados:', response);
        }
      } catch (error) {
        console.warn('❌ Erro no endpoint /users/barbeiros/ativos, tentando fallback:', error);
      }
      
      // Fallback para o endpoint anterior
      console.log('Tentando endpoint fallback /users/barbeiros/disponiveis...');
      const fallbackResponse = await usuariosService.listarBarbeirosDisponiveis(parseInt(barbeariaId));
      console.log('Resposta do endpoint fallback:', fallbackResponse);
      
      if (fallbackResponse.success && fallbackResponse.data) {
        // Filtrar apenas barbeiros ativos manualmente
        const barbeirosAtivos = fallbackResponse.data.filter(barbeiro => {
          const isAtivo = barbeiro.barbearias && 
            barbeiro.barbearias.some(b => b.barbearia_id === parseInt(barbeariaId) && b.ativo === true);
          console.log(`Barbeiro ${barbeiro.nome}: ativo = ${isAtivo}`);
          return isAtivo;
        });
        
        console.log(`Barbeiros ativos encontrados (fallback): ${barbeirosAtivos.length}`);
        setBarbeirosDisponiveis(barbeirosAtivos);
      } else {
        console.log('Nenhum barbeiro encontrado em ambos os endpoints');
        setBarbeirosDisponiveis([]);
      }
      
    } catch (error) {
      console.warn('Erro ao carregar barbeiros ativos (ambos endpoints falharam):', error);
      setBarbeirosDisponiveis([]);
    } finally {
      setLoadingBarbeiros(false);
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

    setLoading(true);
    setError('');
    setSuccess('');
    setClienteAdicionado(null);

    try {
      // Adicionar cliente à fila usando o endpoint correto
      const dadosCliente = {
        nome: formData.nome,
        telefone: formData.telefone
      };

      // Adicionar barbeiro se selecionado
      if (formData.barbeiroId && formData.barbeiroId !== 'geral') {
        dadosCliente.barbeiro_id = formData.barbeiroId; // Manter como string (UUID)
      }

      console.log('Adicionando cliente:', dadosCliente);
      
      const response = await filaService.entrarNaFila(parseInt(formData.barbeariaId), dadosCliente);

      if (response.success) {
        const barbeiroNome = formData.barbeiroId === 'geral' 
          ? 'Fila Geral' 
          : barbeirosDisponiveis.find(b => b.id === parseInt(formData.barbeiroId))?.nome || 'Barbeiro selecionado';
        
        setSuccess('Cliente adicionado à fila com sucesso!');
        setClienteAdicionado({
          nome: formData.nome,
          telefone: formData.telefone,
          barbearia: barbearias.find(b => b.id === parseInt(formData.barbeariaId))?.nome || 'Barbearia selecionada',
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
      console.error('Erro ao adicionar cliente:', error);
      setError('Erro ao adicionar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSimularClienteAleatorio = () => {
    const nomes = ['João Silva', 'Pedro Santos', 'Carlos Ferreira', 'Miguel Costa', 'Lucas Oliveira'];
    const telefones = ['(11) 99999-9999', '(21) 88888-8888', '(31) 77777-7777', '(41) 66666-6666', '(51) 55555-5555'];
    
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

  // Função temporária para testar o endpoint
  const testarEndpoint = async () => {
    console.log('=== TESTE DO ENDPOINT ===');
    console.log('Barbearia atual selecionada:', formData.barbeariaId);
    console.log('Barbearias disponíveis:', barbearias);
    console.log('Role do usuário:', user?.role);
    
    // Teste 1: Endpoint novo
    console.log('\n🔍 TESTE 1: Endpoint /users/barbeiros/ativos');
    try {
      const response = await usuariosService.listarBarbeirosAtivos(parseInt(formData.barbeariaId));
      console.log('✅ Endpoint funcionando:', response);
    } catch (error) {
      console.log('❌ Endpoint com erro:', error.message);
    }
    
    // Teste 2: Endpoint anterior
    console.log('\n🔍 TESTE 2: Endpoint /users/barbeiros/disponiveis');
    try {
      const response = await usuariosService.listarBarbeirosDisponiveis(parseInt(formData.barbeariaId));
      console.log('✅ Endpoint funcionando:', response);
      if (response.success && response.data) {
        console.log('Barbeiros encontrados:', response.data.length);
        console.log('Estrutura:', response.data[0]);
      }
    } catch (error) {
      console.log('❌ Endpoint com erro:', error.message);
    }
    
    // Teste 3: Listar todos os barbeiros
    console.log('\n🔍 TESTE 3: Endpoint /users/barbeiros (todos)');
    try {
      const response = await usuariosService.listarBarbeiros();
      console.log('✅ Endpoint funcionando:', response);
      if (response.success && response.data) {
        console.log('Total de barbeiros:', response.data.length);
        // Filtrar barbeiros ativos na barbearia 6
        const ativosNaBarbearia = response.data.filter(barbeiro => 
          barbeiro.barbearias?.some(b => b.barbearia_id === 6 && b.ativo === true)
        );
        console.log('Barbeiros ativos na barbearia 6:', ativosNaBarbearia.length);
      }
    } catch (error) {
      console.log('❌ Endpoint com erro:', error.message);
    }
  };

  // Função temporária para testar endpoint de fila
  const testarEndpointFila = async () => {
    console.log('=== TESTE DO ENDPOINT DE FILA ===');
    console.log('Barbearia atual selecionada:', formData.barbeariaId);
    
    const dadosTeste = {
      nome: 'Cliente Teste',
      telefone: '(11) 99999-9999'
    };
    
    // Adicionar barbeiro se selecionado
    if (formData.barbeiroId && formData.barbeiroId !== 'geral') {
      dadosTeste.barbeiro_id = formData.barbeiroId;
    }
    
    console.log('Dados de teste:', dadosTeste);
    
    try {
      const response = await filaService.entrarNaFila(parseInt(formData.barbeariaId), dadosTeste);
      console.log('✅ Endpoint de fila funcionando:', response);
    } catch (error) {
      console.log('❌ Endpoint de fila com erro:', error);
      console.log('Detalhes do erro:', {
        message: error.message,
        stack: error.stack
      });
    }
  };

  const handleCopiarToken = async (token) => {
    try {
      await navigator.clipboard.writeText(token);
      setSuccess('Token copiado para a área de transferência!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Erro ao copiar token:', error);
      setError('Erro ao copiar token');
    }
  };

  const getBarbeirosByBarbearia = (barbeariaId) => {
    if (!barbeariaId || !barbeiros.length) return [];
    
    return barbeiros.filter(barbeiro => {
      // Verificar se o barbeiro está ativo na barbearia específica
      const barbeariaAtiva = barbeiro.barbearias?.find(b => 
        b.barbearia_id === parseInt(barbeariaId) && b.ativo === true
      );
      return barbeariaAtiva;
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
                        setFormData({...formData, barbeariaId: value, barbeiroId: 'geral'});
                        // Carregar barbeiros disponíveis na barbearia selecionada
                        await carregarBarbeirosDisponiveis(value);
                      }}
                      disabled={loadingBarbearias}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={
                          loadingBarbearias ? "Verificando barbearias..." : 
                          barbeariasComBarbeiros.length === 0 ? "Nenhuma barbearia disponível" :
                          "Selecione uma barbearia"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {barbeariasComBarbeiros.map(barbearia => (
                          <SelectItem key={barbearia.id} value={barbearia.id.toString()}>
                            {barbearia.nome} ✅
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="barbeiro" className="text-sm font-medium">
                      Barbeiro {barbeirosDisponiveis.length > 0 && `(${barbeirosDisponiveis.length} ativo${barbeirosDisponiveis.length > 1 ? 's' : ''})`}
                    </Label>
                    <Select 
                      value={formData.barbeiroId} 
                      onValueChange={(value) => setFormData({...formData, barbeiroId: value})}
                      disabled={loadingBarbeiros || !formData.barbeariaId}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={
                          loadingBarbeiros ? "Carregando barbeiros ativos..." : 
                          barbeirosDisponiveis.length === 0 ? "Nenhum barbeiro ativo" :
                          "Selecione um barbeiro ativo"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geral">Fila Geral (qualquer barbeiro ativo)</SelectItem>
                        {barbeirosDisponiveis.map(barbeiro => (
                          <SelectItem key={barbeiro.id} value={barbeiro.id}>
                            {barbeiro.nome} ✅ Ativo
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {barbeariasComBarbeiros.length === 0 && !loadingBarbearias && (
                      <p className="text-xs text-orange-600 mt-1">
                        ⚠️ Nenhuma barbearia com barbeiros ativos encontrada
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={handleAddToQueue}
                    disabled={loading}
                    className="flex-1"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Adicionando...
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
                
                {/* Botões temporários para teste */}
                <div className="pt-2 space-y-2">
                  <Button
                    onClick={testarEndpoint}
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs"
                  >
                    🔧 Testar Endpoint /users/barbeiros/ativos
                  </Button>
                  
                  <Button
                    onClick={testarEndpointFila}
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs"
                  >
                    🔧 Testar Endpoint /fila/entrar
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
                  <span className="text-sm text-muted-foreground">Barbearias com barbeiros:</span>
                  <Badge variant="secondary">{loadingBarbearias ? '...' : barbeariasComBarbeiros.length}</Badge>
                </div>
                {(user?.role === 'admin' || user?.role === 'gerente') && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Barbeiros cadastrados:</span>
                    <Badge variant="secondary">{loadingBarbearias ? '...' : barbeiros.length}</Badge>
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
                  <p>• Selecione uma barbearia específica</p>
                  <p>• Escolha "Fila Geral" ou um barbeiro ativo específico</p>
                  <p>• Apenas barbeiros ativos são mostrados</p>
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