# Guia Backend Only - Lucas Barbearia

## 🎯 Visão Geral

Este guia explica como usar o sistema Lucas Barbearia **apenas com backend** (Supabase), sem dependência do localStorage. O sistema agora usa sessionStorage para dados temporários da sessão.

---

## 📁 Arquivos Principais

### Hooks Backend Only
- `src/hooks/useFilaBackend.js` - Hook da fila que usa apenas API
- `src/hooks/useAuthBackend.js` - Hook de autenticação que usa apenas API

### Componentes
- `src/components/ApiStatus.jsx` - Componente de status da API
- `src/components/EntrarFila.jsx` - Atualizado para usar backend only

### Utilitários
- `src/utils/cleanup.js` - Limpeza de localStorage e migração para sessionStorage

---

## 🚀 Como Usar

### 1. Configuração Inicial

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar .env
VITE_API_URL=http://localhost:3000/api
```

### 2. Limpeza do localStorage (Opcional)

```jsx
import { cleanupService } from '@/utils/cleanup.js';

// Migrar dados importantes e limpar localStorage
await cleanupService.executeCleanup();
```

### 3. Hook da Fila (Backend Only)

```jsx
import { useFilaBackend } from '@/hooks/useFilaBackend.js';

function MeuComponente() {
  const {
    fila,
    clienteAtual,
    loading,
    error,
    barbeiros,
    estatisticas,
    barbeariaInfo,
    apiStatus, // 'checking', 'available', 'unavailable'
    entrarNaFila,
    sairDaFila,
    verificarStatusAPI
  } = useFilaBackend(1); // barbeariaId = 1

  // O hook só funciona se a API estiver disponível
  if (apiStatus === 'unavailable') {
    return <div>Servidor indisponível</div>;
  }
}
```

### 4. Hook de Autenticação (Backend Only)

```jsx
import { useAuthBackend } from '@/hooks/useAuthBackend.js';

function LoginComponent() {
  const {
    user,
    loading,
    apiStatus,
    login,
    logout,
    isAuthenticated,
    verificarStatusAPI
  } = useAuthBackend();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Redirecionar após login
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };
}
```

---

## 🔄 Diferenças do Sistema Anterior

### ❌ Removido (localStorage)
- Dados persistentes da fila
- Dados das barbearias
- Cache local
- Funcionamento offline

### ✅ Mantido (sessionStorage)
- Token de autenticação (sessão)
- Dados temporários do cliente
- Estado da sessão atual

### 🆕 Novo (Backend)
- Todos os dados vêm do Supabase
- Sincronização em tempo real
- Dados persistentes no servidor
- Multi-usuário real

---

## 📊 Estados da API

### `apiStatus` - Estados possíveis:

1. **`'checking'`** - Verificando conexão com o servidor
2. **`'available'`** - Servidor disponível e funcionando
3. **`'unavailable'`** - Servidor indisponível

### Exemplo de uso:

```jsx
function StatusComponent({ apiStatus, onRetry }) {
  switch (apiStatus) {
    case 'checking':
      return <div>Verificando conexão...</div>;
    
    case 'available':
      return <div>Conectado ao servidor</div>;
    
    case 'unavailable':
      return (
        <div>
          <p>Servidor indisponível</p>
          <button onClick={onRetry}>Tentar novamente</button>
        </div>
      );
    
    default:
      return null;
  }
}
```

---

## 🛠️ Componente ApiStatus

O componente `ApiStatus` fornece uma interface visual para o status da API:

```jsx
import ApiStatus from '@/components/ApiStatus.jsx';

function MeuComponente() {
  const { apiStatus, verificarStatusAPI } = useFilaBackend(1);

  return (
    <div>
      <ApiStatus 
        status={apiStatus} 
        onRetry={verificarStatusAPI}
      />
      
      {/* Resto do componente */}
    </div>
  );
}
```

### Estados visuais:
- 🟢 **Verde**: Conectado ao servidor
- 🟡 **Amarelo**: Verificando conexão
- 🔴 **Vermelho**: Servidor indisponível (com botão de retry)

---

## 🔧 Configuração Avançada

### 1. Timeout Personalizado

```jsx
import { API_CONFIG } from '@/config/api.js';

