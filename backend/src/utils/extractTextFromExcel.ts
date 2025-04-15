import ExcelJS from "exceljs";

export async function extractTextFromExcel(buffer: Buffer): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  let content = "";

  workbook.eachSheet((sheet) => {
    sheet.eachRow((row) => {
      const values = Array.isArray(row.values)
        ? row.values.slice(1)
        : Object.values(row.values);

      const rowText = values
        .map((cell) => (cell !== null && cell !== undefined ? String(cell).trim() : ""))
        .join(" | ");
      content += rowText + "\n";
    });
  });

  return cleanExcelText(content);
}

function cleanExcelText(text: string): string {
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/[\r\n]+/g, "\n")
    .trim();
}
