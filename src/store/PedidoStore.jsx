import { create } from "zustand";

export const useStorePedidos = create((set, get) => ({
  buscador: "",
  entities : [],
  setBuscador: (p) => {
    set({ buscador: p });
  },
  
  loadEntities: async (entities) => {
    set({ entities });
  },
}))
