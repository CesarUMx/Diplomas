-- Crear la tabla de roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Insertar roles iniciales
INSERT INTO roles (nombre) VALUES ('Administrador'), ('Usuario');

-- Crear la tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,          -- Nombre del usuario
    correo VARCHAR(255) UNIQUE NOT NULL,   -- Email (proporcionado por Google)
    google_id VARCHAR(255) UNIQUE,         -- ID único del usuario proporcionado por Google
    avatar VARCHAR(255),                   -- URL del avatar del usuario
    rol_id INT DEFAULT 2,                  -- Rol del usuario (2 = Usuario por defecto)
    activo BOOLEAN DEFAULT FALSE,          -- Si el usuario está aprobado por el administrador
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

