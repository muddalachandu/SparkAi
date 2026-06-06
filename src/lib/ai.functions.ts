import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateTextResilient, getAvailableProviders } from "./ai-gateway";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  FALLBACK_IDEA,
  ProjectIdeaSchema,
  RoadmapSchema,
  StudyGuideSchema,
  BuildBlueprintSchema,
  MentorPlanSchema,
  type ProjectIdea,
  type Roadmap,
  type StudyGuide,
  type BuildBlueprint,
  type MentorPlan,
} from "./schemas";

export const SYSTEM = `Return ONLY valid JSON. Do not include markdown. Do not wrap in triple backticks. Do not include any explanation. All fields are mandatory.`;

export function getModel() {
  const providers = getAvailableProviders();
  if (providers.length === 0) throw new Error("No AI API Keys configured.");
  return providers[0].model;
}

export function extractJson(text: string): unknown {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
  }
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first >= 0 && last > first) t = t.slice(first, last + 1);
  return JSON.parse(t);
}

async function callJson<T>(schema: z.ZodType<T>, prompt: string, fallback?: T): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { text } = await generateTextResilient({
        system: SYSTEM,
        prompt,
        temperature: attempt === 0 ? 0.7 : 0.4,
      });
      const json = extractJson(text);
      const parsed = schema.safeParse(json);
      if (parsed.success) return parsed.data;
      console.error("[AI] schema parse failed", parsed.error.issues, "raw:", text.slice(0, 500));
    } catch (e) {
      console.error("[AI] generation error", e);
    }
  }
  if (fallback) return fallback;
  throw new Error("AI failed to return valid JSON after retries.");
}

function getFallbackRoadmap(role: string, timeframe: string, level: string, dailyHours: number): Roadmap {
  const normRole = role || "Software Engineer";
  const normLevel = level || "Beginner";
  const normTime = timeframe || "3 months";
  const normHours = dailyHours || 2;
  
  return {
    role: normRole,
    summary: `A customized career path designed to take you from ${normLevel} to professional competency as a ${normRole} within a ${normTime} timeframe, studying ${normHours} hours per day.`,
    phases: [
      {
        title: `Phase 1: Foundational Tools & Core Syntax for ${normRole}`,
        duration: `Weeks 1-4`,
        skills: [`Basic syntax & core theory of ${normRole}`, `Integrated Development Environments (IDEs)`, `Version Control with Git & GitHub`],
        projects: [`First Hello-World ${normRole} project`, `Simple personal command-line utility`],
        certifications: [`Introduction to ${normRole} Fundamentals`]
      },
      {
        title: `Phase 2: Intermediate Concepts & Local Development`,
        duration: `Weeks 5-8`,
        skills: [`Debugging & troubleshooting workflows`, `Structuring data lists and objects`, `Package management & simple libraries`],
        projects: [`Interactive console application`, `Local automated test suite`],
        certifications: [`Intermediate developer skills in ${normRole}`]
      },
      {
        title: `Phase 3: Advanced Architectures & State Management`,
        duration: `Weeks 9-12`,
        skills: [`Asynchronous programming & network calls`, `Designing relational datasets`, `Performance tuning & optimization`],
        projects: [`Data dashboard displaying external API payloads`, `Multi-layered storage-oriented application`],
        certifications: [`Advanced concepts for ${normRole} developers`]
      },
      {
        title: `Phase 4: Real-world Workflows & Deployment`,
        duration: `Weeks 13+`,
        skills: [`CI/CD pipeline orchestration`, `Secure environment variables and production hosting`, `Professional system design patterns`],
        projects: [`Production-ready deployed deployment of ${normRole} system`, `Portfolio project showcase`],
        certifications: [`Certified ${normRole} Professional - Capstone Certificate`]
      }
    ],
    dailySchedule: [
      `30 mins: Read technical articles or official docs for ${normRole}`,
      `${normHours * 40} mins: Hands-on code construction and project building`,
      `${normHours * 15} mins: Refactoring syntax and pushing code to GitHub`,
      `15 mins: Review open-source codebases or solve quick coding algorithms`
    ],
    interviewPrep: [
      `Mastering the foundational interview questions for ${normRole}`,
      `Practice explaining system design concepts and patterns aloud`,
      `Optimize your resume and LinkedIn to highlight your ${normRole} projects`,
      `Participate in mock interviews focusing on data structures & debugging`,
      `Write a clear, structured case study for your capstone project`
    ]
  };
}

