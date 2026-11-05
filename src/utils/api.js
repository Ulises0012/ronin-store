export async function api(ruta, { method = 'GET', body, formData } = {}) {
  const opciones = { method, credentials: 'same-origin', headers: {} }

  if (formData) {
    opciones.body = formData
  } else if (body !== undefined) {
    opciones.headers['Content-Type'] = 'application/json'
    opciones.body = JSON.stringify(body)
  }

  const res = await fetch(`/api${ruta}`, opciones)
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.error || 'No se pudo conectar con el servidor')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}