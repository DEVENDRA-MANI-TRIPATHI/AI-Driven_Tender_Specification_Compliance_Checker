import { Request, Response } from "express";
import { compareDocuments } from "../utils/gemini";
import fs from "fs";
import { extractTextFromPDF } from "../utils/pdf-parser";
import { generatePDF } from "../utils/pdf-generator";
import { generateExcelBuffer } from '../utils/generateExcel';
import { getComparisonResult, setComparisonResult } from "../store/comparisionResult.store";


export const uploadAndExtract = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const referenceFile = files["referenceFile"]?.[0];
    const userFile = files["userFile"]?.[0];

    if (!referenceFile || !userFile) {
      res.status(400).json({ error: "Both PDF files are required." });
      return;
    }

    const referenceBuffer = fs.readFileSync(referenceFile.path);
    const userBuffer = fs.readFileSync(userFile.path);

    const referenceText = await extractTextFromPDF(referenceBuffer);
    const userText = await extractTextFromPDF(userBuffer);

    fs.unlinkSync(referenceFile.path);
    fs.unlinkSync(userFile.path);

    const comparisonResult = await compareDocuments(userText, referenceText);
    setComparisonResult(comparisonResult);
    
    

    res.status(200).json({
      referenceText,
      userText,
      comparisonResult,
      message: "Files uploaded and text extracted successfully",
    });
  } catch (error: any) {
    console.error("Error extracting PDF:", error.message);
    res.status(500).json({ error: "Error while extracting PDF text." });
  }
};

export const compareDocsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userDoc, referenceDoc } = req.body;

    if (!userDoc || !referenceDoc) {
      res.status(400).json({
        error: "Both userDoc and referenceDoc are required in the request body.",
      });
      return;
    }

    const result = await compareDocuments(userDoc, referenceDoc);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Comparison error:", error.message);
    res.status(500).json({
      success: false,
      error: "An error occurred while comparing the documents.",
    });
  }
};




export const downloadReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const format = req.query.format;
    const result=getComparisonResult()

    if (format === "pdf") {
      const pdfBuffer = await generatePDF(result);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=report.pdf");
      res.send(pdfBuffer);
      return;
    }

    if (format === "excel") {
      const excelBuffer = await generateExcelBuffer(result);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
      res.send(excelBuffer);
      return;
    }

    res.status(400).json({ error: "Invalid format. Use 'pdf' or 'excel'." });
  } catch (error: any) {
    console.error("Download error:", error.message);
    res.status(500).json({ error: "Failed to generate report." });
  }
};