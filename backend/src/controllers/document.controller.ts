import { Request, Response } from "express";
import { compareDocuments } from "../utils/gemini";
import fs from "fs";
import { extractTextFromPDF } from "../utils/pdf-parser";


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

    res.status(200).json({
      referenceText,
      userText,
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

