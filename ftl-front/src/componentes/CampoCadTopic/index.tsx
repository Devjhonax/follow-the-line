import { useState } from 'react'
import Botao from '../Botao'
import CampoInput from '../CampoInput'
import './CampoCadTopic.css'

interface CampoCadTopicProps {
  onTopicAdicionado: () => void
}

const CampoCadTopic = ({ onTopicAdicionado }: CampoCadTopicProps) => {
  const [titulo, setTitulo] = useState('')
  const [carregando, setCarregando] = useState(false)

  const addTopic = async (evt: React.FormEvent) => {
    evt.preventDefault()
    if (!titulo.trim()) return

    setCarregando(true)
    try {
      const resp = await fetch(import.meta.env.VITE_BACK_URL +'/topics/', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: titulo.trim() }),
      })
      const dados = await resp.json()
      if (resp.status === 201) {
        setTitulo('')
        onTopicAdicionado()
      } else {
        window.alert(dados.mensagem ?? 'Erro ao adicionar tópico.')
      }
    } catch {
      window.alert('Erro ao se comunicar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section className="cad-topico">
      <form className="cad-topico__form" onSubmit={addTopic}>
        <div className="cad-topico__label">
          <span className="cad-topico__icon">＋</span>
          <span>Novo tópico</span>
        </div>
        <div className="cad-topico__row">
          <CampoInput
            label=""
            type="text"
            placeholder="Ex: Matemática, Inglês, Python..."
            value={titulo}
            setValue={setTitulo}
            required
          />
          <Botao
            text={carregando ? '...' : 'Adicionar'}
            type="submit"
            disabled={carregando}
            classe="cad-topico__btn"
          />
        </div>
      </form>
    </section>
  )
}

export default CampoCadTopic
