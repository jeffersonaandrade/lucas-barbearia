const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('🔐 Middleware de autenticação:', {
    hasAuthHeader: !!authHeader,
    token: token ? token.substring(0, 20) + '...' : null,
    path: req.path
  });
  
  // Para desenvolvimento, aceitar qualquer token que:
  // 1. Comece com 'auth_' ou 'mock_token_'
  // 2. Seja um JWT válido (contém pontos)
  // 3. Seja um token de desenvolvimento
  if (token && (
    token.startsWith('auth_') || 
    token.startsWith('mock_token_') ||
    token.includes('.') || // JWT tokens contêm pontos
    token.length > 20 // Tokens reais são longos
  )) {
    console.log('✅ Token válido para desenvolvimento');
    next();
  } else {
    console.log('❌ Token inválido ou ausente');
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido ou expirado' 
    });
  }
};

// Dados mock
const users = [
  {
    id: '1',
    nome: 'Lucas Silva',
    email: 'admin@lucasbarbearia.com',
    role: 'admin',
    telefone: '(81) 99999-9999',
    ativo: true,
    created_at: '2025-07-29T01:50:28.857231+00:00',
    updated_at: '2025-07-29T02:06:29.649462+00:00'
  },
  {
    id: '2',
    nome: 'João Silva',
    email: 'joao@lucasbarbearia.com',
    role: 'barbeiro',
    telefone: '(81) 88888-8888',
    ativo: true,
    created_at: '2025-07-29T01:50:28.857231+00:00',
    updated_at: '2025-07-29T02:06:29.649462+00:00'
  },
  {
    id: '3',
    nome: 'Maria Santos',
    email: 'maria@lucasbarbearia.com',
    role: 'gerente',
    telefone: '(81) 77777-7777',
    ativo: true,
    created_at: '2025-07-29T01:50:28.857231+00:00',
    updated_at: '2025-07-29T02:06:29.649462+00:00'
  }
];

const barbearias = [];

// Dados mock da fila (vazio)
const filas = {};

// Clientes ativos (simulando banco de dados)
const clientesAtivos = new Map();

// Rotas de autenticação
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login tentativa:', { email, password });
  
  // Mock de autenticação
  if (email === 'admin@lucasbarbearia.com' && password === 'admin123') {
    const user = users.find(u => u.email === email);
    res.json({
      token: 'mock_token_' + Date.now(),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout realizado' });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    res.json({
      success: true,
      data: {
        user: {
          id: '1',
          nome: 'Lucas Silva',
          email: 'admin@lucasbarbearia.com',
          role: 'admin',
          telefone: null,
          created_at: '2025-07-29T01:50:28.857231+00:00',
          updated_at: '2025-07-29T02:06:29.649462+00:00',
          active: true
        }
      }
    });
  } else {
    res.status(401).json({ 
      success: false,
      message: 'Token inválido' 
    });
  }
});

// Rotas de usuários
app.post('/api/users', (req, res) => {
  const { nome, email, password, role, telefone } = req.body;
  
  console.log('👤 Criando usuário:', { nome, email, role, telefone });
  
  const newUser = {
    id: Date.now().toString(),
    nome,
    email,
    role,
    telefone,
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json(newUser);
});

app.get('/api/users', authenticateToken, (req, res) => {
  const { role, status } = req.query;
  
  let filteredUsers = users;
  
  // Filtrar por role se especificado
  if (role && role !== 'todos') {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }
  
  // Filtrar por status se especificado
  if (status) {
    filteredUsers = filteredUsers.filter(user => user.ativo === (status === 'ativo'));
  }
  
  res.json({
    success: true,
    data: {
      users: filteredUsers
    }
  });
});

app.post('/api/users', authenticateToken, (req, res) => {
  const { nome, email, password, role, telefone } = req.body;
  
  console.log('👤 Criando usuário:', { nome, email, role, telefone });
  
  // Verificar se email já existe
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email já cadastrado'
    });
  }
  
  const newUser = {
    id: Date.now().toString(),
    nome,
    email,
    role,
    telefone,
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    data: {
      user: newUser
    }
  });
});

app.put('/api/users/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const { nome, email, password, role, telefone } = req.body;
  
  console.log('👤 Atualizando usuário:', userId, { nome, email, role, telefone });
  
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }
  
  // Verificar se email já existe em outro usuário
  const existingUser = users.find(user => user.email === email && user.id !== userId);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email já cadastrado'
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    nome,
    email,
    role,
    telefone,
    updated_at: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: {
      user: users[userIndex]
    }
  });
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  
  console.log('👤 Removendo usuário:', userId);
  
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    });
  }
  
  users.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'Usuário removido com sucesso'
  });
});

