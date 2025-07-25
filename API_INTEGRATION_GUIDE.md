# Guia de Integração da API - Lucas Barbearia

## Visão Geral

Este guia explica como integrar o frontend React com o backend Fastify + Supabase. O sistema foi projetado para funcionar tanto com a API real quanto com localStorage como fallback.

---

## Estrutura de Arquivos

### Novos Arquivos Criados

```
src/
├── services/
│   └── api.js                    # Serviço principal da API
├── hooks/
│   ├── useFilaAPI.js            # Hook que usa apenas API
│   ├── useAuthAPI.js            # Hook de auth que usa API
│   └── useFilaHybrid.js         # Hook híbrido (API + localStorage)
├── config/
│   └── api.js                   # Configurações da API
└── utils/
    └── migration.js             # Utilitário de migração
```

### Arquivos Existentes (Mantidos)

```
src/
├── services/
│   └── filaDataService.js       # Serviço localStorage (fallback)
├── hooks/
│   ├── useFila.js              # Hook localStorage (fallback)
│   └── useAuth.js              # Hook auth localStorage (fallback)
└── data/
    ├── barbearias.json         # Dados padrão das barbearias
    └── fila.json               # Dados padrão da fila
```

---

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL da API (desenvolvimento)
VITE_API_URL=http://localhost:3000/api

# URL da API (produção)
# VITE_API_URL=https://api.lucasbarbearia.com/api

# Configurações do Supabase (se necessário)
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 2. Configuração do Backend

Certifique-se de que o backend Fastify está rodando na porta 3000 e implementa os endpoints especificados no `BACKEND_README.md`.

---

## Como Usar

### 1. Hook Híbrido (Recomendado)

O hook `useFilaHybrid` é a opção mais segura, pois funciona com ou sem API:

```jsx
import { useFilaHybrid } from '@/hooks/useFilaHybrid.js';

function MeuComponente() {
  const {
    fila,
    clienteAtual,
    loading,
    error,
    barbeiros,
    estatisticas,
    barbeariaInfo,
    entrarNaFila,
    sairDaFila,
    // Funcionalidades extras
    useAPI,
    apiAvailable,
    toggleMode,
    forceAPI,
    forceLocalStorage,
    debug
  } = useFilaHybrid(1); // barbeariaId = 1

  // O hook automaticamente detecta se a API está disponível
  // e usa o modo apropriado

  return (
    <div>
      <p>Modo atual: {debug.currentMode}</p>
      <p>API disponível: {apiAvailable ? 'Sim' : 'Não'}</p>
      
      {/* Resto do seu componente */}
    </div>
  );
}
```

### 2. Hook API Puro

Para usar apenas a API (sem fallback):

```jsx
import { useFilaAPI } from '@/hooks/useFilaAPI.js';

function MeuComponente() {
  const {
    fila,
    clienteAtual,
    loading,
    error,
    // ... outras propriedades
  } = useFilaAPI(1);

  // Este hook só funciona se a API estiver disponível
  // Caso contrário, lançará erros
}
```

### 3. Hook localStorage Puro

Para usar apenas localStorage (sem API):

```jsx
import { useFila } from '@/hooks/useFila.js';

function MeuComponente() {
  const {
    fila,
    clienteAtual,
    loading,
    error,
    // ... outras propriedades
  } = useFila(1);

  // Este hook sempre funciona, mas não sincroniza com o backend
}
```

---

## Migração de Dados

### 1. Migração Automática

O sistema pode migrar automaticamente os dados do localStorage para o backend:

```jsx
import { migrationService } from '@/utils/migration.js';

// Executar migração
const success = await migrationService.executeMigration();

if (success) {
  console.log('Migração concluída!');
} else {
  console.log('Erro na migração');
}
```

### 2. Verificação de Integridade

```jsx
// Verificar se a migração foi bem-sucedida
const integrity = await migrationService.verifyMigrationIntegrity();

if (integrity) {
  console.log('Dados migrados corretamente');
} else {
  console.log('Problemas na migração detectados');
}
```

### 3. Rollback

Se necessário, você pode reverter a migração:

```jsx
// Remover dados do backend
await migrationService.rollbackMigration();
```

---

## Serviços da API

### 1. Autenticação

```jsx
import { authService } from '@/services/api.js';

// Login
const response = await authService.login(email, password);

// Logout
await authService.logout();

// Verificar usuário atual
const user = await authService.getCurrentUser();
```

### 2. Barbearias

```jsx
import { barbeariasService } from '@/services/api.js';

// Listar barbearias
const barbearias = await barbeariasService.listarBarbearias();

// Obter barbearia específica
const barbearia = await barbeariasService.obterBarbearia(1);

// Criar barbearia (admin)
await barbeariasService.criarBarbearia(dadosBarbearia);

// Atualizar barbearia (admin)
await barbeariasService.atualizarBarbearia(1, dadosBarbearia);

// Listar barbeiros
const barbeiros = await barbeariasService.listarBarbeiros(1);
```

### 3. Fila

