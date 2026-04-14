"use strict";
const axios = require("axios");
const mammoth = require("mammoth");
const { groq } = require("../config/groq");

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// ─────────────────────────────────────────────
//  PDF TEXT EXTRACTION  (fixed pdf-parse usage)
// ─────────────────────────────────────────────
async function extractTextFromPdf(input) {
  try {
    let buffer = input;

    // If a URL string is passed, download it first
    if (typeof input === "string" && input.startsWith("http")) {
      console.log("[PDF] Downloading from URL:", input.substring(0, 60));
      const resp = await axios.get(input, { responseType: "arraybuffer", timeout: 15000 });
      buffer = Buffer.from(resp.data);
    }

    if (!buffer || buffer.length === 0) {
      throw new Error("Empty buffer received for PDF extraction");
    }

    // Correct usage for pdf-parse v2: Pass data directly to constructor
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    
    // getText() returns the result directly in v2
    const result = await parser.getText();
    await parser.destroy();

    const text = (result.text || "").trim();
    console.log(`[PDF] Extracted ${text.length} characters.`);

    if (text.length < 20) {
      throw new Error(`Extracted text too short (${text.length} chars) — likely scanned/image PDF or corrupted`);
    }

    return text;
  } catch (err) {
    console.error("[PDF] Extraction failed:", err.message);
    throw new Error("PDF extraction failed: " + err.message);
  }
}

// ─────────────────────────────────────────────
//  DOCX TEXT EXTRACTION
// ─────────────────────────────────────────────
async function extractTextFromDocx(input) {
  try {
    let buffer = input;

    if (typeof input === "string" && input.startsWith("http")) {
      console.log("[DOCX] Downloading from URL:", input.substring(0, 60));
      const resp = await axios.get(input, { responseType: "arraybuffer", timeout: 15000 });
      buffer = Buffer.from(resp.data);
    }

    const result = await mammoth.extractRawText({ buffer });
    const text = (result.value || "").trim();

    console.log(`[DOCX] Extracted ${text.length} characters`);

    if (text.length < 50) {
      throw new Error(`Extracted text too short (${text.length} chars)`);
    }

    return text;
  } catch (err) {
    console.error("[DOCX] Extraction failed:", err.message);
    throw new Error("DOCX extraction failed: " + err.message);
  }
}

// ─────────────────────────────────────────────
//  GROQ AI — RESUME ANALYSIS
// ─────────────────────────────────────────────
function buildAnalysisPrompt(resumeText) {
  return `You are a Tier-1 Technical Recruiter with experience at Google and NVIDIA. 
Analyze the resume below and provide a BRUTALLY HONEST score based on a 100-point rubric.

SCORING RUBRIC (Max 100 pts):
1.  Keyword Density (20 pts): Match against standard industry tech stacks. 
2.  Quantifiability (15 pts): Use of numbers (%, $, #) to show impact. 
3.  Technical Depth (10 pts): Advanced tools, architectures, and depth.
4.  Experience Quality (10 pts): Tenure, company prestige, career growth.
5.  Education (8 pts): Degree relevance, high-tier institutions.
6.  Projects (8 pts): Complexity, open source, or live links.
7.  Formatting (7 pts): ATS-friendly structure, no graphics/columns.
8.  Summary (6 pts): High-impact value proposition, clear role.
9.  Certifications (5 pts): AWS, GCP, Azure, or professional certs.
10. Online Presence (5 pts): Active GitHub, LinkedIn, Portfolio.
11. Soft Skills (4 pts): Leadership, mentoring, collaboration.
12. Grammar (2 pts): Zero typos, professional tone.

BE EXTREMELY CRITICAL. 
- Generic student resumes with only school projects: 40-55 pts.
- Solid professional resumes (2-4 years): 60-75 pts.
- Industry experts / FAANG level: 85+ pts.

Return ONLY valid JSON:
{
  "breakdown": {
    "keywords": 0-20,
    "achievements": 0-15,
    "techSkills": 0-10,
    "experience": 0-10,
    "education": 0-8,
    "projects": 0-8,
    "formatting": 0-7,
    "summary": 0-6,
    "certifications": 0-5,
    "onlinePresence": 0-5,
    "softSkills": 0-4,
    "grammar": 0-2
  },
  "keywordsMissing": ["specifically", "missing", "technical", "terms"],
  "suggestions": ["specific actionable advice"],
  "topStrengths": ["proven skill with evidence"],
  "weaknesses": ["clear improvement area"],
  "experienceLevel": "Entry | Mid | Senior",
  "summaryAnalysis": "Critique of their summary"
}

RESUME:
---
${resumeText.slice(0, 8000)}
---`;
}

