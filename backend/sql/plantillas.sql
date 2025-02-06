CREATE TABLE plantillas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    archivo_svg TEXT NOT NULL, -- Ruta del archivo SVG
    activo TINYINT(1) DEFAULT 1, -- 1 = Activo, 0 = Inactivo (borrado lógico)
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
