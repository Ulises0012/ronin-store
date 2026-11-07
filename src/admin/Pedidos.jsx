import { useCallback, useEffect, useState } from 'react'
import { api } from '../utils/api'
import { formatPrecio } from '../utils/format'

const ESTADOS = {
  pendiente_confirmacion: 'Pendiente de confirmación',
  confirmado: 'Confirmado',
  en_proceso: 'En proceso',
  listo: 'Listo',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const colores = {
  pendiente_confirmacion: 'bg-butter text-night',
  confirmado: 'bg-aqua text-night',
  en_proceso: 'bg-pop text-night',
  listo: 'bg-brand text-white',
  enviado: 'bg-night text-white',
  entregado: 'bg-lavender text-ink',
  cancelado: 'bg-lavender text-ink',
}

const campo = 'min-h-11 rounded-2xl border-2 border-lavender bg-card px-4 font-normal'

function linkWhatsapp(telefono) {
  const numero = telefono.length === 8 ? `503${telefono}` : telefono
  return `https://wa.me/${numero}`
}

function Entrega({ pedido, zonas, onGuardado }) {
  const [zonaId, setZonaId] = useState('')
  const [direccion, setDireccion] = useState(pedido.direccion)
  const [referencia, setReferencia] = useState(pedido.referencia)
  const [costo, setCosto] = useState(pedido.envioACoordinar ? '' : String(pedido.costoEnvio))
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  function elegirZona(id) {
    setZonaId(id)
    const z = zonas.find((x) => String(x.id) === id)
    if (z && !z.aCoordinar) setCosto(String(z.costo))
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      await api(`/admin/pedidos/${pedido.id}/entrega`, {
        method: 'PATCH',
        body: {
          zonaId: zonaId === '' ? null : Number(zonaId),
          direccion,
          referencia,
          costoEnvio: costo === '' ? null : Number(costo),
        },
      })
      await onGuardado()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-3 rounded-2xl bg-lavender p-4">
      <p className="font-display text-lg font-semibold">Datos de entrega</p>

      <label className="flex flex-col gap-1 text-sm font-bold">
        Zona (para sugerir el costo)
        <select value={zonaId} onChange={(e) => elegirZona(e.target.value)} className={campo}>
          <option value="">{pedido.zona ? `Actual: ${pedido.zona}` : 'Sin zona'}</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>
              {z.nombre} {z.aCoordinar ? '(a coordinar)' : `(${formatPrecio(z.costo)})`}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-bold">
        Dirección
        <textarea
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          rows={2}
          maxLength={250}
          className="rounded-2xl border-2 border-lavender bg-card p-3 font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-bold">
        Punto de referencia
        <input
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          maxLength={250}
          className={campo}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-bold">
        Costo de envío (USD). Déjalo vacío si aún no se acuerda
        <input
          type="number"
          min="0"
          step="0.01"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          className={campo}
        />
      </label>

      {error && (
        <p role="alert" className="font-bold text-brand">
          {error}
        </p>
      )}

      <button
        disabled={guardando}
        className="min-h-11 self-start rounded-full bg-brand px-6 font-bold text-white disabled:opacity-60"
      >
        {guardando ? 'Guardando...' : 'Guardar datos de entrega'}
      </button>
    </form>
  )
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [zonas, setZonas] = useState([])
  const [filtro, setFiltro] = useState('todos')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargar = useCallback(async () => {
    try {
      const [lista, z] = await Promise.all([api('/admin/pedidos'), api('/admin/zonas')])
      setPedidos(lista)
      setZonas(z.filter((x) => x.activo))
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [])

   useEffect(() => {
    cargar()
    const alVolver = () => {
      if (document.visibilityState === 'visible') cargar()
    }
    document.addEventListener('visibilitychange', alVolver)
    return () => document.removeEventListener('visibilitychange', alVolver)
  }, [cargar])

  async function cambiarEstado(p, estado) {
    setError('')
    try {
      await api(`/admin/pedidos/${p.id}/estado`, { method: 'PATCH', body: { estado } })
      setPedidos((lista) => lista.map((x) => (x.id === p.id ? { ...x, estado } : x)))
    } catch (e) {
      setError(e.message)
    }
  }

  const pendientes = pedidos.filter((p) => p.estado === 'pendiente_confirmacion').length
  const lista = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.estado === filtro)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">
          Pedidos
          {pendientes > 0 && (
            <span className="ml-3 rounded-full bg-butter px-3 py-1 text-sm font-bold text-night">
              {pendientes} por confirmar
            </span>
          )}
        </h1>
        <div className="flex gap-2">
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Filtrar por estado"
            className={campo}
          >
            <option value="todos">Todos</option>
            {Object.entries(ESTADOS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <button onClick={cargar} className="min-h-11 rounded-full bg-lavender px-5 font-bold">
            Actualizar
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm">La lista se actualiza sola cada 30 segundos.</p>

      {error && (
        <p role="alert" className="mt-4 font-bold text-brand">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="mt-8">Cargando...</p>
      ) : lista.length === 0 ? (
        <p className="mt-8 text-lg">No hay pedidos {filtro === 'todos' ? 'todavía' : 'en este estado'}.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {lista.map((p) => (
            <li key={p.id}>
              <details className="rounded-3xl border-2 border-lavender bg-card p-4">
                <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 [&::-webkit-details-marker]:hidden">
                  <span className="font-display text-lg font-semibold">{p.codigo}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${colores[p.estado]}`}>
                    {ESTADOS[p.estado]}
                  </span>
                  <span className="flex-1">{p.cliente}</span>
                  <span className="font-bold text-brand">
                    {formatPrecio(p.total)}
                    {p.envioACoordinar && ' + envío'}
                  </span>
                  <span className="w-full text-sm sm:w-auto">
                    {new Date(p.creadoEn).toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </summary>

                <div className="mt-4 flex flex-col gap-4 border-t-2 border-lavender pt-4">
                  <ul className="flex flex-col gap-1">
                    {p.items.map((i, n) => (
                      <li key={n}>
                        {i.cantidad} x {i.nombre} ({formatPrecio(i.precio * i.cantidad)})
                        {i.idea && <span className="block text-sm">Idea: {i.idea}</span>}
                      </li>
                    ))}
                  </ul>

                  <p>
                    Subtotal {formatPrecio(p.subtotal)} · Envío{' '}
                    {p.envioACoordinar ? 'por confirmar' : formatPrecio(p.costoEnvio)}
                  </p>

                  {p.notas && <p>Notas del cliente: {p.notas}</p>}
                  {p.correo && (
                    <p>
                      Correo:{' '}
                      <a href={`mailto:${p.correo}`} className="font-bold text-brand">
                        {p.correo}
                      </a>
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={linkWhatsapp(p.telefono)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-11 items-center rounded-full bg-brand px-5 font-bold text-white"
                    >
                      Abrir chat: {p.telefono}
                    </a>

                    {p.estado === 'pendiente_confirmacion' && (
                      <button
                        onClick={() => cambiarEstado(p, 'confirmado')}
                        className="min-h-11 rounded-full bg-aqua px-5 font-bold text-night"
                      >
                        Marcar como confirmado
                      </button>
                    )}

                    <label className="flex items-center gap-2 font-bold">
                      Estado
                      <select
                        value={p.estado}
                        onChange={(e) => cambiarEstado(p, e.target.value)}
                        className="min-h-11 rounded-2xl border-2 border-lavender bg-card px-3 font-normal"
                      >
                        {Object.entries(ESTADOS).map(([id, label]) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <Entrega key={p.id} pedido={p} zonas={zonas} onGuardado={cargar} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}