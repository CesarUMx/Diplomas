import useVerificarRol from "../hooks/verificarRol";
import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { getBackendURL } from "../utils/url";
import { Search, Plus, Trash, Edit } from "lucide-react";
import Loader from "./Loader";
import Swal from "sweetalert2";


const PlantillasC = () => {

  const { rol, loading, permitido } = useVerificarRol([1, 2]);

  const [plantillas, setPlantillas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const URL_PLANTILLAS = getBackendURL("/plantillas");


  useEffect(() => {
    if (permitido && !loading) {  // Solo ejecutar si está permitido y no está cargando
      fetchPlantillas();
    }
  }, [permitido, loading, URL_PLANTILLAS]);

  const fetchPlantillas = async () => {
    try {
      const response = await fetch(URL_PLANTILLAS, { credentials: "include" });
      const data = await response.json();
      setPlantillas(data);
    } catch (error) {
      console.error("Error al obtener plantillas:", error);
    }
  };

  const platillasFiltradas = plantillas.filter(plantilla =>
    plantilla.nombre.toLowerCase().includes(filtro.toLowerCase()) 
  );

  const columns = [
    {
      name: "ID",
      selector: row => row.id,
    },
    {
      name: "Nombre",
      selector: row => row.nombre,
    },
    {
      name: "Descripción",
      selector: row => row.descripcion,
    },
    {
      name: "Archivo SVG",
      cell: row => (
        <a href={row.archivo_svg} target="_blank" rel="noopener noreferrer">
          Ver SVG
        </a>
      ),
    },
    {
      name: "Acciones",
      cell: row => (
        <div className="d-flex justify-content-end">
          <button className="mx-1" onClick={() => mostrarModalPlantilla(row)}>
            <Edit size={25} color="#FFC300" />
          </button>
          <button className="mx-1" onClick={() => handleEliminar(row.id)}>
            <Trash size={25} color="#CA1313" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
    }
  ];

  const mostrarModalPlantilla = (plantilla = null) => {
    Swal.fire({
      title: `<h2 class="text-lg font-semibold text-gray-800">${plantilla ? "Editar Plantilla" : "Nueva Plantilla"}</h2>`,
      html: `
        <div class="flex flex-col gap-2 text-left">
          <label class="text-sm font-medium text-gray-700">Nombre:</label>
          <input id="nombre" class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre" value="${plantilla ? plantilla.nombre : ""}">
          
          <label class="text-sm font-medium text-gray-700">Descripción:</label>
          <textarea id="descripcion" class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">${plantilla ? plantilla.descripcion : ""}</textarea>
          
          <label class="text-sm font-medium text-gray-700">Archivo SVG:</label>
          <input type="file" id="archivo" class="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" accept=".svg">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: plantilla ? "Actualizar" : "Subir",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "bg-white rounded-lg shadow-lg p-6",
        confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded",
      },
      preConfirm: () => {
        const nombre = document.getElementById("nombre").value;
        const descripcion = document.getElementById("descripcion").value;
        const archivo = document.getElementById("archivo").files[0];
        return { nombre, descripcion, archivo };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { nombre, descripcion, archivo } = result.value;

        if ((!nombre || !archivo) && !plantilla) {
          Swal.fire("Error", "El nombre y el archivo SVG son obligatorios", "error");
          return;
        }

        if (plantilla && (!nombre)) {
          console.log(nombre, archivo);
          Swal.fire("Error", "El nombre es obligatorio", "error");
          return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        formData.append("archivo", archivo);

        const url = plantilla ? `${URL_PLANTILLAS}/${plantilla.id}` : URL_PLANTILLAS;
        const method = plantilla ? "PUT" : "POST";

        try {
          const response = await fetch(url, {
            method,
            credentials: "include",
            body: formData,
          });

          if (response.ok) {
            Swal.fire("Éxito", `Plantilla ${plantilla ? "actualizada" : "subida"} correctamente`, "success");
            fetchPlantillas();
          } else {
            Swal.fire("Error", "Hubo un problema al guardar la plantilla", "error");
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        }
      }
    });
  };

  const handleEliminar = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar esta plantilla después de eliminarla.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "bg-white rounded-lg shadow-lg p-6",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${URL_PLANTILLAS}/${id}`, {
            method: "DELETE",
            credentials: "include",
          });

          if (response.ok) {
            Swal.fire("Eliminado", "La plantilla ha sido eliminada.", "success");
            fetchPlantillas();
          } else {
            Swal.fire("Error", "No se pudo eliminar la plantilla.", "error");
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
        }
      }
    });
  };
  

  if (!permitido) return <p>No tienes permisos para acceder a esta página.</p>;
  if (loading) return (<Loader />);

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
              <button className="flex items-center gap-3 bg-blue-900 rounded-md px-4 py-2 text-white" onClick={() => mostrarModalPlantilla()}>
                <Plus size={22} color="#fff" />
                <span className="ml-3">Nueva Plantilla</span>
              </button>
            </div>
        </div>
      <DataTable
        columns={columns}
        data={platillasFiltradas}
        progressPending={loading}
        pagination
        paginationRowsPerPageOptions={[25, 50, 100]}
        paginationRowsPerPage={25}
        highlightOnHover
      />
    </div>
  );
};

export default PlantillasC;
