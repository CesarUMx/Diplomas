const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const generarSVGPersonalizado = require('../models/utils/svgGenerator');
const fsp = require("fs/promises");
const fs = require("fs");
const path = require("path");
const convertirSVGaPDF = require("../models/utils/svgToPdf");
const archiver = require("archiver");

router.post("/:id/generar", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Obtener grupo
        const [grupoRows] = await db.query("SELECT * FROM grupos WHERE id = ?", [id]);
        if (grupoRows.length === 0) return res.status(404).json({ mensaje: "Grupo no encontrado" });
        const grupo = grupoRows[0];

        // 2. Obtener plantilla del grupo
        const [plantillaRows] = await db.query("SELECT * FROM plantillas WHERE id = ?", [grupo.id_plantilla]);
        if (plantillaRows.length === 0) return res.status(404).json({ mensaje: "Plantilla no encontrada" });
        const plantilla = plantillaRows[0];

        // 3. Obtener alumnos del grupo
        const [alumnosRows] = await db.query("SELECT * FROM estudiantes WHERE id_grupo = ? AND activo = 1", [id]);
        if (alumnosRows.length === 0) return res.status(400).json({ mensaje: "Este grupo no tiene alumnos" });

        // 4. Crear carpeta del grupo
        const carpetaDestino = path.join(__dirname, "..", "uploads", "diplomas", String(id));
        await fsp.mkdir(carpetaDestino, { recursive: true });

        // 5. Generar PDF por alumno
        for (const alumno of alumnosRows) {
        const svg = await generarSVGPersonalizado(alumno, grupo, plantilla.archivo_svg);
        if (!svg) continue;

        const pdfBuffer = await convertirSVGaPDF(svg);
        const nombreArchivo = alumno.nombre.replace(/ /g, "_") + ".pdf";
        const rutaPDF = path.join(carpetaDestino, nombreArchivo);

        await fsp.writeFile(rutaPDF, pdfBuffer);
        }

        await db.query("UPDATE grupos SET pdfs = ? WHERE id = ?", [1, id]);

        res.json({ mensaje: "Todos los diplomas fueron generados correctamente." });

        } catch (error) {
            console.error("Error al generar diploma:", error);
            res.status(500).json({ mensaje: "Error interno al generar diploma", error });
        }
    });

router.get("/:id/descargar", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const carpeta = path.join(__dirname, "..", "uploads", "diplomas", String(id));

    // Verifica si la carpeta existe
    if (!fs.existsSync(carpeta)) {
        return res.status(404).json({ mensaje: "No existen diplomas generados para este grupo" });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="grupo_${id}_diplomas.zip"`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    archive.directory(carpeta, false);
    archive.finalize();
});

module.exports = router;