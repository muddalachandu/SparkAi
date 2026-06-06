import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateTextResilient } from "./ai-gateway";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getSeededRoadmap, type RoadmapTier, type Tier, type RoadmapNode, FALLBACK_CURRICULA } from "./roadmap-catalog";
import { DOMAIN_BY_SLUG } from "./domains";
import { getModel, SYSTEM, extractJson } from "./ai.functions";
import { getFallbackMindmapAndResources } from "./resource-engine";

const ResourceSchema = z.object({
  type: z.enum(["doc", "youtube", "github", "blog", "practice"]),
  title: z.string(),
  url: z.string(),
  channel: z.string().optional(),
  videoId: z.string().optional(),
  author: z.string().optional(),
  duration: z.string().optional(),
  difficulty: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  free: z.boolean().optional(),
});

const TierSchema = z.object({
  tier: z.enum(["beginner", "intermediate", "advanced"]),
  summary: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      why: z.string(),
      prerequisites: z.array(z.string()),
      outcome: z.string(),
      hours: z.coerce.number().min(0),
      difficulty: z.enum(["easy", "medium", "hard"]),
      skills: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
      interviewTopics: z.array(z.string()).optional(),
      careerImpact: z.string().optional(),
      dependsOn: z.array(z.string()).optional(),
      resources: z.array(ResourceSchema),
      projects: z.array(
        z.object({
          title: z.string(),
          brief: z.string(),
          difficulty: z.enum(["easy", "medium", "hard"]),
        })
      ),
    })
  ),
});


