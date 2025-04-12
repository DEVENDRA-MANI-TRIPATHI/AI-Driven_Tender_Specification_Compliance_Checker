import { Request, Response } from "express";
import ComparisonModel from "../models/comparison.model";

export const addFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { comparisonId } = req.params;
      const { specification, reason } = req.body;
  
      if (!specification || !reason) {
        res.status(400).json({ error: "Specification and reason are required." });
        return;
      }
  
      const comparison = await ComparisonModel.findById(comparisonId);
      if (!comparison) {
        res.status(404).json({ error: "Comparison not found." });
        return;
      }
  
      const item = comparison.comparison.find(item => item.specification === specification);
      if (!item) {
        res.status(404).json({ error: "Specification not found in comparison." });
        return;
      }
  
      item.feedback = {
        reason,
        submittedAt: new Date(),
        reference: item.reference,
        user: item.user,
      };
  
      await comparison.save();
  
      res.status(200).json({
        message: "Feedback submitted successfully.",
        updatedItem: item,
      });
    } catch (error: any) {
      console.error("Feedback error:", error.message);
      res.status(500).json({ error: "Failed to submit feedback." });
    }
};
  