import "dotenv/config"

import { useState, useEffect, useRef } from 'react'
import Botao from '../Botao'
import './Timer.css'

interface TimerProps {
  sessaoId: string
  plannedTime: number
  onEncerrada: () => void
}

const formatar = (segundos: number) => {
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = segundos % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const Timer = ({ sessaoId, plannedTime, onEncerrada }: TimerProps) => {
  const [segundos, setSegundos] = useState(0)
  const [encerrando, setEncerrando] = useState(false)
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervaloRef.current = setInterval(() => setSegundos((s) => s + 1), 1000)
    return () => { if (intervaloRef.current) clearInterval(intervaloRef.current) }
  }, [])

  const limiteSegundos = plannedTime * 60
  const percentual = Math.min((segundos / limiteSegundos) * 100, 100)
  const ultrapassou = segundos > limiteSegundos

  const encerrar = async () => {
    if (intervaloRef.current) clearInterval(intervaloRef.current)
    setEncerrando(true)
    const tempoRealMinutos = Math.max(1, Math.round(segundos / 60))
    try {
      const res = await fetch(process.env.BACK_URL +`/sessions/${sessaoId}/end`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ realTime: tempoRealMinutos }),
      })
      if (res.ok) onEncerrada()
      else window.alert('Erro ao encerrar sessão.')
    } catch {
      window.alert('Erro de conexão ao encerrar sessão.')
    } finally {
      setEncerrando(false)
    }
  }

  return (
    <div className="timer">
      <div className="timer__display">
        <span className={`timer__tempo ${ultrapassou ? 'timer__tempo--ultra' : ''}`}>
          {formatar(segundos)}
        </span>
        <span className="timer__meta">meta: {formatar(limiteSegundos)}</span>
      </div>

      <div className="timer__barra-container">
        <div
          className={`timer__barra ${ultrapassou ? 'timer__barra--ultra' : ''}`}
          style={{ width: `${percentual}%` }}
        />
      </div>

      <Botao
        text={encerrando ? 'Encerrando...' : '⏹ Encerrar sessão'}
        variante="perigo"
        onclick={encerrar}
        disabled={encerrando}
        classe="timer__btn"
      />
    </div>
  )
}

export default Timer
