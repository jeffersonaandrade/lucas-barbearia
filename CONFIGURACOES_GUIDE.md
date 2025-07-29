# 🛠️ Guia do Sistema de Configurações

## 📋 Visão Geral

O sistema de configurações permite que administradores gerenciem centralmente todos os aspectos de uma barbearia, incluindo serviços, horários de funcionamento e configurações gerais.

## 🚀 Como Acessar

1. Faça login como **administrador**
2. Acesse o dashboard admin
3. Clique no botão **"Configurações"**
4. Selecione a barbearia que deseja configurar

## 📁 Estrutura do Sistema

### 🔧 Hook Principal: `useConfiguracoes`

Localizado em: `src/hooks/useConfiguracoes.js`

**Funcionalidades:**
- Carregar todas as configurações de uma barbearia
- Gerenciar serviços (CRUD completo)
- Atualizar horários de funcionamento
- Modificar configurações gerais

**Uso:**
```javascript
const { 
  configuracoes, 
  loading, 
  error, 
  criarServico, 
  atualizarServico, 
  excluirServico,
  atualizarHorarios,
  atualizarConfiguracoesGerais
} = useConfiguracoes(barbeariaId);
```

### 🎯 Componente Principal: `AdminConfiguracoes`

Localizado em: `src/components/admin/AdminConfiguracoes.jsx`

**Características:**
- Interface com abas (Serviços, Horários, Gerais)
- Seletor de barbearia
- Notificações de sucesso/erro
- Layout responsivo

## 📊 Funcionalidades por Aba

### ✂️ Aba: Serviços

**Gerenciamento Completo:**
- ✅ Criar novos serviços
- ✅ Editar serviços existentes
- ✅ Excluir serviços
- ✅ Visualizar todos os serviços

**Campos do Serviço:**
- **Nome**: Nome do serviço
- **Categoria**: Corte, Barba, Combo, Tratamento
- **Preço**: Valor em reais
- **Duração**: Tempo em minutos
- **Descrição**: Descrição opcional

**Exemplo de Serviço:**
```json
{
  "id": 1,
  "nome": "Corte Degradê",
  "descricao": "Corte moderno com degradê",
  "preco": 35.00,
  "duracao": 45,
  "categoria": "corte",
  "ativo": true
}
```

### 🕐 Aba: Horários

**Funcionalidades:**
- ✅ Definir dias de funcionamento
- ✅ Configurar horários de abertura/fechamento
- ✅ Marcar dias como fechados
- ✅ Edição em tempo real

**Estrutura dos Horários:**
```json
{
  "dia_semana": 1,
  "aberto": true,
  "hora_inicio": "08:00",
  "hora_fim": "18:00"
}
```

**Dias da Semana:**
- 0: Domingo
- 1: Segunda-feira
- 2: Terça-feira
- 3: Quarta-feira
- 4: Quinta-feira
- 5: Sexta-feira
- 6: Sábado

### ⚙️ Aba: Configurações Gerais

**Configurações Disponíveis:**

1. **Tempo Médio de Atendimento**
   - Tipo: Número (minutos)
   - Descrição: Tempo médio para cada atendimento
   - Padrão: 30 minutos

2. **Máximo de Clientes na Fila**
   - Tipo: Número
   - Descrição: Limite máximo de clientes
   - Padrão: 20 clientes

3. **Permitir Agendamento**
   - Tipo: Boolean
   - Descrição: Habilitar sistema de agendamento
   - Padrão: true

## 🔌 Endpoints da API

### 📋 Serviços
```javascript
// Listar todos os serviços
GET /api/configuracoes/servicos

// Criar novo serviço
POST /api/configuracoes/servicos
{
  "nome": "Corte Degradê",
  "descricao": "Corte moderno com degradê",
  "preco": 35.00,
  "duracao": 45,
  "categoria": "corte"
}

// Atualizar serviço
PUT /api/configuracoes/servicos/:id
{
  "nome": "Corte Degradê Premium",
  "preco": 40.00
}

// Excluir serviço
DELETE /api/configuracoes/servicos/:id
```

### 🕐 Horários
```javascript
// Listar horários
GET /api/configuracoes/horarios/:barbearia_id

// Atualizar horários
PUT /api/configuracoes/horarios/:barbearia_id
{
  "horarios": [
    {
      "dia_semana": 1,
      "aberto": true,
      "hora_inicio": "08:00",
      "hora_fim": "18:00"
    }
  ]
}
```

### ⚙️ Configurações Gerais
```javascript
// Listar configurações
GET /api/configuracoes/gerais/:barbearia_id

// Atualizar configurações
PUT /api/configuracoes/gerais/:barbearia_id
{
  "tempo_medio_atendimento": {
    "valor": 30,
    "tipo": "number"
  },
  "max_clientes_fila": {
    "valor": 20,
    "tipo": "number"
  },
  "permitir_agendamento": {
    "valor": true,
    "tipo": "boolean"
  }
}
```

