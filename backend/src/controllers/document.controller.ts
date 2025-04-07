import { Request, Response } from "express";
import { compareDocuments } from "../utils/gemini";

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
