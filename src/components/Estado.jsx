export default function Estado({ estado, error, onReintentar }) {
  if (estado === 'error') {
    return (
      <div role="alert" className="mx-auto max-w-xl px-4 py-12 text-center">
        <p className="font-display text-2xl font-semibold">No pudimos cargar los datos</p>
        <p className="mt-2">{error}</p>
        <button
          onClick={onReintentar}
          className="mt-6 min-h-11 rounded-full bg-brand px-8 py-3 font-bold text-white"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <p role="status" className="px-4 py-12 text-center text-lg">
      Cargando...
    </p>
  )
}