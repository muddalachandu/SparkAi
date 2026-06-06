// Hand-seeded roadmaps for flagship domains. Any domain/tier not present here
// is generated on demand by AI via getRoadmap() and cached in roadmap_cache.

export type Tier = "beginner" | "intermediate" | "advanced";
export type ResourceType = "doc" | "youtube" | "github" | "blog" | "practice";

export type RoadmapResource = {
  type: ResourceType;
  title: string;
  url: string;
  channel?: string;
  /** YouTube video id; used to derive thumbnail + embed without extra deps. */
  videoId?: string;
  author?: string;
  duration?: string;
  difficulty?: string;
  thumbnail?: string;
  rating?: number;
  free?: boolean;
};

export type RoadmapProject = {
  title: string;
  brief: string;
  difficulty: "easy" | "medium" | "hard";
};

export type RoadmapNode = {
  id: string;
  title: string;
  why: string;
  prerequisites: string[];
  outcome: string;
  hours: number;
  difficulty: "easy" | "medium" | "hard";
  resources: RoadmapResource[];
  projects: RoadmapProject[];

  // Extended fields for learning ecosystem
  skills?: string[];
  tools?: string[];
  interviewTopics?: string[];
  miniProjects?: RoadmapProject[];
  careerImpact?: string;
  dependsOn?: string[];
};

export type RoadmapTier = {
  tier: Tier;
  summary: string;
  nodes: RoadmapNode[];
};

export type DomainRoadmap = Partial<Record<Tier, RoadmapTier>>;

// ---------------- Seeded roadmaps ----------------

const REACT_BEGINNER: RoadmapTier = {
  tier: "beginner",
  summary: "Ship your first React app: components, props, state, events and lists.",
  nodes: [
    {
      id: "html-css",
      title: "HTML & CSS Foundations",
      why: "React renders HTML and styles it with CSS — you can't skip the basics.",
      prerequisites: [],
      outcome: "Build static, accessible, responsive pages without React.",
      hours: 20,
      difficulty: "easy",
      resources: [
        {
          type: "doc",
          title: "MDN — Learn HTML",
          url: "https://developer.mozilla.org/docs/Learn/HTML",
        },
        {
          type: "doc",
          title: "MDN — Learn CSS",
          url: "https://developer.mozilla.org/docs/Learn/CSS",
        },
        {
          type: "youtube",
          title: "HTML & CSS Crash Course",
          channel: "Traversy Media",
          url: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
          videoId: "qz0aGYrrlhU",
        },
        {
          type: "practice",
          title: "Frontend Mentor challenges",
          url: "https://www.frontendmentor.io/",
        },
      ],
      projects: [
        {
          title: "Personal landing page",
          brief: "Single-page bio + links, fully responsive.",
          difficulty: "easy",
        },
      ],
    },
    {
      id: "js-essentials",
      title: "Modern JavaScript Essentials",
      why: "React is just JavaScript. Master ES modules, destructuring, array methods, promises.",
      prerequisites: ["html-css"],
      outcome: "Read and write idiomatic modern JS comfortably.",
      hours: 25,
      difficulty: "easy",
      resources: [
        { type: "doc", title: "javascript.info", url: "https://javascript.info/" },
        {
          type: "youtube",
          title: "JS in 100 Seconds + tour",
          channel: "Fireship",
          url: "https://www.youtube.com/watch?v=DHjqpvDnNGE",
          videoId: "DHjqpvDnNGE",
        },
        {
          type: "practice",
          title: "exercism JavaScript track",
          url: "https://exercism.org/tracks/javascript",
        },
      ],
      projects: [
        {
          title: "Todo list (vanilla JS)",
          brief: "DOM, events, localStorage.",
          difficulty: "easy",
        },
      ],
    },
    {
      id: "react-basics",
      title: "React Basics: JSX, Components, Props",
      why: "The mental model of React — UI as a function of state.",
      prerequisites: ["js-essentials"],
      outcome: "Compose components, pass props, render lists, handle events.",
      hours: 15,
      difficulty: "easy",
      resources: [
        { type: "doc", title: "react.dev — Learn", url: "https://react.dev/learn" },
        {
          type: "youtube",
          title: "React Crash Course",
          channel: "Net Ninja",
          url: "https://www.youtube.com/watch?v=j942wKiXFu8",
          videoId: "j942wKiXFu8",
        },
        { type: "github", title: "Awesome React", url: "https://github.com/enaqx/awesome-react" },
      ],
      projects: [
        {
          title: "Recipe card grid",
          brief: "Static data, props, list rendering.",
          difficulty: "easy",
        },
      ],
    },
    {
      id: "state-hooks",
      title: "State & Hooks",
      why: "useState, useEffect and refs unlock interactive UIs.",
      prerequisites: ["react-basics"],
      outcome: "Build interactive components with local state and effects.",
      hours: 18,
      difficulty: "medium",
      resources: [
        {
          type: "doc",
          title: "react.dev — State & Hooks",
          url: "https://react.dev/reference/react",
        },
        {
          type: "youtube",
          title: "React Hooks Playlist",
          channel: "Codevolution",
          url: "https://www.youtube.com/watch?v=cF2lQ_gZeA8",
          videoId: "cF2lQ_gZeA8",
        },
      ],
      projects: [
        { title: "Expense tracker", brief: "Forms, derived state, filters.", difficulty: "medium" },
      ],
    },
    {
      id: "fetch-routing",
      title: "Data Fetching & Routing",
      why: "Real apps load data and have multiple pages.",
      prerequisites: ["state-hooks"],
      outcome: "Fetch APIs, handle loading/errors and route with React Router.",
      hours: 14,
      difficulty: "medium",
      resources: [
        { type: "doc", title: "React Router docs", url: "https://reactrouter.com/" },
        {
          type: "doc",
          title: "Fetching data with React",
          url: "https://react.dev/learn/synchronizing-with-effects",
        },
      ],
      projects: [
        { title: "Movie browser", brief: "TMDB API, search, detail route.", difficulty: "medium" },
      ],
    },
  ],
};

const REACT_INTERMEDIATE: RoadmapTier = {
  tier: "intermediate",
  summary: "Production React: TypeScript, server state, forms, design systems and testing.",
  nodes: [
    {
      id: "ts-react",
      title: "TypeScript with React",
      why: "Catch bugs early and document component contracts.",
      prerequisites: [],
      outcome: "Type props, hooks, generics and async boundaries confidently.",
      hours: 16,
      difficulty: "medium",
      resources: [
        {
          type: "doc",
          title: "TS + React cheatsheet",
          url: "https://react-typescript-cheatsheet.netlify.app/",
        },
        {
          type: "github",
          title: "type-challenges",
          url: "https://github.com/type-challenges/type-challenges",
        },
      ],
      projects: [
        {
          title: "Typed expense tracker",
          brief: "Refactor your tracker to strict TS.",
          difficulty: "medium",
        },
      ],
    },
    {
      id: "tanstack-query",
      title: "Server State with TanStack Query",
      why: "Caching, retries and revalidation done right.",
      prerequisites: ["ts-react"],
      outcome: "Model server state separately from UI state.",
      hours: 12,
      difficulty: "medium",
      resources: [
        { type: "doc", title: "TanStack Query docs", url: "https://tanstack.com/query/latest" },
        {
          type: "youtube",
          title: "React Query in 100s",
          channel: "Fireship",
          url: "https://www.youtube.com/watch?v=novnyCaa7To",
          videoId: "novnyCaa7To",
        },
      ],
      projects: [
        {
          title: "GitHub dashboard",
          brief: "Queries, mutations, infinite scroll.",
          difficulty: "medium",
        },
      ],
    },
    {
      id: "forms-validation",
      title: "Forms & Validation",
      why: "Forms are where most React apps actually live.",
      prerequisites: ["ts-react"],
      outcome: "Build accessible forms with react-hook-form + zod.",
      hours: 10,
      difficulty: "medium",
      resources: [
        { type: "doc", title: "react-hook-form", url: "https://react-hook-form.com/" },
        { type: "doc", title: "Zod", url: "https://zod.dev/" },
      ],
      projects: [
        {
          title: "Multi-step signup",
          brief: "Validation, error UI, autosave.",
          difficulty: "medium",
        },
      ],
    },
    {
      id: "design-systems",
      title: "Design Systems & Tailwind",
      why: "Ship consistent, themeable UIs without reinventing buttons.",
      prerequisites: [],
      outcome: "Build a small component library with tokens and variants.",
      hours: 14,
      difficulty: "medium",
      resources: [
        { type: "doc", title: "Tailwind CSS docs", url: "https://tailwindcss.com/" },
        { type: "doc", title: "shadcn/ui", url: "https://ui.shadcn.com/" },
      ],
      projects: [
        {
          title: "Mini component library",
          brief: "Button, Input, Dialog with variants.",
          difficulty: "medium",
        },
      ],
    },
    {
      id: "testing",
      title: "Testing React Apps",
      why: "Refactor without fear.",
      prerequisites: ["tanstack-query"],
      outcome: "Write unit, integration and e2e tests.",
      hours: 12,
      difficulty: "medium",
      resources: [
        {
          type: "doc",
          title: "Testing Library",
          url: "https://testing-library.com/docs/react-testing-library/intro/",
        },
        { type: "doc", title: "Playwright", url: "https://playwright.dev/" },
      ],
      projects: [
        {
          title: "Tested todo app",
          brief: "100% coverage on reducer + key flows.",
          difficulty: "medium",
        },
      ],
    },
  ],
};

const REACT_ADVANCED: RoadmapTier = {
  tier: "advanced",
  summary: "Performance, architecture, RSC, accessibility and scaling React in production.",
  nodes: [
    {
      id: "performance",
      title: "React Performance",
      why: "Find and fix renders, memory and bundle bloat.",
      prerequisites: [],
      outcome: "Profile and optimize real apps with measurable wins.",
      hours: 14,
      difficulty: "hard",
      resources: [
        {
          type: "doc",
          title: "react.dev — Performance",
          url: "https://react.dev/learn/render-and-commit",
        },
        {
          type: "blog",
          title: "Kent C. Dodds — useMemo / useCallback",
          url: "https://kentcdodds.com/blog/usememo-and-usecallback",
        },
      ],
      projects: [
        {
          title: "Profile + fix a slow app",
          brief: "10k row table, virtualize, memoize.",
          difficulty: "hard",
        },
      ],
    },
    {
      id: "rsc",
      title: "Server Components & Streaming",
      why: "The current direction of React — fetch on the server, ship less JS.",
      prerequisites: [],
      outcome: "Reason about server vs client components and suspense boundaries.",
      hours: 16,
      difficulty: "hard",
      resources: [
        { type: "doc", title: "Next.js App Router", url: "https://nextjs.org/docs/app" },
        {
          type: "blog",
          title: "RSC explained",
          url: "https://www.joshwcomeau.com/react/server-components/",
        },
      ],
      projects: [
        {
          title: "Blog with RSC + streaming",
          brief: "Suspense, server actions.",
          difficulty: "hard",
        },
      ],
    },
    {
      id: "a11y",
      title: "Accessibility at Depth",
      why: "Real users include keyboard, screen reader and low-vision users.",
      prerequisites: [],
      outcome: "Ship WCAG-AA compliant components.",
      hours: 10,
      difficulty: "medium",
      resources: [
        {
          type: "doc",
          title: "WAI-ARIA Authoring Practices",
          url: "https://www.w3.org/WAI/ARIA/apg/",
        },
        { type: "doc", title: "Radix Primitives", url: "https://www.radix-ui.com/primitives" },
      ],
      projects: [
        {
          title: "Accessible combobox",
          brief: "Keyboard nav, ARIA, focus management.",
          difficulty: "hard",
        },
      ],
    },
    {
      id: "architecture",
      title: "Scaling Frontend Architecture",
      why: "Monorepos, module boundaries, feature flags and platform thinking.",
      prerequisites: [],
      outcome: "Make architectural choices teams can live with for years.",
      hours: 14,
      difficulty: "hard",
      resources: [
        { type: "doc", title: "Turborepo", url: "https://turbo.build/repo" },
        { type: "blog", title: "Feature-Sliced Design", url: "https://feature-sliced.design/" },
      ],
      projects: [
        { title: "Mini monorepo", brief: "Apps + packages + shared UI.", difficulty: "hard" },
      ],
    },
  ],
};

