import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../utils/api'

const ETIQUETAS = ['Nuevo', 'Más pedido', 'Personalizable', 'Edición limitada']

const vacio = {
  nombre: '',
  categoria: '',
  subcategoria: '',
  precio: '',
  descripcion: '',
  personalizable: false,
  activo: true,
  etiquetas: [],
  imagenes: [],
}

const campo = 'min-h-11 rounded-2xl border-2 border-lavender bg-card px-4 font-normal'

export default function ProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(vacio)
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [noExiste, setNoExiste] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const [cats, subs] = await Promise.all([api('/categorias'), api('/admin/subcategorias')])
        setCategorias(cats)
        setSubcategorias(subs)
        if (id) {
          const lista = await api('/admin/productos')
          const p = lista.find((x) => x.id === id)
          if (p) setForm({ ...p, precio: String(p.precio), subcategoria: p.subcategoria ?? '' })
          else setNoExiste(true)
        } else if (cats[0]) {
          setForm((f) => ({ ...f, categoria: cats[0].id }))
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  const cambiar = (campoNombre, valor) => setForm((f) => ({ ...f, [campoNombre]: valor }))

  // Al cambiar de categoría se limpia la subcategoría, porque ya no corresponde
  const cambiarCategoria = (valor) =>
    setForm((f) => ({ ...f, categoria: valor, subcategoria: '' }))

  const subsDeCategoria = subcategorias.filter((s) => s.categoria === form.categoria)

  function alternarEtiqueta(e) {
    setForm((f) => ({
      ...f,
      etiquetas: f.etiquetas.includes(e) ? f.etiquetas.filter((x) => x !== e) : [...f.etiquetas, e],
    }))
  }

  async function subirFotos(ev) {
    const archivos = [...ev.target.files]
    ev.target.value = ''
    if (!archivos.length) return

    if (form.imagenes.length + archivos.length > 8) {
      setError('Máximo 8 fotos por producto')
      return
    }

    setError('')
    setSubiendo(true)
    try {
      const nuevas = []
      for (const archivo of archivos) {
        const fd = new FormData()
        fd.append('imagen', archivo)
        const { url } = await api('/admin/upload', { method: 'POST', formData: fd })
        nuevas.push(url)
      }
      setForm((f) => ({ ...f, imagenes: [...f.imagenes, ...nuevas] }))
    } catch (e) {
      setError(e.message)
    } finally {
      setSubiendo(false)
    }
  }

  function quitarFoto(i) {
    setForm((f) => ({ ...f, imagenes: f.imagenes.filter((_, n) => n !== i) }))
  }

  function moverFoto(i, dir) {
    setForm((f) => {
      const lista = [...f.imagenes]
      const j = i + dir
      if (j < 0 || j >= lista.length) return f
      ;[lista[i], lista[j]] = [lista[j], lista[i]]
      return { ...f, imagenes: lista }
    })
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      const body = {
        ...form,
        precio: Number(form.precio),
        subcategoria: form.subcategoria === '' ? null : Number(form.subcategoria),
      }
      if (id) await api(`/admin/productos/${id}`, { method: 'PUT', body })
      else await api('/admin/productos', { method: 'POST', body })
      navigate('/admin')
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  if (cargando) return <p>Cargando...</p>
  if (noExiste) {
    return (
      <>
        <p className="text-lg">No encontramos ese producto.</p>
        <Link to="/admin" className="mt-4 inline-block font-bold text-brand">
          ← Volver
        </Link>
      </>
    )
  }

  return (
    <form onSubmit={guardar} className="flex max-w-2xl flex-col gap-5">
      <Link to="/admin" className="font-bold text-brand">
        ← Volver a productos
      </Link>
      <h1 className="font-display text-3xl font-bold">{id ? 'Editar producto' : 'Nuevo producto'}</h1>

      <label className="flex flex-col gap-2 font-bold">
        Nombre
        <input
          value={form.nombre}
          onChange={(e) => cambiar('nombre', e.target.value)}
          maxLength={120}
          className={campo}
          required
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 font-bold">
          Categoría
          <select
            value={form.categoria}
            onChange={(e) => cambiarCategoria(e.target.value)}
            className={campo}
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
          Subcategoría (opcional)
          <select
            value={form.subcategoria}
            onChange={(e) => cambiar('subcategoria', e.target.value)}
            className={campo}
          >
            <option value="">Sin subcategoría</option>
            {subsDeCategoria.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
                {!s.activo ? ' (oculta)' : ''}
              </option>
            ))}
          </select>
          {subsDeCategoria.length === 0 && (
            <span className="text-sm font-normal">
              Esta categoría no tiene subcategorías.{' '}
              <Link to="/admin/subcategorias" className="font-bold text-brand">
                Crear una
              </Link>
            </span>
          )}
        </label>
      </div>

      <label className="flex flex-col gap-2 font-bold">
        Precio (USD)
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.precio}
          onChange={(e) => cambiar('precio', e.target.value)}
          className={campo}
          required
        />
      </label>

      <label className="flex flex-col gap-2 font-bold">
        Descripción
        <textarea
          value={form.descripcion}
          onChange={(e) => cambiar('descripcion', e.target.value)}
          rows={4}
          maxLength={1000}
          className="rounded-2xl border-2 border-lavender bg-card p-3 font-normal"
        />
      </label>

      <fieldset>
        <legend className="font-bold">Etiquetas</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ETIQUETAS.map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => alternarEtiqueta(e)}
              aria-pressed={form.etiquetas.includes(e)}
              className={`min-h-11 rounded-full border-2 px-4 font-bold ${
                form.etiquetas.includes(e) ? 'border-brand bg-brand text-white' : 'border-lavender bg-card'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex min-h-11 items-center gap-3 font-bold">
        <input
          type="checkbox"
          checked={form.personalizable}
          onChange={(e) => cambiar('personalizable', e.target.checked)}
          className="size-5"
        />
        Se puede personalizar (muestra el cuadro "Cuéntanos tu idea")
      </label>

      <label className="flex min-h-11 items-center gap-3 font-bold">
        <input
          type="checkbox"
          checked={form.activo}
          onChange={(e) => cambiar('activo', e.target.checked)}
          className="size-5"
        />
        Visible en la tienda
      </label>

      <div>
        <p className="font-bold">Fotos (máximo 8)</p>
        <p className="text-sm">La primera es la portada del producto. Se reducen y optimizan solas.</p>

        <div className="mt-3 flex flex-wrap gap-3">
          {form.imagenes.map((src, i) => (
            <div key={src} className="flex flex-col gap-1">
              <img
                src={src}
                alt={`Foto ${i + 1}`}
                className={`size-28 rounded-2xl object-cover ${i === 0 ? 'ring-4 ring-brand' : ''}`}
              />
              <div className="flex justify-between text-sm font-bold">
                <button type="button" onClick={() => moverFoto(i, -1)} disabled={i === 0} aria-label="Mover a la izquierda" className="min-h-9 px-2 disabled:opacity-30">
                  ←
                </button>
                <button type="button" onClick={() => quitarFoto(i)} className="min-h-9 px-2 text-brand">
                  Quitar
                </button>
                <button type="button" onClick={() => moverFoto(i, 1)} disabled={i === form.imagenes.length - 1} aria-label="Mover a la derecha" className="min-h-9 px-2 disabled:opacity-30">
                  →
                </button>
              </div>
            </div>
          ))}
        </div>

        <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-lavender px-5 font-bold">
          {subiendo ? 'Subiendo...' : '+ Agregar fotos'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={subirFotos}
            disabled={subiendo}
            className="sr-only"
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="font-bold text-brand">
          {error}
        </p>
      )}

      <button
        disabled={guardando || subiendo}
        className="min-h-11 rounded-full bg-brand px-8 py-4 font-bold text-white disabled:opacity-60"
      >
        {guardando ? 'Guardando...' : 'Guardar producto'}
      </button>
    </form>
  )
}