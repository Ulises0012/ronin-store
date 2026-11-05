import { config } from '../data/config'
import { formatPrecio } from './format'

export function whatsappLink(texto = '') {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(texto)}`
}

export function mensajePedido(p) {
  const lineas = p.items.map(
    (i) =>
      `• ${i.cantidad} x ${i.nombre}\n` +
      `   ${formatPrecio(i.precio)} c/u = ${formatPrecio(i.precio * i.cantidad)}` +
      (i.idea ? `\n   Idea: ${i.idea}` : ''),
  )

  return [
    `Hola, quiero confirmar mi pedido *${p.codigo}*`,
    `Soy ${p.cliente}.`,
    '',
    '*Mi pedido:*',
    ...lineas,
    '',
    `*Total de productos: ${formatPrecio(p.subtotal)}*`,
    'Envío: por confirmar',
    p.notas ? `Notas: ${p.notas}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n')
}