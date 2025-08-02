# 📋 Documentação das Chamadas API - Frontend vs Backend

## 🔐 **Autenticação**

### **1. Login**
- **Endpoint**: `POST /api/auth/login`
- **Payload**: `{ email: string, password: string }`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid",
        "email": "admin@lucasbarbearia.com",
        "role": "admin",
        "nome": "Administrador",
        "telefone": null,
        "created_at": "2025-07-29T01:50:28.857231+00:00",
        "updated_at": "2025-07-29T02:06:29.649462+00:00",
        "active": true
      },
      "expiresIn": "12h"
    }
  }
  ```
- **Backend retorna** (segundo o log):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "54a44f2b-c346-4af3-a164-f60c49a60a2b",
      "email": "admin@lucasbarbearia.com",
      "role": "admin",
      "nome": "Administrador",
      "telefone": null,
      "created_at": "2025-07-29T01:50:28.857231+00:00",
      "updated_at": "2025-07-29T02:06:29.649462+00:00",
      "active": true
    },
    "expiresIn": "12h"
  }
  ```
- **❌ PROBLEMA**: Frontend espera `{ success, data: { user } }` mas backend retorna `{ token, user, expiresIn }`

### **2. Logout**
- **Endpoint**: `POST /api/auth/logout`
- **Payload**: Nenhum (usa cookies)
- **Frontend espera**: Status 200 OK
- **Backend retorna**: Status 200 OK
- **✅ COMPATÍVEL**

