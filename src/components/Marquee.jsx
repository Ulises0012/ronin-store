const frases = ['Anime', 'K-pop', 'Amigurumis', 'Camisas', 'Tazas', 'Globos y rosas', 'Personalizados']

export default function Marquee() {
  const mitad = [...frases, ...frases]
  const todo = [...mitad, ...mitad]

  return (
    <div className="overflow-hidden bg-brand py-3 text-white" aria-hidden="true">
      <div className="flex w-max animate-marquee whitespace-nowrap font-logo text-lg font-bold uppercase tracking-widest">
        {todo.map((f, i) => (
          <span key={i} className="px-5">
            {f} ✦
          </span>
        ))}
      </div>
    </div>
  )
}