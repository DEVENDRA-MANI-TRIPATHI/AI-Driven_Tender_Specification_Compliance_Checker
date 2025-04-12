import mongoose, { Document, Schema } from "mongoose";

interface Feedback {
  reason: string;
  submittedAt: Date;
  reference: string;
  user: string;
}

export interface ComparisonItem {
  specification: string;
  reference: string;
  user: string;
  status: "Compliant" | "Partially Compliant" | "Non-Compliant";
  feedback?: Feedback;
}

export interface ComparisonDocument extends Document {
  matchPercentage: number;
  summary: string;
  comparison: ComparisonItem[];
  createdAt: Date;
}

const FeedbackSchema = new Schema<Feedback>(
  {
    reason: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    reference: { type: String, required: true },
    user: { type: String, required: true },
  },
  { _id: false }
);

const ComparisonItemSchema = new Schema<ComparisonItem>(
  {
    specification: { type: String, required: true },
    reference: { type: String, required: true },
    user: { type: String, required: true },
    status: {
      type: String,
      enum: ["Compliant", "Partially Compliant", "Non-Compliant"],
      required: true,
    },
    feedback: { type: FeedbackSchema, required: false },
  },
  { _id: false }
);

const ComparisonSchema = new Schema<ComparisonDocument>(
  {
    matchPercentage: { type: Number, required: true },
    summary: { type: String, required: true },
    comparison: { type: [ComparisonItemSchema], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const ComparisonModel = mongoose.model<ComparisonDocument>("Comparison", ComparisonSchema);

export default ComparisonModel;
