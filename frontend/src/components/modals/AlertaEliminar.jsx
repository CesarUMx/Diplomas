import Swal from "sweetalert2";
import { getBackendURL } from "../../utils/url";

const AlertaEliminar = ({id, endpoint, mensaje, onSuccess}) => {
    console.log(endpoint);
    console.log(id);
    console.log(mensaje);

    const URL = getBackendURL(endpoint);
  
    Swal.fire({
      title: "¿Estás seguro?",
      text: mensaje || "No podrás recuperar este elemento después de eliminarlo.",
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
          const response = await fetch(`${URL}/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            },
          });
  
          if (response.ok) {
            Swal.fire("Eliminado", "Eliminado con éxito.", "success");
            if (onSuccess) onSuccess(); // Refrescar la lista después de eliminar
          } else {
            Swal.fire("Error", "No se pudo eliminar el elemento.", "error");
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo conectar con el servidor." + id + endpoint + mensaje, "error");
        }
      }
    });
  };
  
  export default AlertaEliminar;