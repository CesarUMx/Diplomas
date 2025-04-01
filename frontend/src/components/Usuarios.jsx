import useVerificarRol from "../hooks/verificarRol";
import { useState } from "react";
import { getBackendURL } from "../utils/url";
import Loader from "./others/Loader";
import { Search } from "lucide-react";
import useFetchData from "../hooks/useFetchData";
import TablaUsuarios from "./tables/TablaUsuarios";

const UsuariosC = () => {
  const { rol, rolLoading, permitido } = useVerificarRol([1]);
  const { data: usuarios, fetchData, loading } = useFetchData("/usuarios");
  const [filtro, setFiltro] = useState("");

  const URL_USUARIOS = getBackendURL("/usuarios");

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleToggleActivo = async (id, estadoActual) => {
      try {
          await fetch(`${URL_USUARIOS}/${id}/desactivar`, {
              method: "PUT",
              credentials: "include",
              headers: {
                'Content-Type': 'application/json'
               },
              body: JSON.stringify({ desactivado: !estadoActual }),
          });
          fetchData();
      } catch (error) {
          console.error("Error al actualizar usuario:", error);
      }
  };

  const handleToggleAprobado = async (id, estadoActual) => {
      try {
          await fetch(`${URL_USUARIOS}/${id}/aprobar`, {
              method: "PUT",
              credentials: "include",
              headers: {
                'Content-Type': 'application/json'
                },
              body: JSON.stringify({ aprobado: !estadoActual }),
          });
          fetchData();
      } catch (error) {
          console.error("Error al actualizar usuario:", error);
      }
  };

  const handleToggleRol = async (id, rol) => {
      try {
          await fetch(`${URL_USUARIOS}/${id}/rol`, {
              method: "PUT",
              credentials: "include",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ rol }),
          });
          fetchData();
      } catch (error) {
          console.error("Error al actualizar usuario:", error);
      }
  };

  if (rolLoading || loading) return (<Loader />);
  if (!permitido) return <p>No tienes permisos para acceder a esta página.</p>;

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between border-b border-gray-300 pb-1">
        <h1 className="text-2xl font-bold mb-0 flex-1 ">Gestión de Usuarios</h1>

        <div className="flex items-center gap-3 bg-blue-900 rounded-md px-4 py-2">
          <Search size={22} color="#fff" />
          <input
            type="text"
            className="form-control w-full rounded-md border-gray-300 px-6 py-1 text-md"
            placeholder="Buscar por nombre o correo..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
        </div>

      </div>
      <TablaUsuarios
        usuarios={usuariosFiltrados}
        onToggleActivo={handleToggleActivo}
        onToggleAprobado={handleToggleAprobado}
        onToggleRol={handleToggleRol}
      />
    </div>
    );
};

export default UsuariosC;