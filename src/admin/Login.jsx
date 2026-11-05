import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

const campo = 'min-h-11 rounded-2xl border-2 border-lavender bg-card px-4'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  async function entrar(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await api('/auth/login', { method: 'POST', body: { usuario, password } })
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={entrar}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border-2 border-lavender bg-card p-6"
      >
        <h1 className="font-display text-3xl font-bold">Panel de administración</h1>

        <label className="flex flex-col gap-2 font-bold">
          Usuario
          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            className={campo}
            required
          />
        </label>

        <label className="flex flex-col gap-2 font-bold">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={campo}
            required
          />
        </label>

        {error && (
          <p role="alert" className="font-bold text-brand">
            {error}
          </p>
        )}

        <button
          disabled={enviando}
          className="min-h-11 rounded-full bg-brand px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}