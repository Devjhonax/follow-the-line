📚 Follow The Line

Sistema de acompanhamento de estudos com cronômetro, reflexões e análise de desempenho.


Visão geral
Follow The Line é uma aplicação web fullstack para estudantes que querem registrar e acompanhar suas sessões de estudo. Você cria tópicos (ex: Inglês, Python, Matemática), inicia sessões cronometradas, registra quanto tempo realmente estudou e responde reflexões ao final — tudo isso visualizado em um histórico com métricas de eficiência.

Stack
CamadaTecnologiaFrontendReact 19 + TypeScript + ViteBackendNode.js + Express + Prisma ORMBanco de dadosPostgreSQLAutenticaçãoJWT (header + cookie httpOnly)EstiloCSS Modules com design system em variáveis

Estrutura do monorepo
follow-the-line/
├── backend/                   # API RESTful
│   ├── prisma/
│   │   └── schema.prisma      # Models: User, Topic, Session, Reflection
│   ├── src/
│   │   ├── controllers/       # Recebe req/res, delega ao service
│   │   ├── services/          # Lógica de negócio e acesso ao banco
│   │   ├── routes/            # Definição de rotas
│   │   ├── middlewares/       # authenticate.js, errorHandler.js
│   │   ├── prisma/            # Singleton do PrismaClient
│   │   ├── utils/             # AppError, pagination
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
│
└── frontend/                  # SPA React + TypeScript
    ├── src/
    │   ├── componentes/
    │   │   ├── Login/         # Tela de login e cadastro
    │   │   ├── Dashboard/     # Tela principal com abas
    │   │   ├── Cardtopic/     # Card de tópico com formulário de sessão
    │   │   ├── Timer/         # Cronômetro ao vivo da sessão
    │   │   ├── Sessoes/       # Histórico expansível por tópico
    │   │   ├── Modal/         # Modal de reflexão pós-sessão
    │   │   ├── CampoCadTopic/ # Formulário de novo tópico
    │   │   ├── CampoInput/    # Input reutilizável
    │   │   └── Botao/         # Botão reutilizável com variantes
    │   ├── types.ts           # Interfaces TypeScript globais
    │   ├── App.tsx
    │   └── main.tsx
    └── index.html

Como rodar
Pré-requisitos

Node.js 18+
PostgreSQL rodando localmente (ou via Docker)

Backend
bashcd backend
cp .env.example .env
# Edite .env com sua DATABASE_URL e JWT_SECRET

npm install
npx prisma migrate dev --name init
npm run dev
O servidor sobe em http://localhost:3000.
Frontend
bashcd frontend
npm install
npm run dev
A aplicação abre em http://localhost:5173.

Atenção: o frontend espera a API em http://localhost:3000. Certifique-se de que o backend está rodando antes de abrir o frontend.


Variáveis de ambiente (backend)
Copie .env.example e preencha:
envDATABASE_URL=postgresql://user:password@localhost:5432/studytracker
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
CLIENT_URL=http://localhost:5173

Endpoints da API
Autenticação
MétodoRotaDescriçãoPOST/auth/registerCadastrar usuárioPOST/auth/loginLogin (retorna JWT no body e em cookie)GET/auth/meRetorna usuário logadoPOST/auth/logoutEncerra sessão (limpa cookie)
Tópicos (requer JWT)
MétodoRotaDescriçãoPOST/topicsCriar tópicoGET/topicsListar tópicos (paginado)GET/topics/:idBuscar tópico por IDDELETE/topics/:idDeletar tópicoGET/topics/:id/performanceMétricas de desempenho
Sessões (requer JWT)
MétodoRotaDescriçãoPOST/topics/:topicId/sessionsCriar sessãoGET/topics/:topicId/sessionsListar sessões do tópicoPUT/sessions/:id/endEncerrar sessão (registra tempo real)
Reflexões (requer JWT)
MétodoRotaDescriçãoPOST/sessions/:id/reflectionCriar reflexãoGET/sessions/:id/reflectionBuscar reflexão

Fluxo principal
Login / Cadastro
       ↓
   Dashboard
   ├── Criar tópico
   └── Iniciar sessão
            ↓
       Cronômetro ao vivo
            ↓
       Encerrar sessão  →  PUT /sessions/:id/end
            ↓
       Modal de reflexão  →  POST /sessions/:id/reflection
            ↓
   Aba Histórico  →  métricas por tópico

Regras de negócio

Usuário só acessa seus próprios tópicos (ownership verificado em todas as rotas)
Sessão só pode ser encerrada uma vez (realTime imutável após definido)
Reflexão só pode ser criada em sessões já encerradas
Cada sessão possui no máximo uma reflexão
Métricas de performance consideram apenas sessões encerradas
Senha mínima de 6 caracteres, armazenada com bcrypt
