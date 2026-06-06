import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateTextResilient, getAvailableProviders } from "./ai-gateway";

const SYSTEM = `Return ONLY valid JSON. No markdown. No code fences. No commentary.`;

function getModel() {
  const providers = getAvailableProviders();
  if (providers.length === 0) throw new Error("No AI API Keys configured.");
  return providers[0].model;
}

function extractJson(text: string): unknown {
  let t = text.trim();
  if (t.startsWith("```"))
    t = t
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
  const f = t.indexOf("{");
  const l = t.lastIndexOf("}");
  if (f >= 0 && l > f) t = t.slice(f, l + 1);
  return JSON.parse(t);
}

export const ResumeSchema = z.object({
  name: z.string(),
  headline: z.string(),
  contact: z.object({
    email: z.string(),
    location: z.string(),
    website: z.string(),
    github: z.string(),
    linkedin: z.string(),
  }),
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      period: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      tech: z.array(z.string()),
      link: z.string(),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      school: z.string(),
      period: z.string(),
    }),
  ),
  certifications: z.array(z.string()),
  achievements: z.array(z.string()),
});
export type Resume = z.infer<typeof ResumeSchema>;

export const ATSReportSchema = z.object({
  overallScore: z.coerce.number().min(0).max(100),
  scores: z.object({
    keywords: z.coerce.number().min(0).max(100),
    formatting: z.coerce.number().min(0).max(100),
    impact: z.coerce.number().min(0).max(100),
    relevance: z.coerce.number().min(0).max(100),
    clarity: z.coerce.number().min(0).max(100),
    skills: z.coerce.number().min(0).max(100),
  }),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  recruiterTake: z.string(),
});
export type ATSReport = z.infer<typeof ATSReportSchema>;

async function callJson<T>(schema: z.ZodType<T>, prompt: string): Promise<T> {
  for (let i = 0; i < 2; i++) {
    try {
      const { text } = await generateTextResilient({
        system: SYSTEM,
        prompt,
        temperature: i === 0 ? 0.7 : 0.3,
      });
      const parsed = schema.safeParse(extractJson(text));
      if (parsed.success) return parsed.data;
      console.error("[resume] parse", parsed.error.issues, text.slice(0, 300));
    } catch (e) {
      console.error("[resume]", e);
    }
  }
  throw new Error("AI failed to return valid JSON.");
}

export const generateResume = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      name: string;
      targetRole: string;
      experience: string;
      skills: string;
      projects: string;
      education: string;
    }) => d,
  )
  .handler(async ({ data }): Promise<Resume> => {
    const prompt = `Build a premium AI-generated resume tailored to the target role.
Target role: ${data.targetRole}
Candidate name: ${data.name}
Raw experience: ${data.experience}
Raw skills: ${data.skills}
Raw projects: ${data.projects}
Raw education: ${data.education}

JSON shape (every field required, infer/expand where missing):
{
  "name": string,
  "headline": string (e.g. "Full Stack Engineer · React · Node"),
  "contact": { "email": string, "location": string, "website": string, "github": string, "linkedin": string },
  "summary": string (3-4 punchy sentences tailored to the role),
  "skills": string[] (10-18 sorted by relevance),
  "experience": [{ "role": string, "company": string, "period": string, "bullets": string[] }] (rewrite raw input into 3-5 quantified achievement bullets each),
  "projects": [{ "name": string, "description": string, "tech": string[], "link": string }] (2-5),
  "education": [{ "degree": string, "school": string, "period": string }],
  "certifications": string[],
  "achievements": string[]
}`;
    return callJson(ResumeSchema, prompt);
  });

export const analyzeResumeATS = createServerFn({ method: "POST" })
  .inputValidator((d: { resumeText: string; jobDescription: string }) => d)
  .handler(async ({ data }): Promise<ATSReport> => {
    const prompt = `You are a senior tech recruiter and ATS expert. Analyze this resume against the job description and return a detailed ATS report as JSON.

RESUME:
${data.resumeText.slice(0, 6000)}

JOB DESCRIPTION:
${data.jobDescription.slice(0, 3000)}

JSON shape:
{
  "overallScore": number (0-100),
  "scores": {
    "keywords": number, "formatting": number, "impact": number,
    "relevance": number, "clarity": number, "skills": number
  },
  "matchedKeywords": string[] (8-15),
  "missingKeywords": string[] (5-12 critical ones missing),
  "strengths": string[] (4-6),
  "improvements": string[] (5-8 specific rewrites),
  "recruiterTake": string (2-3 sentences as if a recruiter reviewing it)
}`;
    return callJson(ATSReportSchema, prompt);
  });

