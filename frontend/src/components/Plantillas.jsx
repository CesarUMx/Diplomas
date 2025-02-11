import useVerificarRol from "../hooks/verificarRol";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import Loader from "./others/Loader";
import useFetchData from "../hooks/useFetchData";
import AlertaEliminar from "./modals/AlertaEliminar";
import ModalPlantilla from "./modals/ModalPlantillas";
import TablaPlantillas from "./tables/TablaPlantillas";


const PlantillasC = () => {

  const { rol, rolLoading, permitido } = useVerificarRol([1, 2]);
  const { data: plantillas, fetchData, loading } = useFetchData("/plantillas");
  const [filtro, setFiltro] = useState("");


  const plantillasFiltradas = plantillas.filter((plantilla) =>
    plantilla.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleEliminar = async (id) => {
    AlertaEliminar({
      id, 
      endpoint: "/plantillas", 
      mensaje: "No podrás recuperar esta plantilla después de eliminarla.",
      onSuccess: fetchData
    });
  };
  

  if (!permitido) return <p>No tienes permisos para acceder a esta página.</p>;
  if (loading || rolLoading) return (<Loader />);

  return (
    <div className="mt-4">
         <div className="mb-3 flex items-center justify-between border-b border-gray-300 pb-1 ">
            <h1 className="text-2xl font-bold mb-0 ">Gestión de Plantillas</h1>

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
                      onClick={() => ModalPlantilla(null, fetchData)}
              >
                <Plus size={22} color="#fff" />
                <span className="ml-3">Nueva Plantilla</span>
              </button>
            </div>
        </div>
      <TablaPlantillas plantillas={plantillasFiltradas} fetchData={fetchData} onEditar={ModalPlantilla} onEliminar={handleEliminar} />
    </div>
  );
};

export default PlantillasC;
