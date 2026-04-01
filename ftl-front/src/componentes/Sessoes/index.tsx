import "dotenv/config"

import { useEffect, useState } from 'react'
import ModalReflexao from '../Modal'
import type { Sessao } from '../../types'
import './Sessoes.css'

interface SessoesProps {
  topicoId: string
  title: string
}

const formatarMinutos = (min: number | null) => {
  if (min === null) return '—'
  if (min >= 60) return `${(min / 60).toFixed(1)}h`
  return `${min}min`
}

const Sessoes = ({ topicoId, title }: SessoesProps) => {
  const [aberto, setAberto] = useState(false)
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [sessaoParaRefletir, setSessaoParaRefletir] = useState<string | null>(null)

  const buscarSessoes = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_BACK_URL + `/topics/${topicoId}/sessions?limit=50`, {
        credentials: 'include',
      })
      const { dados } = await res.json()
      setSessoes(dados ?? [])
    } catch {}
  }

  useEffect(() => { buscarSessoes() }, [topicoId])

  const toggleAberto = () => {
    setAberto((v) => !v)
    if (!aberto) buscarSessoes()
  }

  const totalPlanejado = sessoes.reduce((s, e) => s + e.plannedTime, 0)
  const totalReal = sessoes.reduce((s, e) => s + (e.realTime ?? 0), 0)
  const percentual = totalPlanejado > 0 ? Math.round((totalReal / totalPlanejado) * 100) : 0
  const encerradas = sessoes.filter((s) => s.realTime !== null).length

  return (
    <>
      <div className="sessoes">
        <div className="sessoes__header" onClick={toggleAberto} role="button">
          <div className="sessoes__info">
            <div className="sessoes__dot" />
            <div>
              <strong className="sessoes__nome">{title}</strong>
              <span className="sessoes__resumo">
                {sessoes.length} sessões · {encerradas} encerradas · {percentual}% eficiência
              </span>
            </div>
          </div>
          <span className={`sessoes__chevron ${aberto ? 'sessoes__chevron--aberto' : ''}`}>›</span>
        </div>

        {aberto && (
          <div className="sessoes__lista">
            <div className="sessoes__metricas">
              <div className="sessao-metrica">
                <span className="sessao-metrica__valor">{formatarMinutos(totalPlanejado)}</span>
                <span className="sessao-metrica__label">Planejado</span>
              </div>
              <div className="sessao-metrica">
                <span className="sessao-metrica__valor">{formatarMinutos(totalReal)}</span>
                <span className="sessao-metrica__label">Real</span>
              </div>
              <div className="sessao-metrica">
                <span className={`sessao-metrica__valor ${percentual >= 100 ? 'sessao-metrica__valor--ok' : ''}`}>
                  {percentual}%
                </span>
                <span className="sessao-metrica__label">Eficiência</span>
              </div>
            </div>

            <div className="sessoes__eficiencia-barra">
              <div className="sessoes__eficiencia-fill" style={{ width: `${Math.min(percentual, 100)}%` }} />
            </div>

            {/* Itens */}
            {sessoes.length === 0 ? (
              <p className="sessoes__vazio">Nenhuma sessão registrada ainda.</p>
            ) : (
              sessoes.map((sessao, idx) => (
                <div key={sessao.id} className="sessao-item">
                  <div className="sessao-item__header">
                    <span className="sessao-item__num">#{idx + 1}</span>
                    <div className="sessao-item__tempos">
                      <span>⏱ {formatarMinutos(sessao.plannedTime)}</span>
                      <span className={sessao.realTime ? 'sessao-item__real--ok' : 'sessao-item__andamento'}>
                        {sessao.realTime ? `✓ ${formatarMinutos(sessao.realTime)}` : '● Em andamento'}
                      </span>
                    </div>
                  </div>

                  {sessao.reflection ? (
                    <div className="sessao-item__reflexao">
                      <div className="reflexao-campo">
                        <span className="reflexao-campo__titulo">💡 Aprendi</span>
                        <p>{sessao.reflection.learned}</p>
                      </div>
                      <div className="reflexao-campo">
                        <span className="reflexao-campo__titulo">⚡ Dificuldade</span>
                        <p>{sessao.reflection.difficulty}</p>
                      </div>
                      <div className="reflexao-campo">
                        <span className="reflexao-campo__titulo">🔁 Revisar</span>
                        <p>{sessao.reflection.review}</p>
                      </div>
                    </div>
                  ) : sessao.realTime !== null ? (
                    <button
                      className="sessao-item__add-reflexao"
                      onClick={() => setSessaoParaRefletir(sessao.id)}
                    >
                      + Adicionar reflexão
                    </button>
                  ) : null}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {sessaoParaRefletir && (
        <ModalReflexao
          sessaoId={sessaoParaRefletir}
          onFechar={() => setSessaoParaRefletir(null)}
          onSalvo={() => { setSessaoParaRefletir(null); buscarSessoes() }}
        />
      )}
    </>
  )
}

export default Sessoes