// Endpoint para listar barbeiros (compatível com frontend)
app.get('/api/users/barbeiros', (req, res) => {
  const { status, public: isPublic, barbearia_id } = req.query;
  
  // Barbeiros mockados
  const barbeiros = [
    {
      id: 'barbeiro_1',
      nome: 'João Silva',
      email: 'joao@lucasbarbearia.com',
      telefone: '(81) 99999-9999',
      especialidade: 'Cortes modernos',
      disponivel: true,
      ativo: true,
      barbearia_id: 1,
      dias_trabalho: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
      horario_inicio: '09:00',
      horario_fim: '19:00',
      created_at: '2025-07-29T01:50:28.857231+00:00',
      updated_at: '2025-07-29T02:06:29.649462+00:00'
    },
    {
      id: 'barbeiro_2',
      nome: 'Pedro Santos',
      email: 'pedro@lucasbarbearia.com',
      telefone: '(11) 88888-8888',
      especialidade: 'Barba e acabamentos',
      disponivel: true,
      ativo: true,
      barbearia_id: 1,
      dias_trabalho: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
      horario_inicio: '10:00',
      horario_fim: '18:00',
      created_at: '2025-07-29T01:50:28.857231+00:00',
      updated_at: '2025-07-29T02:06:29.649462+00:00'
    },
    {
      id: 'fila_geral',
      nome: 'Fila Geral',
      email: null,
      telefone: null,
      especialidade: 'Qualquer barbeiro disponível',
      disponivel: true,
      ativo: true,
      barbearia_id: 1,
      dias_trabalho: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
      horario_inicio: '09:00',
      horario_fim: '19:00',
      created_at: '2025-07-29T01:50:28.857231+00:00',
      updated_at: '2025-07-29T02:06:29.649462+00:00'
    }
  ];
  
  // Filtrar por status se especificado
  let barbeirosFiltrados = barbeiros;
  if (status === 'ativo') {
    barbeirosFiltrados = barbeiros.filter(b => b.ativo);
  }
  
  // Filtrar por barbearia se especificado
  if (barbearia_id) {
    barbeirosFiltrados = barbeirosFiltrados.filter(b => b.barbearia_id == barbearia_id);
  }
  
  // Formatar para o formato que o frontend espera
  const barbeirosFormatados = barbeirosFiltrados.map(barbeiro => ({
    id: barbeiro.id,
    nome: barbeiro.nome,
    email: barbeiro.email,
    telefone: barbeiro.telefone,
    especialidades: [barbeiro.especialidade], // Converter para array
    status: barbeiro.ativo ? "ativo" : "inativo", // Converter para string
    barbearia_id: barbeiro.barbearia_id,
    created_at: barbeiro.created_at,
    updated_at: barbeiro.updated_at
  }));
  
  res.json({
    success: true,
    data: {
      barbeiros: barbeirosFormatados
    }
  });
});

// Rotas de barbearias
app.get('/api/barbearias', (req, res) => {
  // Formatar barbearias para o formato que o frontend espera
  const barbeariasFormatadas = barbearias.map(barbearia => ({
    id: barbearia.id,
    nome: barbearia.nome,
    endereco: barbearia.endereco,
    telefone: barbearia.telefone,
    horario_funcionamento: formatarHorarioFuncionamento(barbearia.horario),
    status: barbearia.ativo ? "aberta" : "fechada",
    created_at: barbearia.created_at,
    updated_at: barbearia.updated_at
  }));
  
  res.json({
    success: true,
    data: barbeariasFormatadas
  });
});

// Função auxiliar para formatar horário
function formatarHorarioFuncionamento(horario) {
  if (!horario) return "Horário não definido";
  
  const dias = Object.keys(horario);
  const horarios = dias.map(dia => `${dia}: ${horario[dia]}`);
  return horarios.join(" | ");
}

app.get('/api/barbearias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const barbearia = barbearias.find(b => b.id === id);
  
  if (barbearia) {
    // Formatar barbearia para o formato que o frontend espera
    const barbeariaFormatada = {
      id: barbearia.id,
      nome: barbearia.nome,
      endereco: barbearia.endereco,
      telefone: barbearia.telefone,
      horario_funcionamento: formatarHorarioFuncionamento(barbearia.horario),
      status: barbearia.ativo ? "aberta" : "fechada",
      created_at: barbearia.created_at,
      updated_at: barbearia.updated_at
    };
    
    res.json({
      success: true,
      data: barbeariaFormatada
    });
  } else {
    res.status(404).json({ 
      success: false,
      message: 'Barbearia não encontrada' 
    });
  }
});

