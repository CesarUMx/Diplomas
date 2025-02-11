import useVerificarRol from "../hooks/verificarRol";
import { useEffect, useState } from "react";
import { getBackendURL } from "../utils/url";
import DataTable from 'react-data-table-component';
import Loader from "./Loader";
import Switch from "react-switch";
import { Search } from "lucide-react";

const UsuariosC = () => {
  // Hook personalizado
  const { rol, loading, permitido } = useVerificarRol([1]);

  // Estado para los usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const URL_USUARIOS = getBackendURL("/usuarios");

  const columns = [
    { name: 'ID',selector: row => row.id,},
    { name: 'Avatar',
      cell: row => (
          <img src={row.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
      ),
      ignoreRowClick: true,
    },
    { name: 'Nombre', selector: row => row.nombre,},
    { name: 'Email', selector: row => row.correo,},
    { name: 'Rol',
      cell: row => ( 
          <select value={row.rol_id} onChange={e => handleToggleRol(row.id, e.target.value)}>
            <option value="1">Administrador </option>
            <option value="2">Usuario </option>
          </select>
      ),
      ignoreRowClick: true,
    },
    { name: "Activo",
      cell: row => (
          <Switch
              onChange={() => handleToggleActivo(row.id, row.activo)}
              checked={row.activo}
              onColor="#4caf50"
              offColor="#f44336"
              uncheckedIcon={false}
              checkedIcon={false}
          />
      ),
      ignoreRowClick: true,
    },
    { name: "Aprobado",
      cell: row => (
          <Switch
              onChange={() => handleToggleAprobado(row.id, row.aprobado)}
              checked={row.aprobado}
              onColor="#2196f3"
              offColor="#bdbdbd"
              uncheckedIcon={false}
              checkedIcon={false}
          />
      ),
      ignoreRowClick: true,
    },
  ];

  // Efecto para obtener los usuarios
  useEffect(() => {
    if (permitido && !loading) {  // Solo ejecutar si está permitido y no está cargando
      fetchUsuarios();
    }
  }, [permitido, loading, URL_USUARIOS]);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(URL_USUARIOS, {
        credentials: "include",
      });
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleToggleActivo = async (id, estadoActual) => {
      try {
          const response = await fetch(URL_USUARIOS + "/" + id + "/desactivar", {
              method: "PUT",
              credentials: "include",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ desactivado: !estadoActual }),
          });
          const data = await response.json();
          fetchUsuarios();
      } catch (error) {
          console.error("Error al actualizar usuario:", error);
      }
  };

  const handleToggleAprobado = async (id, estadoActual) => {
      try {
          const response = await fetch(URL_USUARIOS + "/" + id + "/aprobar", {
              method: "PUT",
              credentials: "include",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ aprobado: !estadoActual }),
          });
          const data = await response.json();
          fetchUsuarios();
      } catch (error) {
          console.error("Error al actualizar usuario:", error);
      }
  };

  // actualizar el rol de un usuario
  const handleToggleRol = async (id, rol) => {
      try {
          const response = await fetch(URL_USUARIOS + "/" + id + "/rol", {
              method: "PUT",
              credentials: "include",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ rol }),
          });
          const data = await response.json();
          fetchUsuarios();
      } catch (error) {
          console.error("Error al actualizar usuario:", error);
      }
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(filtro.toLowerCase())
  );

  // Cargando o sin permisos
  if (loading) return (<Loader />);
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

      <DataTable
        columns={columns}
        data={usuariosFiltrados}
        progressPending={loading}
        progressComponent={<span className="loading loading-dots loading-lg text-info"></span>}
        pagination
        paginationRowsPerPageOptions={[25, 50, 100]}
        paginationRowsPerPage={25}
        defaultSortFieldId="id"          // 📊 Ordenar por defecto por ID
        defaultSortAsc={false}           // 📉 Orden descendente por defecto
        highlightOnHover
        />
    </div>
    );
};

export default UsuariosC;
