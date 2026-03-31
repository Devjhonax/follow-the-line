export default function tratadorDeErros(err, req, res, next) {
  if (err.code === 'P2002') {
    return res.status(409).json({ mensagem: 'Registro duplicado: já existe um valor único igual.' })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ mensagem: 'Registro não encontrado.' })
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({ mensagem: err.message })
  }

  console.error('💥 Erro inesperado:', err)
  return res.status(500).json({ mensagem: 'Erro interno do servidor.' })
}
