import ExcelJS from 'exceljs';

interface ComparisonResult {
  summary?: string;
  complianceStatus?: string;
  matchPercentage?: number;
  details?: {
    compliant?: string[];
    nonCompliant?: string[];
    partiallyCompliant?: string[];
  };
}

export const generateExcelBuffer = async (
  result: ComparisonResult
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Compliance Report');

  // Title
  sheet.addRow(['Compliance Report']);
  sheet.mergeCells('A1:D1');
  sheet.getCell('A1').font = { size: 16, bold: true };
  sheet.addRow([]);

  // Metadata
  sheet.addRow(['Generated On', new Date().toLocaleString()]);
  if (result.complianceStatus)
    sheet.addRow(['Compliance Status', result.complianceStatus]);
  if (result.matchPercentage !== undefined)
    sheet.addRow(['Match Percentage', `${result.matchPercentage}%`]);
  sheet.addRow([]);

  // Summary
  if (result.summary) {
    sheet.addRow(['Summary']);
    sheet.getRow(sheet.lastRow!.number).font = { bold: true };
    sheet.addRow([result.summary]);
    sheet.addRow([]);
  }

  // Section Helper
  const addSection = (title: string, items?: string[]) => {
    if (!items?.length) return;
    sheet.addRow([title]);
    sheet.getRow(sheet.lastRow!.number).font = { bold: true };
    items.forEach((item) => {
      sheet.addRow([`- ${item}`]);
    });
    sheet.addRow([]);
  };

  addSection('✅ Compliant', result.details?.compliant);
  addSection('❌ Non-Compliant', result.details?.nonCompliant);
  addSection('⚠️ Partially Compliant', result.details?.partiallyCompliant);

  // Generate Buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
