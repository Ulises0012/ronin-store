import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import TiendaLayout from './components/TiendaLayout'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import Personalizar from './pages/Personalizar'
import Galeria from './pages/Galeria'
import Preguntas from './pages/Preguntas'
import Contacto from './pages/Contacto'
import NotFound from './pages/NotFound'
import Login from './admin/Login'
import AdminLayout from './admin/AdminLayout'
import Productos from './admin/Productos'
import ProductoForm from './admin/ProductoForm'
import Pedidos from './admin/Pedidos'
import Zonas from './admin/Zonas'
import Subcategorias from './admin/Subcategorias'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<TiendaLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/personalizar" element={<Personalizar />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/preguntas" element={<Preguntas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="subcategorias" element={<Subcategorias />} />
<Route path="zonas" element={<Zonas />} />
          <Route index element={<Productos />} />
          <Route path="productos/nuevo" element={<ProductoForm />} />
          <Route path="productos/:id" element={<ProductoForm />} />
        </Route>
      </Routes>
    </>
  )
}