import Swal from "sweetalert2";
import { getBackendURL } from "../../utils/url";

const ModalGrupo = (grupo, fetchGrupos) => {
    const URL_GRUPOS = getBackendURL("/grupos");
    const URL_PLANTILLAS = getBackendURL("/plantillas");

    // Obtener plantillas disponibles
    let plantillasDisponibles = [];
  
    const obtenerPlantillas = async () => {
        try {
            const response = await fetch(URL_PLANTILLAS, { credentials: "include" });
            plantillasDisponibles = await response.json();
        } catch (error) {
            console.error("Error obteniendo plantillas:", error);
        }
    };

    obtenerPlantillas().then(() => {
        Swal.fire({
            title: `<h2 class="text-lg font-semibold text-gray-800">${grupo ? "Editar Grupo" : "Nuevo Grupo"}</h2>`,
            html: `
            <div class="flex flex-col gap-2 text-left">
                <label class="text-sm font-medium text-gray-700">Nombre:</label>
                <input id="nombre" class="border border-gray-300 rounded-md p-2 w-full" placeholder="Nombre" value="${grupo ? grupo.nombre : ""}">
                
                <label class="text-sm font-medium text-gray-700">Descripción:</label>
                <textarea id="descripcion" class="border border-gray-300 rounded-md p-2 w-full" placeholder="Descripción">${grupo ? grupo.descripcion : ""}</textarea>
                
                <label class="text-sm font-medium text-gray-700">Plantilla:</label>
                <select id="plantilla" class="border border-gray-300 rounded-md p-2 w-full">
                    <option value="">Seleccionar plantilla</option>
                    ${plantillasDisponibles.map(plantilla => 
                        `<option value="${plantilla.id}" ${grupo && grupo.id_plantilla === plantilla.id ? "selected" : ""}>
                            ${plantilla.nombre}
                        </option>`).join("")}
                </select>
            </div>
            `,
            showCancelButton: true,
            confirmButtonText: grupo ? "Actualizar" : "Crear",
            preConfirm: () => {
                const nombre = document.getElementById("nombre").value;
                const descripcion = document.getElementById("descripcion").value;
                const id_plantilla = document.getElementById("plantilla").value || null;
                return { nombre, descripcion, id_plantilla };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { nombre, descripcion, id_plantilla } = result.value;
                if (!nombre) {
                    Swal.fire("Error", "El nombre es obligatorio", "error");
                    return;
                }

                const url = grupo ? `${URL_GRUPOS}/${grupo.id}` : URL_GRUPOS;
                const method = grupo ? "PUT" : "POST";

                try {
                    const response = await fetch(url, {
                        method,
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ nombre, descripcion, id_plantilla }),
                    });

                    if (response.ok) {
                        Swal.fire("Éxito", `Grupo ${grupo ? "actualizado" : "creado"} correctamente`, "success");
                        fetchGrupos();
                    } else {
                        Swal.fire("Error", "Hubo un problema al guardar el grupo", "error");
                    }
                } catch (error) {
                    Swal.fire("Error", "No se pudo conectar con el servidor", "error");
                }
            }
        });
    });
};

export default ModalGrupo;
