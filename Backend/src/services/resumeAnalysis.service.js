"use strict";
const axios = require("axios");
const mammoth = require("mammoth");
const { groq } = require("../config/groq");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



const FREE_MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "mixtral-8x7b-32768",
  "gemma2-9b-it"
];

const ROLE_SKILLS = {
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Responsive Design", "APIs", "Next.js", "Tailwind CSS"],
  "Backend Developer": ["Node.js", "Express", "Databases", "MongoDB", "SQL", "REST APIs", "Auth", "System Design", "Microservices"],
  "Java Developer": ["Java", "OOP", "Spring Boot", "SQL", "Hibernate", "REST", "Microservices", "Maven", "JPA"],
  "React Native Developer": ["React Native", "JavaScript", "TypeScript", "Mobile UI", "APIs", "State Management", "Redux", "iOS/Android Deployment"]
};


/**
 * Centrally managed AI invocation with automatic model failover for 429 errors.
 */
async function callGroqWithFailover(payload, options = {}) {
  const preferredModel = process.env.GROQ_MODEL;
  // Create a priority list: [User Preferred Model, ...Standard Free Pool]
  const modelPool = Array.from(new Set([
    ...(preferredModel ? [preferredModel] : []),
    ...FREE_MODELS
  ]));

  let lastError = null;

  for (let i = 0; i < modelPool.length; i++) {
    const currentModel = modelPool[i];
    try {
      console.log(`[AI Engine] Attempting request with model: ${currentModel} (Attempt ${i + 1}/${modelPool.length})`);

      const response = await groq.chat.completions.create({
        ...payload,
        model: currentModel,
      });

      return response;
    } catch (error) {
      lastError = error;
      const isRateLimit = error.status === 429 || error.message?.includes("rate_limit_exceeded") || error.message?.includes("Rate limit reached");

      if (isRateLimit && i < modelPool.length - 1) {
        console.warn(`[AI Engine] Rate limit hit for ${currentModel}. Switching to ${modelPool[i + 1]}...`);
        continue; // Try next model
      }

      // If it's not a rate limit, or we've exhausted all models, throw
      console.error(`[AI Engine] Permanent failure on ${currentModel}:`, error.message);
      throw error;
    }
  }

  throw lastError || new Error("AI call failed after exhausting all available models.");
}

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

    const pdf = require("pdf-parse");
    let extractedData = null;

    if (typeof pdf === "function") {
      // Standard pdf-parse functional usage
      console.log("[PDF] Using functional extraction engine");
      extractedData = await pdf(buffer);
    } else if (pdf.PDFParse) {
      // pdf-parse fork with class-based usage
      console.log("[PDF] Using class-based extraction engine");
      const parser = new pdf.PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      extractedData = { text: result.text };
    } else {
      throw new Error("Unable to locate valid pdf-parse extraction patterns.");
    }

    const text = (extractedData.text || "").trim();
    console.log(`[PDF] Extracted ${text.length} characters.`);

    if (text.length < 20) {
      throw new Error(`Validation Error: Extracted text too short (${text.length} chars). Please ensure your PDF is not a scanned image and contains readable text.`);
    }

    return text;
  } catch (err) {
    console.error("[PDF] Extraction failed:", err.message);
    // Preserving the prefix if it's already a Validation Error
    if (err.message.includes("Validation Error:")) throw err;
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
      throw new Error(`Validation Error: Extracted text too short (${text.length} chars). Please ensure your document contains readable text.`);
    }

    return text;
  } catch (err) {
    console.error("[DOCX] Extraction failed:", err.message);
    if (err.message.includes("Validation Error:")) throw err;
    throw new Error("DOCX extraction failed: " + err.message);
  }
}

// ─────────────────────────────────────────────
//  DYNAMIC PROMPT HELPERS
// ─────────────────────────────────────────────

/**
 * Replaces {{variable}} placeholders with actual data.
 */
function injectVariables(template, data) {
  let result = template;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, data[key] || "");
  });
  return result;
}

async function getPromptsFromDB() {
  try {
    const prompts = await prisma.aIPrompt.findMany({ where: { isActive: true } });
    const dict = {};
    prompts.forEach(p => dict[p.key] = p.content);
    return dict;
  } catch (err) {
    console.warn("[Prompts] Failed to fetch dynamic prompts:", err.message);
    return {};
  }
}