function generateTierFallback(slug: string, tier: Tier): RoadmapTier {
  const domain = DOMAIN_BY_SLUG[slug];
  const name = domain?.name ?? slug;
  
  // Check if we have pre-seeded domain-specific fallback nodes
  const domainCurriculum = FALLBACK_CURRICULA[slug]?.[tier];
  if (domainCurriculum && domainCurriculum.length > 0) {
    return {
      tier,
      summary: `A comprehensive ${tier} learning path for ${name} covering core concepts, modules, and practical projects.`,
      nodes: domainCurriculum,
    };
  }
  
  const nodes: RoadmapNode[] = [
    {
      id: `${slug}-${tier}-1`,
      title: `Introduction to ${name} (${tier})`,
      why: `To get started with ${name}, you need to understand the core foundations and fundamental concepts.`,
      prerequisites: [],
      outcome: `Understand the high-level architecture and fundamental blocks of ${name}.`,
      hours: 10,
      difficulty: "easy",
      skills: ["Fundamentals", name],
      tools: ["Editor", "CLI"],
      interviewTopics: [`What is ${name}?`, `Core principles of ${name}`],
      careerImpact: `Establishes a solid base for advanced features.`,
      resources: [
        {
          type: "doc",
          title: `Official ${name} Documentation`,
          url: `https://www.google.com/search?q=${encodeURIComponent(name + ' official documentation')}`,
          difficulty: "beginner",
          rating: 4.9,
          free: true
        },
        {
          type: "youtube",
          title: `${name} Beginner Tutorial`,
          url: "https://www.youtube.com/watch?v=de9Wq3yK9fs",
          videoId: "de9Wq3yK9fs",
          channel: "Tech Guides",
          difficulty: "beginner",
          rating: 4.8,
          free: true
        }
      ],
      projects: [
        {
          title: `Simple ${name} Starter`,
          brief: `A basic project to test installation, configuration, and fundamental APIs of ${name}.`,
          difficulty: "easy"
        }
      ]
    },
    {
      id: `${slug}-${tier}-2`,
      title: `Core ${name} Development`,
      why: `Understanding how ${name} is structured internally is essential for building real-world software.`,
      prerequisites: [`${slug}-${tier}-1`],
      outcome: `Design and structure files using modern architectural standards.`,
      hours: 15,
      difficulty: "medium",
      skills: ["Architecture", "Design Patterns"],
      tools: ["Debugger"],
      interviewTopics: [`Internal architecture of ${name}`, "Common design patterns"],
      careerImpact: `Enables building larger codebases with confidence.`,
      resources: [
        {
          type: "blog",
          title: `Best Practices in ${name}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(name + ' architecture best practices')}`,
          difficulty: "intermediate",
          rating: 4.7,
          free: true
        },
        {
          type: "youtube",
          title: `Mastering ${name} Components`,
          url: "https://www.youtube.com/watch?v=de9Wq3yK9fs",
          videoId: "de9Wq3yK9fs",
          channel: "Code Mastery",
          difficulty: "intermediate",
          rating: 4.8,
          free: true
        }
      ],
      projects: [
        {
          title: `${name} Advanced Application`,
          brief: `Build a mid-sized component implementing data binding, routing, or state updates.`,
          difficulty: "medium"
        }
      ]
    },
    {
      id: `${slug}-${tier}-3`,
      title: `Advanced ${name} Techniques`,
      why: `Managing variables and API integration is critical as features grow in complexity.`,
      prerequisites: [`${slug}-${tier}-2`],
      outcome: `Handle remote data fetching, storage caching, and updates.`,
      hours: 12,
      difficulty: "medium",
      skills: ["State Management", "APIs"],
      tools: ["DevTools"],
      interviewTopics: ["How to manage state?", "Lifecycle methods or lifecycle equivalents"],
      careerImpact: `Required for any production level applications.`,
      resources: [
        {
          type: "github",
          title: `${name} Boilerplate Repository`,
          url: `https://github.com/search?q=${encodeURIComponent(name + ' template')}`,
          difficulty: "intermediate",
          rating: 4.6,
          free: true
        },
        {
          type: "youtube",
          title: `Advanced ${name} Guide`,
          url: "https://www.youtube.com/watch?v=de9Wq3yK9fs",
          videoId: "de9Wq3yK9fs",
          channel: "Dev channel",
          difficulty: "intermediate",
          rating: 4.5,
          free: true
        }
      ],
      projects: [
        {
          title: `Advanced ${name} Deployment`,
          brief: `A stateful tracker that syncs updates dynamically.`,
          difficulty: "medium"
        }
      ]
    },
    {
      id: `${slug}-${tier}-4`,
      title: `Testing & Performance in ${name}`,
      why: `Clean and fast code makes the difference between junior developers and senior engineers.`,
      prerequisites: [`${slug}-${tier}-3`],
      outcome: `Write unit and integration tests and profile your application performance.`,
      hours: 10,
      difficulty: "hard",
      skills: ["Testing", "Optimization"],
      tools: ["Profiler", "Testing Framework"],
      interviewTopics: ["Testing strategies", "Performance optimization patterns"],
      careerImpact: `Ensures robust, scalable applications.`,
      resources: [
        {
          type: "doc",
          title: `Testing ${name} Applications`,
          url: `https://www.google.com/search?q=${encodeURIComponent(name + ' testing guide')}`,
          difficulty: "advanced",
          rating: 4.8,
          free: true
        },
        {
          type: "youtube",
          title: `Performance tuning ${name}`,
          url: "https://www.youtube.com/watch?v=de9Wq3yK9fs",
          videoId: "de9Wq3yK9fs",
          channel: "Tech optimization",
          difficulty: "advanced",
          rating: 4.9,
          free: true
        }
      ],
      projects: [
        {
          title: `Optimized Production Release`,
          brief: `Audit an existing project, write tests, optimize load times by 30%.`,
          difficulty: "hard"
        }
      ]
    }
  ];

  return {
    tier,
    summary: `A comprehensive ${tier} learning path for ${name} covering core concepts, modules, state management, and production readiness.`,
    nodes
  };
}

