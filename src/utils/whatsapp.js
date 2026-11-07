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

  const envio = p.envioACoordinar
    ? 'Envío: por confirmar'
    : `Envío (${p.zona}): ${p.costoEnvio === 0 ? 'Gratis' : formatPrecio(p.costoEnvio)}`

  const total = p.envioACoordinar
    ? `*Total de productos: ${formatPrecio(p.subtotal)}*`
    : `*Total a pagar: ${formatPrecio(p.total)}*`

  return [
    `Hola, quiero confirmar mi pedido *${p.codigo}*`,
    `Soy ${p.cliente}.`,
    '',
    '*Mi pedido:*',
    ...lineas,
    '',
    `Subtotal: ${formatPrecio(p.subtotal)}`,
    envio,
    total,
    p.envioACoordinar ? null : `Punto de entrega: ${p.zona} (coordinamos hora y lugar exacto)`,
    p.notas ? `Notas: ${p.notas}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n')
}