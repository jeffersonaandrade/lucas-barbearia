# Lucas Barbearia - Sistema de Filas Inteligente

Sistema de gerenciamento de filas para barbearias com controle de acesso via QR Code e visualização em tempo real.

## 🎯 **Visão Geral**

Sistema completo de filas para barbearias que permite:
- **Entrada na fila** apenas via QR Code (segurança)
- **Visualização pública** da fila em tempo real
- **Gerenciamento multi-unidades** com barbeiros disponíveis
- **Interface responsiva** e intuitiva
- **Persistência de dados** robusta

## 🏗️ **Arquitetura do Sistema**

### **Fluxo Principal**
1. **Cliente chega na barbearia** → Vê QR Code da unidade
2. **Escaneia QR Code** → Acesso direto para entrar na fila
3. **Preenche dados** → Nome, telefone, escolhe barbeiro
4. **Recebe token único** → Para acompanhar posição
5. **Acompanha em tempo real** → Status da fila centralizado
6. **Sai da fila** → Com confirmação via modal

### **Restrições de Acesso**
- ✅ **Com QR Code**: Acesso completo ao formulário de entrada
- ❌ **Sem QR Code**: Apenas visualização da fila
- 🔒 **Segurança**: Verificação de parâmetros na URL
- 📍 **Localização**: Não necessária (QR Code já garante presença na loja)
- 🧪 **Desenvolvimento**: URLs de bypass para testes

## 📱 **Funcionalidades**

### **Para Clientes**
- **Entrada na fila** via QR Code
- **Visualização pública** da fila atual
- **Acompanhamento** da posição em tempo real
- **Status centralizado** com posição, tempo e status
- **Notificações** quando for a vez
- **Sair da fila** com confirmação via modal
- **Persistência de sessão** entre navegações

### **Para Administradores**
- **Painel de administração** (`/admin`)
- **Geração de QR Codes** por unidade
- **Visualização de estatísticas**
- **Exportação/importação** de dados
- **Reset de dados** para testes
- **Limpeza de localStorage**

### **Multi-Unidades**
- **3 barbearias** configuradas
- **Barbeiros disponíveis** por unidade
- **Horários específicos** por unidade
- **Estatísticas independentes**
- **Dados isolados** por barbearia

## 🛠️ **Tecnologias**

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React
- **Estado**: React Hooks + localStorage
- **Build**: Vite
- **Persistência**: localStorage + JSON

## 🚀 **Como Executar**

### **Instalação**
```bash
# Clonar repositório
git clone [url-do-repositorio]
cd lucas-barbearia

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

### **Acesso ao Sistema**
- **Site principal**: `http://localhost:5174/`
- **Visualizar fila**: `http://localhost:5174/barbearia/1/visualizar-fila`
- **Admin panel**: `http://localhost:5174/admin`
- **Teste de dados**: `http://localhost:5174/test`
- **Debug panel**: `http://localhost:5174/debug`

## 🔐 **Regras de Acesso**

### **Produção (QR Code Obrigatório)**
- **Entrada na fila**: Apenas via QR Code
- **URL do QR Code**: `/barbearia/:id/entrar-fila?qr=true&barbearia=:id`
- **Sessão**: 2 horas de validade
- **Visualização**: Pública para todos
- **Persistência**: Dados salvos no localStorage

### **Desenvolvimento (Bypass)**
- **URLs de teste**: `/dev/entrar-fila/:id`
- **Acesso direto**: Para desenvolvimento
- **Sem restrições**: Para testes
- **Indicador visual**: Banner amarelo indicando modo de desenvolvimento

### **🔧 Como Acessar Durante Desenvolvimento**

#### **1. URLs de Bypass (Recomendado)**
```bash
# Acesso direto para testes (sem QR Code)
# Mostra banner amarelo indicando modo de desenvolvimento
http://localhost:5174/dev/entrar-fila/1  # Barbearia Centro
http://localhost:5174/dev/entrar-fila/2  # Barbearia Shopping  
http://localhost:5174/dev/entrar-fila/3  # Barbearia Bairro
```

#### **2. Simular QR Code (Para Testar Fluxo Completo)**
```bash
# URLs que simulam acesso via QR Code
http://localhost:5174/barbearia/1/entrar-fila?qr=true&barbearia=1
http://localhost:5174/barbearia/2/entrar-fila?qr=true&barbearia=2
http://localhost:5174/barbearia/3/entrar-fila?qr=true&barbearia=3
```

