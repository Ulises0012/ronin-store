import { Link } from 'react-router-dom'
import { useTienda } from '../store/tienda'
import { colorClase } from '../utils/colores'
import { formatPrecio } from '../utils/format'
import Etiquetas from './Etiquetas'

export default function ProductCard({ producto }) {
  const categorias = useTienda((s) => s.categorias)
  const cat = categorias.find((c) => c.id === producto.categoria)
  const img = producto.imagenes?.[0]

  return (
    <Link
      to={`/producto/${producto.id}`}
      className="group flex flex-col gap-3 rounded-3xl border-2 border-lavender bg-card p-4 transition hover:-translate-y-1 hover:border-brand"
    >
      <div className="relative overflow-hidden rounded-2xl">
        {img ? (
          <img
            src={img}
            alt={producto.nombre}
            loading="lazy"
            className="aspect-4/3 w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className={`flex aspect-4/3 items-center justify-center font-display text-lg font-semibold transition duration-500 group-hover:scale-105 ${colorClase(cat?.color)}`}
          >
            {cat?.nombre}
          </div>
        )}
        <Etiquetas lista={producto.etiquetas} className="absolute left-2 top-2" />
      </div>
      <h3 className="font-display text-xl font-semibold">{producto.nombre}</h3>
      <p className="text-lg font-bold text-brand">{formatPrecio(producto.precio)}</p>
    </Link>
  )
}