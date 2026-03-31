export interface Usuario {
  id: string
  username: string
  criadoEm: string
}

export interface Topico {
  id: string
  name: string
  userId: string
  createdAt: string
  _count?: { sessions: number }
}

export interface Sessao {
  id: string
  topicId: string
  plannedTime: number
  realTime: number | null
  createdAt: string
  reflection: Reflexao | null
}

export interface Reflexao {
  id: string
  sessionId: string
  learned: string
  difficulty: string
  review: string
  createdAt: string
}

export interface RespostaApi<T> {
  dados?: T
  mensagem?: string
  meta?: {
    total: number
    pagina: number
    limite: number
    totalPaginas: number
  }
}

export interface LoginPayload {
  mensagem: string
  token: string
  usuario: Usuario
}
