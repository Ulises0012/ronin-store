import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../store/tienda'
import { useCarrito } from '../store/carrito'
import { colorClase } from '../utils/colores'
import { formatPrecio } from '../utils/format'
import { whatsappLink } from '../utils/whatsapp'
import { usePageTitle } from '../hooks/usePageTitle'
import Etiquetas from '../components/Etiquetas'
import ProductCard from '../components/ProductCard'
import Estado from '../components/Estado'

export default function Producto() {
  const { id } = useParams()
  const [idea, setIdea] = useState('')
  const [agregado, setAgregado] = useState(false)
  const [foto, setFoto] = useState(0)
  const agregar = useCarrito((s) => s.agregar)
  const subcategorias = useTienda((s) => s.subcategorias)

  const estado = useTienda((s) => s.estado)
  const error = useTienda((s) => s.error)
  const cargar = useTienda((s) => s.cargar)
  const categorias = useTienda((s) => s.categorias)
  const productos = useTienda((s) => s.productos)

  const producto = productos.find((p) => p.id === id)
  usePageTitle(producto?.nombre)
  const sub = subcategorias.find((s) => s.id === producto?.subcategoria)

  useEffect(() => {
    setIdea('')
    setAgregado(false)
    setFoto(0)
  }, [id])

  if (estado !== 'listo') {
    return <Estado estado={estado} error={error} onReintentar={cargar} />
  }

  if (!producto) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="font-display text-3xl">No encontramos ese producto</p>
        <Link to="/catalogo" className="mt-6 inline-block font-bold text-brand">
          Volver al catálogo
        </Link>
      </section>
    )
  }

  const cat = categorias.find((c) => c.id === producto.categoria)
  const imagenes = producto.imagenes ?? []
  const relacionados = [
    ...productos.filter((p) => p.categoria === producto.categoria && p.id !== producto.id),
    ...productos.filter((p) => p.categoria !== producto.categoria && p.id !== producto.id),
  ].slice(0, 3)

  const mensaje =
    `Hola, me interesa: ${producto.nombre} (${formatPrecio(producto.precio)}).` +
    (idea ? ` Mi idea: ${idea}` : '')

  function handleAgregar() {
    agregar(producto, idea)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          {imagenes.length > 0 ? (
            <img
              src={imagenes[foto] ?? imagenes[0]}
              alt={producto.nombre}
              className="aspect-square w-full rounded-3xl object-cover"
            />
          ) : (
            <div
              className={`flex aspect-square items-center justify-center rounded-3xl font-display text-2xl font-semibold ${colorClase(cat?.color)}`}
            >
              {cat?.nombre}
            </div>
          )}

          {imagenes.length > 1 && (
            <div className="flex gap-3">
              {imagenes.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setFoto(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={`size-20 overflow-hidden rounded-2xl border-2 ${
                    foto === i ? 'border-brand' : 'border-lavender'
                  }`}
                >
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Link to="/catalogo" className="font-bold text-brand">
            ← Volver al catálogo
          </Link>
          <Etiquetas lista={producto.etiquetas} />
          {sub && (
  <Link
    to={`/catalogo?categoria=${producto.categoria}&sub=${sub.id}`}
    className="font-bold text-brand"
  >
    Ver más de {sub.nombre} →
  </Link>
)}
          <h1 className="font-display text-4xl font-bold">{producto.nombre}</h1>
          <p className="text-3xl font-bold text-brand">{formatPrecio(producto.precio)}</p>
          <p className="text-lg">{producto.descripcion}</p>

          {producto.personalizable && (
            <label className="flex flex-col gap-2 font-bold">
              Cuéntanos tu idea (diseño, nombre, colores, talla...)
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={4}
                className="rounded-2xl border-2 border-lavender bg-card p-3 font-normal"
              />
            </label>
          )}

          <button
            onClick={handleAgregar}
            className="rounded-full bg-brand px-8 py-4 text-center font-bold text-white"
          >
            {agregado ? '¡Agregado!' : 'Agregar al carrito'}
          </button>

          {agregado && (
            <Link to="/carrito" className="text-center font-bold text-brand">
              Ver mi carrito →
            </Link>
          )}

          <a
            href={whatsappLink(mensaje)}
            className="rounded-full border-2 border-lavender px-8 py-4 text-center font-bold"
          >
            Pedir solo este por WhatsApp
          </a>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <h2 className="font-display text-3xl font-bold">También te puede gustar</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}