const PYTHON_BEGINNER: RoadmapTier = {
  tier: "beginner",
  summary: "Python from zero: syntax, control flow, collections, functions, files.",
  nodes: [
    {
      id: "setup-syntax",
      title: "Setup & Syntax",
      why: "Get Python and an editor running, then learn the basics.",
      prerequisites: [],
      outcome: "Write and run Python scripts confidently.",
      hours: 6,
      difficulty: "easy",
      resources: [
        {
          type: "doc",
          title: "Official Python tutorial",
          url: "https://docs.python.org/3/tutorial/",
        },
        {
          type: "youtube",
          title: "Python for Beginners",
          channel: "freeCodeCamp",
          url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          videoId: "rfscVS0vtbw",
        },
      ],
      projects: [
        { title: "Number guessing game", brief: "Loops, conditionals, input.", difficulty: "easy" },
      ],
    },
    {
      id: "data-structures",
      title: "Lists, Dicts, Sets, Tuples",
      why: "Almost every Python program leans on the built-in collections.",
      prerequisites: ["setup-syntax"],
      outcome: "Pick the right collection and use comprehensions fluently.",
      hours: 8,
      difficulty: "easy",
      resources: [
        {
          type: "doc",
          title: "Data Structures — Python docs",
          url: "https://docs.python.org/3/tutorial/datastructures.html",
        },
      ],
      projects: [
        {
          title: "Word frequency analyzer",
          brief: "Read a file, count, rank.",
          difficulty: "easy",
        },
      ],
    },
    {
      id: "functions-modules",
      title: "Functions & Modules",
      why: "Organize code, avoid repetition and reuse libraries.",
      prerequisites: ["data-structures"],
      outcome: "Write clear functions and import packages.",
      hours: 6,
      difficulty: "easy",
      resources: [
        { type: "doc", title: "Modules", url: "https://docs.python.org/3/tutorial/modules.html" },
      ],
      projects: [
        { title: "CLI calculator", brief: "argparse, functions, tests.", difficulty: "easy" },
      ],
    },
    {
      id: "files-errors",
      title: "Files & Error Handling",
      why: "Real scripts read data and recover from failure.",
      prerequisites: ["functions-modules"],
      outcome: "Read/write files and handle exceptions cleanly.",
      hours: 5,
      difficulty: "easy",
      resources: [
        {
          type: "doc",
          title: "Errors and Exceptions",
          url: "https://docs.python.org/3/tutorial/errors.html",
        },
      ],
      projects: [
        {
          title: "CSV report generator",
          brief: "Read CSV, summarize, write report.",
          difficulty: "easy",
        },
      ],
    },
  ],
};

const ML_BEGINNER: RoadmapTier = {
  tier: "beginner",
  summary: "Foundations of ML: math you need, data wrangling, classic algorithms, evaluation.",
  nodes: [
    {
      id: "math-foundations",
      title: "Math You Actually Need",
      why: "Linear algebra, probability and calculus power every model.",
      prerequisites: [],
      outcome: "Read papers and code without getting lost in notation.",
      hours: 20,
      difficulty: "medium",
      resources: [
        {
          type: "youtube",
          title: "Essence of Linear Algebra",
          channel: "3Blue1Brown",
          url: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
          videoId: "fNk_zzaMoSs",
        },
        {
          type: "doc",
          title: "Khan Academy — Probability",
          url: "https://www.khanacademy.org/math/statistics-probability",
        },
      ],
      projects: [
        {
          title: "Gradient descent from scratch",
          brief: "Implement and plot.",
          difficulty: "medium",
        },
      ],
    },
    {
      id: "data-wrangling",
      title: "Pandas & Data Wrangling",
      why: "80% of ML work is cleaning and shaping data.",
      prerequisites: [],
      outcome: "Load, clean, join and explore real datasets.",
      hours: 14,
      difficulty: "easy",
      resources: [
        {
          type: "doc",
          title: "Pandas getting started",
          url: "https://pandas.pydata.org/docs/getting_started/index.html",
        },
        {
          type: "practice",
          title: "Kaggle Pandas micro-course",
          url: "https://www.kaggle.com/learn/pandas",
        },
      ],
      projects: [{ title: "Titanic EDA", brief: "Clean, explore, visualize.", difficulty: "easy" }],
    },
    {
      id: "sklearn-models",
      title: "Classical ML with scikit-learn",
      why: "Linear models, trees and ensembles solve most tabular problems.",
      prerequisites: ["data-wrangling"],
      outcome: "Train, evaluate and tune models on real data.",
      hours: 18,
      difficulty: "medium",
      resources: [
        {
          type: "doc",
          title: "scikit-learn user guide",
          url: "https://scikit-learn.org/stable/user_guide.html",
        },
        {
          type: "github",
          title: "Hands-On ML notebooks",
          url: "https://github.com/ageron/handson-ml3",
        },
      ],
      projects: [
        {
          title: "House price predictor",
          brief: "Pipeline, CV, feature engineering.",
          difficulty: "medium",
        },
      ],
    },
    {
      id: "evaluation",
      title: "Evaluation & Validation",
      why: "A model is only as good as how you measure it.",
      prerequisites: ["sklearn-models"],
      outcome: "Choose metrics, do proper splits, avoid leakage.",
      hours: 8,
      difficulty: "medium",
      resources: [
        {
          type: "doc",
          title: "Model evaluation",
          url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
        },
      ],
      projects: [
        {
          title: "Imbalanced classification report",
          brief: "Precision/recall, ROC, calibration.",
          difficulty: "medium",
        },
      ],
    },
  ],
};

const AWS_BEGINNER: RoadmapTier = {
  tier: "beginner",
  summary: "Cloud fundamentals on AWS: IAM, compute, storage, networking, deploy a real app.",
  nodes: [
    {
      id: "cloud-basics",
      title: "Cloud & AWS Mental Model",
      why: "Understand regions, AZs, the shared responsibility model and pricing.",
      prerequisites: [],
      outcome: "Navigate the AWS console and reason about service choice.",
      hours: 6,
      difficulty: "easy",
      resources: [
        {
          type: "doc",
          title: "AWS Cloud Practitioner Essentials",
          url: "https://aws.amazon.com/training/learn-about/cloud-practitioner/",
        },
        {
          type: "youtube",
          title: "AWS in 100 Seconds",
          channel: "Fireship",
          url: "https://www.youtube.com/watch?v=a9__D53WsUs",
          videoId: "a9__D53WsUs",
        },
      ],
      projects: [],
    },
    {
      id: "iam",
      title: "IAM & Security Basics",
      why: "Get permissions right early or pay later.",
      prerequisites: ["cloud-basics"],
      outcome: "Create users, roles and policies with least privilege.",
      hours: 5,
      difficulty: "easy",
      resources: [
        {
          type: "doc",
          title: "IAM best practices",
          url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        },
      ],
      projects: [
        { title: "Role-based S3 access", brief: "Two roles, scoped policies.", difficulty: "easy" },
      ],
    },
    {
      id: "compute-storage",
      title: "EC2, S3 & Lambda",
      why: "The core trio that powers most workloads.",
      prerequisites: ["iam"],
      outcome: "Run a server, store objects and call a serverless function.",
      hours: 10,
      difficulty: "medium",
      resources: [
        { type: "doc", title: "EC2 docs", url: "https://docs.aws.amazon.com/ec2/" },
        { type: "doc", title: "Lambda docs", url: "https://docs.aws.amazon.com/lambda/" },
      ],
      projects: [
        {
          title: "S3-hosted static site + Lambda contact form",
          brief: "End-to-end.",
          difficulty: "medium",
        },
      ],
    },
    {
      id: "networking-deploy",
      title: "VPC & Deploy a Real App",
      why: "Tie compute, networking and storage into something users can hit.",
      prerequisites: ["compute-storage"],
      outcome: "Deploy a small web app with a domain and HTTPS.",
      hours: 12,
      difficulty: "medium",
      resources: [
        {
          type: "doc",
          title: "Amplify / App Runner",
          url: "https://docs.aws.amazon.com/apprunner/",
        },
        { type: "doc", title: "Route 53", url: "https://docs.aws.amazon.com/Route53/" },
      ],
      projects: [
        {
          title: "Deploy a Node API on App Runner",
          brief: "Custom domain + HTTPS.",
          difficulty: "medium",
        },
      ],
    },
  ],
};

export const SEED_ROADMAPS: Record<string, DomainRoadmap> = {
  react: {
    beginner: REACT_BEGINNER,
    intermediate: REACT_INTERMEDIATE,
    advanced: REACT_ADVANCED,
  },
  python: { beginner: PYTHON_BEGINNER },
  "machine-learning": { beginner: ML_BEGINNER },
  aws: { beginner: AWS_BEGINNER },
};

export function getSeededRoadmap(slug: string, tier: Tier): RoadmapTier | null {
  return SEED_ROADMAPS[slug]?.[tier] ?? null;
}

