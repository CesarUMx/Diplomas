const express = require("express");
const authMiddleware = require("../middleware/auth");
const verificarRol = require("../middleware/roles");

const router = express.Router();

// Ruta básica para /usuarios
router.get("/", authMiddleware, (req, res) => {
    res.send("Ruta de usuarios funcionando correctamente.");
});


module.exports = router;
