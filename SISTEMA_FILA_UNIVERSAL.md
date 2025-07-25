# Sistema de Fila Universal com Restrições de Barbeiro

## 📋 **Visão Geral**

O sistema Lucas Barbearia implementa um mecanismo de **fila universal** que garante justiça no atendimento, respeitando o tempo de chegada dos clientes, mas mantendo restrições de barbeiro específico.

## 🎯 **Princípios do Sistema**

### **1. Tempo Universal**
- **Todas as filas** (geral + específicas) compartilham o mesmo timestamp de chegada
- **Cliente que chegou primeiro** tem prioridade, independente da fila escolhida
- **Ordenação por tempo** garante justiça no atendimento

### **2. Restrições de Barbeiro**
- **Cliente específico** só pode ser atendido pelo barbeiro que escolheu
- **Cliente geral** pode ser atendido por qualquer barbeiro disponível
- **Barbeiro vê** apenas clientes que pode atender

### **3. Chamada Universal**
- **Barbeiro chama "próximo"** e recebe quem espera há mais tempo
- **Sistema inteligente** filtra automaticamente clientes disponíveis
- **Cliente específico** só pode ser atendido pelo barbeiro escolhido
- **Cliente geral** pode ser atendido por qualquer barbeiro disponível
- **Tempo de espera** é calculado e exibido

## 🔧 **Como Funciona**

### **Exemplo Prático:**
```
9:00 - Cliente A → Fila Geral (pode ser atendido por qualquer barbeiro)
9:05 - Cliente B → Fila Específica João (só pode ser atendido pelo João)
9:10 - Cliente C → Fila Geral (pode ser atendido por qualquer barbeiro)
9:15 - Cliente D → Fila Específica Pedro (só pode ser atendido pelo Pedro)

Ordem de Atendimento (por tempo):
1. João chama "próximo" → Cliente A (9:00) - pode atender (fila geral)
2. Pedro chama "próximo" → Cliente B (9:05) - NÃO pode atender (específico de João)
3. Pedro chama "próximo" → Cliente C (9:10) - pode atender (fila geral)
4. João chama "próximo" → Cliente B (9:05) - pode atender (específico de João)
5. Pedro chama "próximo" → Cliente D (9:15) - pode atender (específico de Pedro)
```

## 🎮 **Interface do Barbeiro**

### **Botões de Chamada:**
1. **"Chamar Próximo"** - Chama o próximo cliente disponível (geral ou específico seu)
2. **"Apenas Meus"** - Chama apenas clientes que escolheram você especificamente

### **Visualização da Fila:**
- **Aba "Por Tempo"** - Mostra todos os clientes ordenados por chegada
- **Indicadores visuais** - Clientes disponíveis vs não disponíveis
- **Tempo de espera** - Exibido em minutos para cada cliente

## ✅ **Vantagens do Sistema**

### **🎯 Justiça**
- Cliente que chegou primeiro é atendido primeiro
- Impossível "furar" a fila escolhendo barbeiro específico
- Tempo de espera respeitado universalmente

### **🔒 Controle**
- Cliente específico só pode ser atendido pelo barbeiro escolhido
- Barbeiro vê apenas clientes que pode atender
- Sistema previne conflitos e confusão

### **📊 Transparência**
- Fila ordenada por tempo visível para todos
- Tempo de espera calculado e exibido
- Status claro de disponibilidade

## 🧪 **Como Testar**

### **1. Teste de Ordem Temporal**
1. Adicione clientes com diferentes timestamps
2. Verifique se a ordem na aba "Por Tempo" está correta
3. Teste chamadas e confirme que respeita a ordem

### **2. Teste de Restrições**
1. Adicione cliente específico para um barbeiro
2. Tente chamar com outro barbeiro
3. Verifique se o sistema bloqueia corretamente

### **3. Teste de Chamada Universal**
1. Use "Chamar Próximo" em diferentes barbeiros
2. Verifique se recebe clientes na ordem correta
3. Confirme que respeita restrições de barbeiro

## 🔄 **Fluxo de Dados**

```
1. Cliente chega → Timestamp registrado
2. Cliente escolhe fila (geral ou específica)
3. Sistema ordena por timestamp
4. Barbeiro chama "próximo"
5. Sistema filtra clientes disponíveis
6. Cliente mais antigo é atendido
```

## 🛠️ **Implementação Técnica**

### **Funções Principais:**
- `chamarProximo()` - Lógica principal de chamada
- `getFilaOrdenadaPorTempo()` - Visualização ordenada
- `adicionarClienteTeste()` - Inclui timestamp

### **Estrutura de Dados:**
```javascript
{
  id: timestamp,
  timestamp: timestamp, // Para ordenação
  nome: "Cliente",
  barbeiro: "Fila Geral" | "Nome do Barbeiro",
  status: "aguardando" | "atendendo"
}
```

## 📝 **Regras de Negócio**

1. **Prioridade por Tempo:** Quem chegou primeiro é atendido primeiro
2. **Restrição de Barbeiro:** Cliente específico só pode ser atendido pelo barbeiro escolhido
3. **Fila Universal:** Todas as filas compartilham o mesmo sistema de tempo
4. **Transparência:** Cliente pode ver sua posição real na fila

---

**Resultado:** Sistema justo e transparente que respeita o tempo de chegada, mas mantém preferências de barbeiro específico. 