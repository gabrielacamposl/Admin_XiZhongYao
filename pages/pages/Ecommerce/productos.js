import React, { useEffect, useState, useRef } from "react";
import Layout from "@/layout/layout"
import axios from "axios";
//--> Componentes primeReact
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';

//--> Funcion cloudinary
import { Image } from 'cloudinary-react'

//--> Funciones propias
import { objetoVacio } from "@/components/catalogos/objetovacio";
import { formatoPrecio } from "@/helpers/funciones";
import { camposVacios, descripcionInvalida, nombreInvalido } from "@/helpers/constantes/mensajes";
import { consultarProductos, editarProducto, eliminarProducto, nuevoProducto } from "@/helpers/constantes/links";
import { alfaNumericoEspacios } from "@/helpers/constantes/expresionesregulares";
import { categoriaPlantas } from "@/helpers/dropproductos";

import Cargando from "@/components/loader/cargando";

const CatalogoProductos = () => {
  // --> Estructura de objetos
  let productoVacio = objetoVacio
  const listaCategoriasPlantas = categoriaPlantas

  // --> Validar cualquier string 
  const validarString = alfaNumericoEspacios


  //----------------| Lista de variables |----------------
  //--> Registros
  const [product, setProduct] = useState(productoVacio);
  const [products, setProducts] = useState(null);
  //--> Edicion
  const [nombreNuevo, setNombreNuevo] = useState('')
  //--> Dialogos
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  //--> Estilos
  const [estiloNombre, setEstiloNombre] = useState('')
  const [estiloDescripcion, setEstiloDescripcion] = useState('')
  const [estiloCategoria, setEstiloCategoria] = useState('')
  //--> Otros
  const [editar, setEditar] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [cargando, setCargando] = useState(false)
  //--> Mensajes
  const [mensajeRespuesta, setMensajeRespuesta] = useState('')
  //---> Eliminar Producto
  const [nombreEliminar, setNombreEliminar] = useState('')
  const [editarElProducto, setEditarElProducto] = useState('')
  //--> Especiales
  const toast = useRef(null);
  const dt = useRef(null);

  const [imagen1, setImagen1] = useState('')


  //----------------| Interaccion con back-end |----------------
  //--> GET

  const obtenerProductos = async () => {

    // console.log("Obteniendo productos...")
    const token = localStorage.getItem('token')
    // console.log(token)
    const cabecera = {headers: {Authorization: `Bearer ${token}`}}
    try {

      const datos = await axios.get(consultarProductos, cabecera)
      console.log(datos.data.productos)
      setProducts(datos.data.productos)
    } catch (error) { console.log(error) }
  }

  //--> POST
  const crearProducto = async (productoNuevo) => {

    console.log("Creando producto...")
    console.log(imagen1);
    console.log(productoNuevo)

    //--> Validar campos llenos
    if (Object.values(productoNuevo).includes('')) {
      if (!productoNuevo.nombreProducto) setEstiloNombre('p-invalid')
      if (!productoNuevo.descrProducto) setEstiloDescripcion('p-invalid')
      if (!productoNuevo.categoriaProducto) setEstiloCategoria('p-invalid')
      if (!productoNuevo.imagen1) setImagen1('p-invalid')

      setMensajeRespuesta(camposVacios)
      setTimeout(() => { setMensajeRespuesta('') }, 3000)
      return
    } else {
      setEstiloNombre('')
      setEstiloDescripcion('')
      setEstiloCategoria('')
      setImagen1('')
    }
    //--> Validar Nombre
    if (!validarString.test(productoNuevo.nombreProducto)) {
      setEstiloNombre('p-invalid')
      setMensajeRespuesta(nombreInvalido)
      setTimeout(() => { setMensajeRespuesta('') }, 3000)
      return
    } else {
      setEstiloNombre('')
      setMensajeRespuesta('')
    }
    //--> Validar descripción
   /* if (!validarString.test(productoNuevo.descrProducto)) {
      setEstiloDescripcion('p-invalid')
      setMensajeRespuesta(descripcionInvalida)
      setTimeout(() => { setMensajeRespuesta('') }, 3000)
      return
    } else {
      setEstiloDescripcion('')
      setMensajeRespuesta('')
    }*/
    //--> Preparar envio back-end
    const token = localStorage.getItem('token')
    const cabecera = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      setCargando(true)
      const respuesta = await axios.post(nuevoProducto, productoNuevo, cabecera)
      toast.current.show({
        severity: 'success', summary: `${respuesta.data.msg}`, life: 3000
      });
      obtenerProductos()
      cerrarDialogoCM()
      setProduct(productoVacio)
    } catch (error) {
      console.log(error.response.data)
      setMensajeRespuesta(error.response.data)
      setTimeout(() => { setMensajeRespuesta('') }, 3000);
    } finally {
      setCargando(false)
    }
  }

  //--> PUT
  const actualizarProducto = async (productoEditar) => {
    console.log("Actualizando...")
    console.log(imagen1); 
    setEditarElProducto(product.nombreProducto)

    //--> Validar campos llenos
    if (Object.values(productoEditar).includes('') ) {
      if (!productoEditar.nombreProducto) setEstiloNombre('p-invalid')
      if (!productoEditar.descrProducto) setEstiloDescripcion('p-invalid')
      if (!productoEditar.categoriaProducto) setEstiloCategoria('p-invalid')
      if (!productoEditar.imagen1) setImagen1('p-invalid')
      setMensajeRespuesta(camposVacios)
      setTimeout(() => { setMensajeRespuesta('') }, 3000)
      return
    } else {
      setEstiloNombre('')
      setEstiloDescripcion('')
      setEstiloCategoria('')
      setImagen1('')
    } 
    //--> Validar Nombre
    if (!validarString.test(productoEditar.nombreProducto)) {
      setEstiloNombre('p-invalid')
      setMensajeRespuesta(nombreInvalido)
      setTimeout(() => { setMensajeRespuesta('') }, 3000)
      return
    } else {
      setEstiloNombre('')
      setMensajeRespuesta('')
    }
    //--> Validar descripción
    if (!validarString.test(productoEditar.descrProducto)) {
      setEstiloDescripcion('p-invalid')
      setMensajeRespuesta(descripcionInvalida)
      setTimeout(() => { setMensajeRespuesta('') }, 3000)
      return
    } else {
      setEstiloDescripcion('')
      setMensajeRespuesta('')
    }


    //--> Preparar objeto para enviar
    const token = localStorage.getItem('token')
    const cabecera = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const objetoEnviar = {
      nombreProducto: product.nombreProducto,
      nuevoNombre: nombreNuevo,
      descrProducto: product.descrProducto,
      precioProducto: product.precioProducto,
      cantidadInv: product.cantidadInv,
      categoriaProducto: product.categoriaProducto,
      imagenProducto: product.imagen1,
    }

    const newUrlEditar = `${editarProducto}${editarElProducto}`
    console.log('Esta es la newURLEditar')
    console.log(newUrlEditar)
    //--> Mandar objeto al back-end
    try {
      setCargando(true)
      const respuesta = await axios.put(newUrlEditar, objetoEnviar, cabecera)
      toast.current.show({
        severity: 'success', summary: `${respuesta.data.msg}`, life: 3000
      });
      cerrarDialogoCM()

      //--> Limpieza
      setProduct(productoVacio)
      setNombreNuevo('')

      //--> Renderizar despues de enviar
      obtenerProductos()
    } catch (error) {
      console.log(error.response?.data)
      setMensajeRespuesta(error.response?.data)
      setTimeout(() => { setMensajeRespuesta('') }, 3000);
    } finally {
      setCargando(false)
    }
  }

  //--> Ruta de la imagen seleccionada
  const handleImage = (e) => {
    const selectedImage = e.target.files[0];
    // --> Concatenar archivo y ruta
    setImagen1(`C:/Users/gabri/Downloads/${selectedImage.name}`)
    product.imagenProducto = `C:/Users/gabri/Downloads/${selectedImage.name}`
};

  //--> DELETE
  const quitarProducto = async () => {
    console.log("Eliminando producto...")
    // console.log(product)
    //--> Crear objeto a eliminar
    const objetoEliminar = { nombreProducto: product.nombreProducto }
    const token = localStorage.getItem('token')
    const cabecera = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    //--> Mandar objeto a back-end
    const newUrl = `${eliminarProducto}${nombreEliminar}`
    console.log(newUrl)
    try {
      const respuesta = await axios.delete(newUrl, cabecera)
      console.log(respuesta.data.msg)
      toast.current.show({
        severity: 'success', summary: `${respuesta.data.msg}`, life: 3000
      });

      //--> Leer productos otra vez
      obtenerProductos()
      //--> Cerrar dialogo
      cerrarDialogoEliminarRegistro()
    } catch (error) {
      console.log(error.response.data)
      setMensajeRespuesta(error.response.data)
      setTimeout(() => { setMensajeRespuesta('') }, 3000);
    }
  }

  //----------------| Renderizado |----------------
  //--> Cargar cuando se renderiza
  useEffect(() => { obtenerProductos() }, []);

  //--> Revisar si es editar o crear producto
  useEffect(() => {
    if (product._id) setEditar(true)
    else setEditar(false)
  }, [product])

  //----------------| Interaccion con dialogos |----------------
  const abrirDialogoCM = () => {
    setProduct(productoVacio);
   // setNombreNuevo('')
    setProductDialog(true);
    //--> Estilos
    setEstiloNombre('')
    setEstiloDescripcion('')
    setEstiloCategoria('')
    setImagen1('')
  };

  const cerrarDialogoCM = () => { setProductDialog(false) };

  const cerrarDialogoEliminarRegistro = () => { setDeleteProductDialog(false) };

  const cerrarDialogoEliminarRegistros = () => { setDeleteProductsDialog(false) }

  //----------------| Funcion CRUD |----------------
  const guardarRegistro = async () => {
    //--> Editar registro
    if (product._id) { actualizarProducto(product) }

    //--> Crear registro
    else { crearProducto(product) }
  };

  const editarRegistro = (product) => {

    setProduct({ ...product });
    setProductDialog(true);

    setImagen1('')

  };

  const confirmarEliminarRegistro = (product) => {
    console.log(product.nombreProducto)
    setNombreEliminar(product.nombreProducto)
    setProduct(product);
    setDeleteProductDialog(true);
  };


  const exportCSV = () => { dt.current.exportCSV() }

  const confirmDeleteSelected = () => { setDeleteProductsDialog(true) }

  //--> DELETE
  const deleteSelectedProducts = () => {
    //--> Preparar objeto para mandar al back-end
    const token = localStorage.getItem('token')
    const cabecera = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    //--> Listar los productos eliminados
    selectedProducts.map(async registro => {
      try {
        const respuesta = await axios.post(eliminarProducto, { nombreProducto: registro.nombreProducto }, cabecera)
        console.log(respuesta.data.msg)
      } catch (error) {
        console.log(error.response.data)
      }
      finally {
        //--> Leer registros de back-end
        obtenerProductos()
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
      }
    })
    toast.current.show({
      severity: 'success', summary: 'Productos eliminados', detail: 'Se ha eliminados correctamente los productos.', life: 3000
    });
  };

  const cambiarString = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };
    // Update the 'imagen1' state
    if (name === 'imagen1') {
      setImagen1(val);
    }
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const cambiarNumero = (e, name) => {
    const val = e.value || 0;
    let _product = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  //----------------| Plantillas |----------------
  const plantillaImagen = (rowData) => {
    return <Image
      cloudName="dluhoni1n" publicId={rowData.imagenProducto}
      className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
      style={{ width: '50px', height: '80px' }}
    />

  };


  const plantillaPrecio = (rowData) => { return formatoPrecio(rowData.precioProducto) }
  const plantillaCantiddad = (rowData) => { return `${rowData.cantidadInv} piezas` }

  // const ratingBodyTemplate = (rowData) => {
  //   return <Rating value={rowData.rating} readOnly cancel={false} />;
  // };

  const plantillaEstatus = (rowData) => {
    return <Tag value={rowData.statusProducto} severity={getSeverity(rowData)}></Tag>;
  };

  const getSeverity = (product) => {
    switch (product.statusProducto) {
      case 'Disponible': return 'success';
      case 'Pocos': return 'warning';
      case 'Agotado': return 'danger';
      default: return null;
    }
  };

  //----------------| Botones de dialogos |----------------
  const cabezal = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Control de productos</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );

  const botonIzquierda = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={abrirDialogoCM} />
        {/* <Button label="Eliminar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
      </div>
    );
  };

  const botonDerecha = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const botonesAccion = (rowData) => {
    return (
      <>
        {/* <Button icon="pi pi-pencil" rounded severity="warning" className="mr-2" onClick={() => editarRegistro(rowData)} /> */}
        <Button icon="pi pi-trash" label="Eliminar" severity="danger" onClick={() => confirmarEliminarRegistro(rowData)} />
      </>
    );
  };

  const botonesCrearModificar = (
    <>
      <Button label="Guardar" severity="success" icon="pi pi-check" onClick={guardarRegistro} />
      <Button label="Cancelar" security="danger" icon="pi pi-times" outlined onClick={cerrarDialogoCM} />

    </>
  );

  const botonesEliminarRegistro = (
    <>
      <Button label="Sí" icon="pi pi-check" severity="success" onClick={quitarProducto} />
      <Button label="No" icon="pi pi-times" severity="danger" onClick={cerrarDialogoEliminarRegistro} />
    </>
  );

  const botonesEliminarRegistros = (
    <>
      <Button label="Sí" icon="pi pi-check" severity="success" onClick={deleteSelectedProducts} />
      <Button label="No" icon="pi pi-times" severity="danger" onClick={cerrarDialogoEliminarRegistros} />
    </>
  );

  //----------------| Valor que regresara |----------------
  return (
    <Layout
      title="Productos"
      description="Acceso al catálogo de plantas medicinales"
    >
      <div className="grid">
        <Toast ref={toast} />
        <div className="col-12">
          <div className="card">
            <Toolbar className="mb-4" start={botonIzquierda} end={botonDerecha} />
            <DataTable
              ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
              paginator rows={10} rowsPerPageOptions={[5, 10, 25]} showGridlines
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} registros"
              globalFilter={globalFilter} header={cabezal}
            >
              <Column selectionMode="multiple" exportable={false} />
              <Column field="nombreProducto" header="Nombre" sortable style={{ minWidth: '12rem', textAlign: "center" }} />
              <Column field="descrProducto" header="Descripción" sortable style={{ minWidth: '12rem', textAlign: "center" }} />
              <Column field="imagen1" header="Imagen" sortable style={{ minWidth: '12rem', textAlign: "center" }} body={plantillaImagen} />
              <Column field="precioProducto" header="Precio" body={plantillaPrecio}
                sortable style={{ minWidth: '12rem', textAlign: "center" }} />
              <Column field="cantidadInv" header="Cantidad" sortable body={plantillaCantiddad}
                style={{ minWidth: '12rem', textAlign: "center" }} />
              <Column field="categoriaProducto" header="Categoría" sortable style={{ minWidth: '12rem', textAlign: "center" }} />
              <Column field="statusProducto" header="Estatus" sortable body={plantillaEstatus}
                style={{ minWidth: '12rem', textAlign: "center" }} />
              <Column header="Editar" body={botonesAccion} exportable={false} style={{ minWidth: '12rem' }} />
            </DataTable>

            <Dialog
              visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
              header="Detalles del producto" modal className="p-fluid" footer={!cargando && botonesCrearModificar}
              onHide={cerrarDialogoCM}
            >
              {product.image && (
                <img

                  alt={product.image} className="product-image block m-auto pb-3" />
              )}
              {cargando && <Cargando />}
              {!cargando && (
                <>
                  <div className="field">
                    <label htmlFor="nombre" className="font-bold">Nombre</label>
                    <InputText
                      id="nombre" value={product.nombreProducto} onChange={(e) => cambiarString(e, 'nombreProducto')}
                      required autoFocus className={estiloNombre}
                    />
                  </div>
                  {/* {editar && (
                    <div className="field">
                      <label htmlFor="nombre" className="font-bold">Nuevo nombre</label>
                      <InputText
                        id="nombre" value={nombreNuevo} onChange={(e) => setNombreNuevo(e.target.value)}
                        required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombreProducto })}
                      />
                    </div>
                  )} */}
                  <div className="field">
                    <label htmlFor="descripcion" className="font-bold">Descripción</label>
                    <InputText
                      id="nombre" value={product.descrProducto} onChange={(e) => cambiarString(e, 'descrProducto')}
                      required autoFocus className={estiloDescripcion}
                    />
                  </div>
                  <div className="formgrid grid">
                    <div className="field col">
                      <label htmlFor="precio" className="font-bold">Precio</label>
                      <InputNumber
                        id="precio" value={product.precioProducto} onValueChange={(e) => cambiarNumero(e, 'precioProducto')}
                        mode="currency" currency="USD" locale="en-US" min={0}
                      />
                    </div>
                  </div>

                  <div className="formgrid grid">
                    <div className="field col">
                      <label htmlFor="cantidad" className="font-bold">Cantidad</label>
                      <InputNumber
                        id="cantidad" value={product.cantidadInv} onValueChange={(e) => cambiarNumero(e, 'cantidadInv')}
                        suffix=" piezas" min={0}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="font-bold">Categoría</label>
                    <Dropdown
                      value={product.categoriaProducto} onChange={(e) => cambiarString(e, 'categoriaProducto')}
                      options={listaCategoriasPlantas}
                      optionLabel="categoria" optionValue="valor"
                      placeholder="Elija una categoría" className={`w-full ${estiloCategoria}`} />
                  </div>

                  <div className="field">
                    <label htmlFor="imagenes" className="font-bold">Imagen del Producto</label>
                    {/* <InputText placeholder="Imagen 1" value={imagen1} onChange={(e) => setImagen1(e.target.value)} /> */}
                    <InputText
                        type="file"
                        id="imagen1"
                        placeholder='Imagen'
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImage}
                        className= "w-full p-3 md:w-25rem "
                    />
                  </div>
                  {mensajeRespuesta && (
                    <div className="mt-4">
                      <Message severity="error" text={mensajeRespuesta} />
                    </div>
                  )}
                </>
              )}

            </Dialog>

            <Dialog
              visible={deleteProductDialog} style={{ width: '32rem' }}
              breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={botonesEliminarRegistro}
              onHide={cerrarDialogoEliminarRegistro}
            >
              <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {product && (
                  <span>
                    ¿Está seguro de eliminar <b>{product.nombreProducto}</b>?
                  </span>
                )}
              </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={botonesEliminarRegistros} onHide={cerrarDialogoEliminarRegistros}>
              <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {product && <span>¿Está seguro de eliminar los registros?</span>}
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CatalogoProductos