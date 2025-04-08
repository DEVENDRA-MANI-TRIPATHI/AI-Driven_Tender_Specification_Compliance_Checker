import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
};
