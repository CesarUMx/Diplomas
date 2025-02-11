import DataTable from 'react-data-table-component';
import Switch from "react-switch";

const TablaUsuarios = ({ usuarios, onToggleActivo, onToggleAprobado, onToggleRol }) => {
    const columns = [
      { name: "ID", selector: (row) => row.id },
      {
        name: "Avatar",
        cell: (row) => (
          <img src={row.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
        ),
        ignoreRowClick: true,
      },
      { name: "Nombre", selector: (row) => row.nombre },
      { name: "Email", selector: (row) => row.correo },
      {
        name: "Rol",
        cell: (row) => (
          <select value={row.rol_id} onChange={(e) => onToggleRol(row.id, e.target.value)}>
            <option value="1">Administrador</option>
            <option value="2">Usuario</option>
          </select>
        ),
        ignoreRowClick: true,
      },
      {
        name: "Activo",
        cell: (row) => (
          <Switch
            onChange={() => onToggleActivo(row.id, row.activo)}
            checked={row.activo}
            onColor="#4caf50"
            offColor="#f44336"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        ),
        ignoreRowClick: true,
      },
      {
        name: "Aprobado",
        cell: (row) => (
          <Switch
            onChange={() => onToggleAprobado(row.id, row.aprobado)}
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
  
    return (
      <DataTable
        columns={columns}
        data={usuarios}
        pagination
        paginationRowsPerPageOptions={[25, 50, 100]}
        paginationRowsPerPage={25}
        defaultSortFieldId="id"
        defaultSortAsc={false}
        highlightOnHover
      />
    );
  };
  
  export default TablaUsuarios;