import prisma from '../prisma/client.js'
import AppError from '../utils/AppError.js'
import { parsePagination, paginate } from '../utils/pagination.js'

class TopicService {
  async criar(userId, nome) {
    if (!nome || !nome.trim()) {
      throw new AppError('O nome do tópico é obrigatório.', 400)
    }

    const topico = await prisma.topic.create({
      data: { name: nome.trim(), userId },
    })

    return topico
  }

  async listar(userId, query) {
    const { page, limit, skip, take } = parsePagination(query)

    const [topicos, total] = await Promise.all([
      prisma.topic.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "asc" },
        include: { _count: { select: { sessions: true } } },
      }),
      prisma.topic.count({ where: { userId } }),
    ])

    return paginate(topicos, total, page, limit)
  }

  async buscarPorId(userId, topicoId) {
    const topico = await prisma.topic.findUnique({
      where: { id: topicoId },
      include: { _count: { select: { sessions: true } } },
    })

    if (!topico) throw new AppError('Tópico não encontrado.', 404)
    if (topico.userId !== userId) throw new AppError('Acesso negado.', 403)

    return topico
  }

  async deletar(userId, topicoId) {
    const topico = await prisma.topic.findUnique({ where: { id: topicoId } })

    if (!topico) throw new AppError('Tópico não encontrado.', 404)
    if (topico.userId !== userId) throw new AppError('Acesso negado.', 403)

    await prisma.topic.delete({ where: { id: topicoId } })
  }

  async calcularPerformance(userId, topicoId) {
    const topico = await prisma.topic.findUnique({
      where: { id: topicoId },
      include: {
        sessions: {
          include: { reflection: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!topico) throw new AppError('Tópico não encontrado.', 404)
    if (topico.userId !== userId) throw new AppError('Acesso negado.', 403)

    const sessoesEncerradas = topico.sessions.filter((s) => s.realTime !== null)

    const totalTempoPlanejado = sessoesEncerradas.reduce((soma, s) => soma + s.plannedTime, 0)
    const totalTempoReal = sessoesEncerradas.reduce((soma, s) => soma + (s.realTime ?? 0), 0)
    const diferenca = totalTempoReal - totalTempoPlanejado
    const percentual =
      totalTempoPlanejado > 0
        ? parseFloat(((totalTempoReal / totalTempoPlanejado) * 100).toFixed(2))
        : 0

    const reflexoes = sessoesEncerradas
      .filter((s) => s.reflection)
      .map((s) => ({
        sessaoId: s.id,
        dataSessao: s.createdAt,
        tempoPlanejado: s.plannedTime,
        tempoReal: s.realTime,
        reflexao: s.reflection,
      }))

    return {
      topicoId: topico.id,
      nomeTopico: topico.name,
      totalSessoes: topico.sessions.length,
      sessoesEncerradas: sessoesEncerradas.length,
      totalTempoPlanejado,
      totalTempoReal,
      diferenca,
      percentual,
      reflexoes,
    }
  }
}

export default new TopicService()
