import { create } from 'zustand'
import { api } from '../utils/api'

export const useTienda = create((set, get) => ({
  categorias: [],
  subcategorias: [],
  productos: [],
  zonas: [],
  estado: 'idle', // idle | cargando | listo | error
  error: '',

  cargar: async () => {
    if (get().estado === 'cargando') return
    set({ estado: 'cargando', error: '' })
    try {
      const [categorias, subcategorias, productos, zonas] = await Promise.all([
        api('/categorias'),
        api('/subcategorias'),
        api('/productos'),
        api('/zonas'),
      ])
      set({ categorias, subcategorias, productos,zonas, estado: 'listo' })
    } catch (e) {
      set({ estado: 'error', error: e.message })
    }
  },
}))