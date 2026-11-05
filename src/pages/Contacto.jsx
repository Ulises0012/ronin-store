import { config } from '../data/config'
import { whatsappLink } from '../utils/whatsapp'

export default function Contacto() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Contacto</h1>
      <p className="mt-3 text-lg">
        Escríbenos para cotizar, preguntar por un producto o hacer tu pedido.
      </p>

      <a
        href={whatsappLink('Hola, quiero más información.')}
        className="mt-8 inline-block rounded-full bg-brand px-8 py-4 font-bold text-white"
      >
        Escribir por WhatsApp
      </a>

      <dl className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border-2 border-lavender bg-card p-5">
          <dt className="font-display text-xl font-semibold">Ubicación</dt>
          <dd className="mt-1">{config.location}</dd>
        </div>
        <div className="rounded-3xl border-2 border-lavender bg-card p-5">
          <dt className="font-display text-xl font-semibold">Horario</dt>
          <dd className="mt-1">{config.horario}</dd>
        </div>
        <div className="rounded-3xl border-2 border-lavender bg-card p-5 sm:col-span-2">
          <dt className="font-display text-xl font-semibold">Redes</dt>
          <dd className="mt-1 flex gap-6 font-bold">
            <a href={config.instagram} className="text-brand">Instagram</a>
            <a href={config.facebook} className="text-brand">Facebook</a>
          </dd>
        </div>
      </dl>
    </section>
  )
}