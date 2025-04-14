import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function sanitizeText(text: string): string {
  return text
    .replace(/Ω|Ω/g, 'Ohm') // Replace Ohm symbols
    .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII
}

export async function generatePDF(result: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const titleSize = 18;
  const margin = 50;
  const rowHeight = 40;
  const linePadding = 5;

  const colWidths = [130, 130, 130, 100]; // 4 columns
  const colX = [
    margin,
    margin + colWidths[0],
    margin + colWidths[0] + colWidths[1],
    margin + colWidths[0] + colWidths[1] + colWidths[2],
  ];

  let y = height - margin;

  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = sanitizeText(text).split(' ');
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
      const testLine = current ? `${current} ${word}` : word;
      const lineWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (lineWidth < maxWidth) {
        current = testLine;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }

    if (current) lines.push(current);
    return lines;
  };

  const checkPageBreak = (lineCount: number) => {
    if (y - lineCount * fontSize - 10 < margin) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - margin;
    }
  };

  const drawTextInCell = (text: string, x: number, maxWidth: number) => {
    const lines = wrapText(text, maxWidth - 2 * linePadding);
    lines.forEach((line, idx) => {
      page.drawText(line, {
        x: x + linePadding,
        y: y - fontSize - idx * fontSize,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
    return lines.length;
  };

  const drawRowWithBorders = (row: string[]) => {
    const lineCounts = row.map((cell, i) =>
      wrapText(cell, colWidths[i] - 2 * linePadding).length
    );
    const maxLines = Math.max(...lineCounts);
    const rowHeightTotal = maxLines * fontSize + 10;

    checkPageBreak(maxLines);

    // Draw cell borders
    for (let i = 0; i < colX.length; i++) {
      page.drawRectangle({
        x: colX[i],
        y: y - rowHeightTotal,
        width: colWidths[i],
        height: rowHeightTotal,
        borderColor: rgb(0.7, 0.7, 0.7),
        borderWidth: 0.5,
      });
    }

    // Draw content
    row.forEach((cell, i) => {
      drawTextInCell(cell, colX[i], colWidths[i]);
    });

    y -= rowHeightTotal;
  };

  // Title
  page.drawText('Compliance Report', {
    x: margin,
    y,
    size: titleSize,
    font,
    color: rgb(0, 0.53, 0.71),
  });
  y -= 30;

  page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
    x: margin,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  if (!result || !result.matchPercentage || !result.summary || !result.comparison) {
    page.drawText('Invalid result object provided.', {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(1, 0, 0),
    });
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  page.drawText(`Match Percentage: ${result.matchPercentage}%`, {
    x: margin,
    y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  const summaryLines = wrapText(result.summary, width - 2 * margin);
  summaryLines.forEach((line) => {
    page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
    y -= fontSize + 2;
  });
  y -= 10;

  page.drawText('Comparison Table:', { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
  y -= 20;

  // Header
  drawRowWithBorders(['Specification', 'Reference', 'User', 'Status']);

  // Data
  result.comparison.forEach((item: any) => {
    drawRowWithBorders([
      item.specification || '',
      item.reference || '',
      item.user || '',
      item.status || '',
    ]);
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
