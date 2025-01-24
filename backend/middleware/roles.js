const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const { rol } = req.user; // El rol se incluye en el token JWT
        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({ mensaje: "Acceso denegado" });
        }
        next(); // Continuar si el rol es permitido
    };
};

module.exports = verificarRol;