export const PortfolioDetailsSchema = z.object({
  fullName: z.string(),
  focusTitle: z.string(),
  email: z.string(),
  github: z.string(),
  linkedin: z.string(),
  skills: z.string(),
  education: z.string(),
  experience: z.string(),
  projects: z.string(),
  achievements: z.string(),
  hobbies: z.string(),
});
export type PortfolioDetails = z.infer<typeof PortfolioDetailsSchema>;

export const parseResumeForPortfolio = createServerFn({ method: "POST" })
  .inputValidator((d: { resumeText: string }) => d)
  .handler(async ({ data }): Promise<PortfolioDetails> => {
    const prompt = `You are an AI resume parsing expert. Analyze the following raw resume text and extract the key information to construct a developer portfolio.
    
Resume Text:
${data.resumeText.slice(0, 6000)}

Extract the details and return JSON with these exact fields:
{
  "fullName": "Candidate's full name",
  "focusTitle": "Tailored focus title or headline (e.g. 'Senior Frontend Engineer' or 'Machine Learning Researcher')",
  "email": "Contact email address",
  "github": "GitHub username or profile url (e.g. 'github.com/username')",
  "linkedin": "LinkedIn username or profile url (e.g. 'linkedin.com/in/username')",
  "skills": "Technical skills as a single comma-separated string (e.g. 'TypeScript, React, Python, AWS')",
  "education": "Brief description of education (e.g. 'B.S. in Computer Science, Stanford University (2025)')",
  "experience": "Brief summary of key professional experience (e.g. 'ML Engineer Intern at SparkLabs AI')",
  "projects": "Comma-separated list of key projects with short descriptions (e.g. 'E-commerce platform in Next.js, Raytracer in Rust')",
  "achievements": "Key professional, academic, or technical achievements, badges, or honors as a single comma-separated string. Do NOT include personal hobbies, sports, games, or leisure interests here!",
  "hobbies": "Personal interests, hobbies, or sports as a single comma-separated string (e.g. 'Chess, Watching Cricket, Hiking'). Do NOT include these in achievements!"
}

If any field is missing or cannot be inferred, provide a sensible default placeholder based on the context of the resume.`;
    return callJson(PortfolioDetailsSchema, prompt);
  });function extractHtml(text: string): string {
  // Try to match anything between <!DOCTYPE html> and </html> (inclusive, case-insensitive)
  const match = text.match(/<html[\s\S]*<\/html>/i) || text.match(/<!DOCTYPE[\s\S]*<\/html>/i);
  if (match) {
    return match[0].trim();
  }
  // Otherwise try to strip code fences manually if they exist
  let cleaned = text.trim();
  const htmlBlockMatch = cleaned.match(/```html([\s\S]*?)```/i) || cleaned.match(/```([\s\S]*?)```/i);
  if (htmlBlockMatch) {
    return htmlBlockMatch[1].trim();
  }
  return cleaned;
}

