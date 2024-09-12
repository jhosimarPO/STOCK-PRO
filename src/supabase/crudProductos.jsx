import { supabase } from "../index";
import Swal from "sweetalert2";
export async function InsertarProductos(p) {
  try {
    // const { error } = await supabase.rpc("insertarproductos", p);
    const { error } = await supabase.from('productos').insert({
      descripcion : p._descripcion,
      idmarca : p._idmarca,
      stock : p._stock,
      stock_minimo : p._stock_minimo,
      codigobarras : p._codigobarras,
      codigointerno : p._codigointerno,
      precioventa : p._precioventa,
      preciocompra : p._preciocompra,
      id_categoria : p._id_categoria,
      id_empresa : 1,
      image : p._image,
    });
    if (error) {
      console.log("parametros", p);
      console.log("parametros", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ya existe un registro con " + p._descripcion,
        footer: '<a href="">Agregue una nueva descripcion</a>',
      });
    }
  } catch (err) {
    console.error(err)
  }
}
export async function MostrarProductos() {
  try {
    // const { data } = await supabase.rpc("mostrarproductos", {
      //   _id_empresa: p._id_empresa,
      // });
    const { data , error } = await supabase.from('productos').select(`*,categorias(*)`)
    if(error){
      console.error(error)
      return []
    }
    return data
  } catch (err) {
    console.error(err)
  }
}
export async function EliminarProductos(p) {
  try {
    const { error } = await supabase.from("productos").delete().eq("id", p.id);
    if (error) {
      alert("Error al eliminar", error);
    }
  } catch (error) {
    alert(error.error_description || error.message + " eliminar productos");
  }
}
export async function EditarProductos(p) {
  try {
    const { error } = await supabase.from("productos").update(p).eq("id", p.id);
    if (error) {
      alert("Error al editar producto", error);
    }
  } catch (error) {
    alert(error.error_description || error.message + " editar categorias");
  }
}

export async function BuscarProductos(p) {
  try {
    const { data } = await supabase.rpc("buscarproductos",{_id_empresa:p.id_empresa,buscador:p.descripcion})
    return data;
  } catch (error) {}
}
