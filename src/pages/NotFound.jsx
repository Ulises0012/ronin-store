import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 text-center">
      <p className="font-display text-7xl font-bold text-brand">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Esta página no existe</h1>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-brand px-8 py-4 font-bold text-white"
      >
        Volver al inicio
      </Link>
    </section>
  )
}