async function generateTierWithAI(slug: string, tier: Tier): Promise<RoadmapTier> {
  const domain = DOMAIN_BY_SLUG[slug];
  const name = domain?.name ?? slug;
  const prompt = `Design a ${tier} roadmap for "${name}".

Return JSON shaped exactly as:
{
  "tier": "${tier}",
  "summary": "1-2 sentence overview of this tier",
  "nodes": [
    {
      "id": "kebab-id",
      "title": "Topic title",
      "why": "Why this matters (1-2 sentences)",
      "prerequisites": ["other-node-id", "..."],
      "outcome": "What the learner can do after",
      "hours": 10,
      "difficulty": "easy" | "medium" | "hard",
      "skills": ["skill-name-1", "skill-name-2"],
      "tools": ["tool-name-1", "tool-name-2"],
      "interviewTopics": ["topic-1", "topic-2"],
      "careerImpact": "Description of career impact",
      "dependsOn": ["other-node-id", "..."],
      "resources": [
        { 
          "type": "doc" | "youtube" | "github" | "blog" | "practice",
          "title": "...", 
          "url": "https://...",
          "channel": "(youtube only)", 
          "videoId": "(youtube only — 11-char id)",
          "author": "Author or Publisher name",
          "duration": "e.g. 10m or 2h",
          "difficulty": "beginner | intermediate | advanced",
          "rating": 4.8,
          "free": true
        }
      ],
      "projects": [{ "title": "...", "brief": "...", "difficulty": "easy|medium|hard" }]
    }
  ]
}

Rules:
- 5 to 8 ordered nodes, each with 3-5 real, high-quality resources from well-known sources.
- Include at least one YouTube resource per node with the real videoId (no playlists).
- Each node must have at least 1 project.
- Prereq ids must reference earlier nodes in this tier (or [] for first nodes).
`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { text } = await generateTextResilient({
        system: SYSTEM,
        prompt,
        temperature: attempt === 0 ? 0.6 : 0.3,
      });
      const parsed = TierSchema.safeParse(extractJson(text));
      if (parsed.success) return parsed.data;
      console.error("[roadmap] parse failed", parsed.error.issues);
    } catch (e) {
      console.error("[roadmap] AI error", e);
    }
  }
  throw new Error("Failed to generate roadmap");
}

