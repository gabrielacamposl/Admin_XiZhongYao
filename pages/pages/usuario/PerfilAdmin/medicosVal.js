import React, { useEffect, useState, useRef } from "react";
import Layout from "@/layout/layout";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import axios from "axios";
import { mostrarDoctores, validarDoctores } from "@/helpers/constantes/links"; // Reemplaza con el enlace correcto para validar doctores
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const Doctores = () => {
  const [doctores, setDoctores] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [displayDialog, setDisplayDialog] = useState(false);
  const [mensajeRespuesta, setMensajeRespuesta] = useState('');
  const [validacionExitosa, setValidacionExitosa] = useState(null); // Nuevo estado para almacenar el resultado de la validación

  const toast = useRef(null);

  const consultarDoctores = async () => {
    const token = localStorage.getItem('token');
    const cabecera = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    try {
      const respuesta = await axios.get(mostrarDoctores, cabecera);
      setDoctores(respuesta.data.doctor);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    consultarDoctores();
  }, []);

  const enviarResultadoValidacion = async (resultado) => {
   
    try {
      const token = localStorage.getItem('token');
      const cabecera = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const body = {
        resultado: resultado
      };
      // Reemplaza 'URL_DEL_SERVICIO' con la URL correcta para realizar el POST.
      await axios.post(validarDoctores, body, cabecera);
    } catch (error) {
      console.error(error);
    }
  };

  const validarCuenta = () => {
    // Lógica para validar la cuenta del doctor
    // Puedes implementar la lógica aquí y mostrar un mensaje de éxito o error.
    setValidacionExitosa(true);
    setDisplayDialog(false);
    toast.current.show({
      severity: 'success',
      summary: 'Cuenta Validada',
      detail: 'La cuenta del doctor ha sido validada correctamente',
      life: 3000
    });
  };

  const cancelarCuenta = () => {
    // Lógica para cancelar la cuenta del doctor
    // Puedes implementar la lógica aquí y mostrar un mensaje de éxito o error.
    setValidacionExitosa(false);
    setDisplayDialog(false);
    toast.current.show({
      severity: 'warn',
      summary: 'Cuenta Cancelada',
      detail: 'La cuenta del doctor ha sido cancelada',
      life: 3000
    });
  };

  const botonesAccion = (rowData) => {
    return (
      <>
        <Button
          label="Validar Cuenta"
          icon="pi pi-check"
          severity="success"
          onClick={() => {
            setSelectedDoctor(rowData);
            setDisplayDialog(true);
          }}
        />
        <Button
          label="Cancelar Cuenta"
          icon="pi pi-times"
          severity="danger"
          onClick={() => {
            setSelectedDoctor(rowData);
            setDisplayDialog(true);
          }}
        />
      </>
    );
  };

  const botonesValidacion = (
    <>
      <Button
        label="Validar Cuenta"
        icon="pi pi-check"
        severity="success"
        onClick={validarCuenta}
      />
      <Button
        label="Cancelar Cuenta"
        icon="pi pi-times"
        severity="danger"
        onClick={cancelarCuenta}
      />
    </>
  );

  useEffect(() => {
    if (validacionExitosa !== null) {
      enviarResultadoValidacion(validacionExitosa);
    }
  }, [validacionExitosa]);

  return (
    <Layout
      title="Doctores"
      description="Acceso al registro de Doctores"
    >
      <div className="grid">
        <Toast ref={toast} />
        <div className="col-12">
          <div className="card">
            <div className="p-input-icon-left mb-4">
              <i className="pi pi-search" />
              <InputText
                type="search"
                onInput={(e) => setGlobalFilter(e.target.value)}
                placeholder="Buscar..."
              />
            </div>
            <DataTable
              value={doctores}
              selection={selectedDoctor}
              onSelectionChange={(e) => setSelectedDoctor(e.value)}
              paginator
              rows={15}
              rowsPerPageOptions={[5, 10, 15]}
              showGridlines
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} registros"
              globalFilter={globalFilter}
            >
              <Column selectionMode="single" exportable={false} />
              <Column field="nombre" header="Nombre del Médico" sortable />
              <Column field="correoElectronico" header="Correo Electrónico" sortable />
              <Column field="especialidad" header="Especialidad" sortable />
              <Column field="cedulaFile" header="Cédula Profesional" sortable />
              <Column field="tituloFile" header="Título de Profesión" sortable />
              <Column header="Acciones" body={botonesAccion} exportable={false} />
            </DataTable>

            <Dialog
              visible={displayDialog}
              header="Validar/Canclear Cuenta"
              modal
              footer={botonesValidacion}
              onHide={() => setDisplayDialog(false)}
            >
              <div>
                <h5>{`¿Está seguro de ${
                  selectedDoctor
                    ? "validar la cuenta del doctor"
                    : "cancelar la cuenta del doctor"
                }?`}</h5>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Doctores;
