import { Link } from 'react-router-dom'
import { config } from '../data/config'
import { whatsappLink } from '../utils/whatsapp'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-16 bg-night text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-white/80">
            Anime, K-pop, amigurumis, personalizados y detalles que sorprenden.
          </p>
        </div>

        <nav className="flex flex-col gap-2 font-bold">
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/personalizar">Personalizar</Link>
          <Link to="/galeria">Trabajos realizados</Link>
          <Link to="/preguntas">Preguntas frecuentes</Link>
        </nav>

        <div className="flex flex-col gap-2 font-bold">
          <a href={whatsappLink('Hola, quiero más información.')}>WhatsApp</a>
          <a href={config.instagram}>Instagram</a>
          <a href={config.facebook}>Facebook</a>
          <p className="mt-2 text-sm font-normal text-white/80">{config.location}</p>
        </div>
      </div>

      <p className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/70">
        © {new Date().getFullYear()} {config.storeName}. Todos los derechos reservados.
      </p>
    </footer>
  )
}