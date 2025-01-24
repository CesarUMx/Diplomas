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

                if (rows.length === 0) {
                    // Si no existe, crear usuario desactivado
                    await db.query(
                        "INSERT INTO usuarios (nombre, correo, google_id, avatar, rol_id, activo) VALUES (?, ?, ?, ?, ?, ?)",
                        [
                            profile.displayName,
                            profile.emails[0].value,
                            profile.id,
                            profile.photos[0].value,
                            2, // Rol por defecto: Usuario
                            false, // Usuario no aprobado
                        ]
                    );

                    return done(null, false, { mensaje: "Usuario creado, pero no aprobado" });
                }

                const usuario = rows[0];

                // Verificar si el usuario está aprobado
                if (!usuario.activo) {
                    return done(null, false, { mensaje: "El usuario no está aprobado" });
                }

                // Generar token JWT con rol
                const token = jwt.sign(
                    {
                        id: usuario.id,
                        rol: usuario.rol_id,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                return done(null, { ...usuario, token });
            } catch (err) {
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
router.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", { session: false }, (err, usuario, info) => {
            if (err) {
                // Error en la autenticación
                return res.status(500).json({ mensaje: "Error en la autenticación.", error: err });
            }

            if (!usuario) {
                console.log(info);
                // Usuario no aprobado o no autenticado
                return res.status(403).json({
                    mensaje: info?.mensaje || "No se pudo completar la autenticación.",
                });
            }

            // Usuario aprobado
            res.json({ mensaje: "Login exitoso", token: usuario.token });
        })(req, res, next);
    }
);



module.exports = router;
