import "dotenv/config"

import { useState } from 'react'
import Botao from '../Botao'
import './Modal.css'

interface ModalReflexaoProps {
  sessaoId: string
  onFechar: () => void
  onSalvo: () => void
}

const ModalReflexao = ({ sessaoId, onFechar, onSalvo }: ModalReflexaoProps) => {
  const [learned, setLearned] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [review, setReview] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  const salvar = async (evt: React.FormEvent) => {
    evt.preventDefault()
    if (!learned || !difficulty || !review) return setErro('Preencha todos os campos.')
    setSalvando(true)
    setErro('')
    try {
      const res = await fetch(import.meta.env.VITE_BACK_URL +`/sessions/${sessaoId}/reflection`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learned, difficulty, review }),
      })
      const data = await res.json()
      if (!res.ok) return setErro(data.mensagem ?? 'Erro ao salvar reflexão.')
      onSalvo()
      onFechar()
    } catch {
      setErro('Erro ao salvar reflexão.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__titulo">✦ Reflexão da sessão</h2>
          <button className="modal__fechar" onClick={onFechar}>✕</button>
        </div>

        <p className="modal__desc">
          Reserve um momento para refletir sobre o que você estudou nesta sessão.
        </p>

        <form className="modal__form" onSubmit={salvar}>
          <div className="modal__campo">
            <label>💡 O que aprendi</label>
            <textarea
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              placeholder="Descreva os principais conceitos ou habilidades que você absorveu..."
              rows={3}
              required
            />
          </div>
          <div className="modal__campo">
            <label>⚡ Dificuldades encontradas</label>
            <textarea
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              placeholder="O que foi desafiador? Onde você travou?"
              rows={3}
              required
            />
          </div>
          <div className="modal__campo">
            <label>O que revisar</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="O que você precisa estudar mais? Quais pontos requerem reforço?"
              rows={3}
              required
            />
          </div>

          {erro && <p className="modal__erro">{erro}</p>}

          <div className="modal__acoes">
            <Botao text="Cancelar" variante="ghost" onclick={onFechar} />
            <Botao text={salvando ? 'Salvando...' : 'Salvar reflexão'} type="submit" disabled={salvando} variante="sucesso" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalReflexao
