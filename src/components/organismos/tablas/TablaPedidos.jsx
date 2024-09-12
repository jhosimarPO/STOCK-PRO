import styled from "styled-components";
import {
  ContentAccionesTabla,
  useCategoriasStore,
  Paginacion,
} from "../../../index";
import Swal from "sweetalert2";
import { v } from "../../../styles/variables";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaArrowsAltV } from "react-icons/fa";
import { useStorePedidos } from "../../../store/PedidoStore";
import { TbTruckDelivery  } from 'react-icons/tb'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PedidosService } from "../../../services/PedidosService";

export function TablaPedidos({entities}) {
  const [pagina, setPagina] = useState(1)
  const qc = useQueryClient()
  // const {  } = useStorePedidos();
  const {mutate : mutateEnviar} = useMutation({
    mutationFn: PedidosService.sendOrder,
    onError: (error) => {
      console.error("ERROR",error)
    },
    onSuccess: (data) => {
      console.log("SUCCESS",data)
      qc.invalidateQueries(['pedidos/listar'])
    },
  })

  function eliminar(p) {
    if (p.descripcion === "General") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Esteregistro no se permite modificar ya que es valor por defecto.",
        footer: '<a href="">...</a>',
      });
      return;
    }
    Swal.fire({
      title: "¿Estás seguro(a)(e)?",
      text: "Una vez eliminado, ¡no podrá recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("ELIMINAR",p);
        // await eliminarCategoria({ id: p.id });
      }
    });
  }
  function editar(data) {
    console.log("EDITAR",data)
    mutateEnviar(data.id)
  }
  const columns = [
    {
      accessorKey: "created_at",
      header: "Fecha Pedido",
      cell: (info) => new Date(info.getValue()).toLocaleDateString("es-PE",{
        weekDay : 'long',
        day : 'numeric',
        month : 'short',
        year : 'numeric',
        hour12 : true,
        hour : "numeric",
        minute : "numeric",
      }),
      enableColumnFilter: true,
    },
    {
      accessorKey: "usuarios",
      header: "Cliente",
      cell: (info) => `DNI:${info.getValue().nro_doc} - ${info.getValue().nombres}`,
      enableColumnFilter: true,
    },

    {
      accessorKey: "total",
      header: "Total",
      enableSorting: true,
      enableColumnFilter : true,
      cell: (info) => (
        <span>S/.{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      enableSorting: true,
      enableColumnFilter : true,
      cell: (info) => (
        <span style={{ 
          borderRadius : '8px' , borderWidth : '2px' , borderStyle : 'dashed' ,
          borderColor : info.getValue() == 'PENDIENTE' ? 
            '#757575' : info.getValue() == 'ACEPTADO' ?
            '#52de65' : '#f31414' ,
          padding : '8px' ,
          color : info.getValue() == 'PENDIENTE' ?
            '#757575' : info.getValue() == 'ACEPTADO' ?
            '#52de65' : '#f31414' 
          }}>{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: (info) => (
        <div style={{ display : 'flex' , justifyContent : 'center' }}>
          
          <button disabled={!(info.row.original.estado === 'PENDIENTE')} style={{ cursor : "pointer",borderRadius : '8px' , padding : '8px' , display : 'flex' , alignItems : 'center' , columnGap : '8px' }}
            onClick={() => editar(info.row.original)}
          >
            <TbTruckDelivery size={16}/>
            <span>ACEPTAR</span>
          </button>
        </div>
      )
    },
  ];
  const table = useReactTable({
    data : entities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });
  return (
    <>
      <Container>
        <table className="responsive-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.column.columnDef.header}
                    {header.column.getCanSort() && (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <FaArrowsAltV />
                      </span>
                    )}
                    {
                      {
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()]
                    }
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${
                        header.column.getIsResizing() ? "isResizing" : ""
                      }`}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(item=>(
              
                <tr key={item.id}>
                  {item.getVisibleCells().map(cell => (
                  
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    
                  ))}
                </tr>
             
            ))}
          </tbody>
        </table>
        <Paginacion
          table={table}
          irinicio={() => table.setPageIndex(0)}
          pagina={table.getState().pagination.pageIndex + 1}
          setPagina={setPagina}
          maximo={table.getPageCount()}
        />
      </Container>
    </>
  );
}
const Container = styled.div`
  position: relative;

  margin: 5% 3%;
  @media (min-width: ${v.bpbart}) {
    margin: 2%;
  }
  @media (min-width: ${v.bphomer}) {
    margin: 2em auto;
    /* max-width: ${v.bphomer}; */
  }
  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    @media (min-width: ${v.bpbart}) {
      font-size: 0.9em;
    }
    @media (min-width: ${v.bpmarge}) {
      font-size: 1em;
    }
    thead {
      position: absolute;

      padding: 0;
      border: 0;
      height: 1px;
      width: 1px;
      overflow: hidden;
      @media (min-width: ${v.bpbart}) {
        position: relative;
        height: auto;
        width: auto;
        overflow: auto;
      }
      th {
        border-bottom: 2px solid rgba(115, 115, 115, 0.32);
        font-weight: normal;
        text-align: center;
        color: ${({ theme }) => theme.text};
        &:first-of-type {
          text-align: center;
        }
      }
    }
    tbody,
    tr,
    th,
    td {
      display: block;
      padding: 0;
      text-align: left;
      white-space: normal;
    }
    tr {
      @media (min-width: ${v.bpbart}) {
        display: table-row;
      }
    }

    th,
    td {
      padding: 0.5em;
      vertical-align: middle;
      @media (min-width: ${v.bplisa}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bpbart}) {
        display: table-cell;
        padding: 0.5em;
      }
      @media (min-width: ${v.bpmarge}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bphomer}) {
        padding: 0.75em;
      }
    }
    tbody {
      @media (min-width: ${v.bpbart}) {
        display: table-row-group;
      }
      tr {
        margin-bottom: 1em;
        @media (min-width: ${v.bpbart}) {
          display: table-row;
          border-width: 1px;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
        &:nth-of-type(even) {
          @media (min-width: ${v.bpbart}) {
            background-color: rgba(78, 78, 78, 0.12);
          }
        }
      }
      th[scope="row"] {
        @media (min-width: ${v.bplisa}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        }
        @media (min-width: ${v.bpbart}) {
          background-color: transparent;
          text-align: center;
          color: ${({ theme }) => theme.text};
        }
      }
      .ContentCell {
        text-align: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;

        border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        @media (min-width: ${v.bpbart}) {
          justify-content: center;
          border-bottom: none;
        }
      }
      td {
        text-align: right;
        @media (min-width: ${v.bpbart}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
          text-align: center;
        }
      }
      td[data-title]:before {
        content: attr(data-title);
        float: left;
        font-size: 0.8em;
        @media (min-width: ${v.bplisa}) {
          font-size: 0.9em;
        }
        @media (min-width: ${v.bpbart}) {
          content: none;
        }
      }
    }
  }
`;
const Colorcontent = styled.div`
  justify-content: center;
  min-height: ${(props) => props.$alto};
  width: ${(props) => props.$ancho};
  display: flex;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  text-align: center;
`;