function getFallbackStudyGuide(domain: string, skillLevel: string, goal: string, dailyMinutes: number): StudyGuide {
  const normDomain = domain || "Software Engineering";
  const normLevel = skillLevel || "Beginner";
  const normGoal = goal || "Learn key patterns";
  const normMins = dailyMinutes || 60;
  
  return {
    title: `Comprehensive Guide to mastering ${normDomain}`,
    summary: `Structured study outline designed for a ${normLevel} to achieve the goal: "${normGoal}" in ${normMins} minutes of daily practice.`,
    weeks: [
      {
        week: 1,
        focus: `Orientation and Core Concepts of ${normDomain}`,
        tasks: [
          `Install the required IDE and standard developer extensions`,
          `Write your first Hello-World program and run it locally`,
          `Familiarize yourself with basic variables, control flows, and loops`
        ],
        resources: [
          `Official Documentation Quickstart Guide`,
          `Interactive Introductory Coding Course (FreeCodeCamp/W3Schools)`,
          `Video: Core Concepts of ${normDomain} explained in 15 minutes`
        ]
      },
      {
        week: 2,
        focus: `Data Layouts and Object Relationships`,
        tasks: [
          `Implement arrays, collections, and simple dictionaries/objects`,
          `Build functions that perform calculations and manipulate complex collections`,
          `Handle user input and read output safely from standard streams`
        ],
        resources: [
          `MDN / DevDocs Guides on Data Types`,
          `Article: Mastering lists and maps in modern ${normDomain}`,
          `Practical exercise sheets on data operations`
        ]
      },
      {
        week: 3,
        focus: `Modular Architecture and Code Packaging`,
        tasks: [
          `Split a single code file into separate importable modules`,
          `Integrate external libraries via a package manager`,
          `Write exception handling wrappers for files and network calls`
        ],
        resources: [
          `Tutorial: Organizing files and namespaces in ${normDomain}`,
          `Guide to dependency management and configuration`,
          `Reference manual on common exceptions and how to debug them`
        ]
      },
      {
        week: 4,
        focus: `Testing, Deployment and Mastery of the Goal`,
        tasks: [
          `Write unit tests focusing on standard behavior and edge cases`,
          `Build and test a fully functional mini-project matching: ${normGoal}`,
          `Publish your project on GitHub and document it with a clean README`
        ],
        resources: [
          `Best practices for structuring README.md documentation`,
          `CI/CD integration checklists`,
          `Refactoring guidelines for professional software developers`
        ]
      }
    ],
    miniProjects: [
      `Simple Command Line Dashboard demonstrating ${normDomain} syntax`,
      `Interactive Data Converter converting values/formats locally`,
      `Personal Task Organizer utilizing object-oriented database storage`,
      `Capstone Project: Deployed application addressing the goal: "${normGoal}"`
    ],
    quizzes: [
      `Quiz 1: Core Syntax, Variables, and Logic constructs in ${normDomain}`,
      `Quiz 2: Structuring datasets and utilizing functions`,
      `Quiz 3: Dynamic module imports, package usage, and error boundary handling`,
      `Quiz 4: Testing protocols, clean deployment, and project organization`
    ]
  };
}

