import './Botao.css'

interface BotaoProps {
  text: string
  classe?: string
  onclick?: (evt: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  variante?: 'primario' | 'perigo' | 'ghost' | 'sucesso'
}

const Botao = ({ text, classe, onclick, type = 'button', disabled, variante = 'primario' }: BotaoProps) => (
  <button
    className={`btn btn--${variante} ${classe ?? ''}`}
    onClick={onclick}
    type={type}
    disabled={disabled}
  >
    {text}
  </button>
)

export default Botao
