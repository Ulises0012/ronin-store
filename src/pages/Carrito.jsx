import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../store/carrito'
import { api } from '../utils/api'
import { formatPrecio } from '../utils/format'
import { whatsappLink, mensajePedido } from '../utils/whatsapp'
import { usePageTitle } from '../hooks/usePageTitle'

const campo = 'min-h-11 rounded-2xl border-2 border-lavender bg-card px-4 font-normal'
const botonCantidad =
  'flex size-11 items-center justify-center rounded-full bg-lavender text-xl font-bold'

const CLAVE_PEDIDO = 'ronin-ultimo-pedido'

function leerPedidoGuardado() {
  try {
    const crudo = sessionStorage.getItem(CLAVE_PEDIDO)
    return crudo ? JSON.parse(crudo) : null
  } catch {
    return null
  }
}

function guardarPedido(p) {
  try {
    if (p) sessionStorage.setItem(CLAVE_PEDIDO, JSON.stringify(p))
    else sessionStorage.removeItem(CLAVE_PEDIDO)
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

export default function Carrito() {
  usePageTitle('Carrito')
  const items = useCarrito((s) => s.items)
  const cambiarCantidad = useCarrito((s) => s.cambiarCantidad)
  const quitar = useCarrito((s) => s.quitar)
  const vaciar = useCarrito((s) => s.vaciar)

  const [form, setForm] = useState({ cliente: '', telefono: '', correo: '', notas: '' })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [pedido, setPedido] = useState(leerPedidoGuardado)
  const [abrir, setAbrir] = useState(false) // true solo cuando el pedido se acaba de crear
  const [mostrarEnlace, setMostrarEnlace] = useState(false)

  const cambiar = (nombre, valor) => setForm((f) => ({ ...f, [nombre]: valor }))

  // Al crear el pedido, abre WhatsApp solo (el cliente únicamente toca "Enviar")
  useEffect(() => {
    if (!pedido || !abrir) return
    const enlace = whatsappLink(mensajePedido(pedido))
    const abrirWhatsapp = setTimeout(() => window.location.assign(enlace), 1500)
    const enlaceRespaldo = setTimeout(() => setMostrarEnlace(true), 4000)
    return () => {
      clearTimeout(abrirWhatsapp)
      clearTimeout(enlaceRespaldo)
    }
  }, [pedido, abrir])

  function terminar() {
    guardarPedido(null)
    setPedido(null)
    setAbrir(false)
    setMostrarEnlace(false)
  }

  // ----- Pantalla de confirmación -----
  if (pedido) {
    const enlace = whatsappLink(mensajePedido(pedido))
    const abriendo = abrir && !mostrarEnlace

    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-4xl font-bold">¡Pedido recibido!</h1>
        <p className="mt-3 text-lg">
          Tu código es <strong className="text-brand">{pedido.codigo}</strong>.
        </p>

        {abriendo ? (
          <p role="status" className="mt-4 text-lg font-bold">
            Abriendo WhatsApp... Cuando se abra, solo toca <em>Enviar</em> para que confirmemos tu
            pedido y acordemos la dirección y el envío.
          </p>
        ) : (
          <p className="mt-4 text-lg">
            Para confirmar tu pedido, envíanos el mensaje por WhatsApp. Si no se abrió solo,{' '}
            <a href={enlace} className="font-bold text-brand underline">
              toca aquí
            </a>
            .
          </p>
        )}

        <div className="mt-8 rounded-3xl border-2 border-lavender bg-card p-5">
          <ul className="flex flex-col gap-2">
            {pedido.items.map((i, n) => (
              <li key={n} className="flex justify-between gap-4">
                <span>
                  {i.cantidad} x {i.nombre}
                  {i.idea && <span className="block text-sm">Idea: {i.idea}</span>}
                </span>
                <span className="font-bold">{formatPrecio(i.precio * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <hr className="my-4 border-lavender" />
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrecio(pedido.subtotal)}</span>
          </p>
          <p className="flex justify-between">
            <span>Envío</span>
            <span>Por confirmar</span>
          </p>
        </div>

        <Link to="/catalogo" onClick={terminar} className="mt-8 inline-block font-bold text-brand">
          Seguir comprando
        </Link>
      </section>
    )
  }

  // ----- Carrito vacío -----
  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="font-display text-4xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-4 text-lg">Agrega algo que te guste y haz tu pedido.</p>
        <Link
          to="/catalogo"
          className="mt-8 inline-block rounded-full bg-brand px-8 py-4 font-bold text-white"
        >
          Ver catálogo
        </Link>
      </section>
    )
  }

  const subtotal = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)

  async function enviar(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      const body = {
        cliente: form.cliente,
        telefono: form.telefono,
        correo: form.correo,
        notas: form.notas,
        items: items.map((i) => ({ id: i.id, cantidad: i.cantidad, idea: i.idea })),
      }
      const resultado = await api('/pedidos', { method: 'POST', body })
      guardarPedido(resultado)
      vaciar()
      setMostrarEnlace(false)
      setAbrir(true)
      setPedido(resultado)
    } catch (err) {
      if (err.data?.faltantes) {
        items
          .filter((i) => err.data.faltantes.includes(i.id))
          .forEach((i) => quitar(i.key))
        setError(`${err.message}. Los quitamos de tu carrito: revisa y vuelve a enviar.`)
      } else {
        setError(err.message)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Tu carrito</h1>

      <ul className="mt-8 flex flex-col gap-4">
        {items.map((i) => (
          <li
            key={i.key}
            className="flex flex-col gap-3 rounded-3xl border-2 border-lavender bg-card p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-xl font-semibold">{i.nombre}</p>
                {i.idea && <p className="mt-1 text-sm">Idea: {i.idea}</p>}
              </div>
              <p className="font-bold text-brand">{formatPrecio(i.precio * i.cantidad)}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={botonCantidad}
                  onClick={() => cambiarCantidad(i.key, -1)}
                  aria-label={`Quitar una unidad de ${i.nombre}`}
                >
                  −
                </button>
                <span className="w-6 text-center font-bold">{i.cantidad}</span>
                <button
                  type="button"
                  className={botonCantidad}
                  onClick={() => cambiarCantidad(i.key, 1)}
                  aria-label={`Agregar una unidad de ${i.nombre}`}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="min-h-11 font-bold text-brand"
                onClick={() => quitar(i.key)}
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={enviar} className="mt-10 flex flex-col gap-5">
        <h2 className="font-display text-2xl font-semibold">Tus datos</h2>

        <label className="flex flex-col gap-2 font-bold">
          Nombre
          <input
            value={form.cliente}
            onChange={(e) => cambiar('cliente', e.target.value)}
            maxLength={80}
            autoComplete="name"
            className={campo}
            required
          />
        </label>

        <label className="flex flex-col gap-2 font-bold">
          Teléfono (WhatsApp)
          <input
            type="tel"
            inputMode="tel"
            value={form.telefono}
            onChange={(e) => cambiar('telefono', e.target.value)}
            autoComplete="tel"
            placeholder="8 dígitos"
            className={campo}
            required
          />
          <span className="text-sm font-normal">
            Por aquí te escribimos para confirmar tu pedido.
          </span>
        </label>

        <label className="flex flex-col gap-2 font-bold">
          Correo electrónico (opcional)
          <input
            type="email"
            value={form.correo}
            onChange={(e) => cambiar('correo', e.target.value)}
            maxLength={120}
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            className={campo}
          />
          <span className="text-sm font-normal">Solo lo usamos para avisarte sobre tu pedido.</span>
        </label>

        <label className="flex flex-col gap-2 font-bold">
          Notas del pedido (opcional)
          <textarea
            value={form.notas}
            onChange={(e) => cambiar('notas', e.target.value)}
            rows={2}
            maxLength={500}
            className="rounded-2xl border-2 border-lavender bg-card p-3 font-normal"
          />
        </label>

        <div className="rounded-3xl border-2 border-lavender bg-card p-5">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrecio(subtotal)}</span>
          </p>
          <p className="flex justify-between">
            <span>Envío</span>
            <span>Por confirmar</span>
          </p>
          <p className="mt-3 text-sm">
            Al hacer tu pedido se abrirá WhatsApp con el mensaje listo: solo toca <em>Enviar</em>.
            La dirección y el costo del envío los acordamos por ahí.
          </p>
        </div>

        {error && (
          <p role="alert" className="font-bold text-brand">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            disabled={enviando}
            className="flex-1 rounded-full bg-brand px-8 py-4 font-bold text-white disabled:opacity-60"
          >
            {enviando ? 'Enviando...' : 'Hacer pedido'}
          </button>
          <button
            type="button"
            onClick={vaciar}
            className="min-h-11 rounded-full border-2 border-lavender px-8 py-4 font-bold"
          >
            Vaciar carrito
          </button>
        </div>
      </form>
    </section>
  )
}