### 📊 Configuração Completa
```javascript
// Obter todas as configurações
GET /api/configuracoes/completa/:barbearia_id
```

## 🎨 Componentes UI Utilizados

### 📦 Componentes Principais
- `AdminConfiguracoes`: Componente principal
- `BarbeariaSelector`: Seletor de barbearia
- `GerenciarServicos`: Gerenciamento de serviços
- `GerenciarHorarios`: Gerenciamento de horários
- `ConfiguracoesGerais`: Configurações gerais

### 🎯 Componentes UI
- `Card`, `CardHeader`, `CardContent`, `CardTitle`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- `Button`, `Badge`, `Alert`, `AlertDescription`
- `LoadingSpinner`, `Notification`

### 🎨 Ícones (Lucide React)
- `Settings`, `Scissors`, `Clock`, `Plus`
- `Edit`, `Trash2`, `Save`, `X`
- `Building2`, `MapPin`, `Phone`, `Globe`

## 🔐 Autenticação e Permissões

### 👤 Roles Permitidos
- **admin**: Acesso completo a todas as funcionalidades
- **gerente**: Acesso limitado (futuro)
- **barbeiro**: Sem acesso

### 🔒 Proteção de Rotas
```javascript
<ProtectedRoute allowedRoles={['admin']}>
  <AdminConfiguracoes />
</ProtectedRoute>
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops

**Breakpoints utilizados:**
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `px-4 sm:px-6 lg:px-8`

## 🔄 Estados e Loading

### ⏳ Estados de Loading
- Carregamento inicial das configurações
- Salvamento de dados
- Exclusão de serviços

### ❌ Tratamento de Erros
- Erro de conexão com API
- Erro de validação de dados
- Erro de permissão

### ✅ Notificações
- Sucesso ao salvar
- Erro ao processar
- Confirmação de exclusão

## 🚀 Como Usar no Frontend

### 1. Importar o Hook
```javascript
import { useConfiguracoes } from '../hooks/useConfiguracoes';
```

### 2. Usar em um Componente
```javascript
const MeuComponente = () => {
  const barbeariaId = 1;
  const { configuracoes, loading, error } = useConfiguracoes(barbeariaId);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert>Erro: {error}</Alert>;

  return (
    <div>
      <h1>Serviços</h1>
      {configuracoes?.servicos?.map(servico => (
        <div key={servico.id}>
          <h2>{servico.nome}</h2>
          <p>R$ {servico.preco}</p>
        </div>
      ))}
    </div>
  );
};
```

### 3. Acessar Configurações Específicas
```javascript
// Serviços
const servicos = configuracoes?.servicos || [];

// Horários
const horarios = configuracoes?.horarios || [];

// Configurações gerais
const tempoMedio = configuracoes?.configuracoes?.tempo_medio_atendimento?.valor;
const maxClientes = configuracoes?.configuracoes?.max_clientes_fila?.valor;
const permitirAgendamento = configuracoes?.configuracoes?.permitir_agendamento?.valor;
```

## 🔧 Configuração de Desenvolvimento

### 📁 Estrutura de Arquivos
```
src/
├── hooks/
│   └── useConfiguracoes.js
├── components/
│   ├── admin/
│   │   ├── AdminConfiguracoes.jsx
│   │   ├── AdminConfiguracoesWrapper.jsx
│   │   └── BarbeariaSelector.jsx
│   └── ui/
│       ├── notification.jsx
│       ├── loading-spinner.jsx
│       └── ...
└── config/
    └── api.js
```

### 🌐 Variáveis de Ambiente
```env
VITE_API_URL=http://localhost:3000/api
```

## 🐛 Troubleshooting

### ❌ Erro: "API não está disponível"
- Verifique se o backend está rodando
- Confirme a URL da API em `src/config/api.js`
- Verifique as variáveis de ambiente

### ❌ Erro: "Acesso negado"
- Verifique se está logado como admin
- Confirme se o token de autenticação é válido
- Verifique as permissões do usuário

### ❌ Erro: "Dados inválidos"
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme o formato dos dados enviados
- Verifique a validação no backend

## 🔮 Próximas Funcionalidades

### 🎯 Roadmap
- [ ] Configurações por barbeiro individual
- [ ] Templates de configuração
- [ ] Backup/restore de configurações
- [ ] Histórico de alterações
- [ ] Configurações em lote
- [ ] Integração com calendário

### 🎨 Melhorias de UI
- [ ] Drag & drop para reordenar serviços
- [ ] Preview de horários em calendário
- [ ] Gráficos de utilização
- [ ] Modo escuro

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este guia
2. Consulte os logs do console
3. Teste os endpoints da API
4. Entre em contato com o time de desenvolvimento 