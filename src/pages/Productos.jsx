
import { useQuery } from "@tanstack/react-query";

import { useCategoriasStore } from "../store/CategoriasStore";
import { useEmpresaStore } from "../store/EmpresaStore";
import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { ProductosTemplate } from "../components/templates/ProductosTemplate";
import { useProductosStore } from "../store/ProductosStore";
import { useMarcaStore } from "../store/MarcaStore";
import { usePermisosStore,BloqueoPagina } from "../index";
export function Productos() {
  const { datapermisos } = usePermisosStore();
  console.log("datapermisos",datapermisos);
  
  const statePermiso = datapermisos.some((objeto) =>
    objeto.modulos.nombre.includes("Productos")
  );
if (statePermiso == false) {
  return <BloqueoPagina state={statePermiso} />;
} 
  const {mostrarProductos,dataproductos,buscador,buscarProductos} = useProductosStore()
  const {mostrarCategorias} = useCategoriasStore()
  const {mostrarMarca} = useMarcaStore()
  const {dataempresa} = useEmpresaStore()
 const {data : products,isLoading,error} = useQuery({queryKey:["mostrar productos",dataempresa.id],queryFn:()=>mostrarProductos()})
 //buscador
 const {data:buscar} = useQuery({queryKey:["buscar productos",buscador],queryFn:()=>buscarProductos({descripcion: buscador,id_empresa:dataempresa.id}),enabled:dataempresa.id!=null})
 //mostrar marcas
 const {data:marca} = useQuery({queryKey:["mostrar marcas",dataempresa.id],queryFn:()=>mostrarMarca()})
  //mostrar categorias
  const {data:datacategorias} = useQuery({queryKey:["mostrar categorias",dataempresa.id],queryFn:()=>mostrarCategorias({idempresa:dataempresa.id})})

 
 if(isLoading){
  return <SpinnerLoader/>
 }
 if(error){
  return <span>Error...</span>
 }

  return (<>

    <ProductosTemplate data={dataproductos}/>
  </>)
}
