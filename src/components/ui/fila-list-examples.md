# FilaList Component - Exemplos de Uso

## Visão Geral
O componente `FilaList` é um componente reutilizável para renderizar listas de fila em diferentes contextos da aplicação.

## Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `fila` | Array | `[]` | Array de clientes na fila |
| `title` | String | "Clientes na Fila" | Título do card |
| `filterStatus` | String | `null` | Filtrar por status ('aguardando', 'atendendo', 'proximo') |
| `showBarbeiro` | Boolean | `true` | Mostrar nome do barbeiro |
| `showPosition` | Boolean | `true` | Mostrar posição na fila |
| `showTime` | Boolean | `true` | Mostrar tempo estimado |
| `showStatus` | Boolean | `true` | Mostrar badge de status |
| `showActions` | Boolean | `false` | Mostrar botões de ação |
| `onRemoveCliente` | Function | `null` | Função para remover cliente |
| `onCallCliente` | Function | `null` | Função para chamar cliente |
| `highlightCurrentUser` | Boolean | `false` | Destacar usuário atual |
| `currentUserToken` | String | `null` | Token do usuário atual |
| `emptyMessage` | String | "Nenhum cliente encontrado" | Mensagem quando vazio |
| `loading` | Boolean | `false` | Estado de carregamento |
| `className` | String | `""` | Classes CSS adicionais |
| `variant` | String | "default" | Variante do layout |

## Exemplos de Uso

### 1. Lista Simples de Clientes Aguardando
```jsx
<FilaList
  fila={fila}
  title="Clientes Aguardando"
  filterStatus="aguardando"
  showActions={false}
  emptyMessage="Não há clientes aguardando no momento."
/>
```

### 2. Lista Completa com Ações (Admin/Barbeiro)
```jsx
<FilaList
  fila={fila}
  title="Gerenciar Fila"
  showActions={true}
  onRemoveCliente={handleRemoveCliente}
  onCallCliente={handleCallCliente}
  emptyMessage="Nenhum cliente na fila."
/>
```

### 3. Lista para Cliente Ver Sua Posição
```jsx
<FilaList
  fila={fila}
  title="Fila Atual"
  highlightCurrentUser={true}
  currentUserToken={clienteAtual.token}
  showActions={false}
  emptyMessage="Nenhum cliente na fila."
/>
```

### 4. Lista Compacta (Apenas Nome e Status)
```jsx
<FilaList
  fila={fila}
  title="Status da Fila"
  showBarbeiro={false}
  showPosition={false}
  showTime={false}
  showStatus={true}
  showActions={false}
  variant="compact"
/>
```

### 5. Lista de Clientes em Atendimento
```jsx
<FilaList
  fila={fila}
  title="Em Atendimento"
  filterStatus="atendendo"
  showActions={true}
  onRemoveCliente={handleFinalizarAtendimento}
  emptyMessage="Nenhum cliente em atendimento."
/>
```

### 6. Lista com Loading State
```jsx
<FilaList
  fila={fila}
  title="Carregando Fila"
  loading={true}
  showActions={false}
/>
```

## Benefícios da Centralização

### ✅ **Antes (Código Duplicado)**
- Múltiplos componentes com lógica similar
- Inconsistências de UI
- Bugs recorrentes (como erro de renderização de objetos)
- Manutenção difícil

### ✅ **Depois (Componente Centralizado)**
- **DRY (Don't Repeat Yourself)** - Lógica em um só lugar
- **Consistência** - Mesmo comportamento em toda aplicação
- **Manutenibilidade** - Mudanças em um só lugar
- **Reutilização** - Fácil de usar em novos contextos
- **Testabilidade** - Testar uma vez, funciona em todos os lugares

## Migração de Componentes Existentes

### VisualizarFila.jsx ✅
```jsx
// Antes: 50+ linhas de código duplicado
// Depois: 1 componente reutilizável
<FilaList
  fila={fila || []}
  title="Clientes Aguardando"
  filterStatus="aguardando"
  showBarbeiro={true}
  showPosition={true}
  showTime={true}
  showStatus={true}
  showActions={false}
  emptyMessage="Não há clientes aguardando no momento."
  loading={loading}
  className="mb-8"
/>
```

### StatusFila.jsx ✅
```jsx
// Antes: 40+ linhas de código duplicado
// Depois: 1 componente reutilizável
<FilaList
  fila={fila || []}
  title="Fila Atual"
  filterStatus={null}
  showBarbeiro={true}
  showPosition={true}
  showTime={true}
  showStatus={true}
  showActions={false}
  highlightCurrentUser={true}
  currentUserToken={clienteAtual?.token}
  emptyMessage="Nenhum cliente na fila."
  loading={loading}
/>
```

## Próximos Passos

1. **Migrar outros componentes** que renderizam filas
2. **Adicionar mais variantes** (compact, detailed, etc.)
3. **Implementar testes** para o componente centralizado
4. **Adicionar animações** e transições
5. **Criar hooks customizados** para lógica de fila 