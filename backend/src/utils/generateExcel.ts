import ExcelJS from "exceljs";

interface ComparisonItem {
  specification: string;
  reference: string;
  user: string;
  status: "Compliant" | "Partially Compliant" | "Non-Compliant";
}

interface ComparisonResult {
  summary?: string;
  complianceStatus?: string;
  matchPercentage?: number;
  comparison?: ComparisonItem[];
}

function sanitize(text: string): string {
  return text.replace(/Ω|Ω/g, "Ohm").replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII
}

export const generateExcelBuffer = async (
  result: ComparisonResult
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Compliance Report", {
    properties: { tabColor: { argb: "FF1F497D" } },
  });

  // Column setup
  sheet.columns = [
    { header: "Specification", key: "specification", width: 40 },
    { header: "Reference", key: "reference", width: 40 },
    { header: "User", key: "user", width: 40 },
    { header: "Status", key: "status", width: 20 },
  ];

  // Title
  const titleRow = sheet.addRow(["Compliance Report"]);
  sheet.mergeCells(`A${titleRow.number}:D${titleRow.number}`);
  titleRow.font = { size: 16, bold: true };
  sheet.addRow([]);

  // Metadata
  sheet.addRow(["Generated On", new Date().toLocaleString()]);
  if (result.complianceStatus)
    sheet.addRow(["Compliance Status", sanitize(result.complianceStatus)]);
  if (result.matchPercentage !== undefined)
    sheet.addRow(["Match Percentage", `${result.matchPercentage}%`]);
  sheet.addRow([]);

  // Summary
  if (result.summary) {
    const summaryRow = sheet.addRow(["Summary"]);
    summaryRow.font = { bold: true };
    sheet.addRow([sanitize(result.summary)]);
    sheet.addRow([]);
  }

  // Section header
  const compHeader = sheet.addRow([
    "Specification",
    "Reference",
    "User",
    "Status",
  ]);
  compHeader.font = { bold: true };
  compHeader.alignment = { horizontal: "center" };

  // Comparison rows
  if (result.comparison && result.comparison.length > 0) {
    result.comparison.forEach((item) => {
      sheet.addRow([
        sanitize(item.specification),
        sanitize(item.reference),
        sanitize(item.user),
        item.status,
      ]);
    });
  }

  // Style: Borders and alignment
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { vertical: "middle", wrapText: true };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
