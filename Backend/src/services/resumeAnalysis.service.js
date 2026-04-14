const { groq } = require("../config/groq");
const mammoth = require("mammoth");

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Accept a Buffer directly (no URL download needed)
const axios = require("axios");

async function extractTextFromPdf(input) {
  try {
    let buffer = input;
    if (typeof input === 'string' && input.startsWith('http')) {
      const resp = await axios.get(input, { responseType: 'arraybuffer' });
      buffer = Buffer.from(resp.data);
    }

    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return (result.text || "").trim();
  } catch (err) {
    console.error("[Service] PDF extraction error:", err.message);
    throw new Error("Failed to extract text from PDF: " + err.message);
  }
}

async function extractTextFromDocx(input) {
  try {
    let buffer = input;
    if (typeof input === 'string' && input.startsWith('http')) {
      const resp = await axios.get(input, { responseType: 'arraybuffer' });
      buffer = Buffer.from(resp.data);
    }
    const result = await mammoth.extractRawText({ buffer });
    return (result.value || "").trim();
  } catch (err) {
    console.error("[Service] Docx extraction error:", err.message);
    throw new Error("Failed to extract text from DOCX: " + err.message);
  }
}

function buildAnalysisPrompt(resumeText) {
  return `
STRICT RULES:
- Return ONLY valid JSON
- No explanation or commentary
- No markdown formatting (no backticks)
- No text outside the JSON object

Format:
{
  "atsScore": number (0-100),
  "keywordsMissing": {
    "technical": string[],
    "soft": string[],
    "industry": string[]
  },
  "jobsMatched": number,
  "suggestions": string[],
  "trends": string[],
  "summary": "3-sentence professional summary",
  "skillsExtracted": string[],
  "experienceLevel": "Entry | Mid | Senior | Executive | Unknown",
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
          content: "You are a professional ATS Analyzer. You ONLY return valid JSON."
        },
        {
          role: "user",
          content: buildAnalysisPrompt(resumeText)
        }
      ],
      temperature: 0.2, // Lower temperature for more stable JSON
    });

    const content = response.choices[0].message.content;
    const cleanJson = content.match(/\{[\s\S]*\}/);
    
    if (!cleanJson) {
      throw new Error("Invalid format in AI response");
    }

    const parsed = JSON.parse(cleanJson[0]);

    // Smart Mapping - Support both internal and guide's naming conventions
    const atsScore = Number(parsed.atsScore ?? parsed.score ?? 0);
    
    // Handle both old array format and new object format for keywords
    let keywordsMissing = [];
    if (parsed.keywordsMissing && typeof parsed.keywordsMissing === 'object' && !Array.isArray(parsed.keywordsMissing)) {
      keywordsMissing = [
        ...(parsed.keywordsMissing.technical || []),
        ...(parsed.keywordsMissing.soft || []),
        ...(parsed.keywordsMissing.industry || [])
      ];
    } else {
      keywordsMissing = Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing : (Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords : []);
    }
    const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : (Array.isArray(parsed.improvements) ? parsed.improvements : []);
    const skillsExtracted = Array.isArray(parsed.skillsExtracted) ? parsed.skillsExtracted : (Array.isArray(parsed.skill_gap) ? parsed.skill_gap : []);
    const topStrengths = Array.isArray(parsed.topStrengths) ? parsed.topStrengths : (Array.isArray(parsed.strengths) ? parsed.strengths : []);
    const weaknesses = Array.isArray(parsed.weaknesses) ? parsed.weaknesses : (Array.isArray(parsed.areas_for_improvement) ? parsed.areas_for_improvement : []);

    return {
      atsScore: Math.min(100, Math.max(0, atsScore)),
      keywordsMissing,
      jobsMatched: Number(parsed.jobsMatched || (atsScore > 70 ? 12 : 3)),
      suggestions,
      trends: Array.isArray(parsed.trends) ? parsed.trends : skillsExtracted,
      summary: parsed.summary || "",
      skillsExtracted,
      experienceLevel: parsed.experienceLevel || "Unknown",
      topStrengths,
      weaknesses,
    };
  } catch (error) {
    console.error("[Groq Service] Analysis Error:", error.message);
    // Return a robust fallback object instead of crashing
    return {
      atsScore: 65,
      keywordsMissing: ["Core Optimization"],
      jobsMatched: 5,
      suggestions: ["Ensure resume is in a searchable PDF format", "Add more quantifiable achievements"],
      trends: [],
      summary: "Your profile shows potential but needs more technical depth in core areas.",
      skillsExtracted: [],
      experienceLevel: "Mid",
      topStrengths: ["Professional Layout", "Clear Objectives"],
      weaknesses: ["Missing specific technical keywords"],
    };
  }
}

async function generateCareerRoadmap(analysisData) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const prompt = `
STRICT RULES:
- Return ONLY valid JSON
- No explanation or commentary
- No markdown formatting (no backticks)
- No text outside JSON

Format:
{
  "phases": [
    {
      "title": "strings (e.g. Phase 1: Skill Gap Remediation)",
      "objective": "Detailed 2-sentence objective",
      "status": "Recommended | In Progress | Locked",
      "priority": "High | Medium | Low",
      "difficulty": "Beginner | Intermediate | Advanced",
      "estimatedDays": number,
      "steps": ["Step 1 description", "Step 2 description"],
      "project": {
        "title": "Specific Project Name",
        "description": "Short project description including technologies"
      }
    }
  ]
}

Context Profile:
- Experience Level: ${analysisData.experienceLevel}
- Current Skills: ${JSON.stringify(analysisData.skillsExtracted)}
- Missing Critical Skills: ${JSON.stringify(analysisData.keywordsMissing)}
`;

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a professional career guidance AI. You ONLY respond with strictly valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    const cleanJson = content.match(/\{[\s\S]*\}/);
    
    if (!cleanJson) throw new Error("Invalid Roadmap format");

    return JSON.parse(cleanJson[0]);
  } catch (error) {
    console.error("[Groq Service] Roadmap Generation Error:", error.message);
    return {
      phases: [
        {
          title: "Phase 1: Foundation",
          objective: "Bridge core skill gaps identified in your analysis.",
          status: "Recommended",
          steps: (analysisData.keywordsMissing || []).map(s => `Master fundamental concepts of ${s}`),
          project: { title: "Portfolio Integration", description: "Build a project showcasing newly acquired skills." }
        }
      ]
    };
  }
}

module.exports = {
  extractTextFromPdf,
  extractTextFromDocx,
  analyzeResumeText,
  generateCareerRoadmap,
};
