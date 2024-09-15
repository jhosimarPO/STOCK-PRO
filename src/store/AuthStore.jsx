import { useState } from "react";
import { create } from "zustand";
import { supabase } from "../index";
import { Navigate } from "react-router-dom";
export const useAuthStore = create((set) => ({
  isAuth:false,
  datauserAuth: [],
  signInWithEmail: async (p) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: p.correo,
      password: p.pass,
    })
    if (error){
      return null;
    }
    return data.user;
  },
  signout: async () => {
    console.log("signout");
    const { error } = await supabase.auth.signOut()
    set({ isAuth: false });
    localStorage.setItem("userLogged", '{}');
    if (error)
      throw new Error("A ocurrido un error durante el cierre de sesión"+error);
  },

}));
