const express = require("express");
const authRoutes = require("./routes/auth");
const usuarioRoutes = require("./routes/usuarios");
const plantillaRoutes = require("./routes/plantillas");
const grupoRoutes = require("./routes/grupos");
const alumnosRoutes = require("./routes/alumnos");
const diplomasRoutes = require("./routes/diplomas");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/uploads/empresas', express.static(path.join(__dirname, 'uploads/empresas')));

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
app.use("/alumnos", alumnosRoutes);
app.use("/diplomas", diplomasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto:${PORT}`);
});
