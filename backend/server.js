const express = require("express");
const authRoutes = require("./routes/auth");
const usuarioRoutes = require("./routes/usuarios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente.");
});

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
