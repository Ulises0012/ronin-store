import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCarrito = create(
  persist(
    (set) => ({
      items: [],

      agregar: (producto, idea = '') =>
        set((state) => {
          const nota = idea.trim()
          const key = `${producto.id}::${nota}`
          const existe = state.items.find((i) => i.key === key)

          if (existe) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, cantidad: i.cantidad + 1 } : i,
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                key,
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                idea: nota,
                cantidad: 1,
              },
            ],
          }
        }),

      cambiarCantidad: (key, delta) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.key === key ? { ...i, cantidad: i.cantidad + delta } : i))
            .filter((i) => i.cantidad > 0),
        })),

      quitar: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      vaciar: () => set({ items: [] }),
    }),
    { name: 'ronin-core-carrito' },
  ),
)