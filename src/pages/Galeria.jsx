import { Link } from 'react-router-dom'
import { useTienda } from '../store/tienda'
import { colorClase } from '../utils/colores'
import { usePageTitle } from '../hooks/usePageTitle'
import Estado from '../components/Estado'

export default function Galeria() {
  usePageTitle('Trabajos realizados')
  const estado = useTienda((s) => s.estado)
  const error = useTienda((s) => s.error)
  const cargar = useTienda((s) => s.cargar)
  const categorias = useTienda((s) => s.categorias)
  const trabajos = useTienda((s) => s.trabajos)

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Trabajos realizados</h1>
      <p className="mt-3 max-w-2xl text-lg">
        Algunos de los pedidos personalizados que ya hicimos. ¿Te gusta alguno?
        Pide uno parecido.
      </p>

      {estado !== 'listo' ? (
        <Estado estado={estado} error={error} onReintentar={cargar} />
      ) : trabajos.length === 0 ? (
        <p className="mt-8 text-lg">Pronto mostraremos aquí nuestros trabajos.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {trabajos.map((t) => {
            const cat = categorias.find((c) => c.id === t.categoria)
            return (
              <figure key={t.id} className="group">
                <div className="overflow-hidden rounded-3xl">
                  {t.imagen ? (
                    <img
                      src={t.imagen}
                      alt={t.titulo}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className={`flex aspect-square items-end p-4 font-display text-lg font-semibold ${colorClase(cat?.color)}`}
                    >
                      {cat?.nombre}
                    </div>
                  )}
                </div>
                <figcaption className="mt-2 font-bold">{t.titulo}</figcaption>
              </figure>
            )
          })}
        </div>
      )}

      <Link
        to="/personalizar"
        className="mt-10 inline-block rounded-full bg-brand px-8 py-4 font-bold text-white"
      >
        Quiero el mío
      </Link>
    </section>
  )
}