import 'dotenv/config'

import { useState, useEffect } from 'react'
import './App.css'
import Login from './componentes/Login/Login'
import Dashboard from './componentes/Dashboard'
import type { Usuario } from './types'

function App() {
  const [logado, setLogado] = useState(false)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    async function verificarSessao() {
      try {
        const res = await fetch(process.env.bACK_URL +`/auth/me`, {
          credentials: 'include',
        })
        if (res.ok) {
          const { usuario } = await res.json()
          setUsuario(usuario)
          setLogado(true)
        }
      } catch {
      } finally {
        setVerificando(false)
      }
    }
    verificarSessao()
  }, [])

  const aoLogar = (usr: Usuario) => {
    setUsuario(usr)
    setLogado(true)
  }

  const aoSair = async () => {
    await fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {})
    setLogado(false)
    setUsuario(null)
  }

  if (verificando) {
    return (
      <div className="splash">
        <div className="splash-logo">FTL</div>
        <div className="splash-dot" />
      </div>
    )
  }

  if (!logado) return <Login aoLogar={aoLogar} />

  return <Dashboard username={usuario?.username ?? ''} aoSair={aoSair} />
}

export default App
