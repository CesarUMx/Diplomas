import Swal from "sweetalert2";
import { getBackendURL } from "../../utils/url";

const ModalAlumnos = (alumno, grupoId, fetchAlumnos) => {
    const URL_ALUMNOS = getBackendURL(`/alumnos`);

    Swal.fire({
        title: `<h2 class="text-lg font-semibold text-gray-800">${alumno ? "Editar Alumno" : "Nuevo Alumno"}</h2>`,
        html: `
            <div class="flex flex-col gap-2 text-left">
                <label class="text-sm font-medium text-gray-700">Nombre:</label>
                <input id="nombre" class="border border-gray-300 rounded-md p-2 w-full" placeholder="Nombre" value="${alumno ? alumno.nombre : ""}">
                
                <input id="id_grupo" type="hidden" value="${grupoId}">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: alumno ? "Actualizar" : "Subir",
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value;
            const id_grupo = document.getElementById("id_grupo").value;
            return { nombre, id_grupo };
        },
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { nombre, id_grupo } = result.value;
            if (!nombre) {
                Swal.fire("Error", "El nombre es obligatorio", "error");
                return;
            }

            const url = alumno ? `${URL_ALUMNOS}/${alumno.id}` : URL_ALUMNOS;
            const method = alumno ? "PUT" : "POST";


            try {
                const response = await fetch(url, { 
                    method, 
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, id_grupo })
                });
                if (response.ok) {
                    Swal.fire("Éxito", `Alumno ${alumno ? "actualizado" : "subido"} correctamente`, "success");
                    fetchAlumnos();
                } else {
                    Swal.fire("Error", "Hubo un problema al guardar el alumno", "error");
                }
            }
            catch (error) {
                Swal.fire("Error", "No se pudo conectar con el servidor", "error");
            }
        }
    });
};

export default ModalAlumnos;