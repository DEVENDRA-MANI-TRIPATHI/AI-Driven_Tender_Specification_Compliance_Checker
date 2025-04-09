import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generatePDF(result: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lineHeight = 16;
  const margin = 50;
  let y = height - margin;

  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const lineWithWord = currentLine + (currentLine ? " " : "") + word;
      const lineWidth = font.widthOfTextAtSize(lineWithWord, fontSize);
      if (lineWidth < maxWidth) {
        currentLine = lineWithWord;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const drawLine = (text: string) => {
    if (y < margin) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - margin;
    }
    page.drawText(text, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  };

  // Draw title
  page.drawText("Compliance Report", {
    x: margin,
    y,
    size: 18,
    font,
    color: rgb(0, 0.53, 0.71),
  });
  y -= 30;

  drawLine(`Generated on: ${new Date().toLocaleString()}`);
  y -= 10;

  drawLine("Comparison Summary:");
  y -= 5;

  for (const key in result) {
    const value = result[key];

    if (typeof value === "string") {
      drawLine(`${key}:`);
      const lines = wrapText(value, width - margin * 2);
      lines.forEach(drawLine);
    } else if (Array.isArray(value)) {
      drawLine(`${key}:`);
      value.forEach((item: string) => {
        const lines = wrapText(`- ${item}`, width - margin * 2);
        lines.forEach(drawLine);
      });
    } else if (typeof value === "object" && value !== null) {
      drawLine(`${key}:`);
      for (const subKey in value) {
        const subValue = value[subKey];
        if (Array.isArray(subValue)) {
          drawLine(`  ${subKey}:`);
          subValue.forEach((item: string) => {
            const lines = wrapText(`    - ${item}`, width - margin * 2);
            lines.forEach(drawLine);
          });
        }
      }
    }

    y -= 10;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