export const FALLBACK_CURRICULA: Record<string, Partial<Record<Tier, RoadmapNode[]>>> = {
  dsa: {
    beginner: [
      {
        id: "dsa-beg-arrays",
        title: "Arrays & Dynamic Arrays",
        why: "Arrays are the most fundamental contiguous data structure, storing elements sequentially in memory.",
        prerequisites: [],
        outcome: "Implement operations on static arrays and build a dynamic resizing ArrayList.",
        hours: 8,
        difficulty: "easy",
        skills: ["Linear Structures", "Memory Layout", "Resizing Arrays"],
        tools: ["VS Code", "Compiler/Interpreter"],
        interviewTopics: ["Array time complexities", "Static vs dynamic memory allocation"],
        resources: [
          { type: "doc", title: "MDN Array Reference", url: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array", free: true },
          { type: "youtube", title: "Data Structures - Arrays", url: "https://www.youtube.com/watch?v=8hly31xKjhc", videoId: "8hly31xKjhc", channel: "Programming with Mosh", free: true }
        ],
        projects: [{ title: "Dynamic Array Implementation", brief: "Write an ArrayList from scratch with push, pop, insert, delete, and automatic doubling.", difficulty: "easy" }]
      },
      {
        id: "dsa-beg-lists",
        title: "Linked Lists",
        why: "Linked lists store elements non-contiguously, using nodes and pointers, unlocking dynamic inserts and deletes.",
        prerequisites: ["dsa-beg-arrays"],
        outcome: "Understand references, pointers, and implement Singly and Doubly Linked Lists.",
        hours: 10,
        difficulty: "easy",
        skills: ["Pointers", "Node Manipulation", "Linked Lists"],
        tools: ["Code IDE"],
        interviewTopics: ["Linked list traversal", "Arrays vs Linked Lists comparison"],
        resources: [
          { type: "doc", title: "GeeksforGeeks Linked Lists", url: "https://www.geeksforgeeks.org/linked-list-data-structure/", free: true },
          { type: "youtube", title: "Linked Lists Explained", url: "https://www.youtube.com/watch?v=H5J1LH8y3SY", videoId: "H5J1LH8y3SY", channel: "mycodeschool", free: true }
        ],
        projects: [{ title: "Singly Linked List Manager", brief: "Implement insertAtHead, insertAtTail, deleteNode, reverseList, and detectCycle.", difficulty: "easy" }]
      },
      {
        id: "dsa-beg-stacks",
        title: "Stacks & Queues",
        why: "Stacks (LIFO) and Queues (FIFO) are core linear structures that govern execution flow and buffering.",
        prerequisites: ["dsa-beg-lists"],
        outcome: "Use and implement stacks and queues using arrays and linked lists.",
        hours: 8,
        difficulty: "easy",
        skills: ["LIFO/FIFO", "Buffer design", "Stacks & Queues"],
        tools: ["Debugger"],
        interviewTopics: ["Call stack execution", "Queue usage in message passing"],
        resources: [
          { type: "doc", title: "Wikipedia: Stack & Queue", url: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)", free: true },
          { type: "youtube", title: "Stacks & Queues in 10 minutes", url: "https://www.youtube.com/watch?v=zLKPMc84aGA", videoId: "zLKPMc84aGA", channel: "Programming with Mosh", free: true }
        ],
        projects: [{ title: "Balanced Parentheses Checker", brief: "Write a program that uses a stack to parse strings and check for balanced brackets.", difficulty: "easy" }]
      },
      {
        id: "dsa-beg-sorting",
        title: "Basic Sorting Algorithms",
        why: "Understanding sorting helps build intuition for algorithm analysis, swap operations, and complexity.",
        prerequisites: ["dsa-beg-arrays"],
        outcome: "Write and analyze Bubble Sort, Selection Sort, and Insertion Sort.",
        hours: 12,
        difficulty: "easy",
        skills: ["Sorting", "Time Complexity", "Swapping"],
        tools: ["Benchmark timer"],
        interviewTopics: ["In-place sorting", "Stability in sorting algorithms"],
        resources: [
          { type: "doc", title: "Visualizing Sorting Algorithms", url: "https://visualgo.net/en/sorting", free: true },
          { type: "youtube", title: "Sorting Algorithms Visualized", url: "https://www.youtube.com/watch?v=RfXt_qHDEPw", videoId: "RfXt_qHDEPw", channel: "Geekific", free: true }
        ],
        projects: [{ title: "Sorting Visualizer Console App", brief: "Write an interactive console app highlighting swaps in Bubble, Selection, and Insertion sorts.", difficulty: "easy" }]
      },
      {
        id: "dsa-beg-binary-search",
        title: "Binary Search",
        why: "Binary search introduces the divide-and-conquer strategy, reducing search time from O(n) to O(log n).",
        prerequisites: ["dsa-beg-sorting"],
        outcome: "Implement binary search and solve search space problems.",
        hours: 8,
        difficulty: "easy",
        skills: ["Binary Search", "Logarithmic Time", "Divide & Conquer"],
        tools: ["IDE"],
        interviewTopics: ["Binary search loop conditions", "Avoid overflow in mid calculation"],
        resources: [
          { type: "doc", title: "Khan Academy Binary Search", url: "https://www.khanacademy.org/computing/computer-science/algorithms/binary-search/a/binary-search", free: true },
          { type: "youtube", title: "Binary Search Algorithm Tutorial", url: "https://www.youtube.com/watch?v=V_T5upbL27o", videoId: "V_T5upbL27o", channel: "mycodeschool", free: true }
        ],
        projects: [{ title: "Rotated Sorted Array Searcher", brief: "Find the index of an element in a sorted array that has been rotated, using binary search.", difficulty: "medium" }]
      }
    ],
    intermediate: [
      {
        id: "dsa-int-trees",
        title: "Binary Trees & BSTs",
        why: "Hierarchical data modeling requires trees. Binary Search Trees (BSTs) enable logarithmic inserts and lookups.",
        prerequisites: [],
        outcome: "Implement tree traversals and basic BST operations.",
        hours: 15,
        difficulty: "medium",
        skills: ["Trees", "Recursion", "BST"],
        tools: ["Visualizer"],
        interviewTopics: ["BST property validation", "Inorder traversal successor"],
        resources: [
          { type: "doc", title: "BST Introduction", url: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/", free: true },
          { type: "youtube", title: "Binary Search Tree Tutorial", url: "https://www.youtube.com/watch?v=H5J1LH8y3SY", videoId: "H5J1LH8y3SY", channel: "mycodeschool", free: true }
        ],
        projects: [{ title: "BST Operations Library", brief: "Implement insert, delete, search, getHeight, and validateBST functionality.", difficulty: "medium" }]
      },
      {
        id: "dsa-int-heaps",
        title: "Heaps & Priority Queues",
        why: "Heaps provide extremely fast O(1) access to the min or max element, which is essential for priority scheduling.",
        prerequisites: ["dsa-int-trees"],
        outcome: "Build a binary heap, perform heapify operations, and implement a priority queue.",
        hours: 10,
        difficulty: "medium",
        skills: ["Heaps", "Priority Queues", "Heapify"],
        tools: ["IDE"],
        interviewTopics: ["Min-heap vs Max-heap structures", "Heap sort complexity"],
        resources: [
          { type: "doc", title: "Heaps explained", url: "https://en.wikipedia.org/wiki/Heap_(data_structure)", free: true },
          { type: "youtube", title: "Heaps and Heap Sort", url: "https://www.youtube.com/watch?v=NEtwJAS48QE", videoId: "NEtwJAS48QE", channel: "Abdul Bari", free: true }
        ],
        projects: [{ title: "K-Way Merge Solver", brief: "Merge K sorted lists into a single sorted list using a Min-Heap/Priority Queue.", difficulty: "medium" }]
      },
      {
        id: "dsa-int-graphs",
        title: "Graphs & Traversals (BFS/DFS)",
        why: "Graphs model networked systems. Breadth-First and Depth-First searches are foundational.",
        prerequisites: [],
        outcome: "Represent graphs via adjacency lists/matrices and implement BFS and DFS.",
        hours: 15,
        difficulty: "medium",
        skills: ["Graphs", "BFS", "DFS", "Traversals"],
        tools: ["Debugger"],
        interviewTopics: ["Cycle detection in directed/undirected graphs", "Connected components"],
        resources: [
          { type: "doc", title: "Graph Algorithms Guide", url: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/", free: true },
          { type: "youtube", title: "Graph Algorithms - BFS & DFS", url: "https://www.youtube.com/watch?v=tWVWeAqZ0WU", videoId: "tWVWeAqZ0WU", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Maze Path Finder", brief: "Build a grid maze solver that finds the shortest path from start to end using BFS.", difficulty: "medium" }]
      },
      {
        id: "dsa-int-hashing",
        title: "Hashing & Hash Tables",
        why: "Hash tables yield O(1) average lookup times, forming the backbone of dictionary structures.",
        prerequisites: [],
        outcome: "Create a hash map with collision resolution strategies (chaining or open addressing).",
        hours: 8,
        difficulty: "medium",
        skills: ["Hashing", "Hash Maps", "Collision Resolution"],
        tools: ["Performance profiler"],
        interviewTopics: ["Load factor resizing", "Amortized time complexity of lookup"],
        resources: [
          { type: "doc", title: "Hashing Basics", url: "https://en.wikipedia.org/wiki/Hash_table", free: true },
          { type: "youtube", title: "Hash Tables - How they Work", url: "https://www.youtube.com/watch?v=zHi5v78W1w0", videoId: "zHi5v78W1w0", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Custom Hash Map", brief: "Write a Hash Map from scratch with custom hash function, resizing, and chaining.", difficulty: "medium" }]
      },
      {
        id: "dsa-int-divide",
        title: "Divide & Conquer Sorting",
        why: "Advanced sorting algorithms lower the sorting time limit from O(n^2) to O(n log n) by partitioning tasks recursively.",
        prerequisites: [],
        outcome: "Implement Merge Sort and Quick Sort and understand their partitioning schemes.",
        hours: 12,
        difficulty: "medium",
        skills: ["Divide & Conquer", "Merge Sort", "Quick Sort"],
        tools: ["Timer Benchmark"],
        interviewTopics: ["Worst-case Quick Sort optimization", "Space complexity of Merge Sort"],
        resources: [
          { type: "doc", title: "Merge & Quick Sort Analysis", url: "https://www.khanacademy.org/computing/computer-science/algorithms/merge-sort/a/overview-of-merge-sort", free: true },
          { type: "youtube", title: "Merge Sort and Quick Sort Algorithms", url: "https://www.youtube.com/watch?v=PrxQlI1Rfi0", videoId: "PrxQlI1Rfi0", channel: "Abdul Bari", free: true }
        ],
        projects: [{ title: "Pivot Optimization benchmark", brief: "Compare Quick Sort performance using first-element, last-element, and median-of-three pivot strategies.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "dsa-adv-dp",
        title: "Dynamic Programming (DP)",
        why: "DP optimizes recursion by storing solutions to overlapping subproblems, reducing exponential time to linear/polynomial.",
        prerequisites: [],
        outcome: "Recognize DP patterns, write memoized solutions, and build tabulation tables.",
        hours: 25,
        difficulty: "hard",
        skills: ["Dynamic Programming", "Memoization", "Tabulation"],
        tools: ["IDE"],
        interviewTopics: ["Subproblem relations", "Knapsack problem", "LCS (Longest Common Subsequence)"],
        resources: [
          { type: "doc", title: "DP Patterns Wiki", url: "https://en.wikipedia.org/wiki/Dynamic_programming", free: true },
          { type: "youtube", title: "Dynamic Programming - Learn to Solve", url: "https://www.youtube.com/watch?v=oBt53YbR9Kk", videoId: "oBt53YbR9Kk", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Knapsack Solver & Visualizer", brief: "Build an interactive tool that solves the 0/1 Knapsack problem using tabulation, displaying the matrix step-by-step.", difficulty: "hard" }]
      },
      {
        id: "dsa-adv-graphs",
        title: "Advanced Graph Algorithms",
        why: "Shortest-pathfinding and minimum spanning trees are crucial for routing, networks, and geometric algorithms.",
        prerequisites: [],
        outcome: "Implement Dijkstra's, Bellman-Ford, Kruskal's, and Prim's algorithms.",
        hours: 20,
        difficulty: "hard",
        skills: ["Advanced Graphs", "Dijkstra", "Spanning Trees", "Shortest Path"],
        tools: ["Graphviz"],
        interviewTopics: ["Dijkstra negative edge weights", "Kruskal Union-Find optimization"],
        resources: [
          { type: "doc", title: "Dijkstra's Algorithm Overview", url: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm", free: true },
          { type: "youtube", title: "Graph Theory - Shortest Paths", url: "https://www.youtube.com/watch?v=09_LlHjoEiY", videoId: "09_LlHjoEiY", channel: "WilliamFiset", free: true }
        ],
        projects: [{ title: "Network Router Simulation", brief: "Simulate a router network finding shortest paths and adapting dynamically when a node goes offline.", difficulty: "hard" }]
      },
      {
        id: "dsa-adv-tries",
        title: "Tries & String Algorithms",
        why: "String matching and spell checking require specialized tree structures to optimize prefix lookups.",
        prerequisites: [],
        outcome: "Build a Trie (Prefix Tree) and implement KMP string matching.",
        hours: 12,
        difficulty: "hard",
        skills: ["Tries", "String Matching", "KMP"],
        tools: ["IDE"],
        interviewTopics: ["Trie node structures", "Prefix lookup complexity"],
        resources: [
          { type: "doc", title: "Trie Data Structure explained", url: "https://www.geeksforgeeks.org/trie-insert-and-search/", free: true },
          { type: "youtube", title: "Trie Insert and Search Tutorial", url: "https://www.youtube.com/watch?v=m9ZaXPwlh10", videoId: "m9ZaXPwlh10", channel: "Tushar Roy", free: true }
        ],
        projects: [{ title: "Autocomplete Search Engine", brief: "Build a memory-efficient autocomplete system that returns suggestion words based on prefix query in real time.", difficulty: "hard" }]
      },
      {
        id: "dsa-adv-segment",
        title: "Segment Trees & Fenwick Trees",
        why: "Updating a range and querying sums/minimums over ranges in log n time is essential for competitive programming and analytics.",
        prerequisites: [],
        outcome: "Write a Segment Tree with point updates and range queries.",
        hours: 15,
        difficulty: "hard",
        skills: ["Segment Trees", "Fenwick Trees", "Range Queries"],
        tools: ["IDE"],
        interviewTopics: ["Range query time complexities", "Lazy propagation concepts"],
        resources: [
          { type: "doc", title: "Segment Trees Guide", url: "https://cp-algorithms.com/data_structures/segment_tree.html", free: true },
          { type: "youtube", title: "Segment Tree Structure and Queries", url: "https://www.youtube.com/watch?v=2Fsg3pU_rQA", videoId: "2Fsg3pU_rQA", channel: "Tushar Roy", free: true }
        ],
        projects: [{ title: "Dynamic Range Sum Resolver", brief: "Build a system that handles thousands of numerical range queries and updates on a large floating list.", difficulty: "hard" }]
      },
      {
        id: "dsa-adv-bits",
        title: "Bit Manipulation",
        why: "Low-level binary operations bypass compiler overhead, enabling high-performance operations and compressed space representations.",
        prerequisites: [],
        outcome: "Understand bitwise operators, masks, and solve array problems using bits.",
        hours: 8,
        difficulty: "hard",
        skills: ["Bitwise Operators", "Bitmasks", "Bitwise Hacks"],
        tools: ["Compiler"],
        interviewTopics: ["XOR properties", "Counting set bits in an integer"],
        resources: [
          { type: "doc", title: "Bit Manipulation wiki", url: "https://en.wikipedia.org/wiki/Bit_manipulation", free: true },
          { type: "youtube", title: "Bit Manipulation Course", url: "https://www.youtube.com/watch?v=Db8OlplTMp8", videoId: "Db8OlplTMp8", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Custom BitSet Class", brief: "Implement a Space-efficient BitSet class mapping indices to single bits, with intersection and union.", difficulty: "hard" }]
      }
    ]
  },
  "computer-vision": {
    beginner: [
      {
        id: "cv-beg-basics",
        title: "Image Representation & Color Spaces",
        why: "Images are just multi-dimensional arrays. Understanding channels, colors (RGB, HSV, Gray) is the foundation of computer vision.",
        prerequisites: [],
        outcome: "Load images, read matrix channels, and convert color representations using Python.",
        hours: 8,
        difficulty: "easy",
        skills: ["Image Tensors", "Color Spaces", "Pixel Operations"],
        tools: ["Python", "OpenCV"],
        interviewTopics: ["Image representations as matrices", "RGB vs HSV advantages"],
        resources: [
          { type: "doc", title: "OpenCV Core Documentation", url: "https://docs.opencv.org/4.x/d9/df8/tutorial_root.html", free: true },
          { type: "youtube", title: "Computer Vision Course - Image Basics", url: "https://www.youtube.com/watch?v=de9Wq3yK9fs", videoId: "de9Wq3yK9fs", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Color Filter App", brief: "Write a script that isolates specific colored objects (e.g. green balls) using HSV color space thresholds.", difficulty: "easy" }]
      },
      {
        id: "cv-beg-filters",
        title: "Linear Filtering & Convolutions",
        why: "Filtering forms the core of image smoothing, sharpening, and noise reduction by sliding a kernel matrix across pixels.",
        prerequisites: ["cv-beg-basics"],
        outcome: "Apply Gaussian, Median, and Bilateral filters and write a 2D convolution from scratch.",
        hours: 10,
        difficulty: "easy",
        skills: ["Convolutions", "Kernels", "Filtering", "Blurring"],
        tools: ["NumPy"],
        interviewTopics: ["Convolution math", "Gaussian kernel characteristics"],
        resources: [
          { type: "doc", title: "OpenCV Filtering Guide", url: "https://docs.opencv.org/4.x/d4/d13/tutorial_py_filtering.html", free: true },
          { type: "youtube", title: "2D Convolution & Filtering", url: "https://www.youtube.com/watch?v=de9Wq3yK9fs", videoId: "de9Wq3yK9fs", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Custom Convolution Engine", brief: "Write a pure NumPy convolution function applying edge-detection and sharpening kernels.", difficulty: "easy" }]
      },
      {
        id: "cv-beg-edges",
        title: "Edge Detection & Contours",
        why: "Edges and contours represent shape structures, capturing geometric boundaries for feature analysis.",
        prerequisites: ["cv-beg-filters"],
        outcome: "Apply Sobel and Canny edge detectors and extract/draw contour shapes from images.",
        hours: 10,
        difficulty: "easy",
        skills: ["Edge Detection", "Gradient Vectors", "Contours", "Thresholding"],
        tools: ["OpenCV"],
        interviewTopics: ["Canny edge detection steps", "Image gradient directions"],
        resources: [
          { type: "doc", title: "Canny Edge Detection", url: "https://docs.opencv.org/4.x/da/d22/tutorial_py_canny.html", free: true },
          { type: "youtube", title: "Canny Edge Detection & Contours", url: "https://www.youtube.com/watch?v=de9Wq3yK9fs", videoId: "de9Wq3yK9fs", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Document Scanner Simulation", brief: "Given a photo of a document, detect edges, isolate the outline contour, and apply a perspective warp.", difficulty: "medium" }]
      }
    ],
    intermediate: [
      {
        id: "cv-int-features",
        title: "Feature Detection & Matching",
        why: "Local features allow us to match objects across different rotations, scales, and lighting conditions.",
        prerequisites: [],
        outcome: "Detect keypoints using ORB/SIFT and match descriptors to stitch images together.",
        hours: 14,
        difficulty: "medium",
        skills: ["Keypoints", "Descriptors", "Feature Matching", "SIFT/ORB"],
        tools: ["OpenCV"],
        interviewTopics: ["Scale invariant features", "Homography calculation"],
        resources: [
          { type: "doc", title: "OpenCV Feature Detection", url: "https://docs.opencv.org/4.x/db/d27/tutorial_py_table_of_contents_feature2d.html", free: true },
          { type: "youtube", title: "Feature Matching & Alignment", url: "https://www.youtube.com/watch?v=de9Wq3yK9fs", videoId: "de9Wq3yK9fs", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Panorama Stitcher", brief: "Align and stitch two overlapping photos into a single widescreen panorama using keypoint matching and homography.", difficulty: "medium" }]
      },
      {
        id: "cv-int-ml",
        title: "Classical ML for Vision",
        why: "Before Deep Learning, classical models like SVM and Random Forest on top of HOG features powered object classifiers.",
        prerequisites: ["cv-int-features"],
        outcome: "Extract HOG/LBP features from images and train a classifier to recognize objects.",
        hours: 12,
        difficulty: "medium",
        skills: ["HOG features", "SVM Classifier", "Dimensionality Reduction"],
        tools: ["scikit-image", "scikit-learn"],
        interviewTopics: ["HOG feature representation", "Classical vs Deep Learning vision pipelines"],
        resources: [
          { type: "doc", title: "scikit-image HOG reference", url: "https://scikit-image.org/docs/stable/auto_examples/features_detection/plot_hog.html", free: true },
          { type: "youtube", title: "Image Classification with SVM", url: "https://www.youtube.com/watch?v=de9Wq3yK9fs", videoId: "de9Wq3yK9fs", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Pedestrian Classifier", brief: "Train a Support Vector Machine on HOG features to classify images as 'pedestrian' or 'background'.", difficulty: "medium" }]
      },
      {
        id: "cv-int-cnns",
        title: "Convolutional Neural Networks",
        why: "CNNs learn hierarchical image features automatically, replacing hand-crafted features for superior classification accuracy.",
        prerequisites: [],
        outcome: "Design, compile, train, and evaluate a CNN model using PyTorch or TensorFlow.",
        hours: 18,
        difficulty: "medium",
        skills: ["Convolutional Layers", "Pooling Layers", "PyTorch", "Backpropagation"],
        tools: ["PyTorch / TensorFlow"],
        interviewTopics: ["Receptive fields", "Pooling vs stride convolutions", "Batch normalization"],
        resources: [
          { type: "doc", title: "PyTorch Image Classification", url: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html", free: true },
          { type: "youtube", title: "CNNs Explained Intuitively", url: "https://www.youtube.com/watch?v=FmpDIaiMIeA", videoId: "FmpDIaiMIeA", channel: "Brandon Rohrer", free: true }
        ],
        projects: [{ title: "Custom MNIST Classifier", brief: "Build a PyTorch CNN class to classify handwritten digits with validation scoring and model checkpoints.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "cv-adv-yolo",
        title: "Object Detection (YOLO)",
        why: "Real-time object detection requires identifying *what* objects are present and *where* (bounding boxes) in single digit milliseconds.",
        prerequisites: [],
        outcome: "Deploy a YOLO model and train it on custom bounding-box annotated data.",
        hours: 20,
        difficulty: "hard",
        skills: ["Object Detection", "Bounding Boxes", "YOLO", "Anchor Boxes"],
        tools: ["Ultralytics YOLO", "Roboflow"],
        interviewTopics: ["Non-max suppression (NMS)", "IoU (Intersection over Union)", "One-stage vs two-stage detectors"],
        resources: [
          { type: "doc", title: "Ultralytics YOLO Documentation", url: "https://docs.ultralytics.com/", free: true },
          { type: "youtube", title: "YOLO Object Detection Explained", url: "https://www.youtube.com/watch?v=ag3DLK31yRE", videoId: "ag3DLK31yRE", channel: "Computerphile", free: true }
        ],
        projects: [{ title: "Real-time Webcam Detector", brief: "Build a Python program streaming webcam frames through YOLO, drawing bounding boxes and labels at >30 FPS.", difficulty: "hard" }]
      },
      {
        id: "cv-adv-seg",
        title: "Semantic & Instance Segmentation",
        why: "Segmentation labels every single pixel in an image with a category, which is crucial for medical imagery and autonomous driving.",
        prerequisites: [],
        outcome: "Build a U-Net architecture for binary/multiclass pixel-level segmentation.",
        hours: 18,
        difficulty: "hard",
        skills: ["Semantic Segmentation", "U-Net", "Transpose Convolutions", "Dice Loss"],
        tools: ["PyTorch", "Albumentations"],
        interviewTopics: ["Transpose convolution vs UpSampling", "Semantic vs Instance vs Panoptic segmentation"],
        resources: [
          { type: "doc", title: "U-Net Paper & Architectures", url: "https://arxiv.org/abs/1505.04597", free: true },
          { type: "youtube", title: "Semantic Segmentation Tutorial", url: "https://www.youtube.com/watch?v=de9Wq3yK9fs", videoId: "de9Wq3yK9fs", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Self-Driving Road Segmenter", brief: "Train a U-Net model on road imagery to segments drivable lane regions from surrounding backgrounds.", difficulty: "hard" }]
      },
      {
        id: "cv-adv-transformers",
        title: "Vision Transformers (ViTs)",
        why: "Attention-based Vision Transformers process images as grids of patches, outperforming CNNs on large-scale datasets.",
        prerequisites: [],
        outcome: "Understand patch projections, self-attention in grids, and apply pretrained ViTs.",
        hours: 15,
        difficulty: "hard",
        skills: ["Vision Transformers", "Attention Mechanisms", "Patch Embeddings"],
        tools: ["Hugging Face", "PyTorch"],
        interviewTopics: ["ViT inductive bias vs CNNs", "Attention complexity with respect to patch counts"],
        resources: [
          { type: "doc", title: "Hugging Face ViT docs", url: "https://huggingface.co/docs/transformers/model_doc/vit", free: true },
          { type: "youtube", title: "Vision Transformers (ViTs) Explained", url: "https://www.youtube.com/watch?v=qU7wO0Fi5gc", videoId: "qU7wO0Fi5gc", channel: "Outlier", free: true }
        ],
        projects: [{ title: "Fine-tuned ViT Classifier", brief: "Fine-tune a Google ViT model from Hugging Face on a custom dataset (e.g. flower categories).", difficulty: "hard" }]
      }
    ]
  },
  backend: {
    beginner: [
      {
        id: "be-beg-web-basics",
        title: "Internet & HTTP Protocols",
        why: "Backend servers live on the web. Knowing IP, DNS, HTTP, ports, and headers is absolutely mandatory.",
        prerequisites: [],
        outcome: "Make HTTP requests, analyze status codes, and trace DNS records.",
        hours: 6,
        difficulty: "easy",
        skills: ["Networking Basics", "HTTP/HTTPS", "IP & DNS Routing"],
        tools: ["curl", "Postman"],
        interviewTopics: ["HTTP methods (GET, POST, etc.)", "HTTP Status codes ranges"],
        resources: [
          { type: "doc", title: "MDN HTTP Overview", url: "https://developer.mozilla.org/docs/Web/HTTP/Overview", free: true },
          { type: "youtube", title: "HTTP Protocols & Servers", url: "https://www.youtube.com/watch?v=iYM2zFP3Zn0", videoId: "iYM2zFP3Zn0", channel: "Hussein Nasser", free: true }
        ],
        projects: [{ title: "CLI Request Maker", brief: "Write a command-line tool that fetches data from an API, parses headers, and displays body metrics.", difficulty: "easy" }]
      },
      {
        id: "be-beg-cli-git",
        title: "CLI Tools & Version Control",
        why: "Backend developers configure remote systems and collaborate via terminal commands and Git.",
        prerequisites: [],
        outcome: "Navigate directories, script basic bash actions, and manage Git branches.",
        hours: 6,
        difficulty: "easy",
        skills: ["Bash Commands", "Git Workflow", "SSH Configuration"],
        tools: ["Terminal", "Git"],
        interviewTopics: ["Git merge vs rebase", "File permissions (chmod)"],
        resources: [
          { type: "doc", title: "Git Reference Manual", url: "https://git-scm.com/doc", free: true },
          { type: "youtube", title: "Git and GitHub for Beginners", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", videoId: "RGOj5yH7evk", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Interactive Bash Script", brief: "Create a deployment automation script checking server status, cloning a repo, and launching it.", difficulty: "easy" }]
      },
      {
        id: "be-beg-db-intro",
        title: "SQL & Relational Databases",
        why: "Data persistence is the core job of the backend. SQL relational databases store structured, transaction-safe data.",
        prerequisites: ["be-beg-web-basics"],
        outcome: "Write SELECT, JOIN, INSERT, UPDATE queries and design table relationships.",
        hours: 10,
        difficulty: "easy",
        skills: ["Relational Databases", "SQL Queries", "Database Schema Design"],
        tools: ["PostgreSQL", "SQLite"],
        interviewTopics: ["Primary key vs Foreign key", "JOIN types (Inner, Left, Right, Outer)"],
        resources: [
          { type: "doc", title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", free: true },
          { type: "youtube", title: "Database Design & SQL Course", url: "https://www.youtube.com/watch?v=ztHopE5Wubs", videoId: "ztHopE5Wubs", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "E-Commerce Database Schema", brief: "Design and implement tables for users, orders, and products with referential integrity.", difficulty: "easy" }]
      }
    ],
    intermediate: [
      {
        id: "be-int-apis",
        title: "RESTful API Design",
        why: "REST endpoints expose backend functionality to client-side UI, third-party libraries, and integrations.",
        prerequisites: [],
        outcome: "Build a Node/Express or Python/FastAPI backend serving JSON endpoints.",
        hours: 12,
        difficulty: "medium",
        skills: ["RESTful Principles", "JSON Parsing", "Middleware Setup"],
        tools: ["Express.js / FastAPI"],
        interviewTopics: ["Idempotence in REST APIs", "REST vs RPC endpoints"],
        resources: [
          { type: "doc", title: "RESTful API Design Best Practices", url: "https://restfulapi.net/", free: true },
          { type: "youtube", title: "Backend Web Development Course", url: "https://www.youtube.com/watch?v=tN6o8tC2nSA", videoId: "tN6o8tC2nSA", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Contact Manager API", brief: "Build an API supporting CRUD operations, query-parameter filters, and server-side logging.", difficulty: "medium" }]
      },
      {
        id: "be-int-auth",
        title: "Authentication & Authorization",
        why: "Backend servers must secure user data, verify identity, and manage roles.",
        prerequisites: ["be-int-apis"],
        outcome: "Implement secure user registration, password hashing (bcrypt), and JWT token auth.",
        hours: 12,
        difficulty: "medium",
        skills: ["Password Hashing", "JWT Validation", "Session Management", "Role Guards"],
        tools: ["jsonwebtoken", "bcrypt"],
        interviewTopics: ["JWT structure (header, payload, signature)", "Storing tokens securely"],
        resources: [
          { type: "doc", title: "OWASP Auth Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html", free: true },
          { type: "youtube", title: "JWT Authentication Guide", url: "https://www.youtube.com/watch?v=tN6o8tC2nSA", videoId: "tN6o8tC2nSA", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Secure User Gateway", brief: "Build a Node/Express service with user login, JWT tokens, and route authorization protection.", difficulty: "medium" }]
      },
      {
        id: "be-int-containers",
        title: "Docker & Containerization",
        why: "Docker packages code, runtime, and configurations together, avoiding the 'works on my machine' problem in production.",
        prerequisites: [],
        outcome: "Write Dockerfiles, build container images, and run multi-container applications with Docker Compose.",
        hours: 10,
        difficulty: "medium",
        skills: ["Containers", "Dockerfiles", "Volume Binding", "Docker Compose"],
        tools: ["Docker"],
        interviewTopics: ["Container vs Virtual Machine", "Docker layers and caching"],
        resources: [
          { type: "doc", title: "Docker Getting Started Guide", url: "https://docs.docker.com/get-started/", free: true },
          { type: "youtube", title: "Docker Tutorial for Beginners", url: "https://www.youtube.com/watch?v=3c-iKanqeec", videoId: "3c-iKanqeec", channel: "TechWorld with Nana", free: true }
        ],
        projects: [{ title: "Dockerized API with DB", brief: "Write a Docker Compose file to run a backend container linked with a PostgreSQL container.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "be-adv-caching",
        title: "Redis & Caching",
        why: "Database queries are slow. In-memory databases like Redis cache queries to yield sub-millisecond responses.",
        prerequisites: [],
        outcome: "Integrate Redis caching inside an API to optimize database queries.",
        hours: 12,
        difficulty: "hard",
        skills: ["In-Memory Caching", "Redis", "Cache Invalidation", "Key TTLs"],
        tools: ["Redis"],
        interviewTopics: ["Cache aside pattern", "Cache stampede & eviction policies"],
        resources: [
          { type: "doc", title: "Redis Developer Guides", url: "https://redis.io/docs/latest/develop/", free: true },
          { type: "youtube", title: "Redis Crash Course", url: "https://www.youtube.com/watch?v=jgpVd5Y7Gx4", videoId: "jgpVd5Y7Gx4", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Cached Weather API", brief: "Build a microservice caching geocode endpoints in Redis for 10 minutes to minimize external calls.", difficulty: "hard" }]
      },
      {
        id: "be-adv-brokers",
        title: "Message Brokers (Kafka/RabbitMQ)",
        why: "To scale systems, slow or heavy tasks are run asynchronously via distributed message queues/event brokers.",
        prerequisites: [],
        outcome: "Build a producer-consumer system decoupling user requests from heavy data processing.",
        hours: 14,
        difficulty: "hard",
        skills: ["Pub/Sub Pattern", "Message Queues", "Event Decoupling", "Consumers"],
        tools: ["RabbitMQ / Kafka"],
        interviewTopics: ["Message Broker vs Database", "At-least-once vs Exactly-once delivery"],
        resources: [
          { type: "doc", title: "RabbitMQ Tutorials", url: "https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html", free: true },
          { type: "youtube", title: "Message Brokers Explained", url: "https://www.youtube.com/watch?v=tN6o8tC2nSA", videoId: "tN6o8tC2nSA", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Async PDF Invoice Generator", brief: "An API receives receipt details, pushes to RabbitMQ, and a background worker generates and saves the PDF.", difficulty: "hard" }]
      },
      {
        id: "be-adv-system-design",
        title: "Scaling & Microservices",
        why: "Production apps deal with millions of users. Load balancing, reverse proxies, and microservices split workloads to keep systems online.",
        prerequisites: [],
        outcome: "Configure Nginx as a reverse proxy, set up load balancing, and design a microservices system.",
        hours: 15,
        difficulty: "hard",
        skills: ["Reverse Proxies", "Load Balancing", "Service Discovery", "Scalability"],
        tools: ["Nginx", "PM2 / Docker Swarm"],
        interviewTopics: ["Horizontal vs Vertical scaling", "Reverse proxy benefits"],
        resources: [
          { type: "doc", title: "Nginx Admin Guide", url: "https://docs.nginx.com/nginx/admin-guide/", free: true },
          { type: "youtube", title: "Microservices Architecture", url: "https://www.youtube.com/watch?v=dBGfXw8tWjE", videoId: "dBGfXw8tWjE", channel: "ByteByteGo", free: true }
        ],
        projects: [{ title: "Load-Balanced API cluster", brief: "Configure Nginx to route incoming traffic across three identical instances of your backend Node service.", difficulty: "hard" }]
      }
    ]
  },
  frontend: {
    beginner: [
      {
        id: "fe-beg-html-css",
        title: "Semantic HTML & Responsive CSS",
        why: "HTML sets the structure and accessibility, and CSS formats the layout so websites look modern on all screen sizes.",
        prerequisites: [],
        outcome: "Build clean, accessible web layouts using Flexbox, CSS Grid, and responsive media queries.",
        hours: 10,
        difficulty: "easy",
        skills: ["HTML5 semantics", "CSS Flexbox", "CSS Grid", "Responsive Design"],
        tools: ["Browser DevTools"],
        interviewTopics: ["Box model in CSS", "Semantic elements benefits"],
        resources: [
          { type: "doc", title: "MDN HTML guide", url: "https://developer.mozilla.org/docs/Web/HTML", free: true },
          { type: "youtube", title: "CSS Grid & Flexbox layouts", url: "https://www.youtube.com/watch?v=3YW-Jv-9V8Y", videoId: "3YW-Jv-9V8Y", channel: "Kevin Powell", free: true }
        ],
        projects: [{ title: "Responsive Product grid", brief: "Build an interactive product card grid that shifts seamlessly from mobile screens to multi-column desktop.", difficulty: "easy" }]
      },
      {
        id: "fe-beg-js",
        title: "Modern JavaScript (ES6+)",
        why: "JavaScript drives browser interactions, animations, form validation, and data fetching.",
        prerequisites: ["fe-beg-html-css"],
        outcome: "Write modern ES6+ JS: destructuring, modules, array filters, and DOM manipulation.",
        hours: 12,
        difficulty: "easy",
        skills: ["DOM manipulation", "ES6 Modules", "Array Methods", "Event handling"],
        tools: ["Chrome Console"],
        interviewTopics: ["var vs let vs const", "Arrow functions lexical this"],
        resources: [
          { type: "doc", title: "JavaScript.info Reference", url: "https://javascript.info/", free: true },
          { type: "youtube", title: "JavaScript Course for Beginners", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", videoId: "hdI2bqOjy3c", channel: "Traversy Media", free: true }
        ],
        projects: [{ title: "Weather Tracker (Vanilla JS)", brief: "Fetch temperature details from an open API, update DOM elements, and support location searches.", difficulty: "easy" }]
      }
    ],
    intermediate: [
      {
        id: "fe-int-frameworks",
        title: "React Framework Foundations",
        why: "Component-based libraries make UI modular and handle state updates automatically for dynamic user interfaces.",
        prerequisites: ["fe-beg-js"],
        outcome: "Understand JSX, render components, pass props, and manage state/effects in React.",
        hours: 15,
        difficulty: "medium",
        skills: ["JSX", "React Hooks", "Props", "Event Binding"],
        tools: ["Vite", "React Developer Tools"],
        interviewTopics: ["Virtual DOM", "React state batching"],
        resources: [
          { type: "doc", title: "Official React Learn docs", url: "https://react.dev/learn", free: true },
          { type: "youtube", title: "React Crash Course", url: "https://www.youtube.com/watch?v=j942wKiXFu8", videoId: "j942wKiXFu8", channel: "Net Ninja", free: true }
        ],
        projects: [{ title: "E-Commerce Cart System", brief: "Build an app featuring dynamic state tracking: adding items, adjusting quantities, and rendering totals.", difficulty: "medium" }]
      },
      {
        id: "fe-int-styling",
        title: "Tailwind CSS & Component Libraries",
        why: "Utility-first CSS makes styling rapid and keeps stylesheets small without writing bloated CSS files.",
        prerequisites: ["fe-beg-html-css"],
        outcome: "Style components using Tailwind utility classes and integrate tailwind-merge.",
        hours: 10,
        difficulty: "medium",
        skills: ["Tailwind Utility Classes", "Responsive Classes", "Themes"],
        tools: ["Tailwind VS Code plugin"],
        interviewTopics: ["CSS Specificity in utility frameworks", "Tailwind purge benefits"],
        resources: [
          { type: "doc", title: "Tailwind CSS Docs", url: "https://tailwindcss.com/", free: true },
          { type: "youtube", title: "Tailwind CSS Crash Course", url: "https://www.youtube.com/watch?v=dFgzHOX84xQ", videoId: "dFgzHOX84xQ", channel: "Traversy Media", free: true }
        ],
        projects: [{ title: "Admin Panel Dashboard mockup", brief: "Create a complex dashboard featuring menus, graphs, sidebar grids, and dark modes using Tailwind CSS.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "fe-adv-perf",
        title: "Frontend Performance Optimization",
        why: "Slow web apps hurt SEO and conversion metrics. Code-splitting, caching, and image optimization make page loads instant.",
        prerequisites: [],
        outcome: "Audit applications with Lighthouse, implement lazy loading, and optimize bundles.",
        hours: 12,
        difficulty: "hard",
        skills: ["Bundle Auditing", "Code Splitting", "Lazy Loading", "Asset Caching"],
        tools: ["Lighthouse", "Webpack/Vite Bundle Visualizer"],
        interviewTopics: ["Critical rendering path", "First Contentful Paint (FCP) optimization"],
        resources: [
          { type: "doc", title: "web.dev Performance Guide", url: "https://web.dev/explore/fast", free: true },
          { type: "youtube", title: "Web Performance Optimizations", url: "https://www.youtube.com/watch?v=zJSY8tJY_3M", videoId: "zJSY8tJY_3M", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Bundle Optimization Audits", brief: "Take an unoptimized web project, split code paths, compress images, and raise Lighthouse scores from 40 to 95.", difficulty: "hard" }]
      },
      {
        id: "fe-adv-ssr",
        title: "Server-Side Rendering (Next.js)",
        why: "SSR meta-frameworks improve initial page load times and search engine crawler visibility by generating HTML on the server.",
        prerequisites: ["fe-int-frameworks"],
        outcome: "Build a Next.js App Router project utilizing Server Components and Server Actions.",
        hours: 15,
        difficulty: "hard",
        skills: ["Server Components", "Client Components", "Dynamic Routing", "Static Site Generation"],
        tools: ["Next.js", "Vercel CLI"],
        interviewTopics: ["Client vs Server components", "Data Hydration process"],
        resources: [
          { type: "doc", title: "Next.js App Router Documentation", url: "https://nextjs.org/docs", free: true },
          { type: "youtube", title: "Next.js Full Course", url: "https://www.youtube.com/watch?v=wmEsleV16qdo", videoId: "wmEsleV16qdo", channel: "JavaScript Mastery", free: true }
        ],
        projects: [{ title: "SSR Blog with Search", brief: "Build a blog that renders metadata server-side and uses dynamic static paths for rapid article loads.", difficulty: "hard" }]
      }
    ]
  },
  devops: {
    beginner: [
      {
        id: "do-beg-linux",
        title: "Linux & Shell Scripting",
        why: "DevOps systems run on Linux servers. Comfort in terminal navigation, process management, and scripting is essential.",
        prerequisites: [],
        outcome: "Write shell scripts automating file backup, system monitoring, and installation commands.",
        hours: 8,
        difficulty: "easy",
        skills: ["Linux Commands", "Shell Scripting", "Cron Jobs", "User Permissions"],
        tools: ["Terminal", "Vim/Nano"],
        interviewTopics: ["Linux file hierarchy", "Systemd service configuration"],
        resources: [
          { type: "doc", title: "Linux Command Library", url: "https://linuxcommand.org/", free: true },
          { type: "youtube", title: "Linux Course for Beginners", url: "https://www.youtube.com/watch?v=wBp0Rb-ZJak", videoId: "wBp0Rb-ZJak", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Automated Syslog Checker", brief: "Write a bash script checking system log files for critical failures and emailing reports when found.", difficulty: "easy" }]
      }
    ],
    intermediate: [
      {
        id: "do-int-docker",
        title: "Docker Containers",
        why: "Containers standardize software runtimes, simplifying deployment across testing, staging, and production environments.",
        prerequisites: ["do-beg-linux"],
        outcome: "Write Dockerfiles, compile code into containers, and deploy microservices.",
        hours: 10,
        difficulty: "medium",
        skills: ["Containers", "Docker Network", "Volumes"],
        tools: ["Docker"],
        interviewTopics: ["Docker layers caching", "Container isolation mechanisms"],
        resources: [
          { type: "doc", title: "Docker User Guides", url: "https://docs.docker.com/", free: true },
          { type: "youtube", title: "Docker Tutorial for Beginners", url: "https://www.youtube.com/watch?v=3c-iKanqeec", videoId: "3c-iKanqeec", channel: "TechWorld with Nana", free: true }
        ],
        projects: [{ title: "Multi-container Application Setup", brief: "Build a Docker Compose recipe coordinating a Node web app, a Redis cache, and a PostgreSQL database.", difficulty: "medium" }]
      },
      {
        id: "do-int-cicd",
        title: "CI/CD (GitHub Actions)",
        why: "Automation pipelines run tests, compile assets, and deploy releases upon code merges, preventing manual errors.",
        prerequisites: ["do-int-docker"],
        outcome: "Write automated YAML test-and-build workflow files triggered by git pushes.",
        hours: 10,
        difficulty: "medium",
        skills: ["CI/CD Pipeline Setup", "YAML Workflow syntax", "Secrets Management"],
        tools: ["GitHub Actions"],
        interviewTopics: ["CI vs CD distinction", "GitHub runner configurations"],
        resources: [
          { type: "doc", title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions", free: true },
          { type: "youtube", title: "CI/CD Pipeline tutorial", url: "https://www.youtube.com/watch?v=hQcFE0RD0cQ", videoId: "hQcFE0RD0cQ", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Automatic Build & Deploy pipeline", brief: "Write a GitHub Actions file that runs tests, builds a Docker image, and pushes it to Docker Hub on branch updates.", difficulty: "medium" }]
      },
      {
        id: "do-int-iac",
        title: "Infrastructure as Code (Terraform)",
        why: "Terraform defines infrastructure dynamically using declarative configurations, avoiding manual console click failures.",
        prerequisites: [],
        outcome: "Write Terraform files creating VPCs, security groups, and server instances on AWS.",
        hours: 12,
        difficulty: "medium",
        skills: ["Infrastructure as Code", "Terraform Syntax", "State tracking"],
        tools: ["Terraform CLI"],
        interviewTopics: ["Terraform state locks", "Declarative vs imperative config"],
        resources: [
          { type: "doc", title: "HashiCorp Learn guides", url: "https://developer.hashicorp.com/terraform/tutorials", free: true },
          { type: "youtube", title: "Terraform Tutorial for Beginners", url: "https://www.youtube.com/watch?v=SLB_c_ayRCo", videoId: "SLB_c_ayRCo", channel: "TechWorld with Nana", free: true }
        ],
        projects: [{ title: "Modular AWS Web Infra", brief: "Write Terraform config setting up a secure subnet, spinning up an EC2 instance, and attaching a public IP.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "do-adv-k8s",
        title: "Kubernetes & Orchestration",
        why: "Kubernetes scales container groups automatically, manages load balancing, and ensures service availability in production.",
        prerequisites: ["do-int-docker"],
        outcome: "Write Kubernetes manifests configuring Pods, Deployments, Services, and ingress paths.",
        hours: 20,
        difficulty: "hard",
        skills: ["Container Orchestration", "K8s Manifests", "Services", "ConfigMaps"],
        tools: ["kubectl", "Minikube", "Helm"],
        interviewTopics: ["Kubernetes Architecture (Control plane vs nodes)", "Pods vs Deployments"],
        resources: [
          { type: "doc", title: "Kubernetes Docs", url: "https://kubernetes.io/docs/home/", free: true },
          { type: "youtube", title: "Kubernetes Course for Beginners", url: "https://www.youtube.com/watch?v=X48VuDVv0do", videoId: "X48VuDVv0do", channel: "TechWorld with Nana", free: true }
        ],
        projects: [{ title: "Local Cluster Web Deploy", brief: "Deploy an Express API container cluster on Minikube with load balancing and rolling update policies.", difficulty: "hard" }]
      },
      {
        id: "do-adv-monitor",
        title: "Monitoring & Observability",
        why: "Systems crash. Tracking metrics, logs, and trace telemetry informs developers of outages before clients complain.",
        prerequisites: [],
        outcome: "Integrate Prometheus scraper configurations and display telemetry metrics inside Grafana dashboards.",
        hours: 12,
        difficulty: "hard",
        skills: ["Prometheus Telemetry", "Grafana dashboards", "Log Scraping"],
        tools: ["Prometheus", "Grafana", "Loki"],
        interviewTopics: ["Metrics scraping models", "Logs indexing vs search speeds"],
        resources: [
          { type: "doc", title: "Prometheus Getting Started", url: "https://prometheus.io/docs/introduction/overview/", free: true },
          { type: "youtube", title: "Prometheus & Grafana Setup", url: "https://www.youtube.com/watch?v=hQcFE0RD0cQ", videoId: "hQcFE0RD0cQ", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Telemetry Grafana Dashboard", brief: "Expose query time metrics on a backend API, scrape via Prometheus, and build a Grafana analytics dashboard.", difficulty: "hard" }]
      }
    ]
  },
  "system-design": {
    beginner: [
      {
        id: "sd-beg-client-server",
        title: "Client-Server Architecture",
        why: "Knowing client layers, API gateways, backend services, DNS lookups, and CDNs forms the starting layout of any system.",
        prerequisites: [],
        outcome: "Model high-level system flows from browser inputs down to database stores.",
        hours: 6,
        difficulty: "easy",
        skills: ["System Topologies", "Client-Server Models", "CDNs"],
        tools: ["Draw.io / Excalidraw"],
        interviewTopics: ["DNS resolution steps", "CDN edge cache behaviors"],
        resources: [
          { type: "doc", title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", free: true },
          { type: "youtube", title: "System Design Introduction", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0", videoId: "xpDnVSmNFX0", channel: "Gaurav Sen", free: true }
        ],
        projects: [{ title: "Topology Architecture Diagram", brief: "Design a full system topology map highlighting DNS lookups, CDNs, load balancers, web instances, and DB layers.", difficulty: "easy" }]
      },
      {
        id: "sd-beg-scaling",
        title: "Scaling Strategies (Horizontal vs Vertical)",
        why: "To handle massive traffic, you must choose between renting bigger servers (vertical) or spinning up multiple smaller servers (horizontal).",
        prerequisites: ["sd-beg-client-server"],
        outcome: "Compare costs, complexity, and performance tradeoffs when scaling web application workloads.",
        hours: 6,
        difficulty: "easy",
        skills: ["Horizontal Scaling", "Vertical Scaling", "Load balancing basics"],
        tools: ["System Design calculations"],
        interviewTopics: ["Single point of failure (SPOF)", "Stateless servers in horizontal scaling"],
        resources: [
          { type: "doc", title: "Scaling Web Apps guide", url: "https://github.com/donnemartin/system-design-primer#horizontal-scaling", free: true },
          { type: "youtube", title: "Horizontal vs Vertical Scaling", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0", videoId: "xpDnVSmNFX0", channel: "Gaurav Sen", free: true }
        ],
        projects: [{ title: "System Capacity Estimator", brief: "Calculate server CPU, RAM, and bandwidth requirements to support 10 million daily active users.", difficulty: "easy" }]
      }
    ],
    intermediate: [
      {
        id: "sd-int-load-balancing",
        title: "Load Balancers & Proxies",
        why: "Load balancers distribute traffic across multiple backends, preventing single server overload failures.",
        prerequisites: ["sd-beg-scaling"],
        outcome: "Select and configure routing algorithms (round robin, least connections) using Nginx.",
        hours: 10,
        difficulty: "medium",
        skills: ["Reverse Proxies", "Load Balancers", "Layer 4 vs Layer 7 routing"],
        tools: ["Nginx / HAProxy"],
        interviewTopics: ["Reverse proxy vs forward proxy", "Session stickiness"],
        resources: [
          { type: "doc", title: "Nginx Load Balancing guide", url: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/", free: true },
          { type: "youtube", title: "Load Balancers Explained", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0", videoId: "xpDnVSmNFX0", channel: "Gaurav Sen", free: true }
        ],
        projects: [{ title: "Nginx Load Balanced Cluster", brief: "Write an Nginx config routing client traffic to three Express backend servers running locally.", difficulty: "medium" }]
      },
      {
        id: "sd-int-caching",
        title: "Distributed Caching",
        why: "Caching keeps frequently requested data in memory, avoiding slow and expensive disk queries.",
        prerequisites: [],
        outcome: "Implement cache-aside or write-through caching patterns using Redis.",
        hours: 10,
        difficulty: "medium",
        skills: ["Distributed Caching", "Cache Invalidation", "Cache Eviction"],
        tools: ["Redis / Memcached"],
        interviewTopics: ["Cache stampede", "Least Recently Used (LRU) evictions"],
        resources: [
          { type: "doc", title: "Redis Cache Patterns", url: "https://redis.io/solutions/caching/", free: true },
          { type: "youtube", title: "Caching System Design", url: "https://www.youtube.com/watch?v=U3RkDLtS7uY", videoId: "U3RkDLtS7uY", channel: "Gaurav Sen", free: true }
        ],
        projects: [{ title: "Cache-Aside Data Optimizer", brief: "Build an API middleware that checks Redis first and falls back to a mock database, logging hit/miss statistics.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "sd-adv-microservices",
        title: "Microservices Architecture",
        why: "Splitting monoliths into standalone services enables teams to build, deploy, and scale features independently.",
        prerequisites: [],
        outcome: "Design microservice boundaries, API gateways, and coordinate communication.",
        hours: 14,
        difficulty: "hard",
        skills: ["Microservices", "API Gateways", "Service Registry", "RPC / gRPC"],
        tools: ["gRPC", "Kong API Gateway"],
        interviewTopics: ["API Gateway roles", "Data isolation in microservices"],
        resources: [
          { type: "doc", title: "Microservice patterns guide", url: "https://microservices.io/", free: true },
          { type: "youtube", title: "Microservices System Design", url: "https://www.youtube.com/watch?v=dBGfXw8tWjE", videoId: "dBGfXw8tWjE", channel: "ByteByteGo", free: true }
        ],
        projects: [{ title: "Microservices Communication demo", brief: "Build an order service communicating with an inventory service via gRPC messages.", difficulty: "hard" }]
      },
      {
        id: "sd-adv-cap",
        title: "CAP Theorem & Consensus",
        why: "Distributed systems must make trade-offs between consistency, availability, and partition tolerance during network cuts.",
        prerequisites: [],
        outcome: "Analyze distributed consensus models (Raft/Paxos) and database properties (ACID vs BASE).",
        hours: 15,
        difficulty: "hard",
        skills: ["CAP Theorem", "Consensus Algorithms", "Distributed Transactions"],
        tools: ["Consul / Etcd"],
        interviewTopics: ["Consistent hashing", "Strict consistency vs Eventual consistency"],
        resources: [
          { type: "doc", title: "CAP Theorem overview", url: "https://en.wikipedia.org/wiki/CAP_theorem", free: true },
          { type: "youtube", title: "CAP Theorem Explained", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0", videoId: "xpDnVSmNFX0", channel: "Gaurav Sen", free: true }
        ],
        projects: [{ title: "Raft Consensus Simulation", brief: "Write a small visualization demonstrating leader election and data replication across three local nodes.", difficulty: "hard" }]
      }
    ]
  },
  javascript: {
    beginner: [
      {
        id: "js-beg-variables",
        title: "Variables, Scope & Data Types",
        why: "Variables store data. Understanding the difference between scopes and primitive/reference types is the starting point of coding.",
        prerequisites: [],
        outcome: "Declare variables and manipulate arrays, objects, strings, and boolean checks.",
        hours: 6,
        difficulty: "easy",
        skills: ["JavaScript Syntax", "Primitive Types", "Scope (var/let/const)"],
        tools: ["Browser Console"],
        interviewTopics: ["Difference between undefined and null", "Const mutability"],
        resources: [
          { type: "doc", title: "MDN JS Basics", url: "https://developer.mozilla.org/docs/Web/JavaScript/Guide", free: true },
          { type: "youtube", title: "JS variables & arrays", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", videoId: "hdI2bqOjy3c", channel: "Traversy Media", free: true }
        ],
        projects: [{ title: "Calculator Script", brief: "Write a calculator module supporting basic mathematical inputs and printing results.", difficulty: "easy" }]
      }
    ],
    intermediate: [
      {
        id: "js-int-async",
        title: "Asynchronous JS (Promises & Async/Await)",
        why: "JS runs on a single thread. Asynchronous handlers let the browser load APIs and perform disk actions without freezing the UI.",
        prerequisites: ["js-beg-variables"],
        outcome: "Write Promises, handle errors via try/catch, and load remote API data using async/await.",
        hours: 10,
        difficulty: "medium",
        skills: ["Callbacks", "Promises", "Async/Await", "Error handling"],
        tools: ["Browser Console"],
        interviewTopics: ["Promise states", "Event Loop fundamentals"],
        resources: [
          { type: "doc", title: "MDN Promises guide", url: "https://developer.mozilla.org/docs/Web/JavaScript/Guide/Using_promises", free: true },
          { type: "youtube", title: "Asynchronous JavaScript tutorial", url: "https://www.youtube.com/watch?v=OSr10Shcgz4", videoId: "OSr10Shcgz4", channel: "Net Ninja", free: true }
        ],
        projects: [{ title: "Giphy API browser", brief: "Build an interface that fetches trending GIFs from the Giphy API and updates image nodes asynchronously.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "js-adv-closures",
        title: "Closures & Lexical Scope",
        why: "Closures enable function encapsulation, letting functions preserve access to parent scopes even after the parent terminates.",
        prerequisites: [],
        outcome: "Write private state containers and factory functions using closures.",
        hours: 8,
        difficulty: "hard",
        skills: ["Closures", "Lexical Scoping", "Encapsulation"],
        tools: ["IDE"],
        interviewTopics: ["JavaScript execution context", "Memory leaks via closures"],
        resources: [
          { type: "doc", title: "MDN Closures reference", url: "https://developer.mozilla.org/docs/Web/JavaScript/Closures", free: true },
          { type: "youtube", title: "Closures in JavaScript", url: "https://www.youtube.com/watch?v=71AtaJpJHw0", videoId: "71AtaJpJHw0", channel: "Hitesh Choudhary", free: true }
        ],
        projects: [{ title: "Encapsulated State Factory", brief: "Write a function returning getter/setter functions protecting internal variable objects from direct mutations.", difficulty: "hard" }]
      }
    ]
  },
  typescript: {
    beginner: [
      {
        id: "ts-beg-basics",
        title: "TypeScript Syntax & Types",
        why: "TypeScript adds static types to JavaScript, highlighting syntax and compiler bugs before code execution.",
        prerequisites: [],
        outcome: "Type variables, interfaces, functions, and configure the tsconfig compiler.",
        hours: 6,
        difficulty: "easy",
        skills: ["Static Typing", "Interfaces", "Type Annotations"],
        tools: ["TSC compiler"],
        interviewTopics: ["JavaScript vs TypeScript benefits", "interface vs type aliases"],
        resources: [
          { type: "doc", title: "Official TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", free: true },
          { type: "youtube", title: "TypeScript for Beginners", url: "https://www.youtube.com/watch?v=d56mG7DezGs", videoId: "d56mG7DezGs", channel: "Programming with Mosh", free: true }
        ],
        projects: [{ title: "Strict Calculator script", brief: "Refactor a JS calculation module to strict TS with typed arguments and return signatures.", difficulty: "easy" }]
      }
    ],
    intermediate: [
      {
        id: "ts-int-generics",
        title: "TypeScript Generics & Unions",
        why: "Generics allow us to write reusable component templates that adapt to different types while preserving strict compile-time checks.",
        prerequisites: ["ts-beg-basics"],
        outcome: "Write generic functions, union types, and type assertions.",
        hours: 8,
        difficulty: "medium",
        skills: ["Generics", "Union Types", "Type Guards"],
        tools: ["VS Code"],
        interviewTopics: ["Type assertions vs casting", "Strict null checks"],
        resources: [
          { type: "doc", title: "TS Generics Reference", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html", free: true },
          { type: "youtube", title: "Advanced TypeScript Types", url: "https://www.youtube.com/watch?v=a_mXG1_8XpU", videoId: "a_mXG1_8XpU", channel: "Matt Pocock", free: true }
        ],
        projects: [{ title: "Generic Data Fetcher", brief: "Write an API client class wrapping fetch calls returning strictly-typed JSON responses.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "ts-adv-utility",
        title: "Advanced Utility Types",
        why: "Mapped types, conditional types, and built-in utilities (Pick, Omit) allow developers to write fluid, robust APIs.",
        prerequisites: ["ts-int-generics"],
        outcome: "Use Pick, Omit, Partial, Record, and write custom conditional types.",
        hours: 10,
        difficulty: "hard",
        skills: ["Utility Types", "Mapped Types", "Conditional Types"],
        tools: ["TS Playground"],
        interviewTopics: ["infer keyword in conditional types", "keyof operator"],
        resources: [
          { type: "doc", title: "TS Utility Types Reference", url: "https://www.typescriptlang.org/docs/handbook/utility-types.html", free: true },
          { type: "youtube", title: "TypeScript Wizardry tutorial", url: "https://www.youtube.com/watch?v=a_mXG1_8XpU", videoId: "a_mXG1_8XpU", channel: "Matt Pocock", free: true }
        ],
        projects: [{ title: "Dynamic DB Update type mapper", brief: "Write types mapped from schemas where ID is mandatory, some fields are read-only, and updates are Partial.", difficulty: "hard" }]
      }
    ]
  },
  "deep-learning": {
    beginner: [
      {
        id: "dl-beg-perceptron",
        title: "Perceptrons & Multi-Layer Perceptrons (MLPs)",
        why: "Deep learning models are networks of artificial neurons. Understanding how single nodes compile and propagate values is critical.",
        prerequisites: [],
        outcome: "Write a simple single-layer perceptron and calculate output weights manually.",
        hours: 10,
        difficulty: "easy",
        skills: ["Perceptrons", "Activation Functions", "Weights & Biases"],
        tools: ["NumPy"],
        interviewTopics: ["Activation function roles (ReLU, Sigmoid)", "Why bias terms are needed"],
        resources: [
          { type: "doc", title: "Neural Networks guide", url: "https://en.wikipedia.org/wiki/Artificial_neural_network", free: true },
          { type: "youtube", title: "Neural Networks Intro", url: "https://www.youtube.com/watch?v=VyW3Uxgpx-4", videoId: "VyW3Uxgpx-4", channel: "3Blue1Brown", free: true }
        ],
        projects: [{ title: "Perceptron Logic Solver", brief: "Write a perceptron class in Python that learns AND/OR logic gates after training on truth tables.", difficulty: "easy" }]
      }
    ],
    intermediate: [
      {
        id: "dl-int-backprop",
        title: "Backpropagation & Optimizers",
        why: "Backpropagation uses the chain rule to calculate loss gradients, informing optimizer algorithms (Adam, SGD) how to adjust model weights.",
        prerequisites: ["dl-beg-perceptron"],
        outcome: "Understand calculus loss gradients and code backpropagation steps in PyTorch.",
        hours: 12,
        difficulty: "medium",
        skills: ["Backpropagation", "Calculus Chain Rule", "Gradient Descent", "Loss Functions"],
        tools: ["PyTorch"],
        interviewTopics: ["Vanishing/Exploding gradients", "Adam vs SGD optimization"],
        resources: [
          { type: "doc", title: "Backpropagation explained", url: "https://en.wikipedia.org/wiki/Backpropagation", free: true },
          { type: "youtube", title: "Backpropagation Calculus", url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U", videoId: "Ilg3gGewQ5U", channel: "3Blue1Brown", free: true }
        ],
        projects: [{ title: "Regression Network from Scratch", brief: "Build a multi-layer neural network using only NumPy, implementing forward, backward, and weight update loops.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "dl-adv-transformers",
        title: "Transformers & Self-Attention",
        why: "Self-attention layers process sequences in parallel, capturing long-range context better than sequence recurrence models (LSTMs).",
        prerequisites: ["dl-int-backprop"],
        outcome: "Build a single self-attention head and trace Query, Key, Value calculations.",
        hours: 20,
        difficulty: "hard",
        skills: ["Self-Attention", "QKV matrices", "Transformers"],
        tools: ["PyTorch"],
        interviewTopics: ["Self-attention math", "Positional encodings necessity"],
        resources: [
          { type: "doc", title: "Attention Is All You Need paper", url: "https://arxiv.org/abs/1706.03762", free: true },
          { type: "youtube", title: "Transformers Neural Network tutorial", url: "https://www.youtube.com/watch?v=VyW3Uxgpx-4", videoId: "VyW3Uxgpx-4", channel: "3Blue1Brown", free: true }
        ],
        projects: [{ title: "Micro-GPT Text Generator", brief: "Implement a small decoder-only Transformer model in PyTorch and train it on a short text file to generate prose.", difficulty: "hard" }]
      }
    ]
  },
  "generative-ai": {
    beginner: [
      {
        id: "gen-beg-llms",
        title: "Introduction to Large Language Models",
        why: "LLMs process prompt contexts to predict subsequent tokens, forming the core engines of Generative AI applications.",
        prerequisites: [],
        outcome: "Query commercial APIs (OpenAI, Gemini), configure temperature settings, and manage tokens.",
        hours: 6,
        difficulty: "easy",
        skills: ["LLM basics", "Token consumption", "Temperature controls"],
        tools: ["OpenAI API", "Google Gemini Studio"],
        interviewTopics: ["Tokenizers and context windows", "Temperature vs Top-P settings"],
        resources: [
          { type: "doc", title: "Google Generative AI guides", url: "https://ai.google.dev/docs", free: true },
          { type: "youtube", title: "Generative AI Course", url: "https://www.youtube.com/watch?v=mEsleV16qdo", videoId: "mEsleV16qdo", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Interactive Translation Chatbot", brief: "Write a script calling the Gemini API that translates input text into a user-specified language, with validation logging.", difficulty: "easy" }]
      }
    ],
    intermediate: [
      {
        id: "gen-int-rag",
        title: "Retrieval Augmented Generation (RAG)",
        why: "RAG feeds relevant context from document stores into LLM prompts, preventing hallucinations and exposing private data safely.",
        prerequisites: ["gen-beg-llms"],
        outcome: "Slice documents, create vector embeddings, index them in a DB, and query databases to augment prompts.",
        hours: 12,
        difficulty: "medium",
        skills: ["Vector Embeddings", "Retrieval", "Context Injection", "LlamaIndex / LangChain"],
        tools: ["ChromaDB / Pinecone", "LangChain"],
        interviewTopics: ["Vector search similarity metrics (Cosine, L2)", "Hierarchical chunking"],
        resources: [
          { type: "doc", title: "LangChain RAG overview", url: "https://python.langchain.com/docs/use_cases/question_answering/", free: true },
          { type: "youtube", title: "RAG Explained by LangChain", url: "https://www.youtube.com/watch?v=wd7TZ4w1mSw", videoId: "wd7TZ4w1mSw", channel: "LangChain", free: true }
        ],
        projects: [{ title: "Q&A PDF Bot", brief: "Build an application loading text from a PDF, chunking it, indexing it in ChromaDB, and answering queries via Gemini.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "gen-adv-agents",
        title: "AI Agents & Tool Access",
        why: "Agents plan executions, coordinate tool calls, and review outputs recursively to solve complex requests autonomously.",
        prerequisites: ["gen-int-rag"],
        outcome: "Build multi-step agents utilizing tool binding (Function Calling) and loop controls.",
        hours: 15,
        difficulty: "hard",
        skills: ["Function Calling", "Agent Planning", "ReAct framework"],
        tools: ["LangGraph / CrewAI"],
        interviewTopics: ["ReAct loop cycles", "State management in multi-agent networks"],
        resources: [
          { type: "doc", title: "LangGraph Agents Guides", url: "https://langchain-ai.github.io/langgraph/", free: true },
          { type: "youtube", title: "AI Agents & Function Calling", url: "https://www.youtube.com/watch?v=mEsleV16qdo", videoId: "mEsleV16qdo", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Automated Researcher Agent", brief: "Build an agent that receives a topic, calls a search tool, compiles citations, and prints a Markdown summary.", difficulty: "hard" }]
      }
    ]
  },
  cybersecurity: {
    beginner: [
      {
        id: "sec-beg-networks",
        title: "Networking & CIA Triad",
        why: "To defend/attack systems, you must know IP routing, ports, TCP/UDP, DNS, and key security pillars (Confidentiality, Integrity, Availability).",
        prerequisites: [],
        outcome: "Scan network ports, audit protocols, and define access control rules.",
        hours: 8,
        difficulty: "easy",
        skills: ["Network Auditing", "TCP/UDP Handshakes", "Access Controls"],
        tools: ["Wireshark", "Terminal"],
        interviewTopics: ["TCP 3-way handshake", "CIA Triad definition"],
        resources: [
          { type: "doc", title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework", free: true },
          { type: "youtube", title: "Cybersecurity Course for Beginners", url: "https://www.youtube.com/watch?v=z5rHp2X9BHM", videoId: "z5rHp2X9BHM", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Network traffic auditor", brief: "Use Wireshark to capture local HTTP requests, locate plaintext parameters, and document leak vulnerabilities.", difficulty: "easy" }]
      }
    ],
    intermediate: [
      {
        id: "sec-int-web",
        title: "Web Security & OWASP Top 10",
        why: "Web applications are targeted by injection, cross-site scripting (XSS), and authentication bypasses.",
        prerequisites: ["sec-beg-networks"],
        outcome: "Test and patch SQL Injection, XSS, and CSRF vulnerabilities.",
        hours: 12,
        difficulty: "medium",
        skills: ["Vulnerability Assessment", "Sanitization", "OWASP Audits"],
        tools: ["Burp Suite", "OWASP ZAP"],
        interviewTopics: ["SQL Injection mitigation", "Cross-Origin Resource Sharing (CORS) security"],
        resources: [
          { type: "doc", title: "OWASP Top 10 Reference", url: "https://owasp.org/www-project-top-ten/", free: true },
          { type: "youtube", title: "OWASP Top 10 Vulnerabilities", url: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", videoId: "3Kq1MIfTWCE", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Penetration Audit Report", brief: "Audit a mockup web app, perform SQL injection tests, patch input queries, and write a mitigation report.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "sec-adv-pentest",
        title: "Penetration Testing",
        why: "Penetration testing simulates adversarial attacks to locate hidden system exploits before malicious actors do.",
        prerequisites: ["sec-int-web"],
        outcome: "Run network exploit simulations, escalate privileges, and document remediation paths.",
        hours: 15,
        difficulty: "hard",
        skills: ["Exploit analysis", "Privilege Escalation", "System Hardening"],
        tools: ["Metasploit", "Nmap"],
        interviewTopics: ["Buffer overflow exploitation", "Defensive system hardening steps"],
        resources: [
          { type: "doc", title: "Metasploit Tutorials", url: "https://docs.metasploit.com/", free: true },
          { type: "youtube", title: "Penetration Testing Course", url: "https://www.youtube.com/watch?v=z5rHp2X9BHM", videoId: "z5rHp2X9BHM", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Vulnerable VM Exploit Lab", brief: "Configure a local virtual network, scan an unpatched OS container, run an exploit module, and patch the service.", difficulty: "hard" }]
      }
    ]
  },
  "machine-learning": {
    intermediate: [
      {
        id: "ml-int-supervised",
        title: "Supervised Learning Algorithms",
        why: "Decision Trees, Random Forests, and SVMs form the bedrock of predictive models for tabular data.",
        prerequisites: [],
        outcome: "Train, evaluate, and tune Random Forest and SVM models on classification/regression tasks.",
        hours: 14,
        difficulty: "medium",
        skills: ["Decision Trees", "Random Forest", "Support Vector Machines"],
        tools: ["scikit-learn", "Jupyter Notebooks"],
        interviewTopics: ["Bias-Variance Tradeoff", "Gini Impurity vs Entropy"],
        resources: [
          { type: "doc", title: "scikit-learn supervised guides", url: "https://scikit-learn.org/stable/supervised_learning.html", free: true },
          { type: "youtube", title: "Random Forests & Decision Trees", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs", videoId: "fNk_zzaMoSs", channel: "3Blue1Brown", free: true }
        ],
        projects: [{ title: "Credit Score Assessor", brief: "Train a Random Forest classifier on financial profiles to predict credit default risks, displaying feature importance.", difficulty: "medium" }]
      },
      {
        id: "ml-int-tuning",
        title: "Evaluation & Hyperparameter Tuning",
        why: "Models must generalize. K-Fold Cross Validation and grid search prevent overfitting and find optimal parameters.",
        prerequisites: ["ml-int-supervised"],
        outcome: "Optimize model hyperparameters using GridSearch and validate performance using ROC-AUC.",
        hours: 10,
        difficulty: "medium",
        skills: ["Cross-Validation", "GridSearch", "ROC-AUC curves", "F1 Score"],
        tools: ["scikit-learn"],
        interviewTopics: ["Precision-Recall Tradeoff", "Data Leakage issues"],
        resources: [
          { type: "doc", title: "GridSearch API Reference", url: "https://scikit-learn.org/stable/modules/grid_search.html", free: true },
          { type: "youtube", title: "Model Tuning & Validation", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs", videoId: "fNk_zzaMoSs", channel: "3Blue1Brown", free: true }
        ],
        projects: [{ title: "Optimal Grid Tuning Engine", brief: "Perform GridSearch on an SVM, benchmarking radial vs linear kernels, and outputting confusion matrices.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "ml-adv-boosting",
        title: "Gradient Boosting & XGBoost",
        why: "Boosting models train trees sequentially to correct predecessor errors, winning most Kaggle tabular competitions.",
        prerequisites: [],
        outcome: "Train XGBoost models, configure learning rates, and handle missing values automatically.",
        hours: 15,
        difficulty: "hard",
        skills: ["Gradient Boosting", "XGBoost", "Regularization"],
        tools: ["xgboost", "LightGBM"],
        interviewTopics: ["Bagging vs Boosting", "Gradient boosting math"],
        resources: [
          { type: "doc", title: "XGBoost Documentation", url: "https://xgboost.readthedocs.io/", free: true },
          { type: "youtube", title: "XGBoost Explained", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs", videoId: "fNk_zzaMoSs", channel: "3Blue1Brown", free: true }
        ],
        projects: [{ title: "Customer Churn Predictor", brief: "Apply XGBoost to classify subscription cancellation risks, using early stopping to prevent over-training.", difficulty: "hard" }]
      }
    ]
  },
  python: {
    intermediate: [
      {
        id: "py-int-oop",
        title: "Object-Oriented Python",
        why: "OOP structures code via classes, inheritance, encapsulation, and magic methods for clean software design.",
        prerequisites: [],
        outcome: "Design classes, override magic methods (__str__, __init__), and apply polymorphism.",
        hours: 8,
        difficulty: "medium",
        skills: ["Object-Oriented Design", "Magic Methods", "Inheritance"],
        tools: ["Python CLI"],
        interviewTopics: ["Multiple inheritance (MRO)", "Abstract Base Classes"],
        resources: [
          { type: "doc", title: "Python OOP Tutorial", url: "https://docs.python.org/3/tutorial/classes.html", free: true },
          { type: "youtube", title: "Python OOP Crash Course", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", videoId: "rfscVS0vtbw", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Banking Account Manager", brief: "Build an account system supporting savings/checking classes, deposit validations, and custom exception handling.", difficulty: "medium" }]
      },
      {
        id: "py-int-decorators",
        title: "Decorators & Generators",
        why: "Decorators wrap functions to insert logging/auth, and generators yield values lazily to process large files without exhausting RAM.",
        prerequisites: ["py-int-oop"],
        outcome: "Write custom decorators and design generator iterators for streaming inputs.",
        hours: 8,
        difficulty: "medium",
        skills: ["Decorators", "Generators", "Memory Efficiency"],
        tools: ["Python"],
        interviewTopics: ["Closures in decorators", "yield vs return statements"],
        resources: [
          { type: "doc", title: "Python Generators guide", url: "https://wiki.python.org/moin/Generators", free: true },
          { type: "youtube", title: "Python Decorators & Generators", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", videoId: "rfscVS0vtbw", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Telemetry Logging decorator", brief: "Write a `@log_runtime` decorator tracking and outputting function execution duration.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "py-adv-concurrency",
        title: "Concurrency (Asyncio & Multiprocessing)",
        why: "Python's GIL blocks threads. Speeding up I/O requires Asyncio, while scaling CPU tasks demands Multiprocessing.",
        prerequisites: [],
        outcome: "Write asynchronous code using asyncio event loops and launch multiprocessing pools.",
        hours: 14,
        difficulty: "hard",
        skills: ["Asyncio", "GIL limitations", "Multiprocessing pools"],
        tools: ["asyncio"],
        interviewTopics: ["GIL (Global Interpreter Lock)", "Asynchronous vs Multiprocessing"],
        resources: [
          { type: "doc", title: "Python asyncio reference", url: "https://docs.python.org/3/library/asyncio.html", free: true },
          { type: "youtube", title: "Python Concurrency Tutorial", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", videoId: "rfscVS0vtbw", channel: "freeCodeCamp", free: true }
        ],
        projects: [{ title: "Async Image Downloader", brief: "Write an asyncio downloader fetching multiple images concurrently, managing connection pools.", difficulty: "hard" }]
      }
    ]
  },
  aws: {
    intermediate: [
      {
        id: "aws-int-compute",
        title: "Container Compute (ECS & Fargate)",
        why: "To run Docker containers in production without managing servers, developers deploy to ECS with Fargate.",
        prerequisites: [],
        outcome: "Write task definitions, launch ECS clusters, and manage load balanced container groups.",
        hours: 12,
        difficulty: "medium",
        skills: ["Container Orchestration", "ECS Tasks", "AWS Fargate Serverless"],
        tools: ["AWS Console", "AWS CLI"],
        interviewTopics: ["Fargate vs EC2 launch types", "ECS task definition settings"],
        resources: [
          { type: "doc", title: "AWS ECS getting started", url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html", free: true },
          { type: "youtube", title: "AWS ECS & Fargate Tutorial", url: "https://www.youtube.com/watch?v=a9__D53WsUs", videoId: "a9__D53WsUs", channel: "Fireship", free: true }
        ],
        projects: [{ title: "Fargate Container API", brief: "Deploy an Express API container on AWS Fargate behind an Application Load Balancer.", difficulty: "medium" }]
      }
    ],
    advanced: [
      {
        id: "aws-adv-iac",
        title: "CloudFormation & AWS CDK",
        why: "AWS CDK lets you define cloud infrastructure using TypeScript/Python, synthesizing secure configurations automatically.",
        prerequisites: [],
        outcome: "Write CDK stacks provisioning VPCs, S3 buckets, and Lambda routes dynamically.",
        hours: 15,
        difficulty: "hard",
        skills: ["Cloud Infrastructure", "AWS CDK", "CloudFormation Stacks"],
        tools: ["AWS CDK CLI"],
        interviewTopics: ["CDK constructs levels", "CloudFormation stacks updates"],
        resources: [
          { type: "doc", title: "AWS CDK Guides", url: "https://docs.aws.amazon.com/cdk/v2/guide/home.html", free: true },
          { type: "youtube", title: "AWS CDK Tutorial", url: "https://www.youtube.com/watch?v=a9__D53WsUs", videoId: "a9__D53WsUs", channel: "Fireship", free: true }
        ],
        projects: [{ title: "CDK Serverless API stack", brief: "Write a CDK stack provisioning a DynamoDB table, a Lambda solver, and an API Gateway endpoint.", difficulty: "hard" }]
      }
    ]
  }
};