// Aumentar timeout para conexões lentas
API_CONFIG.TIMEOUT = 15000; // 15 segundos
```

### 2. Logs Detalhados

```jsx
import { DEV_CONFIG } from '@/config/api.js';

// Ativar logs para debug
DEV_CONFIG.VERBOSE_LOGS = true;
DEV_CONFIG.DEBUG.API_CALLS = true;
```

### 3. Verificar Dados dos Storages

```jsx
import { checkStorageData } from '@/utils/cleanup.js';

// Verificar o que está armazenado
const data = checkStorageData();
console.log('localStorage:', data.localStorage);
console.log('sessionStorage:', data.sessionStorage);
```

---

## 🐛 Troubleshooting

### 1. Servidor não disponível

**Sintomas:**
- `apiStatus === 'unavailable'`
- Erros de conexão no console

**Soluções:**
- Verificar se o backend está rodando
- Confirmar URL no `.env`
- Verificar CORS no backend
- Testar conectividade de rede

### 2. Erros de autenticação

**Sintomas:**
- Token inválido
- Redirecionamento para login

**Soluções:**
- Verificar se o token não expirou
- Confirmar permissões no Supabase
- Limpar sessionStorage e fazer login novamente

### 3. Dados não carregam

**Sintomas:**
- Loading infinito
- Dados vazios

**Soluções:**
- Verificar logs do console
- Confirmar endpoints no backend
- Verificar permissões do usuário

---

## 📈 Benefícios do Backend Only

### Para o Desenvolvedor
- ✅ Dados centralizados no Supabase
- ✅ Sincronização automática
- ✅ Multi-usuário real
- ✅ Backup automático
- ✅ Analytics e relatórios

### Para o Usuário
- ✅ Dados sempre atualizados
- ✅ Funciona em qualquer dispositivo
- ✅ Não perde dados ao limpar cache
- ✅ Experiência consistente

### Para o Negócio
- ✅ Controle total dos dados
- ✅ Relatórios em tempo real
- ✅ Escalabilidade
- ✅ Segurança aprimorada

---

## 🔄 Migração de Dados

### 1. Migração Automática

```jsx
import { migrationService } from '@/utils/migration.js';

// Migrar dados do localStorage para o backend
await migrationService.executeMigration();
```

### 2. Limpeza do localStorage

```jsx
import { cleanupService } from '@/utils/cleanup.js';

// Limpar localStorage e migrar dados importantes
await cleanupService.executeCleanup();
```

### 3. Reset Completo

```jsx
import { resetComplete } from '@/utils/cleanup.js';

// Limpar todos os dados locais
resetComplete();
```

---

## 🎯 Próximos Passos

### 1. Implementar Backend
- Seguir o `BACKEND_README.md`
- Configurar Fastify + Supabase
- Implementar todos os endpoints

### 2. Testar Integração
```bash
# Frontend
npm run dev

# Backend (em outro terminal)
# npm run dev (após implementar)
```

### 3. Migrar Dados
```jsx
// No console do navegador
import { migrationService } from '@/utils/migration.js';
await migrationService.executeMigration();
```

### 4. Atualizar Componentes
- Substituir hooks antigos pelos novos
- Adicionar tratamento de erro da API
- Implementar indicadores de status

---

## ⚠️ Considerações Importantes

### 1. Dependência da Internet
- O sistema não funciona offline
- Sempre verificar `apiStatus` antes de operações
- Implementar retry automático

### 2. Performance
- Dados carregam do servidor a cada operação
- Considerar cache inteligente no futuro
- Otimizar queries do Supabase

### 3. Segurança
- Tokens JWT com expiração
- Validação no backend
- Permissões por role

---

## 🎉 Conclusão

O sistema agora está configurado para usar **apenas o backend**, proporcionando:

- **Dados centralizados** no Supabase
- **Sincronização em tempo real**
- **Multi-usuário real**
- **Segurança aprimorada**
- **Escalabilidade**

Para começar, implemente o backend seguindo o `BACKEND_README.md` e use os hooks `useFilaBackend` e `useAuthBackend` nos seus componentes. 