export const getRoadmap = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; tier: Tier }) => d)
  .handler(async ({ data }) => {
    // 1. Seeded?
    const seeded = getSeededRoadmap(data.slug, data.tier);
    if (seeded) return { source: "seed" as const, content: seeded };

    // 2. Cached?
    try {
      const { data: cached } = await supabaseAdmin
        .from("roadmap_cache")
        .select("content")
        .eq("domain", data.slug)
        .eq("tier", data.tier)
        .maybeSingle();
      if (cached?.content) {
        const content = cached.content as unknown as RoadmapTier;
        // Ignore the cache if it's the old generic 4-node fallback, so we load the new beautiful domain-specific curricula
        const isGenericFallback = !content.nodes || content.nodes.length === 4 &&
          content.nodes.some(n => n.id.endsWith("-1") || n.title.includes("Core Components & Architecture") || n.title.includes("State Management & Data Flow"));
        if (!isGenericFallback) {
          return { source: "cache" as const, content };
        }
      }
    } catch (e) {
      console.warn("[roadmap] Cache read failed (likely due to invalid service role key):", e);
    }

    // 3. Cache Miss: Generate AI custom track synchronously
    try {
      console.log(`[roadmap] Cache miss for ${data.slug} (${data.tier}). Generating custom track synchronously.`);
      const generated = await generateTierWithAI(data.slug, data.tier);
      try {
        await supabaseAdmin.from("roadmap_cache").upsert({
          domain: data.slug,
          tier: data.tier,
          content: generated as any,
          generated_by: "AI",
          model: "google/gemini-2.5-flash",
          version: "1.0",
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      } catch (cacheErr) {
        console.warn("[roadmap] Cache write failed (non-fatal):", cacheErr);
      }
      return { source: "AI" as const, content: generated };
    } catch (err) {
      console.error("[roadmap] Synchronous AI generation failed, using fallback:", err);
      const fallback = generateTierFallback(data.slug, data.tier);
      try {
        await supabaseAdmin.from("roadmap_cache").upsert({
          domain: data.slug,
          tier: data.tier,
          content: fallback as any,
          generated_by: "fallback",
          model: "static",
          version: "1.0",
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      } catch (cacheErr) {
        console.warn("[roadmap] Cache fallback write failed:", cacheErr);
      }
      return { source: "fallback" as const, content: fallback };
    }
  });

const StudyGuideNodeSchema = z.object({
  what: z.array(z.string()),
  how: z.array(z.string()),
  practice: z.array(z.string()),
  mini_project: z.object({ title: z.string(), brief: z.string() }),
  quiz: z
    .array(
      z.object({
        q: z.string(),
        choices: z.array(z.string()).length(4),
        answer: z.number().min(0).max(3),
      }),
    )
    .min(3),
});

export const generateNodeStudyGuide = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; tier: Tier; nodeId: string; nodeTitle: string }) => d)
  .handler(async ({ data }) => {
    const cacheKey = `${data.slug}:${data.nodeId}`;
    
    // 1. Check cache first
    try {
      const { data: cached } = await supabaseAdmin
        .from("roadmap_cache")
        .select("content")
        .eq("domain", cacheKey)
        .eq("tier", "study-guide")
        .maybeSingle();
      if (cached?.content) {
        return cached.content as any;
      }
    } catch (e) {
      console.warn("[study-guide] Cache read failed:", e);
    }

    const fallback = {
      what: [
        `Core fundamentals of ${data.nodeTitle}`,
        `Best practices and design patterns in ${data.nodeTitle}`,
        `Integration and common pitfalls of ${data.nodeTitle}`,
        `Advanced optimization techniques`
      ],
      how: [
        `Review documentation for ${data.nodeTitle}`,
        `Set up a local sandbox environment`,
        `Build a simple demo utilizing ${data.nodeTitle}`,
        `Conduct code reviews on open source examples`
      ],
      practice: [
        `Write a clean implementation of ${data.nodeTitle}`,
        `Create test cases covering edge cases`,
        `Profile memory and execution performance`
      ],
      mini_project: {
        title: `${data.nodeTitle} Sandbox`,
        brief: `Create a fully-featured, production-ready implementation showcasing ${data.nodeTitle} with clean code practices and comprehensive tests.`
      },
      quiz: [
        {
          q: `What is the primary benefit of ${data.nodeTitle}?`,
          choices: [
            "Improves system performance and modularity",
            "Reduces development cost to zero",
            "Eliminates the need for testing",
            "Forces the application to run multi-threaded"
          ],
          answer: 0
        },
        {
          q: `Which of the following is a common pitfall when using ${data.nodeTitle}?`,
          choices: [
            "Over-engineering simple implementations",
            "Complete loss of network connectivity",
            "Compiler deprecation of all features",
            "Immediate database lockouts"
          ],
          answer: 0
        },
        {
          q: `How should you structure testing for ${data.nodeTitle}?`,
          choices: [
            "By isolating core logic and testing edge cases",
            "By writing no tests and letting users report bugs",
            "By compiling only on local machines",
            "By testing only database connectivity"
          ],
          answer: 0
        }
      ]
    };

    const generatePromise = (async () => {
      const domain = DOMAIN_BY_SLUG[data.slug]?.name ?? data.slug;
      const prompt = `Build a focused study guide for "${data.nodeTitle}" within ${domain} (${data.tier}). Return JSON:
{
  "what": ["sub-topic", ...],
  "how": ["actionable step", ...],
  "practice": ["exercise", ...],
  "mini_project": { "title": "...", "brief": "..." },
  "quiz": [{ "q": "...", "choices": ["a","b","c","d"], "answer": 0 }, ...]
}
Rules: 4-6 items per list. Exactly 5 quiz items. Real, modern best practices.`;

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const { text } = await generateTextResilient({
            system: SYSTEM,
            prompt,
            temperature: attempt === 0 ? 0.5 : 0.3,
          });
          const parsed = StudyGuideNodeSchema.parse(extractJson(text));

          // Save to database cache in background
          (async () => {
            try {
              await supabaseAdmin.from("roadmap_cache").upsert({
                domain: cacheKey,
                tier: "study-guide",
                content: parsed as any,
                generated_by: "AI",
                model: "google/gemini-2.5-flash",
                version: "1.0",
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              });
            } catch (err) {
              console.warn("[study-guide] Background cache write failed:", err);
            }
          })();

          return parsed;
        } catch (error) {
          console.error(`[StudyGuide] AI attempt ${attempt + 1} failed:`, error);
        }
      }
      return fallback;
    })();

    try {
      return await generatePromise;
    } catch (e) {
      return fallback;
    }
  });

