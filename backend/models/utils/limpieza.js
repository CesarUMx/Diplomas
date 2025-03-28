const fs = require("fs/promises");
const path = require("path");

/**
 * Elimina todos los archivos PDF dentro de la carpeta del grupo.
 * @param {number|string} grupoId - ID del grupo
 */
async function eliminarPDFsDeGrupo(grupoId) {
  const carpeta = path.join(__dirname, "../../uploads/diplomas", String(grupoId));

  try {
    // Verificar si la carpeta existe
    const archivos = await fs.readdir(carpeta);

    // Eliminar solo los archivos .pdf
    for (const archivo of archivos) {
      if (archivo.endsWith(".pdf")) {
        await fs.unlink(path.join(carpeta, archivo));
      }
    }

    console.log(`PDFs eliminados del grupo ${grupoId}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`Carpeta del grupo ${grupoId} no existe (aún). Nada que borrar.`);
    } else {
      console.error("Error al eliminar PDFs del grupo:", error);
    }
  }
}

module.exports = eliminarPDFsDeGrupo;