app.post('/api/barbearias', (req, res) => {
  const { nome, endereco, telefone, whatsapp, instagram, horario, configuracoes, servicos } = req.body;
  
  const novaBarbearia = {
    id: barbearias.length + 1,
    nome,
    endereco,
    telefone,
    whatsapp,
    instagram,
    horario: horario || {
      segunda: "9h às 19h",
      terca: "9h às 19h",
      quarta: "9h às 19h",
      quinta: "9h às 19h",
      sexta: "9h às 19h",
      sabado: "9h às 18h",
      domingo: "Fechado"
    },
    configuracoes: configuracoes || {
      tempoMedioPorCliente: 15,
      maximoNaFila: 20,
      atualizacaoAutomatica: true,
      intervaloAtualizacao: 60000
    },
    servicos: servicos || [
      { nome: "Corte Masculino", preco: "R$ 35", duracao: "30 min" },
      { nome: "Barba", preco: "R$ 25", duracao: "20 min" },
      { nome: "Corte + Barba", preco: "R$ 50", duracao: "45 min" }
    ],
    ativo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  barbearias.push(novaBarbearia);
  
  // Inicializar fila vazia para a nova barbearia
  filas[novaBarbearia.id] = {
    fila: [],
    estatisticas: { total: 0, atendendo: 0, proximo: 0, aguardando: 0, tempoMedio: 0 }
  };
  
  console.log(`🏪 Barbearia ${nome} criada com ID ${novaBarbearia.id}`);
  
  res.status(201).json(novaBarbearia);
});

app.get('/api/barbearias/:id/barbeiros', (req, res) => {
  const id = parseInt(req.params.id);
  const barbearia = barbearias.find(b => b.id === id);
  
  if (!barbearia) {
    return res.status(404).json({ message: 'Barbearia não encontrada' });
  }
  
  // Retornar barbeiros mockados para a barbearia
  const barbeiros = [
    {
      id: 'barbeiro_1',
      nome: 'João Silva',
      especialidade: 'Cortes modernos',
      disponivel: true,
      ativo: true,
      dias_trabalho: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
      horario_inicio: '09:00',
      horario_fim: '19:00'
    },
    {
      id: 'barbeiro_2',
      nome: 'Pedro Santos',
      especialidade: 'Barba e acabamentos',
      disponivel: true,
      ativo: true,
      dias_trabalho: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
      horario_inicio: '10:00',
      horario_fim: '18:00'
    },
    {
      id: 'fila_geral',
      nome: 'Fila Geral',
      especialidade: 'Qualquer barbeiro disponível',
      disponivel: true,
      ativo: true,
      dias_trabalho: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
      horario_inicio: '09:00',
      horario_fim: '19:00'
    }
  ];
  
  res.json(barbeiros);
});

// Rotas de fila
app.get('/api/fila/:barbeariaId', (req, res) => {
  const barbeariaId = parseInt(req.params.barbeariaId);
  
  if (!filas[barbeariaId]) {
    return res.status(404).json({ message: 'Barbearia não encontrada' });
  }
  
  res.json(filas[barbeariaId]);
});

app.post('/api/fila/entrar', (req, res) => {
  const { nome, telefone, barbearia_id, barbeiro_id } = req.body;
  
  if (!filas[barbearia_id]) {
    return res.status(404).json({ message: 'Barbearia não encontrada' });
  }
  
  // Gerar token único (formato do backend)
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Gerar nova posição
  const novaPosicao = filas[barbearia_id].fila.length + 1;
  const tempoEstimado = novaPosicao * 15; // 15 min por pessoa
  
  const novoCliente = {
    id: Date.now(),
    nome,
    telefone,
    token,
    posicao: novaPosicao,
    status: 'aguardando',
    barbeiro: barbeiro_id ? 'Barbeiro Específico' : 'Fila Geral',
    tempo_estimado: tempoEstimado,
    data_entrada: new Date().toISOString()
  };
  
  // Adicionar à fila
  filas[barbearia_id].fila.push(novoCliente);
  
  // Atualizar estatísticas
  filas[barbearia_id].estatisticas.total = filas[barbearia_id].fila.length;
  filas[barbearia_id].estatisticas.aguardando = filas[barbearia_id].fila.filter(c => c.status === 'aguardando').length;
  
  // Salvar cliente ativo
  clientesAtivos.set(token, { ...novoCliente, barbeariaId: barbearia_id });
  
  console.log(`👤 Cliente ${nome} entrou na fila da barbearia ${barbearia_id}, posição ${novaPosicao}`);
  
  res.status(201).json({
    success: true,
    data: {
      token: token,
      posicao: novaPosicao,
      tempo_estimado: `${tempoEstimado} minutos`,
      cliente: {
        id: novoCliente.id,
        nome: novoCliente.nome,
        telefone: novoCliente.telefone,
        barbeiro: novoCliente.barbeiro,
        entrada: novoCliente.data_entrada
      }
    }
  });
});

app.get('/api/fila/:barbeariaId/status/:token', (req, res) => {
  const barbeariaId = parseInt(req.params.barbeariaId);
  const { token } = req.params;
  
  const cliente = clientesAtivos.get(token);
  
  if (!cliente || cliente.barbeariaId !== barbeariaId) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  
  // Buscar dados atualizados da fila
  const filaAtual = filas[barbeariaId];
  const clienteAtualizado = filaAtual.fila.find(c => c.token === token);
  
  if (!clienteAtualizado) {
    return res.status(404).json({ message: 'Cliente não está mais na fila' });
  }
  
  res.json(clienteAtualizado);
});

app.delete('/api/fila/:barbeariaId/sair/:token', (req, res) => {
  const barbeariaId = parseInt(req.params.barbeariaId);
  const { token } = req.params;
  
  const fila = filas[barbeariaId];
  if (!fila) {
    return res.status(404).json({ message: 'Barbearia não encontrada' });
  }
  
  const index = fila.fila.findIndex(c => c.token === token);
  if (index === -1) {
    return res.status(404).json({ message: 'Cliente não encontrado na fila' });
  }
  
  // Remover da fila
  fila.fila.splice(index, 1);
  
  // Reordenar posições
  fila.fila.forEach((cliente, i) => {
    cliente.posicao = i + 1;
  });
  
  // Atualizar estatísticas
  fila.estatisticas.total = fila.fila.length;
  fila.estatisticas.aguardando = fila.fila.filter(c => c.status === 'aguardando').length;
  
  // Remover cliente ativo
  clientesAtivos.delete(token);
  
  console.log(`👋 Cliente saiu da fila da barbearia ${barbeariaId}`);
  
  res.json({ message: 'Cliente removido da fila com sucesso' });
});

// Remover cliente da fila (BARBEIRO)
app.post('/api/fila/remover/:clienteId', (req, res) => {
  const clienteId = req.params.clienteId;
  
  console.log(`🔧 Removendo cliente ${clienteId} via endpoint /fila/remover`);
  
  // Procurar o cliente em todas as filas
  let clienteEncontrado = false;
  
  for (const barbeariaId in filas) {
    const fila = filas[barbeariaId];
    const index = fila.fila.findIndex(c => c.id.toString() === clienteId || c.id === parseInt(clienteId));
    
    if (index !== -1) {
      // Remover da fila
      fila.fila.splice(index, 1);
      
      // Reordenar posições
      fila.fila.forEach((cliente, i) => {
        cliente.posicao = i + 1;
      });
      
      // Atualizar estatísticas
      fila.estatisticas.total = fila.fila.length;
      fila.estatisticas.aguardando = fila.fila.filter(c => c.status === 'aguardando').length;
      
      clienteEncontrado = true;
      console.log(`✅ Cliente ${clienteId} removido da barbearia ${barbeariaId}`);
      break;
    }
  }
  
  if (!clienteEncontrado) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  
  res.json({ message: 'Cliente removido da fila com sucesso' });
});

// Remover cliente da fila (ADMIN)
app.post('/api/fila/admin/remover/:clienteId', (req, res) => {
  const clienteId = req.params.clienteId;
  
  console.log(`👑 Admin removendo cliente ${clienteId} via endpoint /fila/admin/remover`);
  
  // Procurar o cliente em todas as filas
  let clienteEncontrado = false;
  
  for (const barbeariaId in filas) {
    const fila = filas[barbeariaId];
    const index = fila.fila.findIndex(c => c.id.toString() === clienteId || c.id === parseInt(clienteId));
    
    if (index !== -1) {
      // Remover da fila
      fila.fila.splice(index, 1);
      
      // Reordenar posições
      fila.fila.forEach((cliente, i) => {
        cliente.posicao = i + 1;
      });
      
      // Atualizar estatísticas
      fila.estatisticas.total = fila.fila.length;
      fila.estatisticas.aguardando = fila.fila.filter(c => c.status === 'aguardando').length;
      
      clienteEncontrado = true;
      console.log(`✅ Admin removeu cliente ${clienteId} da barbearia ${barbeariaId}`);
      break;
    }
  }
  
  if (!clienteEncontrado) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  
  res.json({ message: 'Cliente removido da fila com sucesso' });
});

// Endpoint específico para estatísticas da fila
app.get('/api/fila/:barbeariaId/estatisticas', (req, res) => {
  const barbeariaId = parseInt(req.params.barbeariaId);
  
  if (!filas[barbeariaId]) {
    return res.status(404).json({ message: 'Barbearia não encontrada' });
  }
  
  const fila = filas[barbeariaId];
  const clientes = fila.fila || [];
  
  // Buscar barbeiros da barbearia
  const barbeiros = getBarbeirosBarbearia(barbeariaId);
  const barbeirosAtendendo = barbeiros.filter(b => b.disponivel && b.ativo).length;
  
  // Calcular estatísticas em tempo real
  const estatisticas = {
    // Estatísticas da fila atual
    total: clientes.length,
    aguardando: clientes.filter(c => c.status === 'aguardando').length,
    atendendo: clientes.filter(c => c.status === 'em_atendimento' || c.status === 'atendendo').length,
    proximo: clientes.filter(c => c.status === 'próximo' || c.status === 'proximo').length,
    finalizado: clientes.filter(c => c.status === 'finalizado' || c.status === 'concluido').length,
    
    // Estatísticas de barbeiros
    barbeirosTotal: barbeiros.length,
    barbeirosAtendendo: barbeirosAtendendo,
    barbeirosDisponiveis: barbeiros.filter(b => b.disponivel && b.ativo).length,
    
    // Tempos
    tempoMedioEspera: calcularTempoMedioEspera(clientes),
    tempoMedioAtendimento: calcularTempoMedioAtendimento(clientes),
    tempoEstimadoProximo: calcularTempoEstimadoProximo(clientes),
    
    // Estatísticas das últimas 24h
    ultimas24h: calcularEstatisticas24h(barbeariaId),
    
    // Informações gerais
    barbeariaId: barbeariaId,
    timestamp: new Date().toISOString()
  };
  
  console.log(`📊 Estatísticas da barbearia ${barbeariaId}:`, estatisticas);
  
  res.json(estatisticas);
});

// Função para calcular tempo médio de espera
function calcularTempoMedio(clientes) {
  const clientesAguardando = clientes.filter(c => c.status === 'aguardando');
  if (clientesAguardando.length === 0) return 0;
  
  const agora = new Date();
  const temposEspera = clientesAguardando.map(cliente => {
    const entrada = new Date(cliente.data_entrada || cliente.created_at);
    return Math.floor((agora - entrada) / (1000 * 60)); // em minutos
  });
  
  const tempoMedio = temposEspera.reduce((acc, tempo) => acc + tempo, 0) / temposEspera.length;
  return Math.round(tempoMedio);
}

// Função para calcular tempo estimado para o próximo cliente
function calcularTempoEstimadoProximo(clientes) {
  const proximoCliente = clientes.find(c => c.status === 'aguardando');
  if (!proximoCliente) return 0;
  
  const agora = new Date();
  const entrada = new Date(proximoCliente.data_entrada || proximoCliente.created_at);
  const tempoEspera = Math.floor((agora - entrada) / (1000 * 60));
  
  return tempoEspera + 15; // 15 min para o atendimento
}

// Endpoint para inicializar dados de teste
app.post('/api/test/init-data', (req, res) => {
  // Criar uma barbearia de teste se não existir
  if (barbearias.length === 0) {
    const barbeariaTeste = {
      id: 1,
      nome: "Barbearia Teste",
      endereco: "Rua Teste, 123",
      telefone: "(81) 99999-9999",
      email: "teste@barbearia.com",
      horario: {
        segunda: { aberto: true, inicio: "09:00", fim: "18:00" },
        terca: { aberto: true, inicio: "09:00", fim: "18:00" },
        quarta: { aberto: true, inicio: "09:00", fim: "18:00" },
        quinta: { aberto: true, inicio: "09:00", fim: "18:00" },
        sexta: { aberto: true, inicio: "09:00", fim: "18:00" },
        sabado: { aberto: true, inicio: "08:00", fim: "17:00" },
        domingo: { aberto: false, inicio: "", fim: "" }
      },
      servicos: [
        { nome: "Corte Masculino", preco: "R$ 35", duracao: "30 min" },
        { nome: "Barba", preco: "R$ 25", duracao: "20 min" },
        { nome: "Corte + Barba", preco: "R$ 50", duracao: "45 min" }
      ],
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    barbearias.push(barbeariaTeste);
    
    // Inicializar fila com dados de teste
    filas[barbeariaTeste.id] = {
      fila: [
        {
          id: 1,
          nome: "João Silva",
          telefone: "(11) 99999-0001",
          token: "token_teste_1",
          posicao: 1,
          status: "aguardando",
          barbeiro: "Fila Geral",
          tempo_estimado: 15,
          data_entrada: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 min atrás
        },
        {
          id: 2,
          nome: "Pedro Santos",
          telefone: "(11) 99999-0002",
          token: "token_teste_2",
          posicao: 2,
          status: "aguardando",
          barbeiro: "Fila Geral",
          tempo_estimado: 30,
          data_entrada: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 min atrás
        },
        {
          id: 3,
          nome: "Carlos Oliveira",
          telefone: "(11) 99999-0003",
          token: "token_teste_3",
          posicao: 3,
          status: "em_atendimento",
          barbeiro: "João Silva",
          tempo_estimado: 45,
          data_entrada: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 min atrás
        }
      ],
      estatisticas: { total: 3, atendendo: 1, proximo: 0, aguardando: 2, tempoMedio: 30 }
    };
    
    console.log("✅ Dados de teste inicializados!");
  }
  
  res.json({ 
    message: 'Dados de teste inicializados com sucesso!',
    barbearias: barbearias.length,
    filas: Object.keys(filas).length
  });
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Servidor de desenvolvimento funcionando!'
  });
});