const CustomRoadmapSchema = z.object({
  goal: z.string(),
  weeks: z
    .array(
      z.object({
        week: z.number(),
        theme: z.string(),
        daily: z.array(z.string()).min(3),
        milestone: z.string(),
        project: z.string().optional(),
      }),
    )
    .min(2),
  resources: z.array(ResourceSchema).min(3),
});

export const generateCustomRoadmap = createServerFn({ method: "POST" })
  .inputValidator((d: { goal: string; timeframe: string; level: string }) => d)
  .handler(async ({ data }) => {
    const prompt = `Create a personalized week-by-week roadmap.
Goal: ${data.goal}
Timeframe: ${data.timeframe}
Starting level: ${data.level}

Return JSON:
{
  "goal": "...",
  "weeks": [{ "week": 1, "theme": "...", "daily": ["...","...","..."], "milestone": "...", "project": "optional" }],
  "resources": [{ "type": "doc|youtube|github|blog|practice", "title": "...", "url": "https://..." }]
}
Use real, well-known resources.`;
    const { text } = await generateTextResilient({
      system: SYSTEM,
      prompt,
      temperature: 0.6,
    });
    return CustomRoadmapSchema.parse(extractJson(text));
  });

export const toggleNodeProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      slug: string;
      tier: Tier;
      nodeId: string;
      status: "in_progress" | "done";
      hours?: number;
      bookmarked?: boolean;
    }) => d,
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const payload = {
      user_id: userId,
      domain: data.slug,
      tier: data.tier,
      node_id: data.nodeId,
      status: data.status,
      hours: data.hours ?? 0,
      hours_spent: data.hours ?? 0,
      bookmarked: data.bookmarked ?? false,
      completed_at: data.status === "done" ? new Date().toISOString() : null,
      xp_earned: data.status === "done" ? 100 : 0,
      last_accessed: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("node_progress")
      .upsert(payload, { onConflict: "user_id,domain,tier,node_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getDomainProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("node_progress")
      .select(
        "tier,node_id,status,hours,hours_spent,xp_earned,bookmarked,completed_at,last_accessed",
      )
      .eq("domain", data.slug);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

const NodeResourcesAndMindmapSchema = z.object({
  resources: z.array(
    z.object({
      type: z.enum(["doc", "youtube", "github", "blog", "practice"]),
      title: z.string(),
      url: z.string(),
      channel: z.string().optional(),
      videoId: z.string().optional(),
      duration: z.string().optional(),
      rating: z.coerce.number().optional(),
      free: z.boolean().optional(),
    })
  ),
  mindmap: z.object({
    nodes: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        type: z.enum(["root", "main", "leaf"]),
        info: z.string(),
        source: z.string().optional(),
        x: z.number(),
        y: z.number(),
      })
    ),
    edges: z.array(
      z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
      })
    ),
  }),
});

