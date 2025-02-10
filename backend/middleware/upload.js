const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Directorio donde se almacenarán los SVG
const uploadDir = path.join(__dirname, "../uploads/plantillas");

// Crear la carpeta si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Genera un nombre único
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/svg+xml") {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten archivos SVG"));
        }
    },
});

module.exports = upload;
