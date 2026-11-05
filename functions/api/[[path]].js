// Reenvía /api/* a la API en Render, para que tienda y panel usen el mismo dominio
export async function onRequest({ request, env }) {
  if (!env.API_ORIGIN) {
    return new Response(JSON.stringify({ error: 'Falta configurar API_ORIGIN' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  const url = new URL(request.url)
  const destino = new URL(url.pathname + url.search, env.API_ORIGIN)

  const peticion = new Request(destino, request)
  peticion.headers.set('x-client-ip', request.headers.get('cf-connecting-ip') ?? '')
  if (env.PROXY_SECRET) peticion.headers.set('x-proxy-secret', env.PROXY_SECRET)

  return fetch(peticion)
}