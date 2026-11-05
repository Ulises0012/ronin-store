import { useState } from 'react'
import { tiposPersonalizado } from '../data/personalizados'
import { whatsappLink } from '../utils/whatsapp'

const campo = 'min-h-11 rounded-2xl border-2 border-lavender bg-card px-4 font-normal'

export default function Personalizar() {
  const [tipoId, setTipoId] = useState('')
  const [opcion, setOpcion] = useState('')
  const [nombre, setNombre] = useState('')
  const [idea, setIdea] = useState('')
  const [colores, setColores] = useState('')
  const [fecha, setFecha] = useState('')

  const tipo = tiposPersonalizado.find((t) => t.id === tipoId)
  const listo = tipo && idea.trim().length > 0

  function elegirTipo(id) {
    setTipoId(id)
    setOpcion('')
  }

  const mensaje = tipo
    ? [
        `Hola, soy ${nombre || '(tu nombre)'}. Quiero un pedido personalizado:`,
        `• Producto: ${tipo.nombre}`,
        tipo.opcion && opcion ? `• ${tipo.opcion.label}: ${opcion}` : null,
        `• Mi idea: ${idea}`,
        colores ? `• Colores: ${colores}` : null,
        fecha ? `• Lo necesito para: ${fecha}` : null,
        'Te mando una imagen de referencia por aquí.',
      ]
        .filter(Boolean)
        .join('\n')
    : ''

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Personaliza el tuyo</h1>
      <p className="mt-3 text-lg">
        Cuéntanos qué quieres y te cotizamos por WhatsApp. Si tienes una imagen
        de referencia, la envías por el mismo chat.
      </p>

      <h2 className="mt-10 font-display text-2xl font-semibold">1. ¿Qué quieres personalizar?</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tiposPersonalizado.map((t) => (
          <button
            key={t.id}
            onClick={() => elegirTipo(t.id)}
            aria-pressed={tipoId === t.id}
            className={`rounded-3xl border-2 p-5 text-left ${
              tipoId === t.id ? 'border-brand bg-lavender' : 'border-lavender bg-card'
            }`}
          >
            <p className="font-display text-xl font-semibold">{t.nombre}</p>
            <p className="mt-1 text-sm">{t.descripcion}</p>
          </button>
        ))}
      </div>

      {tipo && (
        <div className="mt-10 flex flex-col gap-5">
          <h2 className="font-display text-2xl font-semibold">2. Los detalles</h2>

          {tipo.opcion && (
            <label className="flex flex-col gap-2 font-bold">
              {tipo.opcion.label}
              <select value={opcion} onChange={(e) => setOpcion(e.target.value)} className={campo}>
                <option value="">Elige una opción</option>
                {tipo.opcion.valores.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-2 font-bold">
            Tu idea (obligatorio)
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={4}
              placeholder="Diseño, frase, personaje, nombre..."
              className="rounded-2xl border-2 border-lavender bg-card p-3 font-normal"
            />
          </label>

          <label className="flex flex-col gap-2 font-bold">
            Colores preferidos
            <input value={colores} onChange={(e) => setColores(e.target.value)} className={campo} />
          </label>

          <label className="flex flex-col gap-2 font-bold">
            ¿Para cuándo lo necesitas?
            <input
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              placeholder="Ej: 20 de diciembre"
              className={campo}
            />
          </label>

          <label className="flex flex-col gap-2 font-bold">
            Tu nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} />
          </label>

          {listo ? (
            <a
              href={whatsappLink(mensaje)}
              className="rounded-full bg-brand px-8 py-4 text-center font-bold text-white"
            >
              Enviar por WhatsApp
            </a>
          ) : (
            <button
              disabled
              className="rounded-full bg-lavender px-8 py-4 font-bold opacity-70"
            >
              Cuéntanos tu idea para continuar
            </button>
          )}
        </div>
      )}
    </section>
  )
}