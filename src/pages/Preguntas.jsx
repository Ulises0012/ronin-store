import { faq } from '../data/faq'
import { whatsappLink } from '../utils/whatsapp'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Preguntas() {
  usePageTitle('Preguntas frecuentes')

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Preguntas frecuentes</h1>

      <div className="mt-8 flex flex-col gap-3">
        {faq.map((f) => (
          <details
            key={f.pregunta}
            className="group rounded-3xl border-2 border-lavender bg-card p-5"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold [&::-webkit-details-marker]:hidden">
              {f.pregunta}
              <span className="text-2xl text-brand transition group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3">{f.respuesta}</p>
          </details>
        ))}
      </div>

      <p className="mt-10 text-lg">¿Te quedó otra duda?</p>
      <a
        href={whatsappLink('Hola, tengo una pregunta.')}
        className="mt-3 inline-block rounded-full bg-brand px-8 py-4 font-bold text-white"
      >
        Escríbenos por WhatsApp
      </a>
    </section>
  )
}