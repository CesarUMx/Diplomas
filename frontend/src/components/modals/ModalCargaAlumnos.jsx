import Swal from "sweetalert2";
import { getBackendURL } from "../../utils/url";

const ModalCargaAlumnos = (idGrupo, fetchAlumnos) => {
  const URL_CSV = getBackendURL(`/grupos/${idGrupo}/cargar-csv`);

  Swal.fire({
    title: `<h2 class="text-lg font-semibold text-gray-800">Cargar Alumnos por CSV</h2>`,
    html: `
      <div class="flex flex-col gap-2 text-left">
        <label class="text-sm font-medium text-gray-700">Archivo CSV:</label>
        <input type="file" id="archivo_csv" class="border border-gray-300 rounded-md p-2 w-full" accept=".csv">

        <p class="text-xs text-gray-600 mt-2">
          El archivo debe tener la columna: <strong>nombre</strong>
        </p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Cargar",
    preConfirm: () => {
      const archivo = document.getElementById("archivo_csv").files[0];
      return { archivo };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { archivo } = result.value;
      if (!archivo) {
        Swal.fire("Error", "Debes seleccionar un archivo CSV", "error");
        return;
      }

      const formData = new FormData();
      formData.append("file", archivo); // 👈 nombre esperado por multer

      try {
        const response = await fetch(URL_CSV, {
          method: "POST",
          credentials: 'include',
          body: formData,
        });

        if (response.ok) {
          Swal.fire("Éxito", "Alumnos cargados correctamente", "success");
          fetchAlumnos(); // si quieres recargar la tabla/lista
        } else {
          Swal.fire("Error", "Hubo un problema al cargar los alumnos", "error");
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
      }
    }
  });
};

export default ModalCargaAlumnos;