// Rota para listar serviços
app.get('/api/configuracoes/servicos', authenticateToken, (req, res) => {
  console.log('🔧 DEV-SERVER: Listando serviços');
  
  // Dados mock de serviços
  const servicos = [
    {
      id: 1,
      barbearia_id: 1,
      nome: "Corte Masculino",
      descricao: "Corte tradicional masculino com acabamento profissional",
      preco: 35.00,
      duracao_estimada: 30,
      categoria: "corte",
      ativo: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      barbearia_id: 1,
      nome: "Barba",
      descricao: "Acabamento de barba com navalha e produtos premium",
      preco: 25.00,
      duracao_estimada: 20,
      categoria: "barba",
      ativo: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      barbearia_id: 1,
      nome: "Corte + Barba",
      descricao: "Combo completo com desconto especial",
      preco: 50.00,
      duracao_estimada: 45,
      categoria: "combo",
      ativo: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      barbearia_id: 1,
      nome: "Sobrancelha",
      descricao: "Design e modelagem de sobrancelhas",
      preco: 15.00,
      duracao_estimada: 15,
      categoria: "estetica",
      ativo: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  ];
  
  res.json({
    success: true,
    data: servicos
  });
});

// Endpoint de histórico - REMOVIDO MOCK
app.get('/api/historico', (req, res) => {
  console.log('🚫 DEV-SERVER: Endpoint /api/historico BLOQUEADO - Use backend real');
  res.status(404).json({
    success: false,
    error: 'Use backend real - endpoint não disponível no dev-server'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   POST /api/auth/logout`);
  console.log(`   GET  /api/auth/me`);
  console.log(`   POST /api/users`);
  console.log(`   GET  /api/users`);
  console.log(`   GET  /api/barbearias`);
  console.log(`   POST /api/barbearias`);
  console.log(`   GET  /api/barbearias/:id`);
  console.log(`   GET  /api/barbearias/:id/barbeiros`);
  console.log(`   GET  /api/fila/:barbeariaId`);
  console.log(`   POST /api/fila/entrar`);
  console.log(`   GET  /api/fila/:barbeariaId/status/:token`);
  console.log(`   DELETE /api/fila/:barbeariaId/sair/:token`);
  console.log(`   POST /api/fila/remover/:clienteId`);
  console.log(`   POST /api/fila/admin/remover/:clienteId`);
  console.log(`   GET  /api/fila/:barbeariaId/estatisticas`);
  console.log(`   GET  /api/configuracoes/servicos`);
  console.log(`   GET  /api/historico`);
  console.log(`   POST /api/test/init-data`);
  console.log(`   GET  /api/health`);
}); 