import { useState } from 'react'
import Botao from '../Botao'
import Timer from '../Timer'
import ModalReflexao from '../Modal'
import type { Sessao } from '../../types'
import './Cardtopic.css'

interface CardtopicProps {
  title: string
  sessions: number
  id: string
  onTopic: () => void
}

const Cardtopic = ({ title, sessions, id, onTopic }: CardtopicProps) => {
  const [plannedTime, setPlannedTime] = useState('')
  const [unidade, setUnidade] = useState('')
  const [sessaoAtiva, setSessaoAtiva] = useState<Sessao | null>(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [iniciando, setIniciando] = useState(false)

  const labelSessao = sessions === 1 ? '1 sessão' : `${sessions} sessões`

  const iniciarSessao = async (evt: React.FormEvent) => {
    evt.preventDefault()
    if (!plannedTime || !unidade) return
    const tempoEmMinutos = unidade === 'Hora(s)' ? Number(plannedTime) * 60 : Number(plannedTime)
    if (tempoEmMinutos <= 0) return

    setIniciando(true)
    try {
      const resp = await fetch( import.meta.env.VITE_BACK_URL +`/topics/${id}/sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plannedTime: tempoEmMinutos }),
      })
      const dados = await resp.json()
      if (resp.status === 201) {
        setSessaoAtiva({ ...dados, plannedTime: tempoEmMinutos, realTime: null, reflection: null })
        setPlannedTime('')
        setUnidade('')
        onTopic()
      } else {
        window.alert(dados.mensagem ?? 'Erro ao criar sessão.')
      }
    } catch {
      window.alert('Erro de conexão.')
    } finally {
      setIniciando(false)
    }
  }

  const aoEncerrarTimer = () => {
    setMostrarModal(true)
    onTopic()
  }

  const aoSalvarReflexao = () => {
    setSessaoAtiva(null)
    setMostrarModal(false)
    onTopic()
  }

  const aoCancelarReflexao = () => {
    setSessaoAtiva(null)
    setMostrarModal(false)
  }

  const deletarTopico = async (evt: React.MouseEvent) => {
    evt.preventDefault()
    if (!window.confirm(`Deletar "${title}"? Todas as sessões serão removidas.`)) return
    try {
      const resp = await fetch(import.meta.env.VITE_BACK_URL +`/topics/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (resp.status === 204) onTopic()
      else window.alert('Erro ao deletar.')
    } catch {
      window.alert('Erro de conexão.')
    }
  }

  return (
    <>
      <div className="card">
        <div className="card__header">
          <div>
            <h3 className="card__titulo">{title}</h3>
            <span className="card__contador">{labelSessao}</span>
          </div>
          <button className="card__del" onClick={deletarTopico} title="Deletar tópico">🗑</button>
        </div>

        {sessaoAtiva ? (
          <Timer
            sessaoId={sessaoAtiva.id}
            plannedTime={sessaoAtiva.plannedTime}
            onEncerrada={aoEncerrarTimer}
          />
        ) : (
          <form className="card__form" onSubmit={iniciarSessao}>
            <p className="card__hint">Iniciar sessão de estudo</p>
            <div className="card__inputs">
              <input
                className="card__input-tempo"
                type="number"
                min="1"
                placeholder="30"
                value={plannedTime}
                onChange={(e) => setPlannedTime(e.target.value)}
                required
              />
              <select
                className="card__select"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                required
              >
                <option value="" disabled>unidade</option>
                <option value="Minuto(s)">min</option>
                <option value="Hora(s)">hr</option>
              </select>
            </div>
            <Botao
              text={iniciando ? '...' : '▶ Iniciar'}
              type="submit"
              disabled={iniciando}
              variante="sucesso"
              classe="card__btn"
            />
          </form>
        )}
      </div>
      {mostrarModal && sessaoAtiva && (
        <ModalReflexao
          sessaoId={sessaoAtiva.id}
          onFechar={aoCancelarReflexao}
          onSalvo={aoSalvarReflexao}
        />
      )}
    </>
  )
}

export default Cardtopic
