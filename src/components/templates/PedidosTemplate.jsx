import styled from "styled-components";
import { Header, v,  Title, TablaCategorias, Buscador, RegistrarMarca, Btnsave, Tabs, RegistrarSalidaEntrada, Btnfiltro } from "../../index";
import { useState } from "react";
import { PedidosService } from "../../services/PedidosService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TablaPedidos } from "../organismos/tablas/TablaPedidos";
import { useStorePedidos } from "../../store/PedidoStore";
export function PedidosTemplate() {
  
  

  const [openRegistro, SetopenRegistro] = useState(false);
  const [dataSelect, setdataSelect] = useState([])
  const qc = useQueryClient()
  const [state, setState] = useState(false);

  const { globalFilter , setGlobalFilter} = useStorePedidos()
  const { data, isLoading, error } = useQuery({
    queryKey: ["pedidos/listar"],
    queryFn: () => PedidosService.list(),
    initialData : []
  })

  const openModalCreate = () => {

  }
  
  return (
    <Container>
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>
      <section className="area1">
        <ContentFiltro>
          <Title>
            Pedidos
          </Title>
          <Btnfiltro
          icono={<v.iconof5/>}
          textcolor={"#151515"}
          onClick={() => qc.invalidateQueries(["pedidos/listar"])}
          />
        </ContentFiltro>
      </section>
      <section className="area2">
        <Buscador setBuscador={setGlobalFilter}/>
        
      </section>
    
      <section className="main">
        <TablaPedidos entities={data}/> 
      </section>
    </Container>
  );
}
const Container = styled.div`
  min-height: 100vh;
  padding: 15px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 100px
    "area1" 100px
    "area2" 60px
   
    "main" auto;

  .header {
    grid-area: header;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    align-items: center;
  }
  .area1 {
    grid-area: area1;
    /* background-color: rgba(229, 67, 26, 0.14); */
    display: flex;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
    /* background-color: rgba(77, 237, 106, 0.14); */
    display: flex;
    align-items: center;
    justify-content:end;

  }
 
  .main {
    margin-top:20px;
    grid-area: main;
    /* background-color: rgba(179, 46, 241, 0.14); */
  }
`;
const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content:end;
  width:100%;
  gap:15px;
`;
