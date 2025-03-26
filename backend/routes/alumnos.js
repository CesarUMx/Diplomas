const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require("uuid");

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { nombre, id_grupo } = await req.body;
        const uuid = uuidv4();

        if (!nombre) {
            return res.status(400).json({ mensaje: "El nombre es obligatorio" });
        }

        const [result] = await db.query(
            "INSERT INTO estudiantes (nombre, id_grupo, uuid_qr) VALUES (?, ?, ?)",
            [nombre, id_grupo, uuid]
        );

        res.json({ mensaje: "Alumno creado correctamente", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el alumno", error });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, id_grupo } = req.body;

        if (!nombre) {
            return res.status(400).json({ mensaje: "El nombre es obligatorio" });
        }

        await db.query(
            "UPDATE estudiantes SET nombre = ?, id_grupo = ? WHERE id = ?",
            [nombre, id_grupo || null, id]
        );

        res.json({ mensaje: "Alumno actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el alumno", error });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("SELECT * FROM estudiantes WHERE id = ? AND activo = 1", [id]);

        if (result.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró el alumno" });
        }

        await db.query("UPDATE estudiantes SET activo = 0 WHERE id = ?", [id]);

        res.json({ mensaje: "Alumno eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el alumno", error });
    }
});

module.exports = router;