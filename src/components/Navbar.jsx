import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../store/carrito'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/personalizar', label: 'Personalizar' },
  { to: '/preguntas', label: 'Preguntas' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const cantidad = useCarrito((s) => s.items.reduce((suma, i) => suma + i.cantidad, 0))

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" aria-label="Ir al inicio">
          <Logo />
        </Link>

        <nav className="hidden gap-8 font-bold lg:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-pop">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/carrito"
            className="flex min-h-11 items-center rounded-full bg-brand px-5 font-bold text-white"
          >
            Carrito ({cantidad})
          </Link>
          <button
            className="min-h-11 rounded-full bg-white/15 px-5 font-bold lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            Menú
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 px-4 pb-4 font-bold lg:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}