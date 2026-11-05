import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useTienda } from '../store/tienda'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFab from './WhatsAppFab'

export default function TiendaLayout() {
  const estado = useTienda((s) => s.estado)
  const cargar = useTienda((s) => s.cargar)

  useEffect(() => {
    if (estado === 'idle') cargar()
  }, [estado, cargar])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}