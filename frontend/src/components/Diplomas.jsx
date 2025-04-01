import useVerificarRol from "../hooks/verificarRol";
import { UsersRound, Plus, Search } from "lucide-react";
import Loader from "./others/Loader";
import useFetchData from "../hooks/useFetchData";
import ModalCargaAlumnos from "./modals/ModalCargaAlumnos";
import { useState } from "react";
import TablaEstudiantes from "./tables/TablaEstudiantes";
import AlertaEliminar from "./modals/AlertaEliminar";
import ModalAlumnos from "./modals/ModalAlumnos";
import { getBackendURL } from "../utils/url";
import Swal from "sweetalert2";


const DiplomasC = ({ id }) => {
    const { rol, rolLoading, permitido } = useVerificarRol([1, 2]);
    const { data: grupo, fetchData, loading } = useFetchData("/grupos/" + id);
    const [filtro, setFiltro] = useState("");
    const URL_GENERAR = getBackendURL(`/diplomas/${id}/generar`);
    const URL_DESCARGAR = getBackendURL(`/diplomas/${id}/descargar`);
    const [loder, setLoader] = useState(false);

    const alumnosFiltrados = Array.isArray(grupo.alumnos)
    ? grupo.alumnos.filter((alumno) =>
      alumno.nombre.toLowerCase().includes(filtro.toLowerCase()))
    : [];

    const handleEliminar = async (id) => {
        AlertaEliminar({
            id, 
            endpoint: "/alumnos", 
            mensaje: "No podrás recuperar este alumno después de eliminarlo.",
            onSuccess: fetchData
        });
    };

    const handleEditar = async (alumno) => {
        ModalAlumnos(alumno, grupo.id, fetchData);
    };

    const handleGenerarTodosPDF = async () => {
        setLoader(true);
        try {
          const res = await fetch(URL_GENERAR, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
          });
      
          const data = await res.json();
      
          if (res.ok) {
            Swal.fire("¡Éxito!", data.mensaje, "success");
            fetchData();
          } else {
            Swal.fire("Error", data.mensaje || "No se pudo generar los diplomas", "error");
          }
        } catch (error) {
          console.error("Error al generar diplomas:", error);
          Swal.fire("Error", "Error inesperado al generar los PDFs", "error");
        } finally {
            setLoader(false);
        }
      };

    if (!permitido) return <p>No tienes permisos para acceder a esta página.</p>;
    if (loading || rolLoading || loder) return (<Loader />);

    return (
        <div className="mt-4">
            <div className="mb-3 flex items-center justify-between border-b border-gray-300 pb-1 ">
                <h1 className="text-2xl font-bold mb-0 ">Grupo: {grupo.nombre}</h1>

                { grupo.alumnos.length > 0 ?
                    <>
                        <div className="flex items-center gap-3 bg-blue-900 rounded-md px-4 py-2 mb-1">
                            <Search size={22} color="#fff" />
                            <input
                                type="text"
                                className="form-control rounded-md border-gray-300 px-6 py-1 text-md"
                                placeholder="Buscar por nombre"
                                value={filtro}
                                onChange={e => setFiltro(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <button className="flex items-center gap-3 bg-blue-900 rounded-md px-4 py-2 text-white"
                                    onClick={() => ModalAlumnos(null, grupo.id, fetchData)}
                            >
                                <Plus size={22} color="#fff" />
                                <span className="ml-1">Agregar alumno</span>
                            </button> 
                        </div>
                    </>
                    : 
                    <div className="flex justify-center">
                        <button className="flex items-center gap-3 bg-blue-900 rounded-md px-4 py-2 text-white"
                                onClick={() => ModalCargaAlumnos(grupo.id, fetchData)}
                                >
                            <UsersRound size={22} color="#fff" />
                            <span className="ml-1">Cargar alumnos</span>
                        </button> 
                    </div>

                }

            </div> 
            
            {
                grupo.alumnos.length > 0 ?
                    <>
                        <div className="flex justify-end mb-4">
                        {
                         grupo.pdfs === 0 ?
                            <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            onClick={handleGenerarTodosPDF}
                            >
                            Generar diplomas
                            </button>
                            :
                            <a
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            href={URL_DESCARGAR}
                            >
                            Descargar Diplomas
                            </a>
                        }
                        </div>
                        
                        <TablaEstudiantes estudiantes={alumnosFiltrados} onEliminar={handleEliminar} onEditar={handleEditar} />
                    </>
                    :
                    <p>No hay alumnos en este grupo.</p>
            }

                                
        </div>
    );
};

export default DiplomasC;