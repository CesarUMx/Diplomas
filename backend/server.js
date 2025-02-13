const express = require("express");
const authRoutes = require("./routes/auth");
const usuarioRoutes = require("./routes/usuarios");
const plantillaRoutes = require("./routes/plantillas");
const grupoRoutes = require("./routes/grupos");
const dotenv = require("dotenv");

dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Configurar CORS para permitir solicitudes desde el frontend
app.use(
    cors({
        origin: process.env.FRONTEND_URL, // Asegúrate de que FRONTEND_URL está definido en .env
        credentials: true, // Permite enviar cookies
    })
);

app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente.");
});

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/plantillas", plantillaRoutes);
app.use("/grupos", grupoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
