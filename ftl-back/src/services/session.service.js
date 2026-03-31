import prisma from '../prisma/client.js'
import AppError from '../utils/AppError.js'
import { parsePagination, paginate } from '../utils/pagination.js'

class SessionService {
  async criar(userId, topicoId, tempoPlanejado) {
    if (!tempoPlanejado || isNaN(tempoPlanejado) || tempoPlanejado <= 0) {
      throw new AppError('plannedTime deve ser um número inteiro positivo (minutos).', 400)
    }

    const topico = await prisma.topic.findUnique({ where: { id: topicoId } })
    if (!topico) throw new AppError('Tópico não encontrado.', 404)
    if (topico.userId !== userId) throw new AppError('Acesso negado.', 403)

    const sessao = await prisma.session.create({
      data: { topicId: topicoId, plannedTime: parseInt(tempoPlanejado) },
    })

    return sessao
  }

  async listar(userId, topicoId, query) {
    const topico = await prisma.topic.findUnique({ where: { id: topicoId } })
    if (!topico) throw new AppError('Tópico não encontrado.', 404)
    if (topico.userId !== userId) throw new AppError('Acesso negado.', 403)

    const { page, limit, skip, take } = parsePagination(query)

    const [sessoes, total] = await Promise.all([
      prisma.session.findMany({
        where: { topicId: topicoId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { reflection: true },
      }),
      prisma.session.count({ where: { topicId: topicoId } }),
    ])

    return paginate(sessoes, total, page, limit)
  }

  async encerrar(userId, sessaoId, tempoReal) {
    if (!tempoReal || isNaN(tempoReal) || tempoReal <= 0) {
      throw new AppError('realTime deve ser um número inteiro positivo (minutos).', 400)
    }

    const sessao = await prisma.session.findUnique({
      where: { id: sessaoId },
      include: { topic: true },
    })

    if (!sessao) throw new AppError('Sessão não encontrada.', 404)
    if (sessao.topic.userId !== userId) throw new AppError('Acesso negado.', 403)
    if (sessao.realTime !== null) throw new AppError('Esta sessão já foi encerrada.', 409)

    const sessaoAtualizada = await prisma.session.update({
      where: { id: sessaoId },
      data: { realTime: parseInt(tempoReal) },
    })

    return sessaoAtualizada
  }
}

export default new SessionService()
