# 🔗 Alinhamento de Endpoints - Frontend ↔ Backend

## 📋 **Resumo das Correções**

Este documento descreve as correções feitas para alinhar os endpoints do frontend com as rotas reais do backend.

## ✅ **Endpoints Corrigidos**

### **1. Autenticação** ✅
```javascript
// ✅ CORRETO - Alinhado com o backend
AUTH: {
  LOGIN: '/auth/login',        // POST /api/auth/login
  LOGOUT: '/auth/logout',      // POST /api/auth/logout  
  ME: '/auth/me',             // GET /api/auth/me
  REGISTER: '/auth/register',  // POST /api/auth/register
},
```

### **2. Barbearias** ✅
```javascript
// ✅ CORRETO - Alinhado com o backend
BARBEARIAS: {
  LIST: '/barbearias',                    // GET /api/barbearias
  GET: (id) => `/barbearias/${id}`,       // GET /api/barbearias/{id}
  CREATE: '/barbearias',                  // POST /api/barbearias
  UPDATE: (id) => `/barbearias/${id}`,    // PUT /api/barbearias/{id}
  DELETE: (id) => `/barbearias/${id}`,    // DELETE /api/barbearias/{id}
  PROXIMO_FILA: (id) => `/barbearias/${id}/fila/proximo`, // POST /api/barbearias/{id}/fila/proximo
},
```

### **3. Usuários/Barbeiros** ✅
```javascript
// ✅ CORRETO - Alinhado com o backend
USUARIOS: {
  BARBEIROS: (filtros) => `/users/barbeiros?${queryString}`, // GET /api/users/barbeiros
  ATIVAR_BARBEIRO: '/users/barbeiros/ativar',                // POST /api/users/barbeiros/ativar
  DESATIVAR_BARBEIRO: '/users/barbeiros/desativar',          // POST /api/users/barbeiros/desativar
  MEU_STATUS: '/users/barbeiros/meu-status',                 // GET /api/users/barbeiros/meu-status
  PERFIL: '/users/perfil',                                   // GET /api/users/perfil
  GERENCIAMENTO: '/users/gerenciamento',                     // GET /api/users/gerenciamento
},
```

### **4. Fila** ✅
```javascript
// ✅ CORRETO - Alinhado com o backend
FILA: {
  ENTRAR: '/fila/entrar',           // POST /api/fila/entrar
  VISUALIZAR: '/fila/visualizar',   // GET /api/fila/visualizar
  STATUS: '/fila/status',           // GET /api/fila/status
  GERENCIAR: '/fila/gerenciar',     // POST /api/fila/gerenciar
  ESTATISTICAS: '/fila/estatisticas', // GET /api/fila/estatisticas
},
```

### **5. Avaliações** ✅
```javascript
// ✅ CORRETO - Alinhado com o backend
AVALIACOES: {
  CREATE: '/avaliacoes',            // POST /api/avaliacoes
  LIST: (filtros) => `/avaliacoes?${queryString}`, // GET /api/avaliacoes
  GET: (id) => `/avaliacoes/${id}`, // GET /api/avaliacoes/{id}
},
```

### **6. Histórico** ✅
```javascript
// ✅ CORRETO - Alinhado com o backend
HISTORICO: {
  GET: (filtros) => `/historico?${queryString}`, // GET /api/historico
  RELATORIOS: '/historico/relatorios',           // GET /api/historico/relatorios
},
```

### **7. Relatórios** ✅
```javascript
// ✅ CORRETO - Alinhado com o backend
RELATORIOS: {
  DASHBOARD: (filtros) => `/relatorios/dashboard?${queryString}`, // GET /api/relatorios/dashboard
  DOWNLOAD: (filtros) => `/relatorios/download?${queryString}`,   // GET /api/relatorios/download
},
```