async function analyzeResumeText(resumeText) {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not found");

  if (!resumeText || resumeText.trim().length < 30) {
    throw new Error("Resume content too short to analyze.");
  }

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You are a specialized ATS grading system. Respond with valid JSON ONLY." },
        { role: "user", content: buildAnalysisPrompt(resumeText) },
      ],
      temperature: 0.1,
    });

    const raw = response.choices[0]?.message?.content || "";
    console.log("[Groq] Raw AI Response Preview:", raw.substring(0, 500));

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[Groq] No JSON found in response:", raw);
      throw new Error("Invalid AI Response format (No JSON)");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    // Handle both { breakdown: {...} } and top-level keys
    const b = parsed.breakdown || parsed.scoreBreakdown || parsed;

    // Helper to extract numeric values from potential hallucinations
    const gv = (keys, max) => {
      for (const k of keys) {
        if (b[k] !== undefined && b[k] !== null) {
          const val = Number(b[k]);
          return isNaN(val) ? 0 : Math.min(val, max);
        }
      }
      return 0;
    };

    // Robust Scoring Logic
    const breakdown = {
      keywords: gv(["keywords", "keyword_density", "keywordMatch"], 20),
      achievements: gv(["achievements", "quantifiability", "impact"], 15),
      techSkills: gv(["techSkills", "technical_depth", "skills"], 10),
      experience: gv(["experience", "experience_quality", "workHistory"], 10),
      education: gv(["education", "academic", "credentials"], 8),
      projects: gv(["projects", "portfolio", "side_projects"], 8),
      formatting: gv(["formatting", "ats_compliance", "structure"], 7),
      summary: gv(["summary", "professional_summary", "valueProp"], 6),
      certifications: gv(["certifications", "certs", "licenses"], 5),
      onlinePresence: gv(["onlinePresence", "links", "presence"], 5),
      softSkills: gv(["softSkills", "leadership", "mentoring"], 4),
      grammar: gv(["grammar", "language", "typos"], 2)
    };

    const calcScore = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
    const atsScore = Math.min(100, Math.max(0, Math.round(calcScore)));

    console.log(`[Groq] Final Calculated Score: ${atsScore}`);

    return {
      atsScore,
      scoreBreakdown: breakdown,
      keywordsMissing: Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing.slice(0, 10) : [],
      jobsMatched: atsScore > 80 ? 15 : atsScore > 60 ? 8 : 3,
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 5) : [],
      trends: Array.isArray(parsed.topStrengths) ? parsed.topStrengths : [],
      skillsExtracted: Array.isArray(parsed.skillsExtracted) ? parsed.skillsExtracted : (breakdown.techSkills > 0 ? ["Extracted Skills"] : []),
      summary: parsed.summaryAnalysis || parsed.summary || "",
      experienceLevel: parsed.experienceLevel || "Entry",
      topStrengths: Array.isArray(parsed.topStrengths) ? parsed.topStrengths.slice(0, 4) : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 4) : [],
    };
  } catch (error) {
    console.error("[Groq] Analysis failed:", error.message);
    throw error;
  }
}

// ─────────────────────────────────────────────
//  GROQ AI — CAREER ROADMAP
// ─────────────────────────────────────────────
async function generateCareerRoadmap(analysisData) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const prompt = `Generate a personalized career roadmap as a JSON object. 
Return ONLY valid JSON. No markdown, no text outside the JSON.

Format:
{
  "phases": [
    {
      "title": "Phase 1: ...",
      "objective": "2-sentence objective explaining the goal",
      "status": "Recommended",
      "priority": "High",
      "difficulty": "Beginner",
      "estimatedDays": 30,
      "steps": ["Step 1", "Step 2", "Step 3"],
      "project": {
        "title": "Project Name",
        "description": "Brief description with technologies used"
      }
    }
  ]
}

Context:
- Experience Level: ${analysisData.experienceLevel || "Unknown"}
- Extracted Skills: ${JSON.stringify(analysisData.skillsExtracted?.slice(0, 10) || [])}
- Missing Critical Skills: ${JSON.stringify(analysisData.keywordsMissing?.slice(0, 8) || [])}
- Key Weaknesses: ${JSON.stringify(analysisData.weaknesses?.slice(0, 5) || [])}

Generate 3-4 phases that are specific, realistic, and actionable.`;

  try {
    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You generate career roadmaps as strictly valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const raw = response.choices[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON in roadmap response");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[Groq] Roadmap generation error:", error.message);
    // Graceful fallback
    return {
      phases: [
        {
          title: "Phase 1: Skill Gap Remediation",
          objective: `Focus on acquiring the missing skills identified in your analysis: ${(analysisData.keywordsMissing || []).slice(0, 3).join(", ")}.`,
          status: "Recommended",
          priority: "High",
          difficulty: "Intermediate",
          estimatedDays: 30,
          steps: (analysisData.keywordsMissing || [])
            .slice(0, 4)
            .map((s) => `Learn and practice ${s}`),
          project: {
            title: "Skill Showcase Project",
            description: "Build a project that demonstrates your newly acquired skills.",
          },
        },
      ],
    };
  }
}

module.exports = {
  extractTextFromPdf,
  extractTextFromDocx,
  analyzeResumeText,
  generateCareerRoadmap,
};
