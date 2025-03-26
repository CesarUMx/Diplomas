const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

const upload = multer({ dest: path.join(__dirname, '../uploads/csv') });

const FRONTEND_URL = process.env.FRONTEND_URL;

//listar grupos
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT g.*, p.nombre as plantilla_nombre 
            FROM grupos g 
            LEFT JOIN plantillas p ON g.id_plantilla = p.id 
            WHERE g.activo = 1
        `);

        if (result[0].length === 0) {
            return res.status(404).json({ mensaje: "No se encontró ningún grupo" });
        }

        res.json(result[0]);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los grupos", error });
    }
});

// crear un grupo
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { nombre, descripcion, id_plantilla } = await req.body;

        console.log(req.body);
   

        if (!nombre || !descripcion) {
            return res.status(400).json({ mensaje: "Los campos nombre y descripcion son obligatorios" });
        }

        const [result] = await db.query(
            "INSERT INTO grupos (nombre, descripcion, id_plantilla) VALUES (?, ?, ?)",
            [nombre, descripcion, id_plantilla || null]
        );

        res.json({ mensaje: "Grupo creado correctamente", id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al crear el grupo", error });
    }
});

// actualizar un grupo
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, id_plantilla } = req.body;

        if (!nombre || !descripcion) {
            return res.status(400).json({ mensaje: "Los campos nombre y descripcion son obligatorios" });
        }

        await db.query(
            "UPDATE grupos SET nombre = ?, descripcion = ?, id_plantilla = ? WHERE id = ?",
            [nombre, descripcion, id_plantilla || null, id]
        );

        res.json({ mensaje: "Grupo actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el grupo", error });
    }
});

// eliminar un grupo
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("SELECT * FROM grupos WHERE id = ? AND activo = 1", [id]);

        if (result.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró el grupo" });
        }

        await db.query("UPDATE grupos SET activo = 0 WHERE id = ?", [id]);

        res.json({ mensaje: "Grupo eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al eliminar el grupo", error });
    }
});

// traer un grupo
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        // Obtener el grupo
        const grupoResult = await db.query("SELECT * FROM grupos WHERE id = ? AND activo = 1", [id]);

        if (grupoResult[0].length === 0) {
        return res.status(404).json({ mensaje: "No se encontró el grupo" });
        }

        const grupo = grupoResult[0][0];

        // Obtener los alumnos del grupo
        const alumnosResult = await db.query("SELECT * FROM estudiantes WHERE id_grupo = ? AND activo = 1", [id]);
        const alumnos = alumnosResult[0];

        // Generar el QR base64 para cada alumno
        for (let alumno of alumnos) {
            if (alumno.uuid_qr) {
            const url = `${FRONTEND_URL}/validar/${alumno.uuid_qr}`;
            alumno.qr_base64 = await QRCode.toDataURL(url, { width: 200 });
            }
        }

        // Responder con grupo + alumnos
        res.json({
        ...grupo,
        alumnos
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el grupo", error });
    }
});

router.post('/:id/cargar-csv', authMiddleware, upload.single('file'), async (req, res) => {
    const grupoId = req.params.id;
    console.log("Grupo ID:", grupoId); // 👈 Asegúrate que tiene valor
  
    if (!req.file) {
      return res.status(400).json({ mensaje: "Archivo CSV no proporcionado" });
    }
  
    const results = [];
  
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        const keys = Object.keys(data);
        const nombreKey = keys.find(k => k.trim().toLowerCase().includes('nombre'));
        const nombre = data[nombreKey];
        const uuid = uuidv4();
        if (nombre) {
            results.push([nombre, grupoId, uuid]);
        }
    })
    .on('end', async () => {
        try {
        fs.unlinkSync(req.file.path); // Limpia archivo temporal

        if (results.length === 0) {
            return res.status(400).json({ mensaje: "El archivo CSV no contiene nombres válidos" });
        }

        const query = "INSERT INTO estudiantes (nombre, id_grupo, uuid_qr) VALUES ?";
        await db.query(query, [results]);

        res.json({ mensaje: "Estudiantes cargados correctamente", total: results.length });
        } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al insertar estudiantes", error });
        }
    });
});

module.exports = router;