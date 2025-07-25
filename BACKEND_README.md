# Lucas Barbearia - Backend (Fastify + Supabase)

## Visão Geral

O **Lucas Barbearia** é um sistema de gerenciamento de filas para barbearias com múltiplas unidades. Este documento serve como guia para o desenvolvimento do backend utilizando **Fastify** e **Supabase** (PostgreSQL).

---

## Funcionalidades Principais
- Sistema de filas por barbearia
- QR Code para entrada na fila
- Dashboard administrativo com 3 perfis (Admin, Gerente, Barbeiro)
- Sistema de avaliações
- Multi-unidades (3 barbearias)
- Ativação/desativação de barbeiros por unidade
- Fila universal baseada em tempo de chegada
- Histórico de atendimentos

---

## Stack Tecnológica
- **Fastify** (framework principal)
- **@fastify/jwt** (autenticação JWT)
- **@fastify/cors** (CORS)
- **@fastify/helmet** (segurança)
- **bcrypt** (hash de senhas)
- **joi** (validação de schemas)
- **Supabase** (PostgreSQL)
- **@supabase/supabase-js** (cliente)

---

## Estrutura do Banco de Dados (Supabase)

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'gerente', 'barbeiro')),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);
```

### barbearias
```sql
CREATE TABLE barbearias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco TEXT NOT NULL,
  telefone VARCHAR(20),
  whatsapp VARCHAR(20),
  instagram VARCHAR(100),
  horario JSONB NOT NULL,
  configuracoes JSONB NOT NULL,
  servicos JSONB NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### barbeiros_barbearias
```sql
CREATE TABLE barbeiros_barbearias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  especialidade VARCHAR(255),
  dias_trabalho JSONB NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  disponivel BOOLEAN DEFAULT true,
  ativo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, barbearia_id)
);
```

### clientes
```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'proximo', 'atendendo', 'finalizado')),
  posicao INTEGER NOT NULL,
  tempo_estimado INTEGER,
  data_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atendimento TIMESTAMP WITH TIME ZONE,
  data_finalizacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### avaliacoes
```sql
CREATE TABLE avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  categoria VARCHAR(50) CHECK (categoria IN ('atendimento', 'qualidade', 'ambiente', 'tempo', 'preco')),
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### historico_atendimentos
```sql
CREATE TABLE historico_atendimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  barbearia_id INTEGER REFERENCES barbearias(id) ON DELETE CASCADE,
  barbeiro_id UUID REFERENCES users(id),
  servico VARCHAR(255),
  duracao INTEGER,
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_fim TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Estrutura de Pastas Sugerida

```
src/
├── app.js
├── config/
├── plugins/
├── routes/
├── controllers/
├── services/
├── middlewares/
├── schemas/
└── utils/
```

---

## Autenticação e Permissões
- JWT obrigatório para rotas protegidas
- Roles: `admin`, `gerente`, `barbeiro`
- Middleware para checagem de acesso à barbearia

---

## Endpoints RESTful

### 1. Autenticação
- `POST /api/auth/login` — Login de usuário
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Dados do usuário autenticado

### 2. Usuários (Admin)
- `POST /api/users` — Criar usuário
- `GET /api/users` — Listar usuários
- `PUT /api/users/:id` — Atualizar usuário
- `DELETE /api/users/:id` — Remover usuário

### 3. Barbearias
- `GET /api/barbearias` — Listar barbearias
- `POST /api/barbearias` — Criar barbearia
- `PUT /api/barbearias/:id` — Atualizar barbearia
- `DELETE /api/barbearias/:id` — Remover barbearia

### 4. Barbeiros e Ativação
- `GET /api/barbearias/:id/barbeiros` — Listar barbeiros da barbearia
- `POST /api/barbearias/:id/barbeiros/:barbeiroId/ativar` — Ativar barbeiro
- `POST /api/barbearias/:id/barbeiros/:barbeiroId/desativar` — Desativar barbeiro

### 5. Fila de Clientes
- `POST /api/barbearias/:id/fila/entrar` — Cliente entra na fila
- `GET /api/barbearias/:id/fila` — Fila atual e estatísticas
- `GET /api/barbearias/:id/fila/status/:token` — Status do cliente
- `DELETE /api/barbearias/:id/fila/sair/:token` — Sair da fila

### 6. Gerenciamento da Fila (Admin/Barbeiro)
- `POST /api/barbearias/:id/fila/proximo` — Chamar próximo cliente
- `POST /api/barbearias/:id/fila/finalizar/:clienteId` — Finalizar atendimento
- `POST /api/barbearias/:id/fila/adicionar` — Adicionar cliente manualmente
- `DELETE /api/barbearias/:id/fila/remover/:clienteId` — Remover cliente

### 7. Avaliações
- `POST /api/avaliacoes` — Enviar avaliação
- `GET /api/avaliacoes` — Listar avaliações (com filtros)

### 8. Histórico e Relatórios
- `GET /api/barbearias/:id/historico` — Histórico de atendimentos
- `GET /api/relatorios/barbearias/:id` — Relatórios e estatísticas

---

## Regras de Negócio
- Fila universal por tempo de chegada, mas barbeiro só pode chamar clientes que escolheram ele ou "Fila Geral"
- Barbeiro pode estar ativo em apenas uma barbearia por vez
- Cada cliente recebe um token único ao entrar na fila
- Estatísticas devem ser calculadas em tempo real

---

## Exemplo de Rota Protegida Fastify

```js
fastify.get('/api/barbearias', { preValidation: [fastify.authenticate] }, async (request, reply) => {
  // ... lógica
})
```

---

## Observações
- Todos os endpoints devem validar dados de entrada e saída
- Usar JWT para autenticação e autorização
- Implementar RLS (Row Level Security) no Supabase para máxima segurança
- O frontend já está pronto para consumir endpoints RESTful
- O sistema deve ser multi-unidade e multi-usuário desde o início

---

**Dúvidas ou detalhes adicionais, consulte o README do frontend ou entre em contato com o responsável pelo projeto.** 