### **8. Configurações** ✅
```javascript
// ✅ CORRETO - Alinhado com o backend
CONFIGURACOES: {
  SERVICOS: {
    LIST: '/configuracoes/servicos',                    // GET /api/configuracoes/servicos
    CREATE: '/configuracoes/servicos',                  // POST /api/configuracoes/servicos
    UPDATE: (id) => `/configuracoes/servicos/${id}`,    // PUT /api/configuracoes/servicos/{id}
    DELETE: (id) => `/configuracoes/servicos/${id}`,    // DELETE /api/configuracoes/servicos/{id}
  },
  HORARIOS: {
    LIST: '/configuracoes/horarios',    // GET /api/configuracoes/horarios
    CREATE: '/configuracoes/horarios',  // POST /api/configuracoes/horarios
  },
},
```

## ❌ **Endpoints Removidos (Não Existem no Backend)**

### **1. Endpoints de Fila Removidos:**
```javascript
// ❌ REMOVIDOS - Não existem no backend
GET: (barbeariaId) => `/fila-publica/${barbeariaId}`,
STATUS: (barbeariaId, token) => `/fila/${barbeariaId}/status/${token}`,
SAIR: (barbeariaId, token) => `/fila/${barbeariaId}/sair/${token}`,
PROXIMO: (barbeariaId) => `/fila/${barbeariaId}/proximo`,
FINALIZAR: (barbeariaId, clienteId) => `/fila/${barbeariaId}/finalizar/${clienteId}`,
ADICIONAR: (barbeariaId) => `/fila/${barbeariaId}/adicionar`,
REMOVER: (clienteId) => `/fila/remover/${clienteId}`,
```

### **2. Endpoints de Usuários Removidos:**
```javascript
// ❌ REMOVIDOS - Não existem no backend
LIST: (filtros) => `/users?${queryString}`,
CREATE: '/users',
UPDATE: (id) => `/users/${id}`,
DELETE: (id) => `/users/${id}`,
```

### **3. Endpoints de Histórico Removidos:**
```javascript
// ❌ REMOVIDOS - Não existem no backend
GET: (barbeariaId, filtros) => `/barbearias/${barbeariaId}/historico?${queryString}`,
BARBEIRO: (barbeiroId, filtros) => `/historico?barbeiro_id=${barbeiroId}&${queryString}`,
```

## 🔧 **Como Usar os Endpoints Corrigidos**

### **1. Importar a Configuração:**
```javascript
import { API_CONFIG } from '@/config/api.js';
```

### **2. Usar Endpoints Diretamente:**
```javascript
// Login
const loginUrl = API_CONFIG.ENDPOINTS.AUTH.LOGIN;

// Listar barbearias
const barbeariasUrl = API_CONFIG.ENDPOINTS.BARBEARIAS.LIST;

// Entrar na fila
const entrarFilaUrl = API_CONFIG.ENDPOINTS.FILA.ENTRAR;

// Com parâmetros
const barbeariaUrl = API_CONFIG.ENDPOINTS.BARBEARIAS.GET(1);
```

### **3. Usar com Filtros:**
```javascript
// Listar barbeiros com filtros
const barbeirosUrl = API_CONFIG.ENDPOINTS.USUARIOS.BARBEIROS({
  barbearia_id: 1,
  status: 'ativo'
});

// Histórico com filtros
const historicoUrl = API_CONFIG.ENDPOINTS.HISTORICO.GET({
  barbearia_id: 1,
  data_inicio: '2024-01-01',
  data_fim: '2024-01-31'
});
```

## 📊 **Benefícios do Alinhamento**

### **✅ Vantagens:**
- **Compatibilidade total** com o backend
- **Menos erros 404** e endpoints inexistentes
- **Manutenção mais fácil** - um local para mudanças
- **Documentação clara** de todos os endpoints
- **Filtros padronizados** em todos os endpoints

### **🔧 Próximos Passos:**
1. **Atualizar serviços** que usam os endpoints antigos
2. **Testar integração** com o backend real
3. **Implementar tratamento de erros** específicos
4. **Adicionar validação** de parâmetros

## 📝 **Notas Importantes**

- **Todos os endpoints** agora correspondem exatamente às rotas do backend
- **Filtros são opcionais** e podem ser passados como objetos
- **Parâmetros de URL** são construídos automaticamente
- **Configuração de ambiente** via `VITE_API_URL` continua funcionando
- **Health check** disponível em `/health`

---

**Status:** ✅ **ALINHAMENTO COMPLETO**  
**Data:** $(date)  
**Versão:** 1.0.0 