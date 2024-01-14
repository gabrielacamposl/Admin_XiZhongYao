import React, { useEffect, useState, useRef } from "react";
import Layout from "@/layout/layout"
//--> Componentes primeReact
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Message } from 'primereact/message';
//--> Funciones propias
import { objetoVacio } from "@/components/catalogos/objetovacio";

import { formatoPrecio } from "@/helpers/funciones";
import { camposVacios, descripcionInvalida, descuendoInvalido, nombreInvalido } from "@/helpers/constantes/mensajes";

import { FormatoFecha } from "@/helpers/funciones";


const Devoluciones = () => {
  //--> Estructura de objeto vacío
  let ordenVacia = objetoVacio

  //----------------| Lista de variables |----------------
  //--> Registros
  const [order, setOrder] = useState(ordenVacia);
  const [orders, setOrders] = useState(null);
  //--> Dialogos
  const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
  const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
  const [orderDialog, setOrderDialog] = useState(false);
  //--> Otros
  const [selectedOrders, setSelectedOrders] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Nuevo estado para la orden seleccionada

  //--> Mensajes
  const [mensajeRespuesta, setMensajeRespuesta] = useState('')
  //-> Estatus Pedido
  //---------- | Modificar Status | ------------
  const [displayDialog, setDisplayDialog] = useState(false);
  const [pedidoStatus, setPedidoStatus] = useState('');
  const [estatusOptions, setEstatusOptions] = useState([
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Entregada', value: 'Entregada' },
  ]);

  //--> Especiales
  const toast = useRef(null);
  const dt = useRef(null);

  //--> Cargar cuando se renderiza
  useEffect(() => {
    const datos = [
      {
        idPedido: 153,
        fecha: '14-01-2024',
        detalles: {
          producto1: {
            nombre: 'Crema de Naranja',
            cantidad: 2
          },
          producto2: {
            nombre: 'Concha Nacar',
            cantidad: 1
          }
        },
        total: 185,
        estado: 'Pendiente'
      },
      {
        idPedido: 154,
        fecha: '10-01-2024',
        detalles: {
          producto1: {
            nombre: 'Aceite Anticaida',
            cantidad: 3
          },
          producto2: {
            nombre: '',
            cantidad: '',
          }

        },
        total: 98,
        estado: 'Pendiente'
      }, {
        idPedido: 153,
        fecha: '10-01-2024',
        detalles: {
          producto1: {
            nombre: 'Hojas de lavanda',
            cantidad: 4
          },
          producto2: {
            nombre: '',
            cantidad: '',
          }

        },
        total: 84,
        estado: 'Pendiente'
      },


    ]
    setOrders(datos)
  }, []);

  const getSeverity = (order) => {
    switch (order.estado) {
      case 'Entregada': return 'success';
      case 'Pendiente': return 'warning';
      default: return null;
    }
  };



  const plantillaEstatus = (rowData) => {
    const severity = getSeverity(rowData); // Obtén la severidad del estado actualizado
    return <Tag value={rowData.estado} severity={severity}></Tag>;
  };
  //----------------| Interacción con diálogos |----------------

  const cerrarDialogoEliminarRegistro = () => { setDeleteOrderDialog(false) };
  const cerrarDialogoEliminarRegistros = () => { setDeleteOrdersDialog(false) }

  //------------- | Diálogo Estatus |--------



  const handleDialogHide = () => {
    setDisplayDialog(false);
  };

  
  const handleButtonClick = (rowData) => {
    setDisplayDialog(true);
    setSelectedOrder(rowData); // Almacena la orden seleccionada
  };

  const handleStatusChange = () => {
    const updatedOrders = orders.map((o) => {
      if (o.idPedido === selectedOrder.idPedido) {
        return { ...o, estado: pedidoStatus };
      }
      return o;
    });

    setOrders(updatedOrders);

    toast.current.show({
      severity: 'success', summary: 'Estatus Guardado', detail: 'Se ha actualizado correctamente el estatus del pedido', life: 3000
    });

    setDisplayDialog(false);
  };

  //----------------| Funciones Back-end |----------------

  const eliminarRegistro = () => {
    //--> Registros que no sean los seleccionados
    let _orders = orders.filter((val) => val.idPedido !== order.idPedido);

    setOrders(_orders);
    setDeleteOrderDialog(false);
    setOrder(ordenVacia);
    toast.current.show({
      severity: 'success', summary: 'Registro(s) de cancelación eliminado(s)', detail: 'Se ha eliminado correctamente el registro seleccionado.', life: 3000
    });
  };

  const confirmDeleteSelected = () => { setDeleteOrdersDialog(true) }

  const deleteSelectedOrders = () => {
    //--> Registros que no son seleccionados
    let _orders = orders.filter((val) => !selectedOrders.includes(val));

    setOrders(_orders);
    setDeleteOrdersDialog(false);
    setSelectedOrders(null);
    toast.current.show({
      severity: 'success', summary: 'Registro(s) de cancelación eliminado(s)', detail: 'Se ha eliminado correctamente el registro seleccionado', life: 3000
    });
  };

  const plantillaProductos = (rowData) => {
    const detalles = rowData.detalles;
    const productos = Object.values(detalles).map((producto, index) => (
      <div key={index}>
        {producto.nombre && <p>{`Nombre: ${producto.nombre}, Cantidad: ${producto.cantidad}`}</p>}
      </div>
    ));
    return <>{productos}</>;
  };

  //----------------| Botones de diálogos |----------------
  const cabezal = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Registro de Pedidos</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );

  const deleteButton = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Eliminar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedOrders || !selectedOrders.length} />
      </div>
    );
  };

  const botonesAccion = (rowData) => {
    return (
      <>
        <Button icon="pi pi-check-square" severity="success" label="Validar" onClick={handleButtonClick} />
        <Button icon="pi pi-trash" severity="danger" onClick={() => confirmarEliminarRegistro(rowData)} label="Eliminar" />
      </>
    );
  };

  const botonesEliminarRegistro = (
    <>
      <Button severity="success" label="Aceptar" icon="pi pi-check" onClick={eliminarRegistro} />
      <Button severity="danger" label="Cancelar" icon="pi pi-times" onClick={cerrarDialogoEliminarRegistro} />
    </>
  );

  const botonesEliminarRegistros = (
    <>
      <Button label="Aceptar" icon="pi pi-check" severity="success" onClick={deleteSelectedOrders} />
      <Button label="Cancelar" severity="danger" icon="pi pi-times" onClick={cerrarDialogoEliminarRegistros} />
    </>
  );

  //----------------| Valor que regresará |----------------
  return (
    <Layout
      title="Pedidos"
      description="Acceso al registro de cancelaciones"
    >
      <div className="grid">
        <Toast ref={toast} />

        <div className="col-12">
          <div className="card">
            <Toolbar className="mb-4" right={deleteButton} />

            <DataTable
              ref={dt} value={orders} selection={selectedOrders} onSelectionChange={(e) => setSelectedOrders(e.value)}
              paginator rows={15} rowsPerPageOptions={[5, 10, 15]} showGridlines
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} registros"
              globalFilter={globalFilter} header={cabezal}>
              <Column selectionMode="multiple" exportable={false} />
              <Column field="idPedido" header="ID Pedido" sortable style={{ minWidth: '12rem', textAlign: "center" }} />
              <Column field="fecha" header="Fecha de la Realización Pedido" sortable style={{ minWidth: '16rem', textAlign: "center" }}> </Column>
              <Column field="detalles" header="Productos" body={plantillaProductos} sortable style={{ minWidth: '16rem', textAlign: "center" }} />
              <Column field="total" header="Cantidad Total a Pagar" sortable style={{ minWidth: '16rem', textAlign: "center" }} />
              <Column field="estado" header="Estado del Pedido" body={plantillaEstatus} sortable style={{ minWidth: '16rem', textAlign: "center" }} />
              <Column header="Validar / Eliminar registro" body={botonesAccion} exportable={false} style={{ minWidth: '20rem', textAlign: "center" }} />
            </DataTable>

            <Dialog
              visible={displayDialog}
              style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
              modal className="p-fluid"
              onHide={handleDialogHide}
              header="Modificar estado del pedido"
              footer={
                <div>
                  <Button label="Guardar" severity="success" onClick={handleStatusChange} autoFocus />
                  <Button label="Cancelar" severity="danger" onClick={handleDialogHide} />
                </div>
              }
            >
              <div>
                <h5>Nuevo estado del pedido:</h5> <br />
                {estatusOptions.map((option) => (
                  <div key={option.value}>
                    <RadioButton
                      inputId={option.value}
                      name="pedidoStatus"
                      value={option.value}
                      onChange={(e) => setPedidoStatus(e.value)}
                      checked={pedidoStatus === option.value}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                  </div>
                ))}
              </div>
            </Dialog>

            <Dialog
              visible={deleteOrderDialog} style={{ width: '32rem' }}
              breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={botonesEliminarRegistro}
              onHide={cerrarDialogoEliminarRegistro}
            >
              <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {order && (
                  <span>
                    ¿Está seguro de eliminar el registro?
                  </span>
                )}
              </div>
            </Dialog>

            <Dialog visible={deleteOrdersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Eliminar Registros" modal footer={botonesEliminarRegistros} onHide={cerrarDialogoEliminarRegistros}>
              <div className="confirmation-content">
                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                {order && <span>¿Está seguro de eliminar los registros?</span>}
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Devoluciones;
