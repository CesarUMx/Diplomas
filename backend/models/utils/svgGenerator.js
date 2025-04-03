const fs = require("fs/promises");
const path = require("path");
const cheerio = require("cheerio");
const QRCode = require("qrcode");

/**
 * Genera un SVG personalizado para un alumno a partir de una plantilla.
 * @param {Object} alumno - Objeto con los datos del alumno (debe tener nombre y uuid_qr).
 * @param {Object} grupo - Objeto con los datos del grupo (debe tener nombre).
 * @param {String} archivoSVG - Nombre del archivo SVG de la plantilla (ej. "plantilla1.svg").
 * @returns {String|null} El SVG personalizado como string, o null si hubo error.
 */
async function generarSVGPersonalizado(alumno, grupo, archivoSVG) {
  try {
    const ruta = path.resolve(__dirname, "../../uploads/plantillas", archivoSVG);
    const contenidoSVG = await fs.readFile(ruta, "utf8");

    const $ = cheerio.load(contenidoSVG, { xmlMode: true });

    // Reemplazar nombre del alumno
    $("#nombre").text(alumno.nombre);

    // Reemplazar nombre del grupo/curso
    $("#titulo").text(grupo.nombre);

    // Buscar <rect id="qr"> para extraer su posición
    const rectQR = $("#qr");
    if (rectQR.length) {
      const x = rectQR.attr("x") || "0";
      const y = rectQR.attr("y") || "0";
      const width = rectQR.attr("width") || "70";
      const height = rectQR.attr("height") || "70";

      // Eliminar el <rect>
      rectQR.remove();

      // Generar el QR base64 con uuid del alumno
      const FRONTEND_URL = process.env.FRONTEND_URL;
      const qrUrl = `${FRONTEND_URL}/validar/${alumno.uuid_qr}`;

      const qrOptions = {
        width: parseInt(width),
        color: {
          dark: '#004987',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'Q',
        margin: 3,
        quality: 1.0,
      };

      const qrBase64 = await QRCode.toDataURL(qrUrl, qrOptions);

      const logoPath = path.resolve(__dirname, "../../uploads/empresas/logo.jpg");
      const logoBase64 = await fs.readFile(logoPath)
        .then(buffer => `data:image/png;base64,${buffer.toString('base64')}`)
        .catch(err => {
          console.error('Error loading logo:', err);
          return null;
        });

      // Insertar imagen en lugar del QR
      const qrImg = `
      <g>
        <image href="${qrBase64}" x="${x}" y="${y}" width="${width}" height="${height}" />
        <image 
            href="${logoBase64}"
            x="${Number(x) + (Number(width) - Number(width)/5)/2}" 
            y="${Number(y) + (Number(height) - Number(height)/5)/2}" 
            width="${Number(width)/5}" 
            height="${Number(height)/5}"
          />
      </g>  
      `;
      $("svg").append(qrImg);
    }

    return $.xml();
  } catch (error) {
    console.error("Error en generarSVGPersonalizado:", error);
    return null;
  }
}

module.exports = generarSVGPersonalizado;
