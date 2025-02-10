const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

//subir una plantilla
router.post("/", authMiddleware, upload.single("archivo"), async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({ mensaje: "Los campos nombre y descripcion son obligatorios" });
        }

        if (!req.file) {
            return res.status(400).json({ mensaje: "No se ha seleccionado un archivo" });
        }

        //validar que el archivo sea un SVG
        if (!req.file.mimetype.startsWith("image/svg+xml")) {
            return res.status(400).json({ mensaje: "El archivo debe ser un archivo SVG" });
        }

        const archivo_svg = `/uploads/plantillas/${req.file.filename}`;

        const [result] = await db.query(
            "INSERT INTO plantillas (nombre, descripcion, archivo_svg) VALUES (?, ?, ?)",
            [nombre, descripcion, archivo_svg]
        );

        res.json({ mensaje: "Plantilla subida correctamente", id: result.insertId, archivo_svg });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al subir la plantilla", error });
    }
});

//listar plantillas
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM plantillas");

        if (result[0].length === 0) {
            return res.status(404).json({ mensaje: "No se encontró ninguna plantilla" });
        }

        res.json(result[0]);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las plantillas", error });
    }
});

//traer una plantilla
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT * FROM plantillas WHERE id = ?", [id]);

        if (result[0].length === 0) {
            return res.status(404).json({ mensaje: "No se encontró la plantilla" });
        }

        res.json(result[0]);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la plantilla", error });
    }
});

// 🔹 Editar una plantilla específica (Protegido con autenticación)
router.put("/:id", authMiddleware, upload.single("archivo"), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        // Verificar si la plantilla existe
        const [plantilla] = await db.query("SELECT * FROM plantillas WHERE id = ? AND activo = 1", [id]);
        if (plantilla.length === 0) {
            return res.status(404).json({ mensaje: "Plantilla no encontrada o eliminada" });
        }

        if (!nombre || !descripcion) {
            return res.status(400).json({ mensaje: "Los campos nombre y descripcion son obligatorios" });
        }

        let archivo_svg = plantilla[0].archivo_svg; // Mantener el archivo original si no se cambia

        // Si se sube un nuevo archivo, reemplazar el anterior
        if (req.file) {
            archivo_svg = `/uploads/plantillas/${req.file.filename}`;
        }

        // Actualizar la plantilla en la base de datos
        await db.query(
            "UPDATE plantillas SET nombre = ?, descripcion = ?, archivo_svg = ? WHERE id = ?",
            [nombre || plantilla[0].nombre, descripcion || plantilla[0].descripcion, archivo_svg, id]
        );

        res.json({ mensaje: "Plantilla actualizada correctamente", id, archivo_svg });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la plantilla", Error });
    }
});


//eliminar de forma logica una plantilla
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("SELECT * FROM plantillas WHERE id = ? AND activo = 1", [id]);

        if (result.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró la plantilla" });
        }

        await db.query("UPDATE plantillas SET activo = 0 WHERE id = ?", [id]);

        res.json({ mensaje: "Plantilla eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la plantilla", error });
    }
});

module.exports = router;