import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function compareDocuments(userDoc: string, referenceDoc: string): Promise<any> {
  const prompt = `
Compare the following two documents:
1. Reference Document: """${referenceDoc}"""
2. User Document: """${userDoc}"""

Respond strictly in the following JSON format:

\`\`\`json
{
  "complianceStatus": "Compliant | Partially Compliant | Non-Compliant",
  "matchPercentage": <number>, // percentage of matching
  "summary": "<short summary of comparison>",
  "details": {
    "compliant": [<list of matched features>],
    "partiallyCompliant": [<list of partial matches>],
    "nonCompliant": [<list of missing or non-matching items>]
  }
}
\`\`\`
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const jsonString = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", text);
    throw new Error("Failed to parse Gemini response as JSON");
  }
}
