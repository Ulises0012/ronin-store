import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import { formatPrecio } from '../utils/format'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  async function cargar() {
    try {
      setProductos(await api('/admin/productos'))
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function alternar(p) {
    setError('')
    try {
      await api(`/admin/productos/${p.id}`, { method: 'PUT', body: { ...p, activo: !p.activo } })
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  async function borrar(p) {
    if (!window.confirm(`¿Borrar "${p.nombre}"? Esta acción no se puede deshacer.`)) return
    setError('')
    try {
      await api(`/admin/productos/${p.id}`, { method: 'DELETE' })
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="rounded-full bg-brand px-6 py-3 font-bold text-white"
        >
          + Nuevo
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 font-bold text-brand">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="mt-8">Cargando...</p>
      ) : productos.length === 0 ? (
        <p className="mt-8 text-lg">Aún no hay productos. Crea el primero con el botón "+ Nuevo".</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {productos.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-3xl border-2 border-lavender bg-card p-3"
            >
              {p.imagenes[0] ? (
                <img src={p.imagenes[0]} alt="" className="size-16 rounded-2xl object-cover" />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-2xl bg-lavender text-xs">
                  Sin foto
                </div>
              )}

              <div className="min-w-40 flex-1">
                <p className="font-display text-lg font-semibold">{p.nombre}</p>
                <p className="text-sm">
                  {formatPrecio(p.precio)} · {p.categoria}
                  {!p.activo && <span className="ml-2 font-bold text-brand">(oculto)</span>}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm font-bold">
                <Link to={`/admin/productos/${p.id}`} className="flex min-h-11 items-center rounded-full bg-lavender px-4">
                  Editar
                </Link>
                <button onClick={() => alternar(p)} className="min-h-11 rounded-full bg-lavender px-4">
                  {p.activo ? 'Ocultar' : 'Mostrar'}
                </button>
                <button onClick={() => borrar(p)} className="min-h-11 rounded-full px-4 text-brand">
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