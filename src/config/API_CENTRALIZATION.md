# Centralização de APIs - Documentação

## 📋 Resumo das Mudanças

Este documento registra a centralização de todas as chamadas de API que estavam sendo feitas fora do arquivo `src/services/api.js`.

## 🔍 APIs Encontradas Fora do Central

### 1. **src/utils/testCookies.js**
- **Antes:** Chamadas diretas com `fetch()` e `apiFetch()`
- **Depois:** Usando `testService` e `debugService`

**Endpoints migrados:**
- `/api/auth/login` → `testService.testLogin()`
- `/api/auth/me` → `testService.testAuth()`
- `/api/auth/logout` → `testService.testLogout()`
- `/fila/status` → `testService.testFilaStatus()`
- `/fila/entrar` → `testService.testEntrarFila()`

### 2. **src/hooks/useFila.js**
- **Antes:** Chamadas diretas com `apiFetch()`
- **Depois:** Usando `filaService`

**Endpoints migrados:**
- `/fila/status` → `filaService.obterStatusCliente()`
- `/fila/entrar` → `filaService.entrarNaFila()`
- `/fila/sair` → `filaService.sairDaFila()`

### 3. **src/hooks/useConfiguracoesPublicas.js**
- **Antes:** Chamadas diretas com `apiFetch()`
- **Depois:** Usando `barbeariasService`

**Endpoints migrados:**
- `/barbearias/${id}` → `barbeariasService.obterBarbearia(id)`
- `/barbearias` → `barbeariasService.listarBarbearias()`

### 4. **src/hooks/useConfiguracoes.js**
- **Antes:** Chamadas diretas com `apiFetch()`
- **Depois:** Usando `configuracoesService`

**Endpoints migrados:**
- `/api/configuracoes/completa/${id}` → `configuracoesService.carregarConfiguracoes(id)`
- `/api/configuracoes/servicos/${id}` → `configuracoesService.atualizarServico(id, dados)`
- `/configuracoes/servicos` → `configuracoesService.criarServico(dados)`
- `/api/configuracoes/servicos/${id}` → `configuracoesService.excluirServico(id)`
- `/api/configuracoes/horarios/${id}` → `configuracoesService.atualizarHorarios(id, dados)`
- `/api/configuracoes/gerais/${id}` → `configuracoesService.atualizarConfiguracoesGerais(id, dados)`

### 5. **src/components/admin/BarbeariaSelector.jsx**
- **Antes:** Chamadas diretas com `apiFetch()`
- **Depois:** Usando `barbeariasService`

**Endpoints migrados:**
- `/barbearias` → `barbeariasService.listarBarbearias()`

### 6. **src/components/DebugAPI.jsx**
- **Antes:** Chamadas diretas com `fetch()`
- **Depois:** Usando `testService`

**Endpoints migrados:**
- Todos os endpoints de teste → `testService.testEndpoint()`

### 7. **src/hooks/useAuth.js**
- **Antes:** Chamadas diretas com `apiFetch()`
- **Depois:** Usando `authService`

**Endpoints migrados:**
- `/auth/me` → `authService.getCurrentUser()`
- `/auth/login` → `authService.login(email, password)`
- `/auth/logout` → `authService.logout()`

## 🆕 Novos Serviços Criados

### **configuracoesService**
```javascript
export const configuracoesService = {
  listarServicos(),
  criarServico(dados),
  atualizarServico(servicoId, dados),
  excluirServico(servicoId),
  listarHorarios(barbeariaId),
  criarHorario(barbeariaId, dados)
};
```

### **relatoriosService**
```javascript
export const relatoriosService = {
  obterDashboard(filtros),
  downloadRelatorio(filtros)
};
```

### **testService**
```javascript
export const testService = {
  testLogin(email, password),
  testAuth(),
  testLogout(),
  testFilaStatus(),
  testEntrarFila(dados),
  testEndpoint(endpoint, method, body)
};
```

### **debugService**
```javascript
export const debugService = {
  checkCookies(),
  runAllTests()
};
```

## 🔧 Serviços Corrigidos

### **filaService** (Corrigido)
```javascript
export const filaService = {
  entrarNaFila(dadosCliente),
  visualizarFila(),
  obterStatusFila(),
  gerenciarFila(acao, clienteId),
  obterEstatisticas(),
  chamarProximo(barbeariaId)
};
```

### **usuariosService** (Corrigido)
```javascript
export const usuariosService = {
  listarBarbeiros(filtros),
  obterMeuStatus(),
  ativarBarbeiro(dados),
  desativarBarbeiro(dados),
  obterPerfil(),
  atualizarPerfil(dados),
  deletarPerfil(),
  gerenciarUsuarios()
};
```

### **authService** (Adicionado register)
```javascript
export const authService = {
  login(email, password),
  logout(),
  getCurrentUser(),
  register(dadosUsuario) // NOVO
};
```

## ✅ Benefícios da Centralização

1. **Manutenibilidade:** Todas as APIs em um só lugar
2. **Consistência:** Padrão único de tratamento de erros
3. **Reutilização:** Serviços podem ser usados em múltiplos componentes
4. **Debugging:** Logs centralizados para todas as chamadas
5. **Segurança:** Controle centralizado de autenticação
6. **Performance:** Possibilidade de implementar cache centralizado

## 🔧 Como Usar os Novos Serviços

### Exemplo de uso do configuracoesService:
```javascript
import { configuracoesService } from '@/services/api.js';

// Carregar configurações
const config = await configuracoesService.carregarConfiguracoes(barbeariaId);

// Criar serviço
const novoServico = await configuracoesService.criarServico({
  nome: 'Corte Premium',
  preco: 50.00
});
```

### Exemplo de uso do testService:
```javascript
import { testService } from '@/services/api.js';

// Testar login
const loginResult = await testService.testLogin('admin@exemplo.com', 'senha123');

// Testar endpoint genérico
const result = await testService.testEndpoint('/api/health', 'GET');
```

## 📝 Próximos Passos

1. **Monitorar logs** para identificar possíveis problemas
2. **Implementar cache** nos serviços mais usados
3. **Adicionar retry logic** para falhas de rede
4. **Criar testes unitários** para os serviços
5. **Documentar** novos endpoints conforme forem criados

## 🚨 Importante

- Todos os imports de `apiFetch` devem ser substituídos pelos serviços apropriados
- Sempre usar os serviços centralizados para novas funcionalidades
- Manter a documentação atualizada conforme mudanças 