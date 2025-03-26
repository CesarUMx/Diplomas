import useVerificarRol from "../hooks/verificarRol";
import { UsersRound, Plus, Search } from "lucide-react";
import Loader from "./others/Loader";
import useFetchData from "../hooks/useFetchData";
import ModalCargaAlumnos from "./modals/ModalCargaAlumnos";
import { useState } from "react";
import TablaEstudiantes from "./tables/TablaEstudiantes";
import AlertaEliminar from "./modals/AlertaEliminar";
import ModalAlumnos from "./modals/ModalAlumnos";


const DiplomasC = ({ id }) => {
    const { rol, rolLoading, permitido } = useVerificarRol([1, 2]);
    const { data: grupo, fetchData, loading } = useFetchData("/grupos/" + id);
    const [filtro, setFiltro] = useState("");

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

    if (!permitido) return <p>No tienes permisos para acceder a esta página.</p>;
    if (loading || rolLoading) return (<Loader />);

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
                    <TablaEstudiantes estudiantes={alumnosFiltrados} onEliminar={handleEliminar} onEditar={handleEditar} />
                    :
                    <p>No hay alumnos en este grupo.</p>
            }

                                
        </div>
    );
};

export default DiplomasC;