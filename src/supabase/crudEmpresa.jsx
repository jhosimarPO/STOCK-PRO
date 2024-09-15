import { supabase } from "../index";

export const MostrarEmpresa = async (p) => {
  // const { data } = await supabase.rpc("mostrarempresaasignaciones", {
  //   _id_usuario: p.idusuario,
  // })
  // const { data ,error} = await supabase.from("asignarempresa").select('*').eq("id_usuario", p.idusuario)
  // .maybeSingle();

  // if(error){
  //   console.error(error)
  //   return []
  // }
  // if (data) {
  //   return data;
  // }
  return []
}

export const ContarUsuariosXempresa = async (p) => {
  const { data,error } = await supabase.rpc("contarusuariosxempresa", {
    _id_empresa: p.id_empresa,
  }).maybeSingle();
 
  if(error){
    console.error(error)
    return []
  }
  if (data) {
    return data;
  }
};
