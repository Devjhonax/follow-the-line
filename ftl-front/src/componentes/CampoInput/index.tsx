import './input.css'

interface CampoInputProps {
  label: string
  type: string
  value: string
  placeholder?: string
  setValue: (val: string) => void
  required?: boolean
}

const CampoInput = ({ label, type, value, placeholder, setValue, required }: CampoInputProps) => (
  <div className="campo-texto">
    <label className="label">{label}</label>
    <input
      className="input"
      type={type}
      required={required}
      value={value}
      onChange={(evt) => setValue(evt.target.value)}
      placeholder={placeholder}
    />
  </div>
)

export default CampoInput
