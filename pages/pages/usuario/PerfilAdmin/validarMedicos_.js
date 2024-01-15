import React, { useEffect, useState, useRef } from "react";
import Layout from "@/layout/layout";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const Doctores = () => {
    const [doctores, setDoctores] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [displayDialog, setDisplayDialog] = useState(false);
    const [mensajeRespuesta, setMensajeRespuesta] = useState('');
    const [displayDocumentoDialog, setDisplayDocumentoDialog] = useState(false);

    const [pdfUrl, setPdfUrl] = useState(null);

    const vaidacionDoctores = [
     /*  {
            nombre: "Marco Antonio García Olvera",
            email: "docmarcoantoniogar@gmail.com",
            especialidad: "Nefrólogo",
            cedulaFile: "CedulaProfesionalMarcoAntonio.pdf",
            tituloFile: "TituloMarcoMarcoAnotnio.pdf"
        },*/
        {
            nombre: "Georgina Cruz Luna",
            email: "gaviotacl12@gmail.com",
            especialidad: "Odontólogo",
            cedulaFile: "cedula.pdf",
            tituloFile: "TiTuloProf.pdf"
        },
      /*  {
            nombre: "Oder Olvera Nieto",
            email: "oderolveradoc@gmail.com",
            especialidad: "Otorrinolaringólogo",
            cedulaFile: "cedulaProfOder.pdf",
            tituloFile: "TituloProfOder.pdf"
        },*/
     
        
        {
            nombre: "Aranza Jiménez Gutiérrez",
            email: "doc_araara@gmail.com",
            especialidad: "Cardiólogo",
            cedulaFile: "C:/Users/gabri/Downloads/XiZhongYao_Triptico.pdf",
            tituloFile: "C:/Users/gabri/Downloads/XiZhongYao_Triptico.pdf"
        },
    ]

    const toast = useRef(null);

    useEffect(() => {
        // Cambia la siguiente línea para mostrar los doctores desde la variable vaidacionDoctores
        setDoctores(vaidacionDoctores);
    }, []);

    const mostrarDocumento = (fileName) => {
        const pdfPath = `/pages/usuario/PerfilAdmin/${fileName}`; // Ruta relativa al componente actual
        setPdfUrl(pdfPath);
        console.log('filenname', fileName);
        console.log('pdfPath', pdfPath);
        setDisplayDocumentoDialog(true);
    };



    const cerrarDocumentoDialog = () => {
        setPdfUrl(null);
        setDisplayDocumentoDialog(false);
    };

    const validarCuenta = () => {
        // Lógica para validar la cuenta del doctor
        // Eliminar el doctor de la lista
        const updatedDoctores = doctores.filter((doctor) => doctor !== selectedDoctor);
        setDoctores(updatedDoctores);

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
        // Eliminar el doctor de la lista
        const updatedDoctores = doctores.filter((doctor) => doctor !== selectedDoctor);
        setDoctores(updatedDoctores);

        setDisplayDialog(false);
        toast.current.show({
            severity: 'warn',
            summary: 'Cuenta Cancelada',
            detail: 'La cuenta del doctor ha sido cancelada',
            life: 3000
        });
    };

    const estiloTexto = {
        color: 'transparent',
        userSelect: 'none', // Evita la selección del texto
    };



    const botonesAccion = (rowData) => {
        return (
            <>
                <Button
                    label="Validar Cuenta"
                    icon="pi pi-check-circle"
                    severity="success"
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

    const cabezal = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Validación de Médicos</h4>
        </div>
    );

    const descargarDocumento = (fileName) => {
        const pdfPath = `/docs/${fileName}`;
        const link = document.createElement('a');
        link.href = pdfPath;
        link.target = '_blank';
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
         console.log('filenname', fileName);
        console.log('pdfPath', pdfPath);
    };


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
                            header={cabezal}
                        >
                            <Column selectionMode="single" exportable={false} />
                            <Column field="nombre" header="Nombre del Médico" sortable style={{ minWidth: '15rem', textAlign: "center" }} />
                            <Column field="email" header="Correo Electrónico" sortable style={{ minWidth: '12rem', textAlign: "center" }} />
                            <Column field="especialidad" header="Especialidad" sortable style={{ minWidth: '12rem', textAlign: "center" }} />
                            <Column
                                header="Cédula Profesional"
                                body={(rowData) => (
                                    <>
                                        <a href={`${rowData.cedulaFile}`} target="_blank" rel="noopener noreferrer">
                                            Ver Cédula
                                        </a>
                                        <Button
                                            label="Descargar"
                                            icon="pi pi-download"
                                            onClick={() => descargarDocumento(rowData.cedulaFile)}
                                        />
                                    </>
                                )}
                            />
                            <Column
                                header="Título de Profesión"
                                body={(rowData) => (
                                    <>
                                        <a href={`${rowData.tituloFile}`} target="_blank" rel="noopener noreferrer">
                                            Ver Título
                                        </a>
                                        <Button
                                            label="Descargar"
                                            icon="pi pi-download"
                                            onClick={() => descargarDocumento(rowData.tituloFile)}
                                        />
                                    </>
                                )}
                            />

                            <Column header="Acciones" body={botonesAccion} exportable={false} style={{ minWidth: '20rem', textAlign: "center" }} />
                        </DataTable>
                        <Dialog
                            visible={displayDocumentoDialog}
                            header="Documento PDF"
                            modal
                            onHide={cerrarDocumentoDialog}
                        >
                            <div style={{ height: '500px' }}>
                                <Viewer fileUrl={pdfUrl} />
                            </div>
                        </Dialog>

                        <Dialog
                            visible={displayDialog}
                            header="Validar/Canclear Cuenta"
                            modal
                            footer={botonesValidacion}
                            onHide={() => setDisplayDialog(false)}
                        >
                            <div>
                                <h5>{`¿Está seguro de ${selectedDoctor
                                    ? "validar la cuenta del doctor"
                                    : "cancelar la cuenta del doctor"
                                    }?`}</h5>
                            </div>
                        </Dialog>

                        <Dialog
                            visible={displayDialog}
                            header="Validar/Canclear Cuenta"
                            modal
                            footer={botonesValidacion}
                            onHide={() => setDisplayDialog(false)}
                        >
                            <div>
                                <h5>{`¿Está seguro de ${selectedDoctor
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
