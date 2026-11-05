import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTienda } from '../store/tienda'
import { normalizar } from '../utils/format'
import { usePageTitle } from '../hooks/usePageTitle'
import ProductCard from '../components/ProductCard'
import Estado from '../components/Estado'

const ordenes = [
  { id: 'destacados', label: 'Destacados' },
  { id: 'precio-asc', label: 'Precio: menor a mayor' },
  { id: 'precio-desc', label: 'Precio: mayor a menor' },
  { id: 'nombre', label: 'Nombre A-Z' },
]

const campo = 'min-h-11 rounded-2xl border-2 border-lavender bg-card px-4'
const botonBase = 'min-h-11 rounded-full px-5 font-bold border-2'

export default function Catalogo() {
  usePageTitle('Catálogo')
  const estado = useTienda((s) => s.estado)
  const error = useTienda((s) => s.error)
  const cargar = useTienda((s) => s.cargar)
  const categorias = useTienda((s) => s.categorias)
  const subcategorias = useTienda((s) => s.subcategorias)
  const productos = useTienda((s) => s.productos)

  const [params, setParams] = useSearchParams()
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('destacados')

  const activa = params.get('categoria')
  const subNumero = Number(params.get('sub'))
  const subActiva = activa && Number.isInteger(subNumero) && subNumero > 0 ? subNumero : null

  // Subcategorías de la categoría elegida que tienen productos visibles
  const subsDisponibles = activa
    ? subcategorias
        .filter((s) => s.categoria === activa)
        .map((s) => ({ ...s, total: productos.filter((p) => p.subcategoria === s.id).length }))
        .filter((s) => s.total > 0)
    : []

  const lista = productos
    .filter((p) => !activa || p.categoria === activa)
    .filter((p) => !subActiva || p.subcategoria === subActiva)
    .filter((p) =>
      normalizar(`${p.nombre} ${p.descripcion}`).includes(normalizar(busqueda)),
    )
    .sort((a, b) => {
      if (orden === 'precio-asc') return a.precio - b.precio
      if (orden === 'precio-desc') return b.precio - a.precio
      if (orden === 'nombre') return a.nombre.localeCompare(b.nombre, 'es')
      return 0
    })

  const estilo = (seleccionado) =>
    `${botonBase} ${seleccionado ? 'border-brand bg-brand text-white' : 'border-lavender bg-card'}`

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Catálogo</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          className={`${campo} flex-1`}
        />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          aria-label="Ordenar productos"
          className={campo}
        >
          {ordenes.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => setParams({})} className={estilo(!activa)}>
          Todo
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            onClick={() => setParams({ categoria: c.id })}
            aria-pressed={activa === c.id}
            className={estilo(activa === c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      {subsDisponibles.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-l-4 border-brand pl-4">
          <button
            onClick={() => setParams({ categoria: activa })}
            aria-pressed={!subActiva}
            className={`${estilo(!subActiva)} text-sm`}
          >
            Todos
          </button>
          {subsDisponibles.map((s) => (
            <button
              key={s.id}
              onClick={() => setParams({ categoria: activa, sub: s.id })}
              aria-pressed={subActiva === s.id}
              className={`${estilo(subActiva === s.id)} text-sm`}
            >
              {s.nombre} ({s.total})
            </button>
          ))}
        </div>
      )}

      {estado !== 'listo' ? (
        <Estado estado={estado} error={error} onReintentar={cargar} />
      ) : lista.length === 0 ? (
        <p className="mt-10 text-lg">
          {productos.length === 0
            ? 'Pronto tendremos productos disponibles.'
            : 'No encontramos productos con esos filtros.'}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </section>
  )
}