// ─────────────────────────────────────────────
//  GROQ AI — RESUME ANALYSIS
// ─────────────────────────────────────────────
function buildAnalysisPrompt(resumeText, userType = null, targetRole = null, yearsOfExperience = null, roleSkills = ROLE_SKILLS, customTemplate = null) {



  if (targetRole && roleSkills[targetRole]) {
    roleContext = `
TARGET ROLE: ${targetRole}
EXPECTED SKILLS FOR THIS ROLE: ${roleSkills[targetRole].join(", ")}
${userType === "FRESHER"
        ? "Since the candidate is a FRESHER, focus on their potential, projects, and foundational knowledge."
        : `Since the candidate is EXPERIENCED (YoE: ${yearsOfExperience || "N/A"}), focus on technical depth, leadership, and professional impact.`}

Weigh the score heavily based on these skills and the appropriate career stage.
`;
  }

  if (customTemplate) {
    // If a custom template is provided via Admin, use it instead of the default logic
    // Note: Admin should include placeholders for ${resumeText}, ${roleContext}, etc. if they want to replace the whole thing
    // For now, we'll assume customTemplate is an additional system instruction or a replacement for the rubric
  }




  return `You are a Tier-1 Technical Recruiter and ATS Specialist.
${roleContext}
  
STEP 1: DOCUMENT VALIDATION

First, determine if the provided text is a professional Resume or Curriculum Vitae (CV). 
If it is NOT a resume (e.g., it is a project report, a book excerpt, an invoice, or non-career related text), you MUST return only this JSON and stop:
{ "isResume": false, "error": "This document does not appear to be a professional resume or CV. Please upload a valid resume payload." }

STEP 2: NEURAL ANALYSIS
If it IS a resume, analyze it and provide a BRUTALLY HONEST score based on a 100-point rubric.

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
  "isResume": true,
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
  "topStrengths": ["Exactly 4 specific proven strengths"],
  "weaknesses": ["Exactly 4 specific improvement areas"],
  "experienceLevel": "Entry | Mid | Senior",
  "summaryAnalysis": "Deep executive critique of the candidate's professional standing and resume quality (minimum 6-8 lines). Focus on specific areas for improvement, technical gaps, and strategic market positioning."
}

RESUME PAYLOAD:
---
${resumeText.slice(0, 8000)}
---`;
}

function buildMatchPrompt(resumeText, jobDescription) {
  return `You are a Tier-1 Technical Recruiter. Your task is to perform a pin-pointed comparison between a Candidate's Resume and a specific Job Description (JD).

STEP 1: DOCUMENT VALIDATION
First, verify that the 'RESUME' payload provided is a professional Resume or CV. 
If it is NOT a resume (e.g., project report, random text), you MUST return:
{ "isResume": false, "error": "The uploaded document is not a professional resume. Job matching requires a valid resume payload." }

STEP 2: ATS MATCH ANALYSIS
If it IS a resume, score its alignment with the JD.

CRITICAL INSTRUCTIONS:
- If the JD is random text, jibberish, placeholder text, or completely irrelevant to the candidates career (e.g., candidate is a Coder but JD is for a Chef), the total score MUST be very low (below 30).
- Be EXTREMELY STRICT. If the candidate misses 20% of required tech stack, they lose 15+ points in Skill Alignment.
- The score must reflect the ELIGIBILITY for THIS specific role.

Return ONLY valid JSON:
{
  "breakdown": {
    "skillAlignment": 0-40,
    "experienceRelevance": 0-30,
    "keywords": 0-20,
    "impact": 0-10
  },
  "keywordsMissing": ["specific", "missing", "tech", "from", "JD"],
  "suggestions": ["actions to take specifically for THIS application"],
  "topStrengths": ["Exactly 4 specific matches vs JD"],
  "weaknesses": ["Exactly 4 specific gaps vs JD"],
  "experienceLevel": "Entry | Mid | Senior",
  "summaryAnalysis": "Deep executive critique of the role-fit (minimum 6-8 lines). Compare specific technical depth vs the JD requirements, highlight critical alignment gaps, and provide a strategic verdict on candidacy."
}

RESUME:
---
${resumeText.slice(0, 6000)}
---

JOB DESCRIPTION:
---
${jobDescription.slice(0, 4000)}
---`;
}

