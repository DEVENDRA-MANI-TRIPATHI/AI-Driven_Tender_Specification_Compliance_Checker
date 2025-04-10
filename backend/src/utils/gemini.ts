import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function compareDocuments(userDoc: string, referenceDoc: string): Promise<any> {
  const prompt = `
    Compare the technical specifications in the following two documents:

    1. Reference Document:
    """${referenceDoc}"""

    2. User Document:
    """${userDoc}"""

    🔍 Your task is to analyze and extract a structured comparison table.

    ✅ For each specification or requirement:
    - Identify the value in the reference document.
    - Find the corresponding value in the user document.
    - Determine the compliance status:
      - "Compliant": the values are semantically the same.
      - "Partially Compliant": the values are close but not exact.
      - "Non-Compliant": the values are significantly different or missing.

    📊 Also calculate the overall match percentage based on:
    - Compliant = 1 point
    - Partial = 0.5 point
    - Non-Compliant = 0 point
    - Match percentage = (earned points / total points) * 100

    Respond strictly in this JSON format (no explanation):

    \`\`\`json
    {
      "matchPercentage": <number>,
      "summary": "<brief summary of findings>",
      "comparison": [
        {
          "specification": "Speed",
          "reference": "120 km/h",
          "user": "110 km/h",
          "status": "Non-Compliant"
        },
        {
          "specification": "Color",
          "reference": "Red",
          "user": "Red",
          "status": "Compliant"
        }
      ]
    }
    \`\`\`

    ⚠️ Important:
    - Only include the JSON block.
    - No markdown, no explanation.
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
