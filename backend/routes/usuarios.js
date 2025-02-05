const express = require("express");
const authMiddleware = require("../middleware/auth");
const verificarRol = require("../middleware/roles");
const db = require("../config/db");

const router = express.Router();

// Obtener todos los usuarios
router.get("/", authMiddleware, async (req, res) => {
    try {
        const usuarios = await db.query("SELECT * FROM usuarios");
        res.json(usuarios[0]);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuarios", error });
    }
    
});

// Aprobar o desaprobar un usuario
router.put("/:id/aprobar", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { aprobado } = req.body;
        await db.query("UPDATE usuarios SET aprobado = ? WHERE id = ?", [aprobado, id]);
        res.json({ mensaje: "Usuario actualizado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar usuario", error });
    }
});

// desactivar o activar un usuario
router.put("/:id/desactivar", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { desactivado } = req.body;
        await db.query("UPDATE usuarios SET activo = ? WHERE id = ?", [desactivado, id]);
        res.json({ mensaje: "Usuario actualizado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar usuario", error });
    }
});

        

module.exports = router;
