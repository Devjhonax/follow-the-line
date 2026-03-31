import prisma from '../prisma/client.js'
import AppError from '../utils/AppError.js'

class ReflectionService {
  async criar(userId, sessaoId, { learned, difficulty, review }) {
    if (!learned || !difficulty || !review) {
      throw new AppError('Os campos learned, difficulty e review são obrigatórios.', 400)
    }

    const sessao = await prisma.session.findUnique({
      where: { id: sessaoId },
      include: { topic: true, reflection: true },
    })

    if (!sessao) throw new AppError('Sessão não encontrada.', 404)
    if (sessao.topic.userId !== userId) throw new AppError('Acesso negado.', 403)

    if (sessao.realTime === null) {
      throw new AppError('Encerre a sessão antes de adicionar uma reflexão.', 409)
    }

    if (sessao.reflection) {
      throw new AppError('Esta sessão já possui uma reflexão.', 409)
    }

    const reflexao = await prisma.reflection.create({
      data: {
        sessionId: sessaoId,
        learned: learned.trim(),
        difficulty: difficulty.trim(),
        review: review.trim(),
      },
    })

    return reflexao
  }

  async buscar(userId, sessaoId) {
    const sessao = await prisma.session.findUnique({
      where: { id: sessaoId },
      include: { topic: true, reflection: true },
    })

    if (!sessao) throw new AppError('Sessão não encontrada.', 404)
    if (sessao.topic.userId !== userId) throw new AppError('Acesso negado.', 403)
    if (!sessao.reflection) throw new AppError('Esta sessão ainda não possui reflexão.', 404)

    return sessao.reflection
  }
}

export default new ReflectionService()
