import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { colorClase } from '../utils/colores'

const COLORES = [
  { id: 'brand', nombre: 'Rojo' },
  { id: 'pop', nombre: 'Rosa' },
  { id: 'butter', nombre: 'Dorado' },
  { id: 'aqua', nombre: 'Turquesa' },
  { id: 'lavender', nombre: 'Lavanda' },
  { id: 'night', nombre: 'Negro' },
]

const vacia = { nombre: '', color: 'brand', imagen: null }
const campo = 'min-h-11 rounded-2xl border-2 border-lavender bg-card px-4 font-normal'

function resumenUso(c) {
  const partes = []
  if (c.productos) partes.push(`${c.productos} producto(s)`)
  if (c.subcategorias) partes.push(`${c.subcategorias} subcategoría(s)`)
  if (c.trabajos) partes.push(`${c.trabajos} trabajo(s)`)
  return partes.length ? partes.join(' · ') : 'Sin contenido'
}

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(vacia)
  const [editandoId, setEditandoId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')

  async function cargar() {
    try {
      setCategorias(await api('/admin/categorias'))
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function editar(c) {
    setEditandoId(c.id)
    setForm({ nombre: c.nombre, color: c.color, imagen: c.imagen ?? null })
    window.scrollTo(0, 0)
  }

  function cancelar() {
    setEditandoId(null)
    setForm(vacia)
    setError('')
  }

  async function subirFoto(ev) {
    const archivo = ev.target.files[0]
    ev.target.value = ''
    if (!archivo) return

    setError('')
    setSubiendo(true)
    try {
      const fd = new FormData()
      fd.append('imagen', archivo)
      const { url } = await api('/admin/upload', { method: 'POST', formData: fd })
      setForm((f) => ({ ...f, imagen: url }))
    } catch (e) {
      setError(e.message)
    } finally {
      setSubiendo(false)
    }
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      if (editandoId) await api(`/admin/categorias/${editandoId}`, { method: 'PUT', body: form })
      else await api('/admin/categorias', { method: 'POST', body: form })
      cancelar()
      await cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function mover(c, direccion) {
    setError('')
    try {
      await api(`/admin/categorias/${c.id}/mover`, { method: 'PATCH', body: { direccion } })
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  async function borrar(c) {
    if (!window.confirm(`¿Borrar la categoría "${c.nombre}"?`)) return
    setError('')
    try {
      await api(`/admin/categorias/${c.id}`, { method: 'DELETE' })
      if (editandoId === c.id) cancelar()
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <h1 className="font-display text-3xl font-bold">Categorías</h1>
      <p className="mt-2">
        El orden de esta lista es el mismo en que aparecen en la tienda. Los cambios se ven al
        recargar la tienda.
      </p>

      <form
        onSubmit={guardar}
        className="mt-6 flex max-w-2xl flex-col gap-4 rounded-3xl border-2 border-lavender bg-card p-5"
      >
        <h2 className="font-display text-xl font-semibold">
          {editandoId ? 'Editar categoría' : 'Nueva categoría'}
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

        <fieldset>
          <legend className="font-bold">Color (se usa si no hay imagen)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {COLORES.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setForm({ ...form, color: c.id })}
                aria-pressed={form.color === c.id}
                className={`min-h-11 rounded-full px-5 font-bold ${colorClase(c.id)} ${
                  form.color === c.id ? 'ring-4 ring-ink' : 'opacity-80'
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <p className="font-bold">Imagen de la tarjeta (opcional)</p>
          <p className="text-sm">
            Mejor una foto horizontal (4:3 o más ancha), con lo importante al centro.
          </p>
          {form.imagen && (
            <img
              src={form.imagen}
              alt="Vista previa"
              className="mt-3 aspect-4/3 w-48 rounded-2xl object-cover"
            />
          )}
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-lavender px-5 font-bold">
              {subiendo ? 'Subiendo...' : form.imagen ? 'Cambiar imagen' : '+ Agregar imagen'}
              <input
                type="file"
                accept="image/*"
                onChange={subirFoto}
                disabled={subiendo}
                className="sr-only"
              />
            </label>
            {form.imagen && (
              <button
                type="button"
                onClick={() => setForm({ ...form, imagen: null })}
                className="min-h-11 px-3 font-bold text-brand"
              >
                Quitar imagen
              </button>
            )}
          </div>
        </div>

        {error && (
          <p role="alert" className="font-bold text-brand">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            disabled={guardando || subiendo}
            className="min-h-11 rounded-full bg-brand px-8 py-3 font-bold text-white disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Agregar categoría'}
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
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {categorias.map((c, i) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center gap-4 rounded-3xl border-2 border-lavender bg-card p-3"
            >
              {c.imagen ? (
                <img src={c.imagen} alt="" className="size-12 shrink-0 rounded-2xl object-cover" />
              ) : (
                <div className={`size-12 shrink-0 rounded-2xl ${colorClase(c.color)}`} aria-hidden="true" />
              )}

              <div className="min-w-40 flex-1">
                <p className="font-display text-lg font-semibold">{c.nombre}</p>
                <p className="text-sm">{resumenUso(c)}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm font-bold">
                <button
                  onClick={() => mover(c, 'arriba')}
                  disabled={i === 0}
                  aria-label={`Subir ${c.nombre}`}
                  className="min-h-11 rounded-full bg-lavender px-4 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => mover(c, 'abajo')}
                  disabled={i === categorias.length - 1}
                  aria-label={`Bajar ${c.nombre}`}
                  className="min-h-11 rounded-full bg-lavender px-4 disabled:opacity-30"
                >
                  ↓
                </button>
                <button onClick={() => editar(c)} className="min-h-11 rounded-full bg-lavender px-4">
                  Editar
                </button>
                <button onClick={() => borrar(c)} className="min-h-11 rounded-full px-4 text-brand">
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