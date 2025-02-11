import DataTable from 'react-data-table-component';
import { Trash, Edit } from "lucide-react";
import { getArchivoURL } from "../../utils/url";

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
        cell: row => (
            <div className="flex justify-center">
              <img
                src={getArchivoURL(row.archivo_svg.split("/").pop())} // Extrae el nombre del archivo y genera la URL
                className="w-16 h-auto border rounded-md"
                alt="Previsualización SVG"
              />
            </div>
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