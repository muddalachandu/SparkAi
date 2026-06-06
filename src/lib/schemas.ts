import { z } from "zod";

export const ProjectIdeaSchema = z.object({
  title: z.string(),
  problemStatement: z.string(),
  solutionOverview: z.string(),
  technologies: z.array(z.string()),
  requirements: z.object({
    hardware: z.array(z.string()),
    software: z.array(z.string()),
  }),
  architecture: z.array(z.string()),
  timeline: z.array(z.string()),
  futureScope: z.array(z.string()),
  resumeValueScore: z.coerce.number().min(0).max(10),
  innovationScore: z.coerce.number().min(0).max(10),
  techDepthScore: z.coerce.number().min(0).max(10),
  marketPotential: z.string(),
  difficulty: z.string(),
  domains: z.array(z.string()),
});
export type ProjectIdea = z.infer<typeof ProjectIdeaSchema>;

export const FALLBACK_IDEA: ProjectIdea = {
  title: "Smart AI Attendance System",
  problemStatement: "Manual attendance systems are inefficient.",
  solutionOverview: "AI-powered automated attendance using face recognition.",
  technologies: ["React", "Node.js", "TensorFlow", "MongoDB"],
  requirements: { hardware: ["Webcam"], software: ["VS Code"] },
  architecture: ["Capture Image", "Detect Face", "Store Attendance"],
  timeline: ["Week 1 - Research", "Week 2 - Development", "Week 3 - Testing"],
  futureScope: ["Cloud sync", "Mobile integration"],
  resumeValueScore: 9,
  innovationScore: 8,
  techDepthScore: 7.5,
  marketPotential: "High",
  difficulty: "Intermediate",
  domains: ["AI/ML", "Computer Vision"],
};

export const RoadmapSchema = z.object({
  role: z.string(),
  summary: z.string(),
  phases: z.array(
    z.object({
      title: z.string(),
      duration: z.string(),
      skills: z.array(z.string()),
      projects: z.array(z.string()),
      certifications: z.array(z.string()),
    }),
  ),
  dailySchedule: z.array(z.string()),
  interviewPrep: z.array(z.string()),
});
export type Roadmap = z.infer<typeof RoadmapSchema>;

export const StudyGuideSchema = z.object({
  title: z.string(),
  summary: z.string(),
  weeks: z.array(
    z.object({
      week: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
      resources: z.array(z.string()),
    }),
  ),
  miniProjects: z.array(z.string()),
  quizzes: z.array(z.string()),
});
export type StudyGuide = z.infer<typeof StudyGuideSchema>;

export const BuildBlueprintSchema = z.object({
  title: z.string(),
  techStack: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
    devops: z.array(z.string()),
  }),
  folderStructure: z.array(z.string()),
  frontendArchitecture: z.array(z.string()),
  backendArchitecture: z.array(z.string()),
  databaseSchema: z.array(z.object({ table: z.string(), columns: z.array(z.string()) })),
  apiRoutes: z.array(z.object({ method: z.string(), path: z.string(), description: z.string() })),
  authSetup: z.array(z.string()),
  envVariables: z.array(z.string()),
  recommendedLibraries: z.array(z.string()),
  testingStrategy: z.array(z.string()),
  cicd: z.array(z.string()),
  deploymentSteps: z.array(z.string()),
  githubWorkflow: z.array(z.string()),
  mvpPlan: z.array(z.string()),
  implementationSteps: z.array(
    z.object({ step: z.number(), title: z.string(), detail: z.string() }),
  ),
  starterSnippets: z.array(
    z.object({ filename: z.string(), language: z.string(), code: z.string() }),
  ),
  estimatedTimeline: z.string(),
});
export type BuildBlueprint = z.infer<typeof BuildBlueprintSchema>;

export const MentorPlanSchema = z.object({
  topic: z.string(),
  overview: z.string(),
  prerequisites: z.array(z.string()),
  concepts: z.array(z.object({ name: z.string(), explanation: z.string(), example: z.string() })),
  practiceTasks: z.array(z.string()),
  nextSteps: z.array(z.string()),
  estimatedHours: z.number(),
});
export type MentorPlan = z.infer<typeof MentorPlanSchema>;
