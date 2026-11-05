const estilos = {
  Nuevo: 'bg-aqua text-night',
  'Más pedido': 'bg-butter text-night',
  Personalizable: 'bg-pop text-night',
  'Edición limitada': 'bg-brand text-white',
}

export default function Etiquetas({ lista = [], className = '' }) {
  if (!lista.length) return null

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {lista.map((e) => (
        <span
          key={e}
          className={`rounded-full px-3 py-1 text-xs font-bold ${estilos[e] ?? 'bg-night text-white'}`}
        >
          {e}
        </span>
      ))}
    </div>
  )
}