function getFallbackBuildBlueprint(title: string, description: string, technologies: string[]): BuildBlueprint {
  const normTitle = title || "Next-Gen Project Application";
  const normDesc = description || "A premium, state-of-the-art software system.";
  const tech = technologies && technologies.length > 0 ? technologies : ["React", "TypeScript", "Node.js", "TailwindCSS"];
  
  const frontend = tech.filter(t => /react|vue|angular|svelte|next|nuxt|tailwind|css|html|js|ts|ui/i.test(t));
  const backend = tech.filter(t => /node|express|nest|python|django|flask|fastapi|go|rust|java|c#/i.test(t));
  const db = tech.filter(t => /sql|postgres|mongo|redis|prisma|supabase|firebase|db/i.test(t));
  const devops = tech.filter(t => /docker|k8s|aws|vercel|netlify|github|ci|cd|action/i.test(t));
  
  if (frontend.length === 0) frontend.push("Vite / React SPA");
  if (backend.length === 0) backend.push("Node.js / Express");
  if (db.length === 0) db.push("PostgreSQL (Supabase)");
  if (devops.length === 0) devops.push("Vercel & GitHub Actions");

  return {
    title: normTitle,
    techStack: {
      frontend,
      backend,
      database: db,
      devops
    },
    folderStructure: [
      `src/components/`,
      `src/hooks/`,
      `src/lib/`,
      `src/routes/`,
      `src/styles/`,
      `src/main.tsx`,
      `supabase/`,
      `package.json`,
      `tsconfig.json`,
      `README.md`
    ],
    frontendArchitecture: [
      `Component-Driven Architecture (reusable, atomic layout structures)`,
      `Global State Management for user session configuration and sound levels`,
      `Responsive design scaling across Desktop, Mobile, and Tablet devices`,
      `CSS grid & flexbox systems for fluid, modern user interfaces`,
      `Optimized media loaders and content prefetching systems`
    ],
    backendArchitecture: [
      `RESTful API routes or Server Actions handles secure operations`,
      `Input validation wrappers (Zod) on all payload endpoints`,
      `Error boundary middleware capturing exceptions and logging failures`,
      `Database connections managed via connection pool structures`,
      `Security headers and CORS configuration enabling safe cross-origin access`
    ],
    databaseSchema: [
      {
        table: `users`,
        columns: [`id (uuid, PK)`, `email (varchar, unique)`, `created_at (timestamp)`, `updated_at (timestamp)`]
      },
      {
        table: `projects`,
        columns: [`id (uuid, PK)`, `user_id (uuid, FK)`, `title (varchar)`, `description (text)`, `is_completed (boolean)`, `created_at (timestamp)`]
      },
      {
        table: `logs`,
        columns: [`id (uuid, PK)`, `project_id (uuid, FK)`, `action (varchar)`, `details (jsonb)`, `created_at (timestamp)`]
      }
    ],
    apiRoutes: [
      { method: `GET`, path: `/api/projects`, description: `Retrieve list of all active projects for logged-in user` },
      { method: `POST`, path: `/api/projects`, description: `Create a new project workspace under user ownership` },
      { method: `PUT`, path: `/api/projects/:id`, description: `Update properties or completion status of a project` },
      { method: `DELETE`, path: `/api/projects/:id`, description: `Safely delete a project record and cascade related database logs` }
    ],
    authSetup: [
      `Utilize JSON Web Tokens (JWT) or OAuth providers for session tokens`,
      `Redirect unauthorized users to root/login views via layout middleware rules`,
      `Store active sessions securely using client-side cookies or localStorage`,
      `Configure token expiration and automatic silent session refresh requests`
    ],
    envVariables: [
      `VITE_SUPABASE_URL=URL endpoint of the database service provider`,
      `VITE_SUPABASE_PUBLISHABLE_KEY=Public access key client token`,
      `DATABASE_URL=Direct connection string for backend migration executions`,
      `NODE_ENV=Set to 'development' or 'production'`
    ],
    recommendedLibraries: [
      `lucide-react`,
      `clsx`,
      `tailwind-merge`,
      `zod`,
      `canvas-confetti`
    ],
    testingStrategy: [
      `Unit tests utilizing Vitest targeting business logic and utilities`,
      `End-to-End browser tests (Playwright) testing main user journeys`,
      `Component testing utilizing React Testing Library validating element states`
    ],
    cicd: [
      `GitHub Actions triggers automated checks on all Pull Requests`,
      `Build stage executes 'npx tsc --noEmit && npm run build'`,
      `Lint checks check code format policies before allowing integration`
    ],
    deploymentSteps: [
      `1. Log into your hosting console (e.g. Vercel / Netlify)`,
      `2. Connect the GitHub repository to the project dashboard`,
      `3. Configure environment variables matching target deployment settings`,
      `4. Trigger initial build and verify URLs resolve properly`
    ],
    githubWorkflow: [
      `Create feature branches off the 'main' branch`,
      `Open a pull request once tests pass locally`,
      `Request peer review before merging code branches`,
      `Release builds automatically deploy to production upon merging to main`
    ],
    mvpPlan: [
      `Responsive web dashboard displaying list of tasks`,
      `Creation form allowing user to add, edit, and delete items`,
      `Sound effect notifications trigger on successful status update`,
      `Secure auth login block protecting user workspace directories`
    ],
    implementationSteps: [
      { step: 1, title: `Workspace Initialization`, detail: `Create the app using Vite, configure TypeScript, and set up Git repository structure.` },
      { step: 2, title: `Database & Tables Setup`, detail: `Execute SQL migrations to instantiate users, projects, and logs tables.` },
      { step: 3, title: `Authentication Layout`, detail: `Build login templates and wire secure callback handlers to capture session cookies.` },
      { step: 4, title: `Core API Handlers`, detail: `Implement router endpoints executing database read/write actions.` },
      { step: 5, title: `UI Layout Components`, detail: `Design dashboard views displaying active project lists and action forms.` },
      { step: 6, title: `Sound & Animations Integration`, detail: `Wire action hooks triggering visual canvas-confetti and audible sound bells.` },
      { step: 7, title: `Production Deployment`, detail: `Publish workspace variables, push to Vercel/Netlify, and execute live tests.` }
    ],
    starterSnippets: [
      {
        filename: `src/lib/db.ts`,
        language: `typescript`,
        code: `// Initializing database client instance\nimport { createClient } from '@supabase/supabase-js';\n\nconst supabaseUrl = import.meta.env.VITE_SUPABASE_URL;\nconst supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;\n\nexport const db = createClient(supabaseUrl, supabaseKey);\n`
      },
      {
        filename: `src/components/SoundButton.tsx`,
        language: `tsx`,
        code: `// Interactive button triggering a click sound effect\nimport React from 'react';\nimport { playSound } from '../lib/sounds';\n\nexport const SoundButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => {\n  const handleClick = () => {\n    playSound('click');\n    onClick();\n  };\n  return (\n    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md transition-all active:scale-95" onClick={handleClick}>\n      {children}\n    </button>\n  );\n};\n`
      }
    ],
    estimatedTimeline: `1-2 weeks`
  };
}

function getFallbackMentorPlan(topic: string, level: string, goal: string): MentorPlan {
  const normalizedTopic = topic || "Web Development";
  return {
    topic: normalizedTopic,
    overview: `A structured learning plan designed for a ${level || "beginner"}-level student to master ${normalizedTopic} and achieve the following goal: "${goal || "Build personal projects"}".`,
    prerequisites: [
      `Basic computer literacy and text editor installation`,
      `Familiarity with fundamental concepts related to ${normalizedTopic}`,
      `A desire to learn and practice coding daily`
    ],
    concepts: [
      {
        name: `Core Fundamentals of ${normalizedTopic}`,
        explanation: `Introduction to the foundational syntax, structures, and tools essential to working with ${normalizedTopic}.`,
        example: `Setting up your environment, writing basic commands/scripts, and executing your first simple application.`
      },
      {
        name: `Working with Structured Data`,
        explanation: `Understanding how variables, collections, or data objects are manipulated and managed within ${normalizedTopic}.`,
        example: `Declaring objects/arrays, querying lists, and passing datasets through operational functions.`
      },
      {
        name: `Integration & Best Practices`,
        explanation: `Applying architectural patterns, security controls, and clean code principles to build sustainable systems.`,
        example: `Refactoring spaghetti code into organized modules, writing unit tests, and structuring file directories.`
      },
      {
        name: `Debugging and Error Management`,
        explanation: `Strategies for reading logs, handling exceptions, and troubleshooting issues that arise during execution.`,
        example: `Using try-catch blocks and breakpoints to isolate and resolve unexpected runtime crashes.`
      },
      {
        name: `Project Deployment`,
        explanation: `Taking local source code and hosting it on a remote server, cloud provider, or platform for public access.`,
        example: `Configuring deployment scripts, setting up environment variables, and publishing to GitHub.`
      }
    ],
    practiceTasks: [
      `Set up your development workspace and write a hello-world program in ${normalizedTopic}`,
      `Create a simple mini-project demonstrating core logic and data operations`,
      `Refactor a previous code sample to implement modular patterns and error handling`,
      `Write 3 automated tests targeting edge cases in your ${normalizedTopic} code`,
      `Deploy your project to a staging or production hosting environment`
    ],
    nextSteps: [
      `Deep dive into advanced topics like asynchronous design or performance optimization`,
      `Join community forums, read official documentation, and review open-source repositories`,
      `Build a complex portfolio project utilizing all concepts from this roadmap`
    ],
    estimatedHours: 15
  };
}

export const generateProjectIdea = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      domains: string[];
      difficulty: string;
      projectType: string;
      duration: string;
      teamSize: string;
    }) => d,
  )
  .handler(async ({ data }): Promise<ProjectIdea> => {
    const prompt = `Generate ONE original, modern project idea as JSON.

Constraints:
- domains: ${data.domains.join(", ") || "any"}
- difficulty: ${data.difficulty}
- projectType: ${data.projectType}
- duration: ${data.duration}
- teamSize: ${data.teamSize}

JSON shape (all fields required):
{
  "title": string,
  "problemStatement": string,
  "solutionOverview": string,
  "technologies": string[],
  "requirements": { "hardware": string[], "software": string[] },
  "architecture": string[] (4-7 ordered steps),
  "timeline": string[] (e.g. "Week 1 - ..."),
  "futureScope": string[],
  "resumeValueScore": number (0-10, may be decimal like 8.5),
  "innovationScore": number (0-10, may be decimal like 8.5),
  "techDepthScore": number (0-10, may be decimal like 8.5),
  "marketPotential": "Low" | "Medium" | "High" | "Very High",
  "difficulty": string,
  "domains": string[]
}`;
    return callJson(ProjectIdeaSchema, prompt, FALLBACK_IDEA);
  });

