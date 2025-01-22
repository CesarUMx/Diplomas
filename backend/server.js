const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Ruta básica
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente.");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
