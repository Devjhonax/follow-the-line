import "dotenv/config"

import { useEffect, useState } from 'react'
import Cardtopic from '../Cardtopic'
import CampoCadTopic from '../CampoCadTopic'
import Sessoes from '../Sessoes'
import type { Topico } from '../../types'
import './Dashboard.css'

interface DashboardProps {
  username: string
  aoSair: () => void
}

const Dashboard = ({ username, aoSair }: DashboardProps) => {
  const [topicos, setTopicos] = useState<Topico[]>([])
  const [carregando, setCarregando] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<'topicos' | 'historico'>('topicos')

  const buscarTopicos = async () => {
    try {
      const res = await fetch(process.env.BACK_URL+'/topics?limit=50', {
        credentials: 'include',
      })
      if (res.ok) {
        const { dados } = await res.json()
        setTopicos(dados ?? [])
      }
    } catch {} finally {
      setCarregando(false)
    }
  }

  useEffect(() => { buscarTopicos() }, [])

  const inicialUsuario = username.charAt(0).toUpperCase()

  return (
    <div className="dash">
      <header className="dash__nav">
        <span className="dash__marca">FTL</span>

        <nav className="dash__abas">
          <button
            className={`dash__aba ${abaAtiva === 'topicos' ? 'dash__aba--ativa' : ''}`}
            onClick={() => setAbaAtiva('topicos')}
          >
            Tópicos
          </button>
          <button
            className={`dash__aba ${abaAtiva === 'historico' ? 'dash__aba--ativa' : ''}`}
            onClick={() => setAbaAtiva('historico')}
          >
            Histórico
          </button>
        </nav>

        <div className="dash__usuario">
          <div className="dash__avatar">{inicialUsuario}</div>
          <span className="dash__nome">{username}</span>
          <button className="dash__sair" onClick={aoSair} title="Sair">↩</button>
        </div>
      </header>

      <main className="dash__main">
        {carregando ? (
          <div className="dash__loading">
            <div className="dash__loading-dot" />
            <span>Carregando...</span>
          </div>
        ) : abaAtiva === 'topicos' ? (
          <>

            <section className="dash__saudacao">
              <h1>Olá, <span className="dash__nome-destaque">{username}</span></h1>
              <p>O que vamos estudar hoje?</p>
            </section>

            <CampoCadTopic onTopicAdicionado={buscarTopicos} />

            <section className="dash__secao">
              <h2 className="dash__secao-titulo">
                Seus tópicos
                <span className="dash__badge">{topicos.length}</span>
              </h2>

              {topicos.length === 0 ? (
                <div className="dash__vazio">
                  <span className="dash__vazio-icon"></span>
                  <p>Nenhum tópico ainda. Crie o primeiro acima!</p>
                </div>
              ) : (
                <div className="dash__cards">
                  {topicos.map((t) => (
                    <Cardtopic
                      key={t.id}
                      title={t.name}
                      id={t.id}
                      sessions={t._count?.sessions ?? 0}
                      onTopic={buscarTopicos}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (

          <>
            <section className="dash__saudacao">
              <h1>Histórico de sessões</h1>
              <p>Acompanhe seu progresso em cada tópico</p>
            </section>

            {topicos.length === 0 ? (
              <div className="dash__vazio">
                <span className="dash__vazio-icon"></span>
                <p>Crie tópicos e inicie sessões para ver o histórico aqui.</p>
              </div>
            ) : (
              <section className="dash__secao">
                <div className="dash__historico">
                  {topicos.map((t) => (
                    <Sessoes key={t.id} topicoId={t.id} title={t.name} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
