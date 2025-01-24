const express = require("express");
const authMiddleware = require("../middleware/auth");
const verificarRol = require("../middleware/roles");

const router = express.Router();

// Ruta básica para /usuarios
router.get("/", (req, res) => {
    res.send("Ruta de usuarios funcionando correctamente.");
});

// Ruta solo para administradores
router.get("/admin", authMiddleware, verificarRol(["Administrador"]), (req, res) => {
    res.json({ mensaje: "Bienvenido, Administrador" });
});

// Ruta para todos los usuarios autenticados
router.get("/usuario", authMiddleware, (req, res) => {
    res.json({ mensaje: "Bienvenido, Usuario autenticado" });
});

module.exports = router;
