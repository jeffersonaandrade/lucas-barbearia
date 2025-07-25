# Configuração de CORS para o Backend

## 🚨 **Problema Identificado**
O frontend (localhost:5173) não consegue se comunicar com o backend (localhost:3000) devido a erro de CORS.

## 🔧 **Solução: Configurar CORS no Backend**

### **Para Fastify:**

1. **Instalar o plugin CORS:**
```bash
npm install @fastify/cors
```

2. **Configurar no arquivo principal (app.js ou server.js):**
```javascript
const fastify = require('fastify')();
const cors = require('@fastify/cors');

// Registrar o plugin CORS
await fastify.register(cors, {
  origin: [
    'http://localhost:5173',  // Frontend em desenvolvimento
    'http://localhost:5174',  // Frontend alternativo
    'http://127.0.0.1:5173',  // IP local
    'http://127.0.0.1:5174'   // IP local alternativo
  ],
  credentials: true,  // Para cookies/sessões
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ]
});
```

3. **Ou configuração mais simples:**
```javascript
await fastify.register(cors, {
  origin: true,  // Permite todas as origens (apenas para desenvolvimento)
  credentials: true
});
```

### **Para Express:**

1. **Instalar CORS:**
```bash
npm install cors
```

2. **Configurar:**
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
```

### **Para desenvolvimento rápido:**

Se você quiser uma solução temporária apenas para desenvolvimento:

```javascript
// Configuração permissiva (APENAS para desenvolvimento)
await fastify.register(cors, {
  origin: true,
  credentials: true
});
```

## 🧪 **Teste após configuração:**

1. **Reinicie o backend**
2. **Acesse:** `http://localhost:5174/api-test`
3. **Teste o login**

## 🔒 **Para Produção:**

Em produção, configure apenas os domínios permitidos:

```javascript
await fastify.register(cors, {
  origin: [
    'https://lucasbarbearia.com',
    'https://www.lucasbarbearia.com'
  ],
  credentials: true
});
```

## 📋 **Verificação:**

Após configurar o CORS, você deve ver no console do navegador:
- ✅ Requisições sendo feitas sem erro
- ✅ Headers CORS corretos na resposta
- ✅ Login funcionando normalmente 