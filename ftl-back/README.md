# 📚 Follow The Line — API

API RESTful para sistema de acompanhamento de estudos. Permite criar tópicos, registrar sessões, responder reflexões e visualizar desempenho.

---

## 🛠️ Tecnologias

- Node.js + Express
- Prisma ORM + PostgreSQL
- JWT (header + cookie)
- Bcrypt
- dotenv / CORS

---

## 🚀 Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

### 3. Rodar migrations e gerar client Prisma
```bash
npx prisma migrate dev --name init
```

### 4. Iniciar o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

---

## 📁 Estrutura de pastas

```
src/
├── controllers/       # Recebe req/res, chama services
│   ├── auth.controller.js
│   ├── topic.controller.js
│   ├── session.controller.js
│   └── reflection.controller.js
├── services/          # Lógica de negócio, acesso ao banco
│   ├── auth.service.js
│   ├── topic.service.js
│   ├── session.service.js
│   └── reflection.service.js
├── routes/            # Definição de rotas e middlewares
│   ├── auth.routes.js
│   ├── topic.routes.js
│   ├── session.routes.js
│   └── reflection.routes.js
├── middlewares/
│   ├── authenticate.js   # Valida JWT
│   └── errorHandler.js   # Handler global de erros
├── prisma/
│   └── client.js         # Singleton do PrismaClient
├── utils/
│   ├── AppError.js       # Classe de erro operacional
│   └── pagination.js     # Helpers de paginação
├── app.js
└── server.js
prisma/
└── schema.prisma
```

---

## 🔐 Autenticação

O token JWT pode ser enviado de duas formas:

**Header:**
```
Authorization: Bearer <token>
```

**Cookie** (definido automaticamente no login):
```
token=<token>
```

---

## 📡 Endpoints

### Auth

| Método | Rota             | Descrição         | Auth |
|--------|------------------|-------------------|------|
| POST   | /auth/register   | Cadastrar usuário | ❌   |
| POST   | /auth/login      | Login             | ❌   |

**POST /auth/register**
```json
{ "username": "joao", "password": "123456" }
```

**POST /auth/login**
```json
{ "username": "joao", "password": "123456" }
```
Retorna `token` JWT e dados do usuário.

---

### Topics

| Método | Rota                    | Descrição              | Auth |
|--------|-------------------------|------------------------|------|
| POST   | /topics                 | Criar tópico           | ✅   |
| GET    | /topics                 | Listar tópicos         | ✅   |
| GET    | /topics/:id             | Buscar tópico por ID   | ✅   |
| DELETE | /topics/:id             | Deletar tópico         | ✅   |
| GET    | /topics/:id/performance | Performance do tópico  | ✅   |

**POST /topics**
```json
{ "name": "Inglês" }
```

**GET /topics** — suporta paginação:
```
GET /topics?page=1&limit=10
```

---

### Sessions

| Método | Rota                          | Descrição                        | Auth |
|--------|-------------------------------|----------------------------------|------|
| POST   | /topics/:topicId/sessions     | Criar sessão                     | ✅   |
| GET    | /topics/:topicId/sessions     | Listar sessões do tópico         | ✅   |
| PUT    | /sessions/:id/end             | Encerrar sessão (definir tempo real) | ✅   |

**POST /topics/:topicId/sessions**
```json
{ "plannedTime": 60 }
```

**PUT /sessions/:id/end**
```json
{ "realTime": 45 }
```

---

### Reflections

| Método | Rota                       | Descrição              | Auth |
|--------|----------------------------|------------------------|------|
| POST   | /sessions/:id/reflection   | Criar reflexão         | ✅   |
| GET    | /sessions/:id/reflection   | Buscar reflexão        | ✅   |

**POST /sessions/:id/reflection**
```json
{
  "learned": "Aprendi passado simples em inglês",
  "difficulty": "Conjugações irregulares foram difíceis",
  "review": "Preciso revisar os verbos irregulares"
}
```

---

### Performance

**GET /topics/:id/performance**

Retorna análise completa do tópico:

```json
{
  "topicId": "uuid",
  "topicName": "Inglês",
  "totalSessions": 5,
  "completedSessions": 4,
  "totalPlannedTime": 240,
  "totalRealTime": 210,
  "difference": -30,
  "percentage": 87.5,
  "reflections": [
    {
      "sessionId": "uuid",
      "sessionDate": "2024-03-01T10:00:00.000Z",
      "plannedTime": 60,
      "realTime": 45,
      "reflection": {
        "learned": "...",
        "difficulty": "...",
        "review": "..."
      }
    }
  ]
}
```

> `percentage`: tempo real / tempo planejado × 100  
> `difference`: tempo real − tempo planejado (negativo = estudou menos que o planejado)

---

## ⚙️ Variáveis de ambiente

| Variável     | Descrição                            | Exemplo                                              |
|--------------|--------------------------------------|------------------------------------------------------|
| DATABASE_URL | String de conexão PostgreSQL         | postgresql://user:pass@localhost:5432/studytracker   |
| JWT_SECRET   | Segredo para assinar tokens JWT      | minha_chave_secreta                                  |
| PORT         | Porta do servidor                    | 3000                                                 |
| CLIENT_URL   | Origem permitida no CORS (opcional)  | http://localhost:5173                                |

---

## 🧠 Regras de negócio

- Usuário só acessa seus próprios tópicos (ownership verificado em todas as rotas)
- Senha mínima de 6 caracteres, armazenada com bcrypt
- Reflexão só pode ser criada após encerrar a sessão (`PUT /sessions/:id/end`)
- Cada sessão só pode ter uma reflexão
- Cada sessão só pode ser encerrada uma vez
- Performance considera apenas sessões já encerradas (`realTime !== null`)

---

## 🔒 Segurança

- Todas as rotas (exceto `/auth`) requerem JWT válido
- Token aceito via `Authorization: Bearer` ou cookie `httpOnly`
- Erros de autenticação retornam `401`, acesso negado `403`
- Erros operacionais retornam mensagens claras; erros inesperados retornam `500` sem expor stack trace
