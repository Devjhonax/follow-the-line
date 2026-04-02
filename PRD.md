# PRD — Follow The Line

**Versão:** 1.0  
**Status:** Em desenvolvimento  
**Autor:** Jhonathas  
**Última atualização:** Abril 2026

---

## 1. Problema

Estudantes autodidatas têm dificuldade em manter consistência nos estudos porque:

1. Não registram quanto tempo realmente dedicam a cada matéria
2. Planejam sessões mas raramente medem se o cumprimento foi fiel ao plano
3. Não refletem sobre o que aprenderam, dificultando a retenção e a revisão
4. Não têm visibilidade do progresso acumulado ao longo do tempo

O resultado é estudo sem foco, sem rastreamento e sem aprendizado metacognitivo.

---

## 2. Solução

**Follow The Line** é um sistema web de acompanhamento de estudos que fecha o ciclo completo:

```
Planejar → Executar → Refletir → Analisar
```

O usuário cria tópicos de estudo, inicia sessões cronometradas, encerra registrando o tempo real e responde três perguntas de reflexão. Tudo isso é consolidado em métricas de eficiência por tópico.

---

## 3. Público-alvo

| Perfil | Descrição |
|--------|-----------|
| Primário | Estudantes universitários com múltiplas matérias para acompanhar |
| Secundário | Autodidatas em tecnologia, idiomas ou concursos |
| Fora do escopo | Equipes / uso corporativo (v1) |

---

## 4. Objetivos de produto (v1)

| # | Objetivo | Métrica de sucesso |
|---|----------|--------------------|
| 1 | Usuário consegue registrar uma sessão de estudo do início ao fim | Taxa de conclusão do fluxo ≥ 80% |
| 2 | Usuário preenche reflexão após sessão | ≥ 60% das sessões encerradas têm reflexão |
| 3 | Usuário visualiza seu desempenho por tópico | Aba de histórico acessada em ≥ 50% das visitas |
| 4 | Sistema é confiável e não perde dados de sessão | Zero perda de `realTime` após encerramento |

---

## 5. Funcionalidades

### 5.1 Autenticação

- Cadastro com username único e senha (mínimo 6 caracteres)
- Login com JWT retornado no body e em cookie `httpOnly`
- Verificação de sessão ativa ao carregar o app (`GET /auth/me`)
- Logout com limpeza de cookie

**Fora do escopo (v1):** OAuth, recuperação de senha, 2FA

---

### 5.2 Tópicos

- Criar tópico com nome livre (ex: "Inglês", "Python", "Cálculo")
- Listar todos os tópicos do usuário com contagem de sessões
- Deletar tópico (remove em cascata todas as sessões e reflexões)

---

### 5.3 Sessões

- Criar sessão com tempo planejado (minutos ou horas)
- Cronômetro ao vivo que inicia automaticamente ao criar sessão
- Barra de progresso visual em relação ao tempo planejado
- Alerta visual quando o tempo planejado é ultrapassado
- Encerrar sessão: registra o tempo real estudado (calculado pelo cronômetro)
- Sessão só pode ser encerrada uma vez

---

### 5.4 Reflexões

- Modal exibido automaticamente ao encerrar sessão
- Três campos obrigatórios:
  - **O que aprendi** — síntese do conteúdo absorvido
  - **Dificuldades** — pontos onde travou ou ficou com dúvida
  - **O que revisar** — tópicos que precisam de reforço
- Possibilidade de adicionar reflexão retroativamente em sessões sem nota
- Cada sessão possui no máximo uma reflexão

---

### 5.5 Histórico e métricas

- Aba separada no dashboard para visualizar o histórico completo
- Por tópico: total planejado, total real, % de eficiência
- Barra visual de eficiência (gradiente roxo → rosa)
- Lista expansível de todas as sessões com seus tempos e reflexões

---

## 6. Arquitetura

```
┌──────────────────────┐        ┌─────────────────────────────┐
│   React + TypeScript │ ──────▶│   Express API (Node.js)     │
│   Vite / SPA         │  JWT   │   Controllers → Services     │
│   CSS Variables      │ cookie │   Prisma ORM                │
└──────────────────────┘        └──────────────┬──────────────┘
                                               │
                                        ┌──────▼──────┐
                                        │  PostgreSQL  │
                                        └─────────────┘
```

**Padrão de camadas no backend:**

```
Route → Middleware (auth) → Controller → Service → Prisma → DB
```

---

## 7. Modelo de dados

```
User
 └── Topic (1:N)
      └── Session (1:N)
           └── Reflection (1:1)
```

| Entidade | Campos principais |
|----------|-------------------|
| `User` | id, username (único), password (hash bcrypt) |
| `Topic` | id, name, userId |
| `Session` | id, topicId, plannedTime (min), realTime (min, nullable) |
| `Reflection` | id, sessionId, learned, difficulty, review |

---

## 8. Fora do escopo (v1)

- App mobile nativo
- Compartilhamento de progresso entre usuários
- Metas de estudo diárias / semanais
- Notificações push ou lembretes
- Integração com calendário
- Exportação de dados (PDF, CSV)
- Modo colaborativo / grupos de estudo
- Gamificação (badges, streaks)

---

## 9. Riscos e mitigações

| Risco | Probabilidade | Mitigação |
|-------|--------------|-----------|
| Usuário fecha o navegador durante sessão e perde o cronômetro | Alta | Salvar `startTime` no localStorage para recuperar ao reabrir |
| Cookie não funcionar em ambiente de produção com HTTPS misto | Média | Garantir `secure: true` + `sameSite: none` em produção |
| Dados de reflexão perdidos se a API cair após encerrar sessão | Baixa | Frontend salva formulário no estado antes de enviar; exibe erro com opção de reenvio |

---

## 10. Roadmap pós-v1

| Versão | Funcionalidade |
|--------|---------------|
| v1.1 | Recuperação de sessão interrompida (localStorage) |
| v1.2 | Metas semanais por tópico + dashboard de streak |
| v1.3 | Exportação do histórico em PDF |
| v2.0 | App mobile (React Native) |
