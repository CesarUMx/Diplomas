import Swal from "sweetalert2";
import { getBackendURL } from "../../utils/url";

const ModalGrupo = (grupo, fetchGrupos) => {
    const URL_GRUPOS = getBackendURL("/grupos");
    const URL_PLANTILLAS = getBackendURL("/plantillas");

    // Format the date to YYYY-MM-DD
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const fecha_curso = formatDate(grupo?.fecha_curso);

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

                <label class="text-sm font-medium text-gray-700">Fecha del curso</label>
                <input id="fecha" class="border border-gray-300 rounded-md p-2 w-full" type="date" value="${fecha_curso}">

                <label class="text-sm font-medium text-gray-700">Imagen:</label>
                <input id="imagen" type="file" accept="image/*" class="border border-gray-300 rounded-md p-2 w-full"
                    onchange="const file = this.files[0];
                             const reader = new FileReader();
                             reader.onload = function(e) {
                                 document.getElementById('preview').src = e.target.result;
                                 document.getElementById('preview').style.display = 'block';
                             };
                             if(file) reader.readAsDataURL(file);">
                <img id="preview" 
                     src="${grupo && grupo.imagen_url ? import.meta.env.VITE_BACKEND_URL + grupo.imagen_url : ''}"
                     class="mt-2 max-h-40 object-contain mx-auto"
                     style="display: ${grupo && grupo.imagen_url ? 'block' : 'none'}">
                
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
                const fecha = document.getElementById("fecha").value;
                const imagen = document.getElementById("imagen").files[0];
                return { nombre, descripcion, id_plantilla, fecha, imagen };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { nombre, descripcion, id_plantilla, fecha, imagen } = result.value;
                if (!nombre || !fecha) {
                    Swal.fire("Error", "El nombre y la fecha son obligatorios", "error");
                    return;
                }

                const formData = new FormData();
                formData.append("nombre", nombre);
                formData.append("descripcion", descripcion);
                formData.append("fecha", fecha);
                if (id_plantilla) formData.append("id_plantilla", id_plantilla);
                if (imagen) formData.append("imagen", imagen);

                const url = grupo ? `${URL_GRUPOS}/${grupo.id}` : URL_GRUPOS;
                const method = grupo ? "PUT" : "POST";

                try {
                    const response = await fetch(url, {
                        method,
                        credentials: "include",
                        body: formData,
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
