const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Leer la cookie con el token
    if (!token) {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
        req.user = decoded; // Guardar los datos del usuario en la solicitud
        next(); // Continuar al siguiente middleware
    } catch (err) {
        return res.status(403).json({ mensaje: "Token inválido" });
    }
};

module.exports = authMiddleware;
