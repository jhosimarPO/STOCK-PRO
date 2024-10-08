import { create } from "zustand";
import { BuscarKardex, InsertarKardex, MostrarKardex } from "../index";
import { GlobalFiltering } from "@tanstack/react-table";
export const useKardexStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => {
    set({ buscador: p });
  },
  datakardex: [],
  kardexItemSelect: [],
  parametros: {},

  insertarKardex: async (p) => {
    await InsertarKardex(p);
    const { mostrarKardex } = get();
    const { parametros } = get();
    set(mostrarKardex(parametros));
  },
  mostrarKardex: async () => {
    const response = await MostrarKardex();
    // set({ parametros: p });
    set({ datakardex: response });
    return response;
  },
  buscarKardex: async (p) => {
    const response = await BuscarKardex(p);
    set({ datakardex: response });
    return response;
  },
  globalFilter : '',
  setGlobalFilter: (globalFilter) => {
    set({ globalFilter })
  },
}));