export const generateCustomPortfolio = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      details: PortfolioDetails;
      prompt: string;
    }) => d,
  )
  .handler(async ({ data }): Promise<{ html: string }> => {
    const prompt = `You are a world-class frontend engineer and UI/UX designer. Generate a complete, standalone, premium portfolio HTML page based on the candidate's details and the custom styling prompt.
    
Candidate Details:
- Name: ${data.details.fullName}
- Title: ${data.details.focusTitle}
- Email: ${data.details.email}
- GitHub: ${data.details.github}
- LinkedIn: ${data.details.linkedin}
- Skills: ${data.details.skills}
- Education: ${data.details.education}
- Experience: ${data.details.experience}
- Projects: ${data.details.projects}
- Achievements: ${data.details.achievements}
- Hobbies: ${data.details.hobbies}

Styling Prompt / Request:
"${data.prompt}"

CRITICAL REQUIREMENT: You MUST populate the generated HTML page with the EXACT Candidate Details provided above (Name, Title, Email, GitHub, LinkedIn, Skills, Education, Experience, Projects, Achievements, Hobbies). Do NOT use default placeholder names (like 'Arun Singh' or 'John Doe') or template text. Every piece of custom detail from the candidate list MUST be visible on the page.

Generate a single highly polished, responsive page. Use modern typography (e.g. Google Fonts like Space Grotesk, Inter, Outfit), smooth gradients, glowing glassmorphic elements, transition effects, and a layout that matches the theme described in the styling prompt. 

The output must be a single, complete HTML string including the full inline <style> block. Do NOT wrap the output in markdown code fences or backticks. Return ONLY the raw HTML code starting with <!DOCTYPE html>.`;

    const { text } = await generateTextResilient({
      system: "You are a web page generator. Return ONLY the raw HTML code. Do not wrap in triple backticks or markdown.",
      prompt,
    });

    let cleaned = extractHtml(text);

    // Heuristic fallback replacements to ensure placeholder details never leak
    const replacePlaceholder = (htmlText: string, search: string, replacement: string) => {
      if (!search || !replacement) return htmlText;
      const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      return htmlText.replace(new RegExp(escaped, 'gi'), replacement);
    };

    if (data.details.fullName) {
      cleaned = replacePlaceholder(cleaned, "Arun Singh", data.details.fullName);
      cleaned = replacePlaceholder(cleaned, "Arun", data.details.fullName.split(" ")[0]);
    }
    if (data.details.focusTitle) {
      cleaned = replacePlaceholder(cleaned, "AI Solutions Engineer", data.details.focusTitle);
      cleaned = replacePlaceholder(cleaned, "Full-Stack Developer", data.details.focusTitle);
      cleaned = replacePlaceholder(cleaned, "Full Stack Engineer", data.details.focusTitle);
    }
    if (data.details.email) {
      cleaned = replacePlaceholder(cleaned, "arun.singh@sparklabs.ai", data.details.email);
    }
    if (data.details.github) {
      cleaned = replacePlaceholder(cleaned, "github.com/arunsingh-ai", data.details.github);
    }
    if (data.details.linkedin) {
      cleaned = replacePlaceholder(cleaned, "linkedin.com/in/arun-spark", data.details.linkedin);
    }
    if (data.details.skills) {
      cleaned = replacePlaceholder(cleaned, "TypeScript, React, Node.js, PyTorch, Python, Docker", data.details.skills);
    }
    if (data.details.education) {
      cleaned = replacePlaceholder(cleaned, "B.S. in Computer Science, Stanford University (2025)", data.details.education);
    }
    if (data.details.experience) {
      cleaned = replacePlaceholder(cleaned, "ML Engineer Intern at SparkLabs AI (Implemented vision transformer diagnostic pipelines)", data.details.experience);
    }
    if (data.details.projects) {
      cleaned = replacePlaceholder(cleaned, "Custom RESP Engine (Rust) - in-memory key-value store, Interactive Mindmap (React) - visual graphs", data.details.projects);
    }
    if (data.details.achievements) {
      cleaned = replacePlaceholder(cleaned, "Hackathon Winner 2026, Dean's List (GPA 3.9/4.0)", data.details.achievements);
    }
    if (data.details.hobbies) {
      cleaned = replacePlaceholder(cleaned, "Chess, Watching Cricket, Hiking", data.details.hobbies);
    }

    return { html: cleaned };
  });

export const updateCustomPortfolio = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      html: string;
      details: PortfolioDetails;
      prompt: string;
    }) => d,
  )
  .handler(async ({ data }): Promise<{ html: string }> => {
    const prompt = `You are a world-class frontend engineer and UI/UX designer. Modify the following developer portfolio HTML page based on the update request.
    
Existing HTML:
\`\`\`html
${data.html}
\`\`\`

Candidate Details (for reference to ensure they remain populated):
- Name: ${data.details.fullName}
- Title: ${data.details.focusTitle}
- Email: ${data.details.email}
- GitHub: ${data.details.github}
- LinkedIn: ${data.details.linkedin}
- Skills: ${data.details.skills}
- Education: ${data.details.education}
- Experience: ${data.details.experience}
- Projects: ${data.details.projects}
- Achievements: ${data.details.achievements}
- Hobbies: ${data.details.hobbies}

Update Request:
"${data.prompt}"

CRITICAL REQUIREMENTS:
1. Retain the candidate's exact information, but apply the style edits, structure updates, layout modifications, or text replacements requested.
2. Return ONLY the modified raw HTML starting with <!DOCTYPE html>. Do not wrap in triple backticks or markdown.`;

    const { text } = await generateTextResilient({
      system: "You are a web page generator. Return ONLY the raw HTML code. Do not wrap in triple backticks or markdown.",
      prompt,
    });

    let cleaned = extractHtml(text);

    // Heuristic fallback replacements to ensure details are correct
    const replacePlaceholder = (htmlText: string, search: string, replacement: string) => {
      if (!search || !replacement) return htmlText;
      const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      return htmlText.replace(new RegExp(escaped, 'gi'), replacement);
    };

    if (data.details.fullName) {
      cleaned = replacePlaceholder(cleaned, "Arun Singh", data.details.fullName);
    }
    if (data.details.focusTitle) {
      cleaned = replacePlaceholder(cleaned, "AI Solutions Engineer", data.details.focusTitle);
      cleaned = replacePlaceholder(cleaned, "Full Stack Engineer", data.details.focusTitle);
    }
    if (data.details.email) {
      cleaned = replacePlaceholder(cleaned, "arun.singh@sparklabs.ai", data.details.email);
    }

    return { html: cleaned };
  });

