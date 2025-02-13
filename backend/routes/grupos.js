const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

//listar grupos
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT g.*, p.nombre as plantilla_nombre 
            FROM grupos g 
            LEFT JOIN plantillas p ON g.id_plantilla = p.id 
            WHERE g.activo = 1
        `);

        if (result[0].length === 0) {
            return res.status(404).json({ mensaje: "No se encontró ningún grupo" });
        }

        res.json(result[0]);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los grupos", error });
    }
});

// crear un grupo
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { nombre, descripcion, id_plantilla } = await req.body;

        console.log(req.body);
   

        if (!nombre || !descripcion) {
            return res.status(400).json({ mensaje: "Los campos nombre y descripcion son obligatorios" });
        }

        const [result] = await db.query(
            "INSERT INTO grupos (nombre, descripcion, id_plantilla) VALUES (?, ?, ?)",
            [nombre, descripcion, id_plantilla || null]
        );

        res.json({ mensaje: "Grupo creado correctamente", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el grupo", error });
    }
});

// actualizar un grupo
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, id_plantilla } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({ mensaje: "Los campos nombre y descripcion son obligatorios" });
        }

        await db.query(
            "UPDATE grupos SET nombre = ?, descripcion = ?, id_plantilla = ? WHERE id = ?",
            [nombre, descripcion, id_plantilla || null, id]
        );

        res.json({ mensaje: "Grupo actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el grupo", error });
    }
});

// eliminar un grupo
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("SELECT * FROM grupos WHERE id = ? AND activo = 1", [id]);

        if (result.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró el grupo" });
        }

        await db.query("UPDATE grupos SET activo = 0 WHERE id = ?", [id]);

        res.json({ mensaje: "Grupo eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el grupo", error });
    }
});

// traer un grupo
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT * FROM grupos WHERE id = ? AND activo = 1", [id]);

        if (result[0].length === 0) {
            return res.status(404).json({ mensaje: "No se encontró el grupo" });
        }

        res.json(result[0]);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el grupo", error });
    }
});

module.exports = router;