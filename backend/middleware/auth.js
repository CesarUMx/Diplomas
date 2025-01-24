const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del header
    if (!token) {
        return res.status(403).json({ mensaje: "Token no proporcionado" });
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
