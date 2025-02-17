import { getBackendURL } from "../utils/url";
import { useState, useEffect } from "react";
import useVerificarRol from "../hooks/verificarRol";
import { UsersRound } from "lucide-react";
import Loader from "./others/Loader";

const DiplomasC = ({ id }) => {
    const { rol, rolLoading, permitido } = useVerificarRol([1, 2]);
    const URL_GRUPO = getBackendURL("/grupos/" + id);
    const [grupo, setGrupo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alumnos, setAlumnos] = useState([]);

    useEffect(() => {
        fetchGrupos();
    }, [URL_GRUPO]);

    const fetchGrupos = async () => {
        try {
            setLoading(true);
            const response = await fetch(URL_GRUPO, { credentials: "include" });
            const result = await response.json();
            setGrupo(result[0]);
        } catch (error) {
            console.error("Error obteniendo grupos:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!permitido) return <p>No tienes permisos para acceder a esta página.</p>;
    if (loading || rolLoading) return (<Loader />);

    return (
        <div className="mt-4">
            <div className="mb-3 flex items-center justify-between border-b border-gray-300 pb-1 ">
                <h1 className="text-2xl font-bold mb-0 ">Grupo: {grupo.nombre}</h1>

                { alumnos.length ?
                    <div className="flex items-center gap-3 bg-blue-900 rounded-md px-4 py-2 mb-1">
                        <Search size={22} color="#fff" />
                        <input
                            type="text"
                            className="form-control rounded-md border-gray-300 px-6 py-1 text-md"
                            placeholder="Buscar por nombre"
                            value={filtro}
                            onChange={e => setFiltro(e.target.value)}
                            // disabled={!(grupos?.length > 0)}
                        />
                    </div>
                    : 
                    <div className="flex justify-center">
                        <button className="flex items-center gap-3 bg-blue-900 rounded-md px-4 py-2 text-white">
                            <UsersRound size={22} color="#fff" />
                            <span className="ml-1">Cargar alumnos</span>
                        </button> 
                    </div>

                }

            </div> 

                                
        </div>
    );
};

export default DiplomasC;