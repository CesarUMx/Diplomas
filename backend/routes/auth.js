const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Buscar usuario por google_id o correo
                const [rows] = await db.query(
                    "SELECT * FROM usuarios WHERE google_id = ? OR correo = ?",
                    [profile.id, profile.emails[0].value]
                );

                let usuario = null;

                if (rows.length === 0) {
                    // Si no existe, crear usuario desactivado
                    await db.query(
                        "INSERT INTO usuarios (nombre, correo, google_id, avatar, rol_id) VALUES (?, ?, ?, ?, ?)",
                        [
                            profile.displayName,
                            profile.emails[0].value,
                            profile.id,
                            profile.photos[0].value,
                            2, // Rol por defecto: Usuario
                        ]
                    );

                    return done(null, false, { mensaje: "Usuario creado, pero no aprobado" });
                }

                usuario = rows[0];

                // Verificar si el usuario está aprobado
                if (!usuario.aprobado) {
                    return done(null, false, { mensaje: "El usuario no está aprobado" });
                }

                if (!usuario.activo) {
                    return done(null, false, { mensaje: "El usuario esta desactivado" });
                }

                // Generar token JWT con rol
                const token = jwt.sign(
                    {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        avatar: usuario.avatar,
                        rol: usuario.rol_id,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                usuario.token = token;

                return done(null, { ...usuario, token }); 
            } catch (err) {
                console.error("Error en la autenticación con Google:", err);
                return done(err, false);
            }
        }
    )
);

// Ruta para iniciar el flujo de autenticación con Google
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"], // Solicita acceso al perfil y correo del usuario
    })
);

// Ruta para manejar el callback de Google
router.get("/google/callback",(req, res, next) => 
    {
        passport.authenticate("google", { session: false }, (err, usuario, info) => {

            const FRONTEND_URL = process.env.FRONTEND_URL;

            if (err) {
                return res.redirect(`${FRONTEND_URL}/Login?error=${encodeURIComponent("Error en la autenticación.")}`);
            }

            if (!usuario || typeof usuario !== "object") {
                console.log(info);
                // Usuario no aprobado o no autenticado
                return res.redirect(`${FRONTEND_URL}/Login?error=${encodeURIComponent(info?.mensaje || "No se pudo completar la autenticación.")}`);
            }

            // Verificar que el usuario tenga un token
            if (!usuario.token) {
                console.error("Error: Usuario autenticado pero sin token", usuario);
                return res.redirect(`${FRONTEND_URL}/Login?error=${encodeURIComponent("Error generando el token.")}`);
            }

              // Configurar la cookie
                res.cookie('token', usuario.token, {
                    sameSite: 'lax',
                    path: '/',
                    domain: 'diplomas.mondragonmexico.edu.mx',
                    maxAge: 24 * 60 * 60 * 1000
                });

                setTimeout(() => {
                    // Usuario aprobado, redirigir a dashboard
                    res.redirect(`${FRONTEND_URL}`);
                }, 1000);
             
        })(req, res, next);
    }
);

router.get("/me", (req, res) => {
    // Verificar tanto la cookie como el header de autorización
    const token = req.cookies.token
    console.log('Token recibido:', token); // Para debugging

    if (!token) {
        return res.status(401).json({ mensaje: "No autenticado" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.json(payload);
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(401).json({ mensaje: "Token inválido" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        domain: 'diplomas.mondragonmexico.edu.mx',
    });
    res.json({ mensaje: "Logout exitoso" });
});



module.exports = router;
