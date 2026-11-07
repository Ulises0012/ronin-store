import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { formatPrecio } from '../utils/format'

const vacia = { nombre: '', costo: '0', gratisDesde: '', aCoordinar: false, activo: true }
const campo = 'min-h-11 rounded-2xl border-2 border-lavender bg-card px-4 font-normal'

export default function Zonas() {
  const [zonas, setZonas] = useState([])
  const [form, setForm] = useState(vacia)
  const [editandoId, setEditandoId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function cargar() {
    try {
      setZonas(await api('/admin/zonas'))
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const cuerpo = (f) => ({
    nombre: f.nombre,
    costo: Number(f.costo),
    gratisDesde: f.gratisDesde === '' ? null : Number(f.gratisDesde),
    aCoordinar: f.aCoordinar,
    activo: f.activo,
  })

  function editar(z) {
    setEditandoId(z.id)
    setForm({
      nombre: z.nombre,
      costo: String(z.costo),
      gratisDesde: z.gratisDesde === null ? '' : String(z.gratisDesde),
      aCoordinar: z.aCoordinar,
      activo: z.activo,
    })
    window.scrollTo(0, 0)
  }

  function cancelar() {
    setEditandoId(null)
    setForm(vacia)
    setError('')
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      if (editandoId) {
        await api(`/admin/zonas/${editandoId}`, { method: 'PUT', body: cuerpo(form) })
      } else {
        await api('/admin/zonas', { method: 'POST', body: cuerpo(form) })
      }
      cancelar()
      await cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function alternar(z) {
    setError('')
    try {
      await api(`/admin/zonas/${z.id}`, {
        method: 'PUT',
        body: cuerpo({ ...z, costo: z.costo, gratisDesde: z.gratisDesde ?? '', activo: !z.activo }),
      })
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  async function borrar(z) {
    if (!window.confirm(`¿Borrar la zona "${z.nombre}"? Los pedidos anteriores conservan su nombre.`)) return
    setError('')
    try {
      await api(`/admin/zonas/${z.id}`, { method: 'DELETE' })
      if (editandoId === z.id) cancelar()
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <h1 className="font-display text-3xl font-bold">Zonas de envío</h1>
      <p className="mt-2">
        Los puntos con precio fijo (por ejemplo, Plaza Mundo) aparecen en el carrito para que el
        cliente los elija. Los marcados como "a coordinar" no se muestran al cliente.
      </p>
      <form
        onSubmit={guardar}
        className="mt-6 flex max-w-2xl flex-col gap-4 rounded-3xl border-2 border-lavender bg-card p-5"
      >
        <h2 className="font-display text-xl font-semibold">
          {editandoId ? 'Editar zona' : 'Nueva zona'}
        </h2>

        <label className="flex flex-col gap-2 font-bold">
          Nombre
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            maxLength={80}
            className={campo}
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 font-bold">
            Costo de envío (USD)
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.costo}
              onChange={(e) => setForm({ ...form, costo: e.target.value })}
              disabled={form.aCoordinar}
              className={`${campo} disabled:opacity-50`}
              required
            />
          </label>

          <label className="flex flex-col gap-2 font-bold">
            Envío gratis desde (opcional)
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.gratisDesde}
              onChange={(e) => setForm({ ...form, gratisDesde: e.target.value })}
              disabled={form.aCoordinar}
              placeholder="Ej: 30"
              className={`${campo} disabled:opacity-50`}
            />
          </label>
        </div>

        <label className="flex min-h-11 items-center gap-3 font-bold">
          <input
            type="checkbox"
            checked={form.aCoordinar}
            onChange={(e) => setForm({ ...form, aCoordinar: e.target.checked })}
            className="size-5"
          />
          El costo se acuerda por WhatsApp (no se suma al total)
        </label>

        <label className="flex min-h-11 items-center gap-3 font-bold">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
            className="size-5"
          />
          Disponible para los clientes
        </label>

        {error && (
          <p role="alert" className="font-bold text-brand">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            disabled={guardando}
            className="min-h-11 rounded-full bg-brand px-8 py-3 font-bold text-white disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Agregar zona'}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={cancelar}
              className="min-h-11 rounded-full border-2 border-lavender px-8 py-3 font-bold"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {cargando ? (
        <p className="mt-8">Cargando...</p>
      ) : zonas.length === 0 ? (
        <p className="mt-8 text-lg">Aún no hay zonas. Los clientes solo podrán elegir retiro en tienda.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {zonas.map((z) => (
            <li
              key={z.id}
              className="flex flex-wrap items-center gap-4 rounded-3xl border-2 border-lavender bg-card p-4"
            >
              <div className="min-w-40 flex-1">
                <p className="font-display text-lg font-semibold">
                  {z.nombre}
                  {!z.activo && <span className="ml-2 text-sm font-bold text-brand">(oculta)</span>}
                </p>
                <p className="text-sm">
                  {z.aCoordinar ? 'A coordinar por WhatsApp' : formatPrecio(z.costo)}
                  {z.gratisDesde !== null && !z.aCoordinar && ` · gratis desde ${formatPrecio(z.gratisDesde)}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm font-bold">
                <button onClick={() => editar(z)} className="min-h-11 rounded-full bg-lavender px-4">
                  Editar
                </button>
                <button onClick={() => alternar(z)} className="min-h-11 rounded-full bg-lavender px-4">
                  {z.activo ? 'Ocultar' : 'Mostrar'}
                </button>
                <button onClick={() => borrar(z)} className="min-h-11 rounded-full px-4 text-brand">
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}