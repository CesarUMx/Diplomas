import Swal from "sweetalert2";
import { getBackendURL, getArchivoURL } from "../../utils/url";

const ModalPlantilla = (plantilla, fetchPlantillas) => {
    const URL_PLANTILLAS = getBackendURL("/plantillas");

    let previewSVG = plantilla ? getArchivoURL(plantilla.archivo_svg) : "";
  
    Swal.fire({
      title: `<h2 class="text-lg font-semibold text-gray-800">${plantilla ? "Editar Plantilla" : "Nueva Plantilla"}</h2>`,
      html: `
        <div class="flex flex-col gap-2 text-left">
          <label class="text-sm font-medium text-gray-700">Nombre:</label>
          <input id="nombre" class="border border-gray-300 rounded-md p-2 w-full" placeholder="Nombre" value="${plantilla ? plantilla.nombre : ""}">
          
          <label class="text-sm font-medium text-gray-700">Descripción:</label>
          <textarea id="descripcion" class="border border-gray-300 rounded-md p-2 w-full" placeholder="Descripción">${plantilla ? plantilla.descripcion : ""}</textarea>
          
          <label class="text-sm font-medium text-gray-700">Archivo SVG:</label>
          <input type="file" id="archivo" class="border border-gray-300 rounded-md p-2 w-full" accept=".svg">

          <div id="preview-container" class="border rounded-md p-2 mt-2 ${previewSVG ? "" : "hidden"}">
            <p class="text-sm font-medium text-gray-700">Previsualización:</p>
            <div class="w-full flex justify-center">
              <img id="preview-img" src="${previewSVG}" class="w-64 h-auto" />
            </div>
          </div>

        </div>
      `,
      showCancelButton: true,
      confirmButtonText: plantilla ? "Actualizar" : "Subir",
      preConfirm: () => {
        const nombre = document.getElementById("nombre").value;
        const descripcion = document.getElementById("descripcion").value;
        const archivo = document.getElementById("archivo").files[0];
        return { nombre, descripcion, archivo };
        //return { nombre, descripcion, fileData  };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { nombre, descripcion, archivo } = result.value;
        if (!nombre || (!plantilla && !archivo)) {
          Swal.fire("Error", "El nombre y el archivo SVG son obligatorios", "error");
          return;
        }
  
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        if (archivo) formData.append("archivo", archivo);

        const url = plantilla ? `${URL_PLANTILLAS}/${plantilla.id}` : URL_PLANTILLAS;
        const method = plantilla ? "PUT" : "POST";
  
        try {
          const response = await fetch(url, { method, credentials: "include", body: formData });
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
  
  export default ModalPlantilla;