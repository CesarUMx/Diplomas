import useVerificarRol from "../hooks/verificarRol";
import Loader from "./others/Loader";
import useFetchData from "../hooks/useFetchData";
import AlertaEliminar from "./modals/AlertaEliminar";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import ModalGrupo from "./modals/ModalGrupo";
import { getBackendURL } from "../utils/url";

const GruposDiplomasC = () => {

  const { rol, rolLoading, permitido } = useVerificarRol([1, 2]);
  const { data: grupos, fetchData, loading } = useFetchData("/grupos");
  const [filtro, setFiltro] = useState("");
  const gruposFiltrados = Array.isArray(grupos) 
    ? grupos.filter((grupo) =>
        grupo.nombre.toLowerCase().includes(filtro.toLowerCase())
        ) 
    : [];

  const URL = getBackendURL("");

  const handleEliminar = async (id) => {
    AlertaEliminar({
      id, 
      endpoint: "/grupos", 
      mensaje: "No podrás recuperar este grupo después de eliminarlo.",
      onSuccess: fetchData
    });
  };

  const verGrupo = async (id) => {
    window.location.href = `/grupo/${id}`;
  };

  if (!permitido) return <p>No tienes permisos para acceder a esta página.</p>;
  if (loading || rolLoading) return (<Loader />);

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between border-b border-gray-300 pb-1 ">
        <h1 className="text-2xl font-bold mb-0 ">Gestión de Grupos de Diplomas</h1>

        <div className="flex items-center gap-3 bg-blue-900 rounded-md px-4 py-2 mb-1">
            <Search size={22} color="#fff" />
            <input
                type="text"
                className="form-control rounded-md border-gray-300 px-6 py-1 text-md"
                placeholder="Buscar por nombre"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                disabled={!(grupos?.length > 0)}
            />
        </div>

        <div className="flex justify-center">
          <button className="flex items-center gap-3 bg-blue-900 rounded-md px-4 py-2 text-white"
                  onClick={() => ModalGrupo(null, fetchData)}
          >
            <Plus size={22} color="#fff" />
            <span className="ml-1">Nuevo Grupo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {
            grupos.length ? gruposFiltrados.map((grupo) => (
                <div key={grupo.id} className="bg-white px-8 py-4 rounded-lg shadow-md text-center relative">
              <button className="flex flex-col items-center" onClick={() => verGrupo(grupo.id)}>
                {
                  grupo.imagen_url ? (
                    <img 
                        src={`${URL}${grupo.imagen_url}`}
                        alt={grupo.nombre}
                        className="w-24 h-24 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <span className="text-blue-500 text-8xl">📁</span>
                  )
                }
                <p className="text-lg font-medium mt-2">{grupo.nombre}</p>
                <p className="text-sm text-gray-500">{grupo.descripcion}</p>
              </button>
              <button
                onClick={() => handleEliminar(grupo.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:scale-110"
              >
                ❌
              </button>
              <button
                onClick={() => ModalGrupo(grupo, fetchData)}
                className="absolute top-10 right-2 text-blue-500 hover:text-blue-700 hover:scale-110"
              >
                ✏️
              </button>
            </div>
          )) : <p>No hay grupos, crea uno primero.</p>
        }
        </div>
    </div>
  );
};

export default GruposDiplomasC;