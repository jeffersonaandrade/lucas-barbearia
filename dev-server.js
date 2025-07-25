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

// Dados mock
const users = [
  {
    id: '1',
    nome: 'Lucas Silva',
    email: 'admin@lucasbarbearia.com',
    role: 'admin',
    telefone: '(81) 99999-9999'
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
      id: '1',
      nome: 'Lucas Silva',
      email: 'admin@lucasbarbearia.com',
      role: 'admin'
    });
  } else {
    res.status(401).json({ message: 'Token inválido' });
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

app.get('/api/users', (req, res) => {
  res.json(users);
});

// Rotas de barbearias
app.get('/api/barbearias', (req, res) => {
  res.json(barbearias);
});

app.get('/api/barbearias/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const barbearia = barbearias.find(b => b.id === id);
  
  if (barbearia) {
    res.json(barbearia);
  } else {
    res.status(404).json({ message: 'Barbearia não encontrada' });
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
  
  // Gerar token único
  const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
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
    token,
    cliente: novoCliente
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

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Servidor de desenvolvimento funcionando!'
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
  console.log(`   GET  /api/health`);
}); 