async function analyzeResumeText(resumeText, jobDescription = null, options = {}) {

  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not found");

  if (!resumeText || resumeText.trim().length < 30) {
    throw new Error("Resume content too short to analyze.");
  }

  // --- Dynamic Config Loading ---
  let dynamicRoleSkills = ROLE_SKILLS;
  try {
    const tracks = await prisma.jobTrack.findMany({ where: { isActive: true } });
    if (tracks.length > 0) {
      dynamicRoleSkills = {};
      tracks.forEach(t => { dynamicRoleSkills[t.name] = t.skills; });
    }
  } catch (dbErr) {
    console.warn("[Analysis] Using fallback role skills:", dbErr.message);
  }

  // Handle dynamic prompts (Optional: logic to swap buildAnalysisPrompt with DB content)
  // For now, we'll pass the dynamicRoleSkills to the prompt builder if needed
  // ...

  // Handle dynamic prompts
  const dbPrompts = await getPromptsFromDB();
  let prompt;

  if (jobDescription) {
    const template = dbPrompts['job_match'] || buildMatchPrompt(resumeText, jobDescription);
    prompt = typeof template === 'string' && template.includes('{{')
      ? injectVariables(template, { resumeText, jobDescription })
      : buildMatchPrompt(resumeText, jobDescription);
  } else {
    const key = options.userType === 'FRESHER' ? 'analysis_fresher' : 'analysis_experienced';
    const template = dbPrompts[key];

    if (template && template.includes('{{')) {
      const skills = (options.targetRole && dynamicRoleSkills[options.targetRole])
        ? dynamicRoleSkills[options.targetRole].join(", ")
        : "General engineering skills";

      prompt = injectVariables(template, {
        resumeText,
        userType: options.userType,
        targetRole: options.targetRole,
        yearsOfExperience: options.yearsOfExperience,
        roleSkills: skills
      });
    } else {
      prompt = buildAnalysisPrompt(
        resumeText,
        options.userType,
        options.targetRole,
        options.yearsOfExperience,
        dynamicRoleSkills
      );
    }
  }






  try {
    const response = await callGroqWithFailover({
      messages: [
        { role: "system", content: "You are a specialized ATS grading system. Respond with valid JSON ONLY." },
        { role: "user", content: prompt },
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

    // Handle Document Validation Failure
    if (parsed.isResume === false) {
      console.warn("[Groq] Validation Failed:", parsed.error);
      throw new Error(`Validation Error: ${parsed.error || "The uploaded document is not a professional resume. Please upload a valid resume."}`);
    }

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
    const breakdown = jobDescription
      ? {
        skillAlignment: gv(["skillAlignment", "skills"], 40),
        experienceRelevance: gv(["experienceRelevance", "experience"], 30),
        keywords: gv(["keywords", "keywordMatch"], 20),
        impact: gv(["impact", "achievements"], 10)
      }
      : {
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
    const response = await callGroqWithFailover({
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

// ─────────────────────────────────────────────
//  GROQ AI — RESUME DATA EXTRACTION (For Resume Maker)
// ─────────────────────────────────────────────
async function extractResumeData(resumeText) {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not found");

  const prompt = `You are a specialized Data Extraction AI. 
Extract all professional details from the resume below into a perfectly structured JSON object.
Capture EVERY detail accurately.

Return ONLY this JSON structure:
{
  "fullName": "Name",
  "phone": "Phone",
  "email": "Email",
  "linkedin": "URL",
  "portfolio": "URL",
  "github": "URL",
  "location": "City, Country",
  "targetRole": "Extrapolated current/target role",
  "summary": "Full professional summary",
  "skills": ["Skill 1", "Skill 2"],
  "languages": "List of languages",
  "frameworks": "List of frameworks",
  "cloud": "Cloud platforms",
  "certifications": "Certifications",
  "experience": [
    {
      "role": "Title",
      "company": "Company",
      "startDate": "Date",
      "endDate": "Date",
      "location": "Location",
      "highlights": ["Bullet point 1", "Bullet point 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree",
      "field": "Field",
      "university": "University",
      "year": "Year"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "techStack": "Tools used",
      "highlights": ["What you did", "Impact"]
    }
  ],
  "achievements": [
    { "label": "Revenue Growth", "value": "25%" }
  ]
}

RESUME:
---
${resumeText.slice(0, 8000)}
---`;

  try {
    const response = await callGroqWithFailover({
      messages: [
        { role: "system", content: "You extract structured resume data. Respond with valid JSON ONLY." },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
    });

    const raw = response.choices[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in extraction response");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[Groq] Extraction failed:", error.message);
    throw error;
  }
}

// ─────────────────────────────────────────────
//  GROQ AI — JD OPTIMIZATION (For Resume Maker)
// ─────────────────────────────────────────────
async function optimizeResumeForJD(resumeData, jobDescription) {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not found");

  const prompt = `You are a World-Class Resume Strategist and ATS Specialist.
Your goal is to RE-ENGINEER the provided resume data to MAXIMIZE its match rate against the specific Job Description (JD).

STRATEGIC INSTRUCTIONS:
1.  PERSONALIZED SUMMARY (CAREER OBJECTIVE): Rewrite the 'summary' from scratch to be a high-impact branding statement. It must use keywords from the JD and explicitly state how the candidate solves the specific problems mentioned in the JD.
2.  SKILLS SYNCHRONIZATION (CORE CAPABILITIES): Reorganize and update the 'skills' array. Prioritize the technical and soft skills highlighted in the JD. Ensure terminology exactly matches the JD (e.g., if JD says "Cloud Architecture", don't just say "AWS").
3.  EXPERIENCE OPTIMIZATION: Rephrase 'highlights' for every role to emphasize accomplishments that are directly relevant to the JD's requirements. Use action verbs and quantifiable metrics where possible.
4.  PROJECT ALIGNMENT: Tailor the 'projects' highlights to showcase relevance to the JD's tech stack and objectives.
5.  VERACITY & INTEGRITY: Do not invent new jobs, dates, degrees, or companies. Stay honest to the candidate's core history.

EXTREME IMPORTANCE: 
- The tone should be authoritative, professional, and JD-aligned.
- Return ONLY the full updated JSON object of the resume data.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Return the optimized JSON object now.`;

  try {
    const response = await callGroqWithFailover({
      messages: [
        { role: "system", content: "You optimize resume data for JD alignment. Respond with valid JSON ONLY." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const raw = response.choices[0]?.message?.content || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in optimization response");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[Groq] Optimization failed:", error.message);
    throw error;
  }
}

/**
 * Extracts structured job details from raw JD text using AI (Groq).
 */
async function extractStructuredJDText(text) {
  try {
    const prompt = `
      You are an expert HR recruitment assistant. Your task is to extract job role details from the provided Job Description text.
      Return the data ONLY as a valid and clean JSON object.
      
      The JSON object MUST have these fields:
      - title: The official job title
      - company: The hiring company name
      - location: Remote, or a specific city/country
      - type: One of ["Full-time", "Part-time", "Contract", "Remote", "Internship"]
      - experience: Experience required (e.g. "3+ Years")
      - description: A concise 2-3 sentence overview of the role
      - requirements: A list of candidate requirements (bullet points)
      - responsibilities: A list of job responsibilities (bullet points)
      - tags: A list of 5-10 key technical skills required
      
      Job Description:
      """
      ${text}
      """
    `;

    const response = await callGroqWithFailover({
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);

    // Ensure lists are formatted correctly
    if (Array.isArray(result.requirements)) result.requirements = result.requirements.join('\n');
    if (Array.isArray(result.responsibilities)) result.responsibilities = result.responsibilities.join('\n');

    return result;
  } catch (error) {
    console.error("[JD Extraction] AI parsing failed:", error.message);
    throw error;
  }
}

module.exports = {
  analyzeResumeText,
  buildAnalysisPrompt,
  extractTextFromPdf,
  extractTextFromDocx,
  extractStructuredJDText
};
