const puppeteer = require("puppeteer");

async function convertirSVGaPDF(svgString) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(svgString, { waitUntil: "networkidle0" });

  // Obtener tamaño real del SVG
  const elementHandle = await page.$("svg");
  const boundingBox = await elementHandle.boundingBox();

  const pdfBuffer = await page.pdf({
    printBackground: true,
    width: `${boundingBox.width}px`,
    height: `${boundingBox.height}px`,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = convertirSVGaPDF;
