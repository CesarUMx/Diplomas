const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();

// Crear el transporter con la configuración de correo
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Cambiado a false para puerto 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
    },
    debug: true
});

// Verificar la configuración con más detalles de error
transporter.verify(function(error, success) {
    if (error) {
        console.log('Detalles de configuración SMTP:');
        console.log('Host:', process.env.SMTP_HOST);
        console.log('Puerto:', process.env.SMTP_PORT);
        console.log('Usuario:', process.env.SMTP_USER);
        console.log('Error completo:', error);
    } else {
        console.log('Servidor está listo para enviar correos');
    }
});

/**
 * Envía un correo electrónico
 * @param {string} destinatario - Correo del destinatario
 * @param {string} asunto - Asunto del correo
 * @param {string} contenidoHTML - Contenido HTML del correo
 */
async function enviarCorreo(destinatario, asunto, contenidoHTML) {
    try {
        const info = await transporter.sendMail({
            from: `"Sistema de Diplomas" <${process.env.SMTP_USER}>`,
            to: destinatario,
            subject: asunto,
            html: contenidoHTML
        });

        console.log('Correo enviado:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return false;
    }
}

module.exports = enviarCorreo;