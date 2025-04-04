const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require("uuid");
const upload = multer({ dest: path.join(__dirname, '../uploads/csv') });
const eliminarPDFsDeGrupo = require("../models/utils/limpieza");

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/empresas');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadImage = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
}).single('imagen');

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
    uploadImage(req, res, async (err) => {
        try {
            if (err) {
                return res.status(400).json({ mensaje: "Error al cargar la imagen", error: err.message });
            }
            const { nombre, descripcion, id_plantilla, fecha, posicion, color, duracion } = req.body;

            if (!nombre || !fecha || !id_plantilla) {
                return res.status(400).json({ mensaje: "Los campos nombre, fecha y plantilla son obligatorios" });
            }

            // Mapeo de campos a insertar
            const fieldsToInsert = {
                nombre,
                descripcion,
                id_plantilla,
                fecha_curso: fecha,
                posicion,
                color,
                duracion,
                imagen_url: req.file ? `/uploads/empresas/${req.file.filename}` : null
            };

            const fields = [];
            const values = [];
            const placeholders = [];

            // Filtrar campos con valores definidos
            Object.entries(fieldsToInsert).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    fields.push(key);
                    values.push(value);
                    placeholders.push('?');
                }
            });

            // Construir y ejecutar la consulta
            const insertQuery = `INSERT INTO grupos (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
            const [result] = await db.query(insertQuery, values);

            res.json({ mensaje: "Grupo creado correctamente", id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al crear el grupo", error });
        }
    });
});

// actualizar un grupo
router.put("/:id", authMiddleware, async (req, res) => {
    uploadImage(req, res, async (err) => {
        try {
            if (err) {
                return res.status(400).json({ mensaje: "Error al cargar la imagen", error: err.message });
            }

            const { id } = req.params;
            const { nombre, descripcion, id_plantilla, fecha, posicion, color, duracion } = req.body;

            if (!nombre || !fecha || !id_plantilla) {
                return res.status(400).json({ mensaje: "Los campos nombre, fecha y plantilla son obligatorios" });
            }

            // Mapeo de campos a actualizar
            const fieldsToUpdate = {
                nombre,
                descripcion,
                id_plantilla,
                fecha_curso: fecha,
                posicion,
                color,
                duracion
            };

            const updateFields = [];
            const updateValues = [];

            // Filtrar campos con valores definidos
            Object.entries(fieldsToUpdate).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(value);
                }
            });

            // Manejar la imagen
            const [currentGroup] = await db.query("SELECT imagen_url FROM grupos WHERE id = ?", [id]);
            let imagen_url = currentGroup[0]?.imagen_url;

            if (req.file) {
                if (imagen_url) {
                    const oldImagePath = path.join(__dirname, '..', imagen_url);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                imagen_url = `/uploads/empresas/${req.file.filename}`;
                updateFields.push('imagen_url = ?');
                updateValues.push(imagen_url);
            }

            // Agregar el ID al final de los valores
            updateValues.push(id);

            // Construir y ejecutar la consulta
            const updateQuery = `UPDATE grupos SET ${updateFields.join(', ')} WHERE id = ?`;
            await db.query(updateQuery, updateValues);

            await eliminarPDFsDeGrupo(id);
            //pdfs a 0
            await db.query("UPDATE grupos SET pdfs =? WHERE id =?", [0, id]);

            res.json({ mensaje: "Grupo actualizado correctamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al actualizar el grupo", error });
        }
    });
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

        await eliminarPDFsDeGrupo(id);
        //pdfs a 0
        await db.query("UPDATE grupos SET pdfs =? WHERE id =?", [0, id]);

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
