const clases = {
  brand: 'bg-brand text-white',
  pop: 'bg-pop text-night',
  butter: 'bg-butter text-night',
  aqua: 'bg-aqua text-night',
  lavender: 'bg-lavender text-ink',
  night: 'bg-night text-white',
}

export function colorClase(color) {
  return clases[color] ?? clases.brand
}