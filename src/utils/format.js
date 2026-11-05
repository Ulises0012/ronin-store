export function formatPrecio(valor) {
  return `$${valor.toFixed(2)}`
}

export function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}