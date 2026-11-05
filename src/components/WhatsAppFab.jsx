import { whatsappLink } from '../utils/whatsapp'

export default function WhatsAppFab() {
  return (
    <a
      href={whatsappLink('Hola, quiero más información.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-night shadow-lg transition hover:scale-110"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5.2A8.5 8.5 0 1 1 21 11.5z" />
      </svg>
    </a>
  )
}