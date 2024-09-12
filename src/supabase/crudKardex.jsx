import { supabase } from "../index";
import Swal from "sweetalert2";
export async function InsertarKardex(p) {
  const { error } = await supabase.from("kardex").insert(p);
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
      footer: '<a href="">...</a>',
    });
  }
}

export async function MostrarKardex() {
  const { data , error } = await supabase
    .from("kardex")
    .select(`*,usuarios(*),productos(*)`)
    .order("id", { ascending: false });
  if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
      footer: '<a href="">...</a>',
    });
    console.error(error)
    return [];
  }
  console.log("[CRUD][R] Kardex",data);
  return data;
}
export async function BuscarKardex(p) {
  const { data } = await supabase.from('kardex').select(`*,usuarios(*),productos(*)`).order("id", { ascending: false });
    
  return data;
}