### **3. Verificar Usuário Atual**
- **Endpoint**: `GET /api/auth/me`
- **Headers**: Cookies httpOnly
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid",
        "email": "admin@lucasbarbearia.com",
        "role": "admin",
        "nome": "Administrador",
        "telefone": null,
        "created_at": "2025-07-29T01:50:28.857231+00:00",
        "updated_at": "2025-07-29T02:06:29.649462+00:00",
        "active": true
      }
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **4. Verificar Status de Autenticação**
- **Endpoint**: `GET /api/auth/check`
- **Headers**: Cookies httpOnly
- **Frontend espera**:
  ```json
  {
    "success": true,
    "authenticated": true,
    "data": {
      "id": "uuid",
      "nome": "Administrador",
      "role": "admin"
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

---

## 🏢 **Barbearias**

### **5. Listar Barbearias**
- **Endpoint**: `GET /api/barbearias`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "nome": "Lucas Barbearia - Centro",
        "endereco": "Rua das Flores, 123",
        "telefone": "(81) 99999-9999",
        "horario_funcionamento": "08:00-18:00",
        "status": "aberta",
        "created_at": "2025-07-29T01:50:28.857231+00:00",
        "updated_at": "2025-07-29T02:06:29.649462+00:00"
      }
    ]
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **6. Obter Barbearia Específica**
- **Endpoint**: `GET /api/barbearias/:id`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "nome": "Lucas Barbearia - Centro",
      "endereco": "Rua das Flores, 123",
      "telefone": "(81) 99999-9999",
      "horario_funcionamento": "08:00-18:00",
      "status": "aberta",
      "created_at": "2025-07-29T01:50:28.857231+00:00",
      "updated_at": "2025-07-29T02:06:29.649462+00:00"
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

---

## 👨‍💼 **Barbeiros**

### **7. Listar Barbeiros Públicos**
- **Endpoint**: `GET /api/users/barbeiros?status=ativo&public=true&barbearia_id=:id`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "barbeiros": [
        {
          "id": "uuid",
          "nome": "João Silva",
          "email": "joao@lucasbarbearia.com",
          "telefone": "(81) 99999-9999",
          "especialidades": ["corte", "barba"],
          "status": "ativo",
          "barbearia_id": 1,
          "created_at": "2025-07-29T01:50:28.857231+00:00",
          "updated_at": "2025-07-29T02:06:29.649462+00:00"
        }
      ]
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **8. Listar Barbeiros Ativos**
- **Endpoint**: `GET /api/users/barbeiros?status=ativo&barbearia_id=:id`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "barbeiros": [
        {
          "id": "uuid",
          "nome": "João Silva",
          "email": "joao@lucasbarbearia.com",
          "telefone": "(81) 99999-9999",
          "especialidades": ["corte", "barba"],
          "status": "ativo",
          "barbearia_id": 1,
          "created_at": "2025-07-29T01:50:28.857231+00:00",
          "updated_at": "2025-07-29T02:06:29.649462+00:00"
        }
      ]
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

---

## 📋 **Fila**

### **9. Entrar na Fila**
- **Endpoint**: `POST /api/fila/entrar`
- **Payload**:
  ```json
  {
    "barbearia_id": 1,
    "nome": "João Silva",
    "telefone": "(81) 99999-9999",
    "barbeiro": "João Silva"
  }
  ```
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "token": "fila_token_123",
      "posicao": 5,
      "tempo_estimado": "30 minutos",
      "cliente": {
        "id": "uuid",
        "nome": "João Silva",
        "telefone": "(81) 99999-9999",
        "barbeiro": "João Silva",
        "entrada": "2025-07-29T10:30:00Z"
      }
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **10. Visualizar Fila**
- **Endpoint**: `GET /api/fila/:barbearia_id`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "fila": [
        {
          "id": "uuid",
          "nome": "João Silva",
          "telefone": "(81) 99999-9999",
          "barbeiro": "João Silva",
          "posicao": 1,
          "status": "aguardando",
          "entrada": "2025-07-29T10:00:00Z"
        }
      ],
      "estatisticas": {
        "total_clientes": 10,
        "tempo_medio": "25 minutos",
        "barbeiros_ativos": 3
      }
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **11. Obter Status do Cliente**
- **Endpoint**: `GET /api/fila/status?token=:token&barbearia_id=:id`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "cliente": {
        "id": "uuid",
        "nome": "João Silva",
        "telefone": "(81) 99999-9999",
        "barbeiro": "João Silva",
        "posicao": 3,
        "status": "aguardando",
        "entrada": "2025-07-29T10:30:00Z",
        "tempo_estimado": "15 minutos"
      }
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **12. Sair da Fila**
- **Endpoint**: `POST /api/fila/sair`
- **Payload**: `{ token: "fila_token_123", barbearia_id: 1 }`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "message": "Cliente removido da fila com sucesso"
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

---

## 🎯 **Gerenciamento de Fila (Admin)**

### **13. Chamar Próximo**
- **Endpoint**: `POST /api/admin/fila/chamar-proximo`
- **Payload**: `{ barbearia_id: 1 }`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "cliente_chamado": {
        "id": "uuid",
        "nome": "João Silva",
        "telefone": "(81) 99999-9999",
        "barbeiro": "João Silva",
        "posicao": 1,
        "status": "atendendo"
      }
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **14. Iniciar Atendimento**
- **Endpoint**: `POST /api/admin/fila/iniciar-atendimento`
- **Payload**: `{ cliente_id: "uuid" }`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "message": "Atendimento iniciado com sucesso"
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **15. Finalizar Atendimento**
- **Endpoint**: `POST /api/admin/fila/finalizar-atendimento`
- **Payload**: `{ cliente_id: "uuid" }`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "message": "Atendimento finalizado com sucesso"
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **16. Remover Cliente**
- **Endpoint**: `POST /api/admin/fila/remover-cliente`
- **Payload**: `{ cliente_id: "uuid" }`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "message": "Cliente removido com sucesso"
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

---

## 📊 **Estatísticas e Relatórios**

### **17. Obter Estatísticas**
- **Endpoint**: `GET /api/admin/estatisticas?barbearia_id=:id`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "total_clientes_hoje": 45,
      "tempo_medio_atendimento": "25 minutos",
      "clientes_aguardando": 8,
      "barbeiros_ativos": 3,
      "faturamento_hoje": 1250.00
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **18. Obter Dashboard**
- **Endpoint**: `GET /api/admin/dashboard`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "barbearias": [
        {
          "id": 1,
          "nome": "Lucas Barbearia - Centro",
          "clientes_aguardando": 5,
          "barbeiros_ativos": 2,
          "status": "aberta"
        }
      ],
      "estatisticas_gerais": {
        "total_clientes_hoje": 45,
        "total_faturamento": 1250.00,
        "media_tempo_atendimento": "25 minutos"
      }
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

---

## 👥 **Usuários (Admin)**

### **19. Listar Usuários**
- **Endpoint**: `GET /api/admin/usuarios`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "usuarios": [
        {
          "id": "uuid",
          "nome": "João Silva",
          "email": "joao@lucasbarbearia.com",
          "role": "barbeiro",
          "telefone": "(81) 99999-9999",
          "barbearia_id": 1,
          "status": "ativo",
          "created_at": "2025-07-29T01:50:28.857231+00:00",
          "updated_at": "2025-07-29T02:06:29.649462+00:00"
        }
      ]
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **20. Criar Usuário**
- **Endpoint**: `POST /api/admin/usuarios`
- **Payload**:
  ```json
  {
    "nome": "João Silva",
    "email": "joao@lucasbarbearia.com",
    "senha": "senha123",
    "role": "barbeiro",
    "telefone": "(81) 99999-9999",
    "barbearia_id": 1
  }
  ```
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "usuario": {
        "id": "uuid",
        "nome": "João Silva",
        "email": "joao@lucasbarbearia.com",
        "role": "barbeiro",
        "telefone": "(81) 99999-9999",
        "barbearia_id": 1,
        "created_at": "2025-07-29T01:50:28.857231+00:00"
      }
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

---

## 🔧 **Configurações**

### **21. Obter Configurações**
- **Endpoint**: `GET /api/admin/configuracoes`
- **Frontend espera**:
  ```json
  {
    "success": true,
    "data": {
      "configuracoes": {
        "tempo_medio_atendimento": 25,
        "max_clientes_fila": 50,
        "notificacoes_whatsapp": true,
        "horario_funcionamento": "08:00-18:00"
      }
    }
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

### **22. Atualizar Configurações**
- **Endpoint**: `PUT /api/admin/configuracoes`
- **Payload**:
  ```json
  {
    "tempo_medio_atendimento": 30,
    "max_clientes_fila": 60,
    "notificacoes_whatsapp": false
  }
  ```
- **Frontend espera**:
  ```json
  {
    "success": true,
    "message": "Configurações atualizadas com sucesso"
  }
  ```
- **Backend retorna**: ❓ **PRECISA VERIFICAR**

---

## 📝 **Resumo dos Problemas Identificados**

### **❌ PROBLEMAS CONFIRMADOS:**
1. **Login**: Frontend espera `{ success, data: { user } }` mas backend retorna `{ token, user, expiresIn }` - **✅ CORRIGIDO**
2. **Verificar Usuário Atual (`/api/auth/me`)**: Backend não envolvia dados em `data.user` - **✅ CORRIGIDO**
3. **Listar Barbearias (`/api/barbearias`)**: Campos diferentes (`horario` vs `horario_funcionamento`) - **✅ CORRIGIDO**
4. **Listar Barbeiros (`/api/users/barbeiros`)**: Estrutura diferente (`data` vs `data.barbeiros`) - **✅ CORRIGIDO**
5. **Entrar na Fila (`/api/fila/entrar`)**: Campos faltando (`tempo_estimado`, `barbeiro`) - **✅ CORRIGIDO**

### **❓ PRECISA VERIFICAR:**
- Todos os outros endpoints (marcados com ❓)

### **✅ COMPATÍVEIS:**
- Logout

---

## 🛠️ **Próximos Passos**

1. **Testar cada endpoint** do backend e comparar com o que o frontend espera
2. **Corrigir incompatibilidades** identificadas
3. **Atualizar documentação** com as respostas reais do backend
4. **Implementar correções** no frontend ou backend conforme necessário

---

## 📋 **Checklist de Testes**

- [x] Login (`POST /api/auth/login`) - **✅ CORRIGIDO**
- [x] Logout (`POST /api/auth/logout`) - **✅ COMPATÍVEL**
- [x] Verificar usuário (`GET /api/auth/me`) - **✅ CORRIGIDO**
- [ ] Verificar status (`GET /api/auth/check`)
- [x] Listar barbearias (`GET /api/barbearias`) - **✅ CORRIGIDO**
- [x] Listar barbeiros (`GET /api/users/barbeiros`) - **✅ CORRIGIDO**
- [x] Entrar na fila (`POST /api/fila/entrar`) - **✅ CORRIGIDO**
- [ ] Visualizar fila (`GET /api/fila/:id`)
- [ ] Status do cliente (`GET /api/fila/status`)
- [ ] Gerenciamento de fila (admin)
- [ ] Estatísticas (`GET /api/admin/estatisticas`)
- [ ] Dashboard (`GET /api/admin/dashboard`)
- [ ] Usuários (`GET /api/admin/usuarios`)
- [ ] Configurações (`GET /api/admin/configuracoes`) 