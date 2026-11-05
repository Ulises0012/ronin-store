import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'

const links = [
  { to: '/admin', label: 'Productos', end: true },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/zonas', label: 'Zonas de envío' },
    { to: '/admin/subcategorias', label: 'Subcategorías' },
]

export default function AdminLayout() {
  const [estado, setEstado] = useState('cargando')
  const [usuario, setUsuario] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)

    api('/auth/me')
      .then((d) => {
        setUsuario(d.usuario)
        setEstado('ok')
      })
      .catch(() => setEstado('no'))

    return () => meta.remove()
  }, [])

  async function salir() {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    navigate('/admin/login')
  }

  if (estado === 'cargando') return <p className="p-10 text-center">Cargando...</p>
  if (estado === 'no') return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen">
      <header className="bg-night text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Link to="/admin" className="font-logo text-lg font-bold uppercase tracking-widest">
            Panel <span className="text-pop">Admin</span>
          </Link>

          <nav className="flex flex-wrap gap-2 text-sm font-bold">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex min-h-11 items-center rounded-full px-4 ${isActive ? 'bg-brand' : 'bg-white/15'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-sm font-bold">
            <Link to="/" className="hover:text-pop">Ver tienda</Link>
            <span className="hidden sm:inline">{usuario}</span>
            <button onClick={salir} className="min-h-11 rounded-full bg-white/15 px-4">
              Salir
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}