export const generateNodeResourcesAndMindmap = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; tier: Tier; nodeId: string; nodeTitle: string }) => d)
  .handler(async ({ data }) => {
    const cacheKey = `${data.slug}:${data.nodeId}`;
    
    // 1. Check cache first
    try {
      const { data: cached } = await supabaseAdmin
        .from("roadmap_cache")
        .select("content")
        .eq("domain", cacheKey)
        .eq("tier", "resources-mindmap")
        .maybeSingle();
      if (cached?.content) {
        return cached.content as any;
      }
    } catch (e) {
      console.warn("[resources-mindmap] Cache read failed:", e);
    }

    const fallback = getFallbackMindmapAndResources(data.nodeTitle, data.slug, data.tier);

    const generatePromise = (async () => {
      const domain = DOMAIN_BY_SLUG[data.slug]?.name ?? data.slug;
      const prompt = `You are a world-class AI learning assistant. Find the most accurate, real-world, high-quality learning resources and design a customized circular interactive mindmap for the topic "${data.nodeTitle}" inside the domain "${domain}" (${data.tier}).

      To provide the best resources, act like ChatGPT or Gemini searching for real, high-quality material. You must include:
      1. Official documentation link tailored specifically to this topic (e.g. if it's pandas, link to pandas.pydata.org; if it's cloud computing, link to specific AWS/GCP/Azure docs).
      2. Video tutorial sources (specifically YouTube videos, with valid, real-world YouTube videoIds, titles, and channels like freeCodeCamp, Traversy Media, Net Ninja, Programming with Mosh, etc., that match the topic).
      3. Practical hands-on exercise platforms or interactive coding courses (e.g., LeetCode, Frontend Mentor, Exercism, Kaggle).
      4. Curated GitHub repositories or awesome lists for the topic.
      5. Cheat sheets, interactive syntax guides, or key technical blog posts (e.g., Devhints, QuickRef, Dev.to).

      Return JSON shaped exactly as:
      {
        "resources": [
          {
            "type": "doc" | "youtube" | "github" | "blog" | "practice",
            "title": "Specific resource title (e.g. 'Pandas Dataframes Complete Guide' or 'AWS EC2 Getting Started Documentation')",
            "url": "A real, working URL for this resource",
            "channel": "YouTube channel name (youtube type only)",
            "videoId": "Valid 11-character YouTube video ID (youtube type only)",
            "duration": "Duration (e.g., '15m' or '2h')",
            "rating": 4.9,
            "free": true
          }
        ],
        "mindmap": {
          "nodes": [
            {
              "id": "root",
              "label": "${data.nodeTitle}",
              "type": "root",
              "info": "Central focus node summary explaining what this topic is at a high level.",
              "source": "Official documentation link",
              "x": 0,
              "y": 0
            },
            {
              "id": "branch-0",
              "label": "First major subtopic of ${data.nodeTitle}",
              "type": "main",
              "info": "Detailed explanation of this subtopic, its purpose, and core usage.",
              "source": "Reference link or documentation section",
              "x": -160,
              "y": -90
            },
            {
              "id": "leaf-0-0",
              "label": "Detailed leaf of first subtopic",
              "type": "leaf",
              "info": "Specific tooltip information with code or configuration examples.",
              "source": "Specific reference or tutorial link",
              "x": -270,
              "y": -120
            }
          ],
          "edges": [
            { "id": "edge-root-branch-0", "source": "root", "target": "branch-0" },
            { "id": "edge-branch-0-leaf-0-0", "source": "branch-0", "target": "leaf-0-0" }
          ]
        }
      }

      Rules:
      - resources list must contain at least 1 'doc', 2 'youtube' videos (with working videoIds), 1 'practice', 1 'github', and 1 'blog' (or cheatsheet).
      - mindmap must contain 8-12 nodes specific to "${data.nodeTitle}". Spaced out coordinates around (0,0) (radius ~150 for main nodes, radius ~260 for leaves).
      - each node in the mindmap MUST include 'info' (hover details) and 'source' (clickable reference link).
      - Do not use generic structures. Create a unique, highly informative mindmap for "${data.nodeTitle}" with accurate sub-topics, tools, and concepts.`;

      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const { text } = await generateTextResilient({
            system: SYSTEM,
            prompt,
            temperature: attempt === 0 ? 0.5 : 0.3,
          });
          const parsed = NodeResourcesAndMindmapSchema.parse(extractJson(text));

          // Save to database cache in background
          (async () => {
            try {
              await supabaseAdmin.from("roadmap_cache").upsert({
                domain: cacheKey,
                tier: "resources-mindmap",
                content: parsed as any,
                generated_by: "AI",
                model: "google/gemini-2.5-flash",
                version: "1.0",
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              });
            } catch (err) {
              console.warn("[resources-mindmap] Background cache write failed:", err);
            }
          })();

          return parsed;
        } catch (error) {
          console.error(`[Resources & Mindmap] AI attempt ${attempt + 1} failed:`, error);
        }
      }
      return fallback;
    })();

    try {
      return await generatePromise;
    } catch (e) {
      return fallback;
    }
  });
