import { useEffect, useState } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {CiImageOff, CiImageOn} from "react-icons/ci"
import {
  InputText,
  Spinner,
  useOperaciones,
  Btnsave,
  useUsuariosStore,
  useCategoriasStore,
  Selector,
  useProductosStore,
  useMarcaStore,
  ListaGenerica,
  Btnfiltro,
  RegistrarMarca,
  RegistrarCategorias,
  supabase,
} from "../../../index";
import { useForm } from "react-hook-form";
import { CirclePicker } from "react-color";
import Emojipicker from "emoji-picker-react";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { Device } from "../../../styles/breakpoints";
import Swal from "sweetalert2";
export function RegistrarProductos({ onClose, dataSelect, accion }) {
  const { insertarProductos, editarProductos } = useProductosStore();
  const { datamarca, selectMarca, marcaItemSelect } = useMarcaStore();
  const { datacategorias, categoriaItemSelect, selectCategoria } =
    useCategoriasStore();
  const { dataempresa } = useEmpresaStore();
  const [stateMarca, setStateMarca] = useState(false);
  const [stateCategoria, setStateCategoria] = useState(false);
  const [openRegistroMarca, SetopenRegistroMarca] = useState(false);
  const [openRegistroCategoria, SetopenRegistroCategoria] = useState(false);
  const [subaccion, setAccion] = useState("");
  const [preview,setPreview] = useState("")
  const [image,setImage] = useState(null)

  function nuevoRegistroMarca() {
    SetopenRegistroMarca(!openRegistroMarca);
    setAccion("Nuevo");
  }
  function nuevoRegistroCategoria() {
    SetopenRegistroCategoria(!openRegistroCategoria);
    setAccion("Nuevo");
  }
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    watch,
  } = useForm();
  async function insertar(data) {
    if (accion === "Editar") {
      const resultUrl = await uploadImage()
      
      const p = {
        id: dataSelect.id,
        descripcion: data.descripcion,
        idmarca: marcaItemSelect.id,
        stock: parseFloat(data.stock),
        stock_minimo: parseFloat(data.stockminimo),
        codigobarras: parseFloat(data.codigobarras),
        codigointerno: data.codigointerno,
        precioventa: parseFloat(data.precioventa),
        preciocompra: parseFloat(data.preciocompra),
        id_categoria: categoriaItemSelect.id,
        id_empresa: dataempresa.id,
        image : image && resultUrl ? resultUrl : dataSelect.image 
      };

      await editarProductos(p);

      onClose();
      setImage(null)
    } else {
      

        const resultUrl = await uploadImage()
      

        const p = {
          _descripcion: data.descripcion,
          _idmarca: marcaItemSelect.id,
          _stock: parseFloat(data.stock),
          _stock_minimo: parseFloat(data.stockminimo),
          _codigobarras: parseFloat(data.codigobarras),
          _codigointerno: data.codigointerno,
          _precioventa: parseFloat(data.precioventa),
          _preciocompra: parseFloat(data.preciocompra),
          _id_categoria: categoriaItemSelect.id,
          _idempresa: dataempresa.id,
          _image : resultUrl
        };
  
        console.log("DATA PRODUCTO[N]",p)
  
        await insertarProductos(p);
        onClose();
        setImage(null)
      
    }
  }

  const onChangeFile = (e) => {
    const file = e.target.files[0]; // Obtener el primer archivo seleccionado
    console.log("FILE",file)
    if (file) {
      const objectUrl = URL.createObjectURL(file); // Crear una URL de objeto temporal
      setPreview(objectUrl); // Establecer la URL de previsualización
      setImage(file)
    } else {
      setPreview("");
      setImage(null) // Restablecer la previsualización si no hay archivo seleccionado
    }
  }

  const uploadImage = async () => {
    if(!image){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debe subir una imagen",
        footer: 'Intente de nuevo',
      });
      return
    }

    const { data : responseImage, error : errorSigned } = await supabase.storage
        .from('storage_products')
        .createSignedUploadUrl(image.name)


        if(errorSigned){
          console.error(errorSigned)
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al subir imagen",
            footer: 'Intente de nuevo',
          });
          return
        }

      const { data:signed , error: uploadError } = await supabase.storage.from('storage_products')
      .uploadToSignedUrl(responseImage.path, responseImage.token, image)

      if(uploadError){
        console.error(uploadError)
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al subir imagen",
          footer: 'Intente de nuevo',
        });
        return
      }

      try {
        const { data : dataURL   } = await supabase
        .storage
        .from('storage_products')
        .getPublicUrl(signed?.path)

        
        console.log("PUBLIC URL",dataURL.publicUrl)
        return dataURL.publicUrl
      } catch (err) {
        console.error(err)
        return ""
      }
  }

  useEffect(() => {
    if (accion === "Editar") {
      console.log("DATA SELECT",dataSelect.idmarca)
      selectMarca({id:dataSelect.idmarca,descripcion:dataSelect.marca})
      selectCategoria({id:dataSelect.id_categoria,descripcion:dataSelect.categoria})
    }
  }, [accion]);
  return (
    <Container>
     
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>
              {accion == "Editar"
                ? "Editar producto"
                : "Registrar nuevo producto"}
            </h1>
          </section>

          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>
        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section className="seccion1">
            <article>
              <InputText icono={<v.icononombre />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.descripcion}
                  type="text"
                  placeholder=""
                  {...register("descripcion", {
                    required: true,
                  })}
                />
                <label className="form__label">Nombre</label>

                {errors.descripcion?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            <ContainerSelector>
              <label>Marca: </label>
              <Selector
                state={stateMarca}
                color="#fc6027"
                texto1="🍿"
                texto2={marcaItemSelect?.descripcion}
                funcion={() => setStateMarca(!stateMarca)}
              />
              <Btnfiltro
                funcion={nuevoRegistroMarca}
                bgcolor="#f6f3f3"
                textcolor="#353535"
                icono={<v.agregar />}
              />
              {stateMarca && (
                <ListaGenerica
                  bottom="-260px"
                  scroll="scroll"
                  setState={() => setStateMarca(!stateMarca)}
                  data={datamarca}
                  funcion={selectMarca}
                />
              )}

              {subaccion}
            </ContainerSelector>

            <article>
              <InputText icono={<v.iconostock />}>
                <input
                  step="0.01"
                  className="form__field"
                  defaultValue={dataSelect.stock}
                  type="number"
                  placeholder=""
                  {...register("stock", {
                    required: true,
                  })}
                />
                <label className="form__label">Stock</label>

                {errors.stock?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconostockminimo />}>
                <input
                  step="0.01"
                  className="form__field"
                  defaultValue={dataSelect.stock_minimo}
                  type="number"
                  placeholder=""
                  {...register("stockminimo", {
                    required: true,
                  })}
                />
                <label className="form__label">Stock minimo</label>

                {errors.stockminimo?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            <ContainerSelector>
              <label>Categoria: </label>
              <Selector
                state={stateCategoria}
                color="#fc6027"
                texto1="🍿"
                texto2={categoriaItemSelect?.descripcion}
                funcion={() => setStateCategoria(!stateCategoria)}
              />
              <Btnfiltro
                funcion={nuevoRegistroCategoria}
                bgcolor="#f6f3f3"
                textcolor="#353535"
                icono={<v.agregar />}
              />
              {stateCategoria && (
                <ListaGenerica
                  bottom="50px"
                  scroll="scroll"
                  setState={() => setStateCategoria(!stateCategoria)}
                  data={datacategorias}
                  funcion={selectCategoria}
                />
              )}
            </ContainerSelector>
          </section>
          <section className="seccion2">
            <article>
              <InputText icono={<v.iconocodigobarras />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.codigobarras}
                  type="number"
                  placeholder=""
                  {...register("codigobarras", {
                    required: true,
                  })}
                />
                <label className="form__label">Codigo de barras</label>

                {errors.codigobarras?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconocodigointerno />}>
                <input
                  className="form__field"
                  defaultValue={dataSelect.codigointerno}
                  type="text"
                  placeholder=""
                  {...register("codigointerno", {
                    required: true,
                  })}
                />
                <label className="form__label">Codigo interno</label>

                {errors.codigointerno?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconoprecioventa />}>
                <input
                  step="0.01"
                  className="form__field"
                  defaultValue={dataSelect.precioventa}
                  type="number"
                  placeholder=""
                  {...register("precioventa", {
                    required: true,
                  })}
                />
                <label className="form__label">Precio de venta</label>

                {errors.precioventa?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconopreciocompra />}>
                <input
                  step="0.01"
                  className="form__field"
                  defaultValue={dataSelect.preciocompra}
                  type="number"
                  placeholder=""
                  {...register("preciocompra", {
                    required: true,
                  })}
                />
                <label className="form__label">Precio de compra</label>

                {errors.preciocompra?.type === "required" && (
                  <p>Campo requerido</p>
                )}
              </InputText>
            </article>
            <article>
              <label htmlFor="input-file-image" style={{ 
                cursor : 'pointer' ,
                border : '1px dashed #EF552B' ,
                display : 'flex',
                backgroundColor : 'rgba(255, 105, 63,0.1)',
                borderRadius : '16px',
                justifyContent : 'center'
              }}>
                  <div style={{padding : '32px' , display : 'flex' , justifyContent : 'center' }}>
                    {
                      preview.length > 0 && image ?
                      <div style={{ display : 'flex' , columnGap : '24px' }}>
                        <div style={{ height : '96px' , padding : '8px' , border :'1px solid white' , display : 'flex' , alignItems : 'center' , borderRadius : '8px' }}>
                        <img src={preview} style={{ borderRadius : '8px' , maxWidth : '96px' , objectFit : 'contain' }} />
                        </div>
                        <div style={{ display : 'flex' , flexDirection : 'column' , gap : '16px' }}>
                          <p style={{ fontWeight : 'bold' }}>{image.name}</p>
                          <p style={{ color : '#d9d9d9' }}>{(image.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      :
                      <div style={{ display : 'flex', flexDirection : 'column' , alignItems : 'center' }}>
                        <CiImageOn size={32} color="#EF552B" />
                        <span>Subir foto de producto</span>
                      </div>
                    }
                  </div>
              </label>
              <input
                id="input-file-image"   // ID que coincide con htmlFor del label
                type="file"        // Tipo de input
                style={{ display: 'none' }}  // Oculta el input
                {...register("image", {
                  required: true,
                })}
                onChange={(e) => onChangeFile(e)}  // Manejador de cambio
              />
              {errors.image?.type === "required" && (
                <p style={{ color : '#f46943' }}>Campo requerido</p>
              )}
            </article>
          </section>
          <div className="btnguardarContent">
            <Btnsave
              icono={<v.iconoguardar />}
              titulo="Guardar"
              bgcolor="#EF552B"
            />
          </div>
        </form>
        {openRegistroMarca && (
          <RegistrarMarca
            dataSelect={dataSelect}
            onClose={() => SetopenRegistroMarca(!openRegistroMarca)}
            accion={subaccion}
          />
        )}
        {openRegistroCategoria && (
          <RegistrarCategorias
            dataSelect={dataSelect}
            onClose={() => SetopenRegistroCategoria(!openRegistroCategoria)}
            accion={subaccion}
          />
        )}
      </div>
    </Container>
  );
}
const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    overflow-y: auto;
    overflow-x: hidden;
    height: 90vh;

    &::-webkit-scrollbar {
      width: 6px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #484848;
      border-radius: 10px;
    }
    width: 100%;
    max-width: 90%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
      .btnguardarContent {
        display: flex;
        justify-content: end;
        grid-column: 1;
        @media ${Device.tablet} {
          grid-column: 2;
        }
      }
    }
  }
`;

const ContainerSelector = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  position: relative;
`;