export const generateRoadmap = createServerFn({ method: "POST" })
  .inputValidator((d: { role: string; timeframe: string; level: string; dailyHours: number }) => d)
  .handler(async ({ data }): Promise<Roadmap> => {
    const prompt = `Generate a personalized career roadmap as JSON.
Role: ${data.role}
Timeframe: ${data.timeframe}
Experience: ${data.level}
Daily hours available: ${data.dailyHours}

JSON shape:
{
  "role": string,
  "summary": string,
  "phases": [{ "title": string, "duration": string, "skills": string[], "projects": string[], "certifications": string[] }] (4-6 phases),
  "dailySchedule": string[] (5-8 items),
  "interviewPrep": string[] (5-8 items)
}`;
    return callJson(RoadmapSchema, prompt, getFallbackRoadmap(data.role, data.timeframe, data.level, data.dailyHours));
  });

export const generateStudyGuide = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { domain: string; skillLevel: string; goal: string; dailyMinutes: number }) => d,
  )
  .handler(async ({ data }): Promise<StudyGuide> => {
    const cacheKey = `study-guide-global:${data.domain}:${data.skillLevel}:${data.goal}`;

    // 1. Check cache first
    try {
      const { data: cached } = await supabaseAdmin
        .from("roadmap_cache")
        .select("content")
        .eq("domain", cacheKey)
        .eq("tier", "study-guide-global")
        .maybeSingle();
      if (cached?.content) {
        return cached.content as unknown as StudyGuide;
      }
    } catch (e) {
      console.warn("[study-guide-global] Cache read failed:", e);
    }

    const prompt = `Generate a personalized study guide as JSON.
Domain: ${data.domain}
Skill level: ${data.skillLevel}
Goal: ${data.goal}
Daily time: ${data.dailyMinutes} minutes

JSON shape:
{
  "title": string,
  "summary": string,
  "weeks": [{ "week": number, "focus": string, "tasks": string[], "resources": string[] }],
  "miniProjects": string[],
  "quizzes": string[]
}
Generate 4-8 weeks.`;

    const generated = await callJson(
      StudyGuideSchema,
      prompt,
      getFallbackStudyGuide(data.domain, data.skillLevel, data.goal, data.dailyMinutes),
    );

    // Save to cache in the background
    (async () => {
      try {
        await supabaseAdmin.from("roadmap_cache").upsert({
          domain: cacheKey,
          tier: "study-guide-global",
          content: generated as any,
          generated_by: "AI",
          model: "google/gemini-2.5-flash",
          version: "1.0",
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      } catch (err) {
        console.warn("[study-guide-global] Background cache write failed:", err);
      }
    })();

    return generated;
  });

export const generateBuildBlueprint = createServerFn({ method: "POST" })
  .inputValidator((d: { title: string; description: string; technologies: string[] }) => d)
  .handler(async ({ data }): Promise<BuildBlueprint> => {
    const prompt = `Generate a COMPLETE production-ready build blueprint as JSON for this project.

Title: ${data.title}
Description: ${data.description}
Preferred tech: ${data.technologies.join(", ")}

JSON shape (every field required, generate rich detail):
{
  "title": string,
  "techStack": { "frontend": string[], "backend": string[], "database": string[], "devops": string[] },
  "folderStructure": string[] (10-20 lines like "src/components/", "src/api/users.ts"),
  "frontendArchitecture": string[] (5-8 bullets),
  "backendArchitecture": string[] (5-8 bullets),
  "databaseSchema": [{ "table": string, "columns": string[] }] (3-6 tables),
  "apiRoutes": [{ "method": string, "path": string, "description": string }] (6-12 routes),
  "authSetup": string[] (4-6 steps),
  "envVariables": string[] (5-10 KEY=description),
  "recommendedLibraries": string[] (8-12 libs),
  "testingStrategy": string[] (4-6 bullets),
  "cicd": string[] (4-6 bullets),
  "deploymentSteps": string[] (5-8 steps),
  "githubWorkflow": string[] (5-7 steps),
  "mvpPlan": string[] (5-8 features),
  "implementationSteps": [{ "step": number, "title": string, "detail": string }] (8-12 steps),
  "starterSnippets": [{ "filename": string, "language": string, "code": string }] (3-5 real, useful code snippets),
  "estimatedTimeline": string
}`;
    return callJson(BuildBlueprintSchema, prompt, getFallbackBuildBlueprint(data.title, data.description, data.technologies));
  });

export const generateMentorPlan = createServerFn({ method: "POST" })
  .inputValidator((d: { topic: string; level: string; goal: string }) => d)
  .handler(async ({ data }): Promise<MentorPlan> => {
    const prompt = `You are an expert AI mentor. Build a structured learning plan as JSON.

Topic: ${data.topic}
Learner level: ${data.level}
Goal: ${data.goal}

JSON shape:
{
  "topic": string,
  "overview": string,
  "prerequisites": string[] (3-6),
  "concepts": [{ "name": string, "explanation": string, "example": string }] (5-8 concepts),
  "practiceTasks": string[] (5-8),
  "nextSteps": string[] (3-5),
  "estimatedHours": number
}`;
    return callJson(MentorPlanSchema, prompt, getFallbackMentorPlan(data.topic, data.level, data.goal));
  });

export const generateProjectPrototypeCode = createServerFn({ method: "POST" })
  .inputValidator((d: { title: string; description: string; technologies: string[] }) => d)
  .handler(async ({ data }): Promise<{ html: string }> => {
    const prompt = `You are a world-class frontend engineer and UI/UX designer. Generate a complete, standalone, premium, single-page prototype web application as a single HTML string based on the following project blueprint details.
    
Project Title: ${data.title}
Description: ${data.description}
Technologies requested: ${data.technologies.join(", ")}

CRITICAL REQUIREMENTS:
1. Return a single complete HTML page starting with <!DOCTYPE html>.
2. Embed all CSS styles inside a <style> tag in the <head>. Use a dark theme with smooth gradients, glassmorphism, nice typography (Google Fonts like Inter or Space Grotesk), micro-interactions, hover states, and premium aesthetics matching the platform.
3. Embed all interactive JavaScript inside a <script> tag before the closing </body> tag. Write functional code to support mock database operations, adding items, deleting items, interactive components, dynamic search, tab changes, and dashboard statistics in the prototype.
4. Ensure there are NO placeholders or missing assets. Use clean inline SVGs for any icons needed.
5. The response must be ONLY the raw HTML code. Do NOT wrap it in markdown code fences or backticks.`;

    const { text } = await generateTextResilient({
      system: "You are a web page builder. Return ONLY the raw HTML code. Do not wrap in triple backticks or markdown.",
      prompt,
    });

    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned
        .replace(/^```(?:html)?/i, "")
        .replace(/```$/, "")
        .trim();
    }
    return { html: cleaned };
  });

export const updateProjectPrototypeCode = createServerFn({ method: "POST" })
  .inputValidator((d: { currentHtml: string; prompt: string }) => d)
  .handler(async ({ data }): Promise<{ html: string }> => {
    const prompt = `You are an expert AI software developer. You are updating an existing single-page web application prototype based on a user's prompt request.
    
User Request:
"${data.prompt}"

Existing Prototype HTML Code:
${data.currentHtml.slice(0, 30000)}

CRITICAL REQUIREMENTS:
1. Update the code to implement the user's request. Modify elements, styles, scripts, or add new features as instructed.
2. Maintain the beautiful glassmorphic visual system, sleek dark theme, and high-fidelity interactive details.
3. Return the COMPLETE updated HTML code (including all styles and scripts). Do NOT output only the diff or partial snippets.
4. Return ONLY the raw HTML code. Do NOT wrap the output in markdown code fences or triple backticks. Start directly with <!DOCTYPE html>.`;

    const { text } = await generateTextResilient({
      system: "You are a web page builder. Return ONLY the raw HTML code. Do not wrap in triple backticks or markdown.",
      prompt,
    });

    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned
        .replace(/^```(?:html)?/i, "")
        .replace(/```$/, "")
        .trim();
    }
    return { html: cleaned };
  });
