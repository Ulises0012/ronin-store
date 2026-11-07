import { Link } from 'react-router-dom'
import { useTienda } from '../store/tienda'
import { colorClase } from '../utils/colores'
import { config } from '../data/config'
import { whatsappLink } from '../utils/whatsapp'
import { usePageTitle } from '../hooks/usePageTitle'
import ProductCard from '../components/ProductCard'
import Marquee from '../components/Marquee'
import Reveal from '../components/Reveal'
import CategoriaCard from '../components/CategoriaCard'
import Estado from '../components/Estado'

const pasos = [
  { n: '1', titulo: 'Elige o cuéntanos tu idea', texto: 'Mira el catálogo o usa la página Personalizar.' },
  { n: '2', titulo: 'Confirmamos por WhatsApp', texto: 'Te cotizamos y acordamos los detalles y el anticipo.' },
  { n: '3', titulo: 'Lo hacemos y te lo entregamos', texto: `Tiempo estimado: ${config.entrega}.` },
]

export default function Home() {
  usePageTitle()
  const estado = useTienda((s) => s.estado)
  const error = useTienda((s) => s.error)
  const cargar = useTienda((s) => s.cargar)
  const categorias = useTienda((s) => s.categorias)
  const productos = useTienda((s) => s.productos)

  const destacados = productos.slice(0, 4)

  const collage =
    destacados.length > 0
      ? destacados.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          img: p.imagenes[0],
          clase: colorClase(categorias.find((c) => c.id === p.categoria)?.color),
        }))
      : categorias.slice(0, 4).map((c) => ({
          id: c.id,
          nombre: c.nombre,
          img: null,
          clase: colorClase(c.color),
        }))

  const listo = estado === 'listo'

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 md:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-butter px-4 py-1 text-sm font-bold text-night">
            Hecho con cariño en El Salvador
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight md:text-6xl">
            Todo lo que amas, en un solo lugar.
          </h1>
          <p className="mt-6 max-w-xl text-lg">
            Anime, K-pop, amigurumis, camisas y tazas personalizadas, globos y
            rosas para sorprender a alguien especial.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/catalogo" className="rounded-full bg-brand px-7 py-3 font-bold text-white">
              Ver catálogo
            </Link>
            <Link to="/personalizar" className="rounded-full bg-aqua px-7 py-3 font-bold text-night">
              Personaliza el tuyo
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {collage.map((item, i) => {
            const offset = i === 1 ? 'mt-8' : i === 2 ? '-mt-4' : ''
            return item.img ? (
              <img
                key={item.id}
                src={item.img}
                alt={item.nombre}
                className={`aspect-square w-full rounded-3xl object-cover ${offset}`}
              />
            ) : (
              <div
                key={item.id}
                className={`flex aspect-square items-end rounded-3xl p-4 font-display text-lg font-semibold ${item.clase} ${offset}`}
              >
                {item.nombre}
              </div>
            )
          })}
        </div>
      </section>

      <Marquee />

      {!listo ? (
        <Estado estado={estado} error={error} onReintentar={cargar} />
      ) : (
        <>
          <Reveal as="section" className="mx-auto mt-16 max-w-6xl px-4">
            <h2 className="mb-6 font-display text-3xl font-bold">Explora por categoría</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
  {categorias.map((c) => (
    <CategoriaCard key={c.id} categoria={c} />
  ))}
</div>
          </Reveal>

          {destacados.length > 0 && (
            <Reveal as="section" className="mx-auto mt-16 max-w-6xl px-4">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="font-display text-3xl font-bold">Novedades</h2>
                <Link to="/catalogo" className="font-bold text-brand">
                  Ver todo →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {destacados.map((p) => (
                  <ProductCard key={p.id} producto={p} />
                ))}
              </div>
            </Reveal>
          )}
        </>
      )}

      <Reveal as="section" className="mx-auto mt-16 max-w-6xl px-4">
        <h2 className="font-display text-3xl font-bold">¿Cómo pedir?</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {pasos.map((p) => (
            <li key={p.n} className="rounded-3xl border-2 border-lavender bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand font-display text-lg font-bold text-white">
                {p.n}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{p.titulo}</h3>
              <p className="mt-1">{p.texto}</p>
            </li>
          ))}
        </ol>
      </Reveal>


      <Reveal as="section" className="patron-puntos mt-16 bg-brand py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">
              ¿Tienes una idea? La hacemos realidad.
            </h2>
            <p className="mt-3 max-w-xl text-lg">
              Camisas y tazas con tu diseño, y arreglos a tu gusto. Cuéntanos y
              te cotizamos por WhatsApp.
            </p>
          </div>
          <a
            href={whatsappLink('Hola, quiero hacer un pedido personalizado.')}
            className="rounded-full bg-butter px-8 py-4 text-center font-bold text-night"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </Reveal>
    </>
  )
}