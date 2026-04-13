const { groq } = require("../config/groq");
const mammoth = require("mammoth");

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Accept a Buffer directly (no URL download needed)
async function extractTextFromPdf(buffer) {
  try {
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return (result.text || "").trim();
  } catch (err) {
    console.error("[Service] PDF extraction error:", err.message);
    throw err;
  }
}

async function extractTextFromDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return (result.value || "").trim();
}

function buildAnalysisPrompt(resumeText) {
  return `Analyze this resume and provide a professional ATS evaluation.

STRICT RULES:
- Return ONLY valid JSON.
- No commentary before or after the JSON.
- No markdown formatting (no backticks).

JSON Structure:
{
  "atsScore": number (0-100),
  "keywordsMissing": string[],
  "jobsMatched": number,
  "suggestions": string[],
  "trends": string[],
  "summary": string (3-sentence professional summary),
  "skillsExtracted": string[],
  "experienceLevel": "Entry" | "Mid" | "Senior" | "Executive" | "Unknown",
  "topStrengths": string[],
  "weaknesses": string[]
}

Resume Content:
${resumeText.slice(0, 6000)}
`;
}

async function analyzeResumeText(resumeText) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in .env");
  }

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a senior technical recruiter and ATS specialist. You only respond with strictly valid JSON."
        },
        {
          role: "user",
          content: buildAnalysisPrompt(resumeText)
        }
      ],
      temperature: 0.3,
    });

    let content = response.choices[0].message.content;

    // Clean JSON - Robust extraction
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON structure");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      atsScore: Number(parsed.atsScore) || 0,
      keywordsMissing: Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing : [],
      jobsMatched: Number(parsed.jobsMatched) || 0,
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      trends: Array.isArray(parsed.trends) ? parsed.trends : [],
      summary: parsed.summary || "",
      skillsExtracted: Array.isArray(parsed.skillsExtracted) ? parsed.skillsExtracted : [],
      experienceLevel: parsed.experienceLevel || "Unknown",
      topStrengths: Array.isArray(parsed.topStrengths) ? parsed.topStrengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error(`AI Analysis Failed: ${error.message}`);
  }
}

module.exports = {
  extractTextFromPdf,
  extractTextFromDocx,
  analyzeResumeText,
};
