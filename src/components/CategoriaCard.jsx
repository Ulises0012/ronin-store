import { Link } from 'react-router-dom'
import { colorClase } from '../utils/colores'

export default function CategoriaCard({ categoria: c }) {
  return (
    <Link
      to={`/catalogo?categoria=${c.id}`}
      className={`group relative flex min-h-40 items-end overflow-hidden rounded-3xl p-5 font-display text-xl font-semibold transition hover:-translate-y-1 ${
        c.imagen ? 'bg-night text-white' : colorClase(c.color)
      }`}
    >
      {c.imagen && (
        <>
          <img
            src={c.imagen}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-110"
          />
          <span className="absolute inset-0 bg-linear-to-t from-night/80 to-transparent" aria-hidden="true" />
        </>
      )}
      <span className="relative">{c.nombre}</span>
    </Link>
  )
}