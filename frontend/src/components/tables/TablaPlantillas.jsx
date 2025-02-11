import DataTable from 'react-data-table-component';
import { Trash, Edit } from "lucide-react";

const TablaPlantillas = ({ plantillas, fetchData, onEditar, onEliminar }) => {
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
        name: "Descripción",
        selector: (row) => row.descripcion,
      },
      {
        name: "Archivo SVG",
        cell: (row) => (
          <a href={row.archivo_svg} target="_blank" rel="noopener noreferrer">
            Ver SVG
          </a>
        ),
      },
      {
        name: "Acciones",
        cell: (row) => (
          <div className="d-flex justify-content-end">
            <button className="mx-1" onClick={() => onEditar(row, fetchData)}>
              <Edit size={25} color="#FFC300" />
            </button>
            <button className="mx-1" onClick={() => onEliminar(row.id)}>
              <Trash size={25} color="#CA1313" />
            </button>
          </div>
        ),
        ignoreRowClick: true,
      },
    ];
  
    return (
      <DataTable
        columns={columns}
        data={plantillas}
        pagination
        paginationRowsPerPageOptions={[25, 50, 100]}
        paginationRowsPerPage={25}
        highlightOnHover
      />
    );
  };
  
  export default TablaPlantillas;