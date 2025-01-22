const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());


// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Error de conexión a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos");
});

// Ruta básica
app.get("/", (req, res) => {
    db.query("SELECT 'Hola desde la base de datos' AS mensaje", (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error en la consulta");
            return;
        }
        res.json(results[0]);
    });
});

app.get("/test", (req, res) => {
    res.json({ mensaje: "Conexión exitosa al backend" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
