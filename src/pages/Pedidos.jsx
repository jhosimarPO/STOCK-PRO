// import { SpinnerLoader } from "../components/moleculas/SpinnerLoader";
import { usePermisosStore, BloqueoPagina } from "../index";
import { PedidosTemplate } from "../components/templates/PedidosTemplate";
export function Pedidos() {
  const { datapermisos } = usePermisosStore();
  const statePermiso = datapermisos.some((objeto) =>
    true 
  // objeto.modulos.nombre.includes("Pedidos")
  )
  //respuestas
//   if (isLoading) {
//     return <SpinnerLoader />;
//   }
//   if (error) {
//     return <span>Error...</span>;
//   }
  if (statePermiso == false) return <BloqueoPagina state={statePermiso}/>;
  return <PedidosTemplate  />;
}
