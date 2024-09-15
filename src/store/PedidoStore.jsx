import { create } from "zustand";

export const useStorePedidos = create((set, get) => ({
  globalFilter: "",
  entities : [],

  setGlobalFilter: (globalFilter) => {
    set({ globalFilter });
  },
  
  loadEntities: async (entities) => {
    set({ entities });
  },
}))
