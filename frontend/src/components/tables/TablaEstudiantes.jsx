import DataTable from 'react-data-table-component';
import { Trash, Edit } from "lucide-react";

const TablaEstudiantes = ({ estudiantes, onEliminar, onEditar }) => {
    const columns = [
      {
        name: "ID",
        selector: (row) => row.id,
      },
      {
        name: "Nombre",
        selector: (row) => row.nombre,
      },
      {
        name: "Acciones",
        cell: (row) => (
          <div className="d-flex justify-content-end">
            <button className="mx-1" onClick={() => onEliminar(row.id)}>
              <Trash size={25} color="#CA1313" />
            </button>
            <button className="mx-1" onClick={() => onEditar(row)}>
              <Edit size={25} color="#FFC300" />
            </button>
          </div>
        ),
        ignoreRowClick: true,
      },
    ];
  
    return (
      <DataTable
        columns={columns}
        data={estudiantes}
        pagination
        paginationRowsPerPageOptions={[25, 50, 100]}
        paginationRowsPerPage={25}
        highlightOnHover
      />
    );
  };
  
  export default TablaEstudiantes;