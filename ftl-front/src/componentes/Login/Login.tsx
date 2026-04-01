import "dotenv/config"

import { useState } from 'react'
import CampoInput from '../CampoInput'
import Botao from '../Botao'
import type { Usuario } from '../../types'
import './Login.css'

interface LoginProps {
  aoLogar: (usuario: Usuario) => void
}

const Login = ({ aoLogar }: LoginProps) => {
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [aba, setAba] = useState<'entrar' | 'cadastrar'>('entrar')
  const [erro, setErro] = useState('')

  const handleCadastro = async (evt: React.FormEvent) => {
    evt.preventDefault()
    if (!nome || !senha) return setErro('Preencha todos os campos.')
    setCarregando(true)
    setErro('')
    try {
      const res = await fetch(import.meta.env.VITE_BACK_URL +'/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: nome, password: senha }),
      })
      const data = await res.json()
      if (!res.ok) return setErro(data.mensagem ?? 'Erro ao cadastrar.')
      setAba('entrar')
      setErro('Conta criada! Faça login.')
    } catch {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  const handleLogin = async (evt: React.FormEvent) => {
    evt.preventDefault()
    if (!nome || !senha) return setErro('Preencha todos os campos.')
    setCarregando(true)
    setErro('')
    try {
      const res = await fetch(import.meta.env.VITE_BACK_URL +'/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: nome, password: senha }),
      })
      const data = await res.json()
      if (!res.ok) return setErro(data.mensagem ?? 'Credenciais inválidas.')
      aoLogar(data.usuario)
    } catch {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  const isLogin = aba === 'entrar'

  return (
    <div className="login-page">
      <div className="login-bg-blob blob-1" />
      <div className="login-bg-blob blob-2" />

      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-logo">FTL</span>
          <p className="login-brand-sub">Follow The Line</p>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${isLogin ? 'login-tab--ativo' : ''}`}
            onClick={() => { setAba('entrar'); setErro('') }}
          >
            Entrar
          </button>
          <button
            className={`login-tab ${!isLogin ? 'login-tab--ativo' : ''}`}
            onClick={() => { setAba('cadastrar'); setErro('') }}
          >
            Cadastrar
          </button>
        </div>

        <form className="login-form" onSubmit={isLogin ? handleLogin : handleCadastro}>
          <CampoInput
            label="Nome de usuário"
            type="text"
            value={nome}
            setValue={setNome}
            placeholder="ex: joao_silva"
            required
          />
          <CampoInput
            label="Senha"
            type="password"
            value={senha}
            setValue={setSenha}
            placeholder="Mínimo 6 caracteres"
            required
          />

          {erro && (
            <p className={`login-msg ${erro.includes('criada') ? 'login-msg--ok' : 'login-msg--erro'}`}>
              {erro}
            </p>
          )}

          <Botao
            text={carregando ? 'Aguarde...' : isLogin ? 'Entrar →' : 'Criar conta'}
            type="submit"
            disabled={carregando}
            classe="login-btn"
          />
        </form>
      </div>
    </div>
  )
}

export default Login
