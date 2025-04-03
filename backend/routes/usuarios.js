const express = require("express");
const authMiddleware = require("../middleware/auth");
const db = require("../config/db");
const enviarCorreo = require("../models/utils/mailer");

const router = express.Router();

// Obtener todos los usuarios
router.get("/", authMiddleware, async (req, res) => {
    try {
        const usuarios = await db.query(" SELECT * FROM usuarios");
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

        const [usuario] = await db.query("SELECT nombre, correo FROM usuarios WHERE id = ?", [id]);

        await db.query("UPDATE usuarios SET aprobado = ? WHERE id = ?", [aprobado, id]);

        // Enviar correo si el usuario fue aprobado
        if (aprobado && usuario[0]) {
            const asunto = "Aprobación de cuenta de Diplomas";
            const mensaje = `
                <h1>¡Felicidades ${usuario[0].nombre}!</h1>
                <p>Tu cuenta ha sido aprobada. Ya puedes acceder al sistema con tus credenciales.</p>
                <p>Gracias por tu paciencia.</p>
                <p>Ingresa a este enlace para acceder al sistema: <a href="https://diplomas.mondragonmexico.edu.mx/">https://diplomas.mondragonmexico.edu.mx/</a></p>
            `;
            
            await enviarCorreo(usuario[0].correo, asunto, mensaje);
        }

        res.json({ mensaje: "Usuario aprobado" });
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

// actualizar el rol de un usuario
router.put("/:id/rol", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;
        await db.query("UPDATE usuarios SET rol_id = ? WHERE id = ?", [rol, id]);
        res.json({ mensaje: "Usuario actualizado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar usuario", error });
    }
});

        

module.exports = router;