```jsx
import { filaService } from '@/services/api.js';

// Cliente entra na fila
const response = await filaService.entrarNaFila(1, dadosCliente);

// Obter fila atual
const fila = await filaService.obterFila(1);

// Obter status do cliente
const cliente = await filaService.obterStatusCliente(1, token);

// Cliente sai da fila
await filaService.sairDaFila(1, token);

// Chamar próximo cliente (admin/barbeiro)
await filaService.chamarProximo(1);

// Finalizar atendimento (admin/barbeiro)
await filaService.finalizarAtendimento(1, clienteId);
```

### 4. Avaliações

```jsx
import { avaliacoesService } from '@/services/api.js';

// Enviar avaliação
await avaliacoesService.enviarAvaliacao(dadosAvaliacao);

// Listar avaliações
const avaliacoes = await avaliacoesService.listarAvaliacoes(filtros);
```

### 5. Histórico

```jsx
import { historicoService } from '@/services/api.js';

// Obter histórico
const historico = await historicoService.obterHistorico(1, filtros);

// Obter relatórios
const relatorios = await historicoService.obterRelatorios(1, filtros);
```

---

## Tratamento de Erros

### 1. Erros de Rede

```jsx
try {
  const data = await filaService.obterFila(1);
} catch (error) {
  if (error.message.includes('Network')) {
    console.log('Erro de conexão - usando localStorage');
    // Fallback para localStorage
  } else {
    console.error('Erro da API:', error);
  }
}
```

### 2. Erros de Autenticação

```jsx
try {
  const user = await authService.getCurrentUser();
} catch (error) {
  if (error.message.includes('401')) {
    // Token expirado - redirecionar para login
    window.location.href = '/login';
  }
}
```

---

## Configurações Avançadas

### 1. Timeout Personalizado

```jsx
import { API_CONFIG } from '@/config/api.js';

// Alterar timeout
API_CONFIG.TIMEOUT = 15000; // 15 segundos
```

### 2. Logs Detalhados

```jsx
import { DEV_CONFIG } from '@/config/api.js';

// Ativar logs detalhados
DEV_CONFIG.VERBOSE_LOGS = true;
DEV_CONFIG.DEBUG.API_CALLS = true;
```

### 3. Retry Automático

```jsx
import { API_CONFIG } from '@/config/api.js';

// Configurar retry
API_CONFIG.RETRY_ATTEMPTS = 5;
API_CONFIG.RETRY_DELAY = 2000;
```

---

## Exemplos de Uso

### 1. Componente de Login

```jsx
import { useAuthAPI } from '@/hooks/useAuthAPI.js';

function LoginForm() {
  const { login, loading, error } = useAuthAPI();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      // Redirecionar após login
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### 2. Componente de Fila

```jsx
import { useFilaHybrid } from '@/hooks/useFilaHybrid.js';

function FilaComponent() {
  const {
    fila,
    clienteAtual,
    loading,
    error,
    entrarNaFila,
    sairDaFila,
    useAPI,
    apiAvailable
  } = useFilaHybrid(1);

  const handleEntrarNaFila = async (dados) => {
    try {
      await entrarNaFila(dados);
      alert('Entrou na fila com sucesso!');
    } catch (error) {
      alert('Erro ao entrar na fila');
    }
  };

  return (
    <div>
      <div className="status">
        <p>Modo: {useAPI ? 'API' : 'localStorage'}</p>
        <p>API: {apiAvailable ? 'Disponível' : 'Indisponível'}</p>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}

      <div className="fila">
        {fila.map(cliente => (
          <div key={cliente.id}>
            <p>{cliente.nome} - Posição: {cliente.posicao}</p>
          </div>
        ))}
      </div>

      {clienteAtual && (
        <div className="cliente-atual">
          <p>Você está na posição {clienteAtual.posicao}</p>
          <button onClick={() => sairDaFila(clienteAtual.token)}>
            Sair da Fila
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Troubleshooting

### 1. API não está disponível

- Verifique se o backend está rodando
- Confirme a URL da API no `.env`
- Verifique se não há problemas de CORS

### 2. Erros de autenticação

- Verifique se o token JWT está sendo enviado corretamente
- Confirme se o token não expirou
- Verifique as permissões do usuário

### 3. Dados não sincronizam

- Verifique se a migração foi executada
- Confirme se os endpoints estão retornando dados corretos
- Verifique os logs do console para erros

### 4. Performance lenta

- Ajuste o intervalo de atualização da fila
- Configure timeouts apropriados
- Use cache quando possível

---

## Próximos Passos

1. **Implementar o backend** seguindo o `BACKEND_README.md`
2. **Configurar o Supabase** com as tabelas necessárias
3. **Testar a integração** usando o hook híbrido
4. **Migrar dados** do localStorage para o backend
5. **Configurar produção** com URLs apropriadas

---

## Suporte

Para dúvidas ou problemas:

1. Verifique os logs do console
2. Confirme a configuração da API
3. Teste com o hook híbrido primeiro
4. Consulte o `BACKEND_README.md` para detalhes do backend 