import { config } from '../data/config'

export default function Logo({ className = '' }) {
  const [primera, ...resto] = config.storeName.split(' ')

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="28" fill="#E11D48" />
        <path d="M14 50 L50 14" stroke="#FAF5F0" strokeWidth="4" strokeLinecap="round" />
        <path d="M18 38 L26 46" stroke="#F2B84B" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="font-logo text-xl font-bold uppercase tracking-widest">
        {primera} <span className="text-pop">{resto.join(' ')}</span>
      </span>
    </span>
  )
}