#### **3. Fluxo Completo de Teste**
1. **Acesse**: `http://localhost:5174/dev/entrar-fila/1`
2. **Preencha**: Nome, telefone, escolha barbeiro
3. **Confirme**: Entrada na fila
4. **Acompanhe**: `http://localhost:5174/barbearia/1/status-fila`
5. **Visualize**: `http://localhost:5174/barbearia/1/visualizar-fila`

#### **4. Painel de Administração**
```bash
# Gerenciar dados e configurações
http://localhost:5174/admin

# Testar dados e funcionalidades
http://localhost:5174/test

# Debug e limpeza
http://localhost:5174/debug
```

#### **5. Navegação Entre Unidades**
```bash
# Lista de todas as barbearias
http://localhost:5174/barbearias

# Informações específicas de cada unidade
http://localhost:5174/qr-code/1
http://localhost:5174/qr-code/2
http://localhost:5174/qr-code/3
```

## 📋 **Estrutura de Dados**

### **Barbearias**
```json
{
  "id": 1,
  "nome": "Lucas Barbearia - Centro",
  "endereco": "Rua das Flores, 123 - Centro",
  "telefone": "(11) 99999-9999",
  "barbeiros": [
    {
      "id": "joao",
      "nome": "João Silva",
      "especialidade": "Cortes modernos",
      "disponivel": true,
      "diasTrabalho": ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"],
      "horarioInicio": "09:00",
      "horarioFim": "19:00"
    }
  ]
}
```

### **Fila**
```json
{
  "id": 1,
  "nome": "João Silva",
  "telefone": "(11) 99999-9999",
  "barbeiro": "Fila Geral",
  "status": "atendendo",
  "posicao": 1,
  "tempoEstimado": 15,
  "token": "token_1703123456789_abc123def"
}
```

### **Dados de Sessão (localStorage)**
```javascript
// Dados salvos no localStorage
localStorage.setItem('fila_token', 'token_123456');
localStorage.setItem('cliente_data', JSON.stringify(cliente));
localStorage.setItem('fila_barbearia_id', '1');
localStorage.setItem('fila_timestamp', '1703123456789');
```

## 🎨 **Interface do Usuário**

### **Páginas Principais**
1. **Home** (`/`) - Apresentação e navegação
2. **Visualizar Fila** (`/barbearia/:id/visualizar-fila`) - Fila pública
3. **Entrar na Fila** (`/barbearia/:id/entrar-fila`) - Formulário (QR Code)
4. **Status da Fila** (`/barbearia/:id/status-fila`) - Acompanhamento
5. **Nossas Unidades** (`/barbearias`) - Lista de barbearias

### **Componentes Especiais**
- **RestrictedAccess** - Tela de acesso restrito
- **QRCodeGenerator** - Informações da unidade
- **AdminPanel** - Painel administrativo
- **StatusFila** - Status centralizado do cliente

### **Design System**
- **Tema**: Preto e branco
- **Cores primárias**: `foreground` (preto) e `background` (branco)
- **Modo de desenvolvimento**: Banner amarelo
- **Status centralizado**: Layout destacado
- **Modais**: Tema consistente

## 🔧 **Configuração**

### **Configuração das Barbearias**
```javascript
// Configurações por unidade
const BARBEARIAS_CONFIG = {
  1: { nome: "Centro", endereco: "Rua das Flores, 123" },
  2: { nome: "Shopping", endereco: "Av. Principal, 456" },
  3: { nome: "Bairro", endereco: "Rua da Paz, 789" }
};
```

### **Variáveis de Ambiente**
- **URLs de desenvolvimento** configuráveis
- **Configurações** ajustáveis por unidade
- **QR Codes** únicos por barbearia

## 📊 **Funcionalidades Técnicas**

### **Hooks Customizados**
- **useFila** - Gerenciamento da fila
- **useQRCodeAccess** - Controle de acesso QR Code
- **useScroll** - Navegação suave
- **useWhatsApp** - Integração WhatsApp

### **Serviços**
- **filaDataService** - CRUD da fila
- **LocalStorage** - Persistência de dados
- **Mock API** - Simulação de backend

### **Segurança**
- **Validação de parâmetros** na URL
- **Sessão com timeout** (2 horas)
- **QR Code obrigatório** para entrada na fila
- **Filtro de barbeiros** por disponibilidade

## 🎯 **Regras de Negócio**

### **Entrada na Fila**
1. **QR Code obrigatório** em produção
2. **Dados obrigatórios**: Nome, telefone, barbeiro
3. **Token único** gerado automaticamente
4. **Posição calculada** baseada na fila atual
5. **Tempo estimado** baseado no barbeiro
6. **Persistência** no localStorage

### **Visualização da Fila**
1. **Acesso público** sem restrições
2. **Atualização automática** a cada 10 segundos
3. **Atualização manual** disponível
4. **Seleção de unidade** via dropdown
5. **Estatísticas em tempo real**

### **Barbeiros**
1. **Disponibilidade** por barbeiro (`disponivel: true`)
2. **Horários específicos** por barbeiro
3. **Especialidades** definidas
4. **"Fila Geral"** sempre disponível
5. **Filtro por disponibilidade** (sem filtro por dia)

### **Multi-Unidades**
1. **Dados isolados** por barbearia
2. **Configurações independentes**
3. **Estatísticas separadas**
4. **QR Codes únicos** por unidade
5. **Navegação entre unidades**

### **Status da Fila**
1. **Status centralizado** na página
2. **Posição destacada** com número grande
3. **Tempo estimado** em destaque
4. **Status colorido** com badge
5. **Alerta especial** para posição 1
6. **Lista completa** da fila
7. **Destaque do cliente** na lista

### **Sair da Fila**
1. **Confirmação obrigatória** via modal
2. **Modal com tema** preto e branco
3. **Limpeza automática** dos dados
4. **Redirecionamento** para home
5. **Persistência removida** do localStorage

## 🚨 **Limitações e Considerações**

### **Desenvolvimento**
- **Dados mockados** em localStorage
- **Sem backend real** implementado
- **QR Codes** gerados externamente
- **Sem verificação de localização** (QR Code já garante presença)

### **Produção**
- **Backend necessário** para dados reais
- **Banco de dados** para persistência
- **Sistema de notificações** push
- **QR Codes físicos** nas barbearias

## 🔧 **Troubleshooting - Desenvolvimento**

### **Problemas Comuns**

#### **1. Erro "Cannot read properties of undefined"**
```bash
# Solução: Limpar localStorage
# Acesse: http://localhost:5174/admin
# Clique em: "Limpar localStorage"
# Ou no console do navegador:
localStorage.clear()
```

#### **2. Dados não aparecem**
```bash
# Verificar se os dados foram inicializados
# Acesse: http://localhost:5174/test
# Verifique se há dados nas 3 barbearias
```

#### **3. QR Code não funciona**
```bash
# Para testes, use sempre as URLs de bypass:
http://localhost:5174/dev/entrar-fila/1
# Em vez de:
http://localhost:5174/barbearia/1/entrar-fila
```

#### **4. Barbeiros não aparecem**
```bash
# Verificar se o campo disponivel está true
# Os barbeiros são filtrados por disponibilidade
# "Fila Geral" sempre aparece
```

#### **5. Reset Completo do Sistema**
```bash
# 1. Limpar localStorage
localStorage.clear()

# 2. Recarregar página
# 3. Dados serão reinicializados automaticamente
```

#### **6. Cliente não permanece na página de status**
```bash
# Verificar dados no localStorage:
localStorage.getItem('fila_token')
localStorage.getItem('cliente_data')
localStorage.getItem('fila_barbearia_id')

# Se dados estiverem corrompidos, limpar e tentar novamente
```

## 📝 **Próximos Passos**

### **Melhorias Técnicas**
- [ ] Implementar backend real
- [ ] Sistema de notificações push
- [ ] Integração com WhatsApp Business API
- [ ] Dashboard administrativo avançado
- [ ] Relatórios e analytics

### **Funcionalidades**
- [ ] Sistema de avaliações
- [ ] Histórico de atendimentos
- [ ] Agendamento antecipado
- [ ] Integração com pagamentos
- [ ] App mobile nativo

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido para Lucas Barbearia** - Sistema de Filas Inteligente 🎯

