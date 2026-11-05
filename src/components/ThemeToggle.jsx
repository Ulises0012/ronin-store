import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('ronin-tema', dark ? 'dark' : 'light')
    } catch {
      /* sin almacenamiento, no pasa nada */
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
      className="flex size-11 items-center justify-center rounded-full bg-white/15"
    >
      {dark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
        </svg>
      )}
    </button>
  )
}