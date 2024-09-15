import { GlobalFiltering } from "@tanstack/react-table";
import { create } from "zustand";

export const usePersonalStore = create((set, get) => ({
  globalFilter: '',
  setGlobalFilter: (text) => {
    set({ globalFilter: text });
  },
}));
