import { useEffect, useState } from 'react'
import { api } from '../utils/api'

const campo = 'min-h-11 rounded-2xl border-2 border-lavender bg-card px-4 font-normal'

export default function Subcategorias() {
  const [categorias, setCategorias] = useState([])
  const [subs, setSubs] = useState([])
  const [form, setForm] = useState({ categoria: '', nombre: '', activo: true })
  const [editandoId, setEditandoId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function cargar() {
    try {
      const [cats, lista] = await Promise.all([api('/categorias'), api('/admin/subcategorias')])
      setCategorias(cats)
      setSubs(lista)
      setForm((f) => (f.categoria || !cats[0] ? f : { ...f, categoria: cats[0].id }))
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function editar(s) {
    setEditandoId(s.id)
    setForm({ categoria: s.categoria, nombre: s.nombre, activo: s.activo })
    window.scrollTo(0, 0)
  }

  function cancelar() {
    setEditandoId(null)
    setForm({ categoria: categorias[0]?.id ?? '', nombre: '', activo: true })
    setError('')
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      if (editandoId) {
        await api(`/admin/subcategorias/${editandoId}`, {
          method: 'PUT',
          body: { nombre: form.nombre, activo: form.activo },
        })
      } else {
        await api('/admin/subcategorias', { method: 'POST', body: form })
      }
      cancelar()
      await cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function alternar(s) {
    setError('')
    try {
      await api(`/admin/subcategorias/${s.id}`, {
        method: 'PUT',
        body: { nombre: s.nombre, activo: !s.activo },
      })
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  async function borrar(s) {
    const aviso = s.productos
      ? `Tiene ${s.productos} producto(s): quedarán sin subcategoría, pero no se borran.`
      : 'No tiene productos.'
    if (!window.confirm(`¿Borrar "${s.nombre}"? ${aviso}`)) return
    setError('')
    try {
      await api(`/admin/subcategorias/${s.id}`, { method: 'DELETE' })
      if (editandoId === s.id) cancelar()
      await cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <h1 className="font-display text-3xl font-bold">Subcategorías</h1>
      <p className="mt-2">
        Por ejemplo, dentro de "Anime" puedes crear Naruto o One Piece. Luego se las asignas a cada
        producto desde su formulario.
      </p>

      <form
        onSubmit={guardar}
        className="mt-6 flex max-w-2xl flex-col gap-4 rounded-3xl border-2 border-lavender bg-card p-5"
      >
        <h2 className="font-display text-xl font-semibold">
          {editandoId ? 'Editar subcategoría' : 'Nueva subcategoría'}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 font-bold">
            Categoría
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              disabled={!!editandoId}
              className={`${campo} disabled:opacity-50`}
              required
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 font-bold">
            Nombre
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              maxLength={80}
              placeholder="Ej: Naruto"
              className={campo}
              required
            />
          </label>
        </div>

        <label className="flex min-h-11 items-center gap-3 font-bold">
          <input
            type="checkbox"
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
            className="size-5"
          />
          Visible en la tienda
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
            {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Agregar'}
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
      ) : subs.length === 0 ? (
        <p className="mt-8 text-lg">Aún no hay subcategorías.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-6">
          {categorias
            .filter((c) => subs.some((s) => s.categoria === c.id))
            .map((c) => (
              <section key={c.id}>
                <h2 className="font-display text-xl font-semibold">{c.nombre}</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {subs
                    .filter((s) => s.categoria === c.id)
                    .map((s) => (
                      <li
                        key={s.id}
                        className="flex flex-wrap items-center gap-4 rounded-3xl border-2 border-lavender bg-card p-3 pl-5"
                      >
                        <div className="min-w-40 flex-1">
                          <p className="font-bold">
                            {s.nombre}
                            {!s.activo && <span className="ml-2 text-sm text-brand">(oculta)</span>}
                          </p>
                          <p className="text-sm">{s.productos} producto(s)</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm font-bold">
                          <button onClick={() => editar(s)} className="min-h-11 rounded-full bg-lavender px-4">
                            Editar
                          </button>
                          <button onClick={() => alternar(s)} className="min-h-11 rounded-full bg-lavender px-4">
                            {s.activo ? 'Ocultar' : 'Mostrar'}
                          </button>
                          <button onClick={() => borrar(s)} className="min-h-11 rounded-full px-4 text-brand">
                            Borrar
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
        </div>
      )}
    </>
  )
}