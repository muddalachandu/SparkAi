import { type RoadmapNode, type RoadmapResource } from "./roadmap-catalog";

// Priority Official Documentation Sources
export const OFFICIAL_DOCS: Record<string, { title: string; url: string }> = {
  webdev: { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
  html: { title: "WHATWG HTML Living Standard", url: "https://html.spec.whatwg.org" },
  w3c: { title: "W3C Standards", url: "https://www.w3.org" },
  react: { title: "React Official Docs", url: "https://react.dev" },
  nextjs: { title: "Next.js Documentation", url: "https://nextjs.org/docs" },
  vue: { title: "Vue.js Documentation", url: "https://vuejs.org" },
  angular: { title: "Angular Documentation", url: "https://angular.dev" },
  javascript: { title: "MDN JavaScript Reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  typescript: { title: "TypeScript Official Docs", url: "https://www.typescriptlang.org/docs" },
  nodejs: { title: "Node.js API Docs", url: "https://nodejs.org/docs/latest/api" },
  python: { title: "Python Documentation", url: "https://docs.python.org/3" },
  java: { title: "Oracle Java SE Documentation", url: "https://docs.oracle.com/javase" },
  springboot: { title: "Spring Boot Reference", url: "https://spring.io/projects/spring-boot" },
  django: { title: "Django Documentation", url: "https://docs.djangoproject.com" },
  fastapi: { title: "FastAPI Documentation", url: "https://fastapi.tiangolo.com" },
  laravel: { title: "Laravel Documentation", url: "https://laravel.com/docs" },
  flutter: { title: "Flutter Docs", url: "https://docs.flutter.dev" },
  android: { title: "Android Developers", url: "https://developer.android.com" },
  swift: { title: "Apple Developer Swift Documentation", url: "https://developer.apple.com/documentation" },
  kotlin: { title: "Kotlin Documentation", url: "https://kotlinlang.org/docs" },
  aws: { title: "AWS Documentation", url: "https://docs.aws.amazon.com" },
  azure: { title: "Microsoft Azure Documentation", url: "https://learn.microsoft.com/azure" },
  gcp: { title: "Google Cloud Documentation", url: "https://cloud.google.com/docs" },
  docker: { title: "Docker Docs", url: "https://docs.docker.com" },
  kubernetes: { title: "Kubernetes Documentation", url: "https://kubernetes.io/docs" },
  terraform: { title: "Terraform Documentation", url: "https://developer.hashicorp.com/terraform/docs" },
  git: { title: "Git Reference Manual", url: "https://git-scm.com/doc" },
  github: { title: "GitHub Docs", url: "https://docs.github.com" },
  mongodb: { title: "MongoDB Manual", url: "https://www.mongodb.com/docs" },
  postgresql: { title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs" },
  redis: { title: "Redis Documentation", url: "https://redis.io/docs" },
  graphql: { title: "GraphQL Learn Guide", url: "https://graphql.org/learn" },
  tensorflow: { title: "TensorFlow Learn Guide", url: "https://www.tensorflow.org/learn" },
  pytorch: { title: "PyTorch Documentation", url: "https://pytorch.org/docs" },
  openai: { title: "OpenAI Developer Platform Docs", url: "https://platform.openai.com/docs" },
  langchain: { title: "LangChain Documentation", url: "https://python.langchain.com/docs" },
  huggingface: { title: "Hugging Face Documentation", url: "https://huggingface.co/docs" },
  linux: { title: "Linux Journey Interactive Learning", url: "https://linuxjourney.com" },
  cybersecurity: { title: "OWASP Foundation Security Standards", url: "https://owasp.org" },
  pandas: { title: "Pandas Official Documentation", url: "https://pandas.pydata.org/docs/" },
  cloud: { title: "AWS Cloud Computing Basics", url: "https://aws.amazon.com/what-is-cloud-computing/" },
  go: { title: "Go Programming Language Documentation", url: "https://go.dev/doc/" },
  rust: { title: "Rust Programming Language Learn Guide", url: "https://www.rust-lang.org/learn" },
};

// Curated YouTube Channels & Video IDs for exact playback
export interface YouTubeVideoInfo {
  title: string;
  channel: string;
  videoId: string;
  url: string;
  duration?: string;
  rating?: number;
}

export const YOUTUBE_LIBRARY: Record<string, YouTubeVideoInfo[]> = {
  react: [
    { title: "React Crash Course for Beginners", channel: "Traversy Media", videoId: "w7ejDZ8SWv8", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", duration: "1h 30m", rating: 4.8 },
    { title: "React JS Tutorial for Beginners", channel: "Net Ninja", videoId: "j942wKiXFu8", url: "https://www.youtube.com/watch?v=j942wKiXFu8", duration: "2h 15m", rating: 4.9 },
  ],
  nextjs: [
    { title: "Next.js App Router Crash Course", channel: "Traversy Media", videoId: "ZjAqacq_ToI", url: "https://www.youtube.com/watch?v=ZjAqacq_ToI", duration: "1h 45m", rating: 4.8 },
    { title: "Next.js 14 in 100 Seconds", channel: "Fireship", videoId: "Sklc_fSGryY", url: "https://www.youtube.com/watch?v=Sklc_fSGryY", duration: "2m", rating: 4.9 },
  ],
  javascript: [
    { title: "JavaScript Course for Beginners", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", duration: "3h 20m", rating: 4.9 },
    { title: "JavaScript Tutorial for Beginners", channel: "Programming with Mosh", videoId: "W6NZ1r0KB9A", url: "https://www.youtube.com/watch?v=W6NZ1r0KB9A", duration: "1h 10m", rating: 4.8 },
  ],
  typescript: [
    { title: "TypeScript Tutorial for Beginners", channel: "Net Ninja", videoId: "2pZmEmXL0nY", url: "https://www.youtube.com/watch?v=2pZmEmXL0nY", duration: "1h 20m", rating: 4.8 },
    { title: "TypeScript in 100 Seconds", channel: "Fireship", videoId: "zQnBQ4tB3ZA", url: "https://www.youtube.com/watch?v=zQnBQ4tB3ZA", duration: "2m", rating: 4.9 },
  ],
  python: [
    { title: "Python for Beginners - Full Course", channel: "freeCodeCamp", videoId: "rfscVS0vtbw", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", duration: "4h 30m", rating: 4.9 },
    { title: "Python OOP Tutorial", channel: "Programming with Mosh", videoId: "pTB0EiLXUC8", url: "https://www.youtube.com/watch?v=pTB0EiLXUC8", duration: "1h 15m", rating: 4.8 },
  ],
  docker: [
    { title: "Docker Tutorial for Beginners", channel: "freeCodeCamp", videoId: "3c-iKanqdEc", url: "https://www.youtube.com/watch?v=3c-iKanqdEc", duration: "2h 45m", rating: 4.8 },
    { title: "Docker in 100 Seconds", channel: "Fireship", videoId: "gAkwW2tuIq8", url: "https://www.youtube.com/watch?v=gAkwW2tuIq8", duration: "2m", rating: 4.9 },
  ],
  kubernetes: [
    { title: "Kubernetes Tutorial for Beginners", channel: "TechWorld with Nana", videoId: "X48VuDVv0do", url: "https://www.youtube.com/watch?v=X48VuDVv0do", duration: "3h 40m", rating: 4.9 },
    { title: "Kubernetes in 100 Seconds", channel: "Fireship", videoId: "Pz-YIIU67s8", url: "https://www.youtube.com/watch?v=Pz-YIIU67s8", duration: "2m", rating: 4.8 },
  ],
  aws: [
    { title: "AWS Certified Cloud Practitioner Course", channel: "freeCodeCamp", videoId: "SOTamWGuDKc", url: "https://www.youtube.com/watch?v=SOTamWGuDKc", duration: "4h 15m", rating: 4.8 },
    { title: "AWS in 100 Seconds", channel: "Fireship", videoId: "a9__D53WsUs", url: "https://www.youtube.com/watch?v=a9__D53WsUs", duration: "2m", rating: 4.9 },
  ],
  dsa: [
    { title: "Data Structures & Algorithms Course", channel: "Programming with Mosh", videoId: "8hly31xKjhc", url: "https://www.youtube.com/watch?v=8hly31xKjhc", duration: "2h 00m", rating: 4.9 },
    { title: "Introduction to Algorithms (CLRS)", channel: "MIT OpenCourseWare", videoId: "Db9yQRE60b4", url: "https://www.youtube.com/watch?v=Db9yQRE60b4", duration: "1h 15m", rating: 4.8 },
  ],
  ai: [
    { title: "Neural Networks: Zero to Hero", channel: "Andrej Karpathy", videoId: "VMj-3S1tku0", url: "https://www.youtube.com/watch?v=VMj-3S1tku0", duration: "2h 25m", rating: 4.9 },
    { title: "Deep Learning Demystified", channel: "3Blue1Brown", videoId: "aircAruvnKk", url: "https://www.youtube.com/watch?v=aircAruvnKk", duration: "25m", rating: 4.9 },
  ],
  cybersecurity: [
    { title: "Cybersecurity Course for Beginners", channel: "NetworkChuck", videoId: "fNzpXM0y1aU", url: "https://www.youtube.com/watch?v=fNzpXM0y1aU", duration: "1h 50m", rating: 4.8 },
    { title: "OWASP Top 10 Web Security vulnerabilities", channel: "freeCodeCamp", videoId: "fK3gN9k-X0Y", url: "https://www.youtube.com/watch?v=fK3gN9k-X0Y", duration: "2h 10m", rating: 4.9 },
  ],
  git: [
    { title: "Git & GitHub Course for Beginners", channel: "freeCodeCamp", videoId: "RGOj5yH7evk", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", duration: "1h 10m", rating: 4.8 },
    { title: "Git in 100 Seconds", channel: "Fireship", videoId: "hw3bHdU-7v4", url: "https://www.youtube.com/watch?v=hw3bHdU-7v4", duration: "2m", rating: 4.9 },
  ],
  sql: [
    { title: "SQL Tutorial for Beginners", channel: "freeCodeCamp", videoId: "HXV3zeQKqGY", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", duration: "4h 20m", rating: 4.9 },
    { title: "SQL in 100 Seconds", channel: "Fireship", videoId: "ztHopE5Wubs", url: "https://www.youtube.com/watch?v=ztHopE5Wubs", duration: "2m", rating: 4.8 },
  ],
  pandas: [
    { title: "Pandas Tutorial for Beginners", channel: "Keith Galli", videoId: "vmEHCJof1Oo", url: "https://www.youtube.com/watch?v=vmEHCJof1Oo", duration: "1h 00m", rating: 4.9 },
    { title: "Pandas Crash Course", channel: "Corey Schafer", videoId: "ZyhVh-qRZPA", url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA", duration: "30m", rating: 4.8 },
  ],
  cloud: [
    { title: "Cloud Computing Tutorial for Beginners", channel: "Simplilearn", videoId: "2LaAJq1lB1Q", url: "https://www.youtube.com/watch?v=2LaAJq1lB1Q", duration: "2h 30m", rating: 4.8 },
    { title: "Cloud Computing in 100 Seconds", channel: "Fireship", videoId: "M988_fsOSWo", url: "https://www.youtube.com/watch?v=M988_fsOSWo", duration: "2m", rating: 4.9 },
  ],
  "computer-vision": [
    { title: "Computer Vision Course - OpenCV & Python", channel: "freeCodeCamp", videoId: "oXlwWbU8l2o", url: "https://www.youtube.com/watch?v=oXlwWbU8l2o", duration: "3h 40m", rating: 4.9 },
    { title: "OpenCV Python Tutorial for Beginners", channel: "ProgrammingKnowledge", videoId: "oXlwWbU8l2o", url: "https://www.youtube.com/watch?v=oXlwWbU8l2o", duration: "2h 15m", rating: 4.8 }
  ]
};

// Curated Practice Platform URLs
export const PRACTICE_PLATFORMS = {
  dsa: { title: "LeetCode Practice", url: "https://leetcode.com" },
  frontend: { title: "Frontend Mentor Challenges", url: "https://www.frontendmentor.io" },
  backend: { title: "Exercism Coding Tracks", url: "https://exercism.org" },
  devops: { title: "Killercoda K8s Playgrounds", url: "https://killercoda.com" },
  cybersecurity: { title: "TryHackMe Security Labs", url: "https://tryhackme.com" },
  cloud: { title: "AWS Skillbuilder Training", url: "https://aws.skillbuilder.com" },
  ai: { title: "Kaggle Competitions & Notebooks", url: "https://www.kaggle.com" },
};

// Curated Cheat Sheet Platforms
export const CHEATSHEETS = {
  devhints: "https://devhints.io",
  quickref: "https://quickref.me",
  overapi: "https://overapi.com",
};

// Curated Awesome Lists on GitHub
export const AWESOME_LISTS: Record<string, string> = {
  react: "https://github.com/enaqx/awesome-react",
  nextjs: "https://github.com/unicodeveloper/awesome-nextjs",
  javascript: "https://github.com/sorrycc/awesome-javascript",
  typescript: "https://github.com/dzharii/awesome-typescript",
  python: "https://github.com/vinta/awesome-python",
  docker: "https://github.com/veggiemonk/awesome-docker",
  kubernetes: "https://github.com/ramitsurana/awesome-kubernetes",
  aws: "https://github.com/donnemartin/awesome-aws",
  dsa: "https://github.com/tayllan/awesome-algorithms",
  ai: "https://github.com/josephmisiti/awesome-machine-learning",
  cybersecurity: "https://github.com/sbilly/awesome-security",
  git: "https://github.com/dictcp/awesome-git",
  pandas: "https://github.com/academic/awesome-datascience",
  cloud: "https://github.com/donnemartin/awesome-aws",
  "computer-vision": "https://github.com/jbhuang0604/awesome-computer-vision",
};

// Help helper to match keywords
export function matchKey(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("pandas") || t.includes("dataframe")) return "pandas";
  if (t.includes("cloud computing") || t.includes("cloud fundamentals") || t.includes("cloud architecture")) return "cloud";
  if (t.includes("react") && !t.includes("next")) return "react";
  if (t.includes("next")) return "nextjs";
  if (t.includes("javascript") || t.includes(" es6") || t.includes(" js")) return "javascript";
  if (t.includes("typescript") || t.includes(" ts")) return "typescript";
  if (t.includes("python")) return "python";
  if (t.includes("docker") || t.includes("container")) return "docker";
  if (t.includes("kubernetes") || t.includes("k8s") || t.includes("helm")) return "kubernetes";
  if (t.includes("aws") || t.includes("cloud") || t.includes("lambda") || t.includes("s3") || t.includes("ec2")) return "aws";
  if (t.includes("dsa") || t.includes("algorithm") || t.includes("tree") || t.includes("list") || t.includes("graph")) return "dsa";
  if (t.includes("vision") || t.includes("opencv") || t.includes("image processing") || t.includes("yolo") || t.includes("cv")) return "computer-vision";
  if (t.includes("ai ") || t.includes("machine learning") || t.includes("neural") || t.includes("model") || t.includes("tensor") || t.includes("pytorch") || t.includes("deep learning")) return "ai";
  if (t.includes("security") || t.includes("cyber") || t.includes("owasp") || t.includes("exploit") || t.includes("crack")) return "cybersecurity";
  if (t.includes("git")) return "git";
  if (t.includes("sql") || t.includes("postgres") || t.includes("mongo") || t.includes("database") || t.includes("query") || t.includes("nosql")) return "sql";
  if (t.includes("java") && !t.includes("javascript")) return "java";
  if (t.includes("spring")) return "springboot";
  if (t.includes("django")) return "django";
  if (t.includes("fastapi")) return "fastapi";
  if (t.includes("laravel") || t.includes("php")) return "laravel";
  if (t.includes("flutter") || t.includes("dart")) return "flutter";
  if (t.includes("android")) return "android";
  if (t.includes("swift") || t.includes("ios")) return "swift";
  if (t.includes("kotlin")) return "kotlin";
  if (t.includes("azure")) return "azure";
  if (t.includes("gcp") || t.includes("google cloud")) return "gcp";
  if (t.includes("terraform")) return "terraform";
  if (t.includes("mongodb")) return "mongodb";
  if (t.includes("postgresql")) return "postgresql";
  if (t.includes("redis")) return "redis";
  if (t.includes("graphql")) return "graphql";
  if (t.includes("tensorflow")) return "tensorflow";
  if (t.includes("pytorch")) return "pytorch";
  if (t.includes("openai")) return "openai";
  if (t.includes("langchain")) return "langchain";
  if (t.includes("huggingface")) return "huggingface";
  if (t.includes("linux") || t.includes("bash") || t.includes("shell")) return "linux";
  return null;
}

// Map key to standard domain area
function getPracticeDomain(key: string | null): keyof typeof PRACTICE_PLATFORMS {
  if (!key) return "backend";
  if (key === "dsa") return "dsa";
  if (key === "react" || key === "nextjs") return "frontend";
  if (key === "docker" || key === "kubernetes") return "devops";
  if (key === "cybersecurity") return "cybersecurity";
  if (key === "aws" || key === "cloud") return "cloud";
  if (key === "ai" || key === "pandas" || key === "computer-vision") return "ai";
  return "backend";
}

// Generate static interview questions if AI fails
export interface InterviewQuestion {
  question: string;
  answer: string;
}

export function getFallbackInterviewQuestions(topic: string, key: string | null): InterviewQuestion[] {
  const normKey = key || "general";
  
  const library: Record<string, InterviewQuestion[]> = {
    react: [
      { question: "What is the Virtual DOM and how does React use it?", answer: "React builds an in-memory cache of the UI structure (the Virtual DOM). When state updates, React renders a new virtual tree, computes the diff (reconciliation) against the real DOM, and updates only the changed nodes for high performance." },
      { question: "What are React Hooks and what rules govern them?", answer: "Hooks are functions that let you hook into React state and lifecycle features from functional components. Rules: 1. Only call Hooks at the top level (not inside loops or conditions). 2. Only call Hooks from React Function Components or Custom Hooks." },
      { question: "What is the difference between props and state?", answer: "Props are read-only inputs passed into a component by its parent, used to configure it. State is a private, mutable data store managed internally by the component itself to track interactive changes." }
    ],
    nextjs: [
      { question: "What is the difference between Server Components and Client Components in Next.js?", answer: "Server Components are rendered on the server, meaning they send zero JavaScript to the client, improving load speed. Client Components are hydrated on the client, enabling interactivity (like useState, event listeners, and browser APIs). Use 'use client' to declare them." },
      { question: "What are SSR, SSG, and ISR in Next.js?", answer: "SSR (Server-Side Rendering) fetches data and renders pages on every request. SSG (Static Site Generation) compiles pages once at build time. ISR (Incremental Static Regeneration) rebuilds static pages in the background after a specified interval when requests come in." }
    ],
    javascript: [
      { question: "Explain event delegation in JavaScript.", answer: "Event delegation is a technique where you attach a single event listener to a parent element rather than multiple listeners to individual child elements. It relies on event bubbling, where the event propagates up through child nodes to the parent." },
      { question: "What is a closure in JavaScript?", answer: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). Closures allow an inner function to access variables from an outer function scope even after the outer function has completed execution." }
    ],
    typescript: [
      { question: "What is the difference between an Interface and a Type Alias in TypeScript?", answer: "Interfaces are extendable via declaration merging (you can declare the same interface twice and they merge) and are preferred for objects. Type Aliases can define primitives, unions, and tuples, but cannot be reopened to add new properties." },
      { question: "What are generics in TypeScript?", answer: "Generics allow you to build reusable components or functions that work over a variety of types rather than a single one, preserving type safety (e.g. `Array<T>` or `Promise<T>`)." }
    ],
    python: [
      { question: "How does memory management work in Python?", answer: "Python manages memory via a private heap space that holds all Python objects. The Python interpreter allocates heap space automatically and recovers unused space via a built-in garbage collector that counts references and handles cyclic references." },
      { question: "What are list comprehensions and generator expressions?", answer: "List comprehensions offer a concise syntax to create lists (e.g. `[x*2 for x in items]`). Generator expressions use parentheses and yield values one at a time lazily (e.g. `(x*2 for x in items)`), saving memory on large streams." }
    ],
    docker: [
      { question: "What is the difference between a Docker Image and a Docker Container?", answer: "A Docker Image is a read-only, static template containing instructions for creating a container (like a blueprint). A Docker Container is a running, writeable instance of an image running in isolation." },
      { question: "Explain the purpose of Docker Compose.", answer: "Docker Compose is a tool for defining and running multi-container Docker applications. You declare your services, networks, and volumes in a single `docker-compose.yml` file, and deploy the entire stack using `docker-compose up`." }
    ],
    kubernetes: [
      { question: "What is a Pod in Kubernetes?", answer: "A Pod is the smallest deployable unit in Kubernetes. It represents a single instance of a running process and can contain one or more tightly coupled containers sharing storage and network IP addresses." },
      { question: "What does a Kubernetes Service do?", answer: "A Service is an abstraction that defines a logical set of Pods and a policy to access them. It provides a stable network IP address and DNS name, acting as a load balancer to route traffic across dynamic Pods." }
    ],
    aws: [
      { question: "Explain the difference between AWS IAM Roles and IAM Users.", answer: "An IAM User is a permanent identity associated with a specific person or application with credentials (password/access keys). An IAM Role is an identity with temporary permissions that can be assumed by any trusted entity (like an EC2 instance or Lambda)." },
      { question: "What is AWS Lambda?", answer: "AWS Lambda is a serverless compute service that runs your code in response to events (e.g., S3 upload, API request) and automatically manages the underlying compute infrastructure, billing you only for active execution time." }
    ],
    dsa: [
      { question: "What is the time complexity of searching in a Hash Map vs a Binary Search Tree?", answer: "A Hash Map offers O(1) average time complexity for searches, but can degrade to O(N) in case of high hash collisions. A Balanced Binary Search Tree offers O(log N) search complexity in both average and worst cases." },
      { question: "Explain the difference between Depth First Search (DFS) and Breadth First Search (BFS) in graphs.", answer: "DFS explores as deep as possible along each branch before backtracking, utilizing a Stack (or recursion). BFS explores all neighbor nodes at the current depth before moving to nodes at the next level, utilizing a Queue." }
    ],
    cybersecurity: [
      { question: "What is Cross-Site Scripting (XSS) and how do you prevent it?", answer: "XSS is a vulnerability where malicious scripts are injected into trusted websites and executed in user browsers. Prevention: Sanitizing and encoding all user input before rendering it in the DOM, and setting robust Content Security Policies (CSP)." },
      { question: "What is the purpose of a Salt in cryptography and password hashing?", answer: "A Salt is a random string of data appended to a password before hashing. It ensures that identical passwords yield completely different hashes, protecting against pre-computed table attacks (Rainbow Tables)." }
    ],
    git: [
      { question: "What is the difference between git merge and git rebase?", answer: "Git merge joins two branches together by creating a new merge commit, preserving historical context. Git rebase moves the entire commit history of a branch onto the tip of another branch, producing a clean, linear history." }
    ],
    sql: [
      { question: "What are database Indexes and what are their tradeoffs?", answer: "Indexes are data structures (typically B-Trees) that speed up database query retrieval. Tradeoff: They slow down write operations (INSERT, UPDATE, DELETE) because the index must be updated, and they consume additional storage disk space." }
    ],
    general: [
      { question: "What is Clean Code and why is it important?", answer: "Clean Code is code that is easy to read, write, and maintain by other developers. It includes sensible naming, single-responsibility functions, extensive testing, and minimal duplication, preventing technical debt." }
    ]
  };

  return library[normKey] || library.general;
}

// Automatic Enrichment Engine
export function enrichRoadmapNode(node: RoadmapNode, domainSlug: string): RoadmapNode {
  const enriched = { ...node };
  
  // 1. Identify Tech Key
  const key = matchKey(node.title) || matchKey(domainSlug) || matchKey(node.id);
  
  // 2. Guarantee Prerequisites
  if (!enriched.prerequisites) {
    enriched.prerequisites = [];
  }
  
  // 3. Guarantee Hours
  if (!enriched.hours || enriched.hours <= 0) {
    enriched.hours = enriched.difficulty === "easy" ? 8 : enriched.difficulty === "medium" ? 14 : 20;
  }
  
  // 4. Guarantee Skills & Tools
  if (!enriched.skills || enriched.skills.length === 0) {
    enriched.skills = [node.title, key || "Engineering", "Fundamentals"];
  }
  if (!enriched.tools || enriched.tools.length === 0) {
    enriched.tools = ["VS Code", key || "DevTools", "Git"];
  }
  
  // 5. Guarantee Projects
  if (!enriched.projects || enriched.projects.length === 0) {
    enriched.projects = [
      {
        title: `${node.title} Sandbox App`,
        brief: `Build a modular sandbox utility implementing ${node.title} principles. Integrate basic testing and publish with a clear README.md.`,
        difficulty: node.difficulty === "hard" ? "hard" : node.difficulty === "medium" ? "medium" : "easy",
      }
    ];
  }

  // 6. Curate / Append Resources
  const resources: RoadmapResource[] = [];

  // A. Official Documentation
  let docSrc = key && OFFICIAL_DOCS[key] ? OFFICIAL_DOCS[key] : (OFFICIAL_DOCS[domainSlug] ? OFFICIAL_DOCS[domainSlug] : null);
  if (docSrc) {
    resources.push({
      type: "doc",
      title: `Official ${node.title} Docs — ${docSrc.title}`,
      url: docSrc.url,
      difficulty: "beginner",
      free: true,
      rating: 4.9,
    });
  } else {
    // Dynamic Google Search fallback for official documentation of the topic
    resources.push({
      type: "doc",
      title: `Official ${node.title} Documentation Reference`,
      url: `https://www.google.com/search?q=${encodeURIComponent(node.title + " official documentation reference")}`,
      difficulty: "beginner",
      free: true,
      rating: 4.8,
    });
  }

  // B. Best YouTube Videos
  const ytVids = key && YOUTUBE_LIBRARY[key] ? YOUTUBE_LIBRARY[key] : null;
  if (ytVids && ytVids.length > 0) {
    ytVids.slice(0, 2).forEach((v) => {
      resources.push({
        type: "youtube",
        title: `${node.title}: ${v.title}`,
        url: v.url,
        channel: v.channel,
        videoId: v.videoId,
        duration: v.duration || "45m",
        rating: v.rating || 4.8,
        free: true,
      });
    });
  } else {
    // Generate highly relevant dynamic YouTube search results links
    resources.push({
      type: "youtube",
      title: `${node.title} — Complete Tutorial Video`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(node.title + " tutorial")}`,
      channel: "YouTube Search",
      duration: "30m+",
      rating: 4.8,
      free: true,
    });
    resources.push({
      type: "youtube",
      title: `${node.title} — Crash Course Video`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(node.title + " crash course")}`,
      channel: "YouTube Search",
      duration: "1h+",
      rating: 4.7,
      free: true,
    });
  }

  // C. Practice Platforms
  const practiceDom = getPracticeDomain(key);
  const pPlat = PRACTICE_PLATFORMS[practiceDom];
  if (pPlat) {
    resources.push({
      type: "practice",
      title: `${node.title} Hands-on Practice — ${pPlat.title}`,
      url: pPlat.url,
      difficulty: node.difficulty === "easy" ? "beginner" : "intermediate",
      free: true,
      rating: 4.7,
    });
  }

  // D. GitHub Repositories
  let githubUrl = `https://github.com/search?q=${encodeURIComponent(node.title)}`;
  let githubTitle = `GitHub Repositories for ${node.title}`;
  if (key && AWESOME_LISTS[key]) {
    githubUrl = AWESOME_LISTS[key];
    githubTitle = `Awesome ${key.toUpperCase()} Resources List`;
  } else if (AWESOME_LISTS[domainSlug]) {
    githubUrl = AWESOME_LISTS[domainSlug];
    githubTitle = `Awesome ${domainSlug.toUpperCase()} Resources List`;
  }
  resources.push({
    type: "github",
    title: githubTitle,
    url: githubUrl,
    free: true,
    rating: 4.8,
  });

  // E. Cheat Sheets
  const csKey = key || domainSlug || null;
  if (csKey && CHEATSHEETS[csKey as keyof typeof CHEATSHEETS]) {
    resources.push({
      type: "blog",
      title: `${node.title} Syntax Cheat Sheet — QuickRef`,
      url: `${CHEATSHEETS.quickref}/${csKey}`,
      difficulty: "beginner",
      free: true,
      rating: 4.6,
    });
  } else {
    // Dynamic Google Search fallback for cheat sheet of the topic
    resources.push({
      type: "blog",
      title: `${node.title} Syntax Cheat Sheet & Quick Reference`,
      url: `https://www.google.com/search?q=${encodeURIComponent(node.title + " cheat sheet quick reference")}`,
      difficulty: "beginner",
      free: true,
      rating: 4.5,
    });
  }

  enriched.resources = resources;

  // 7. Guarantee Interview Topics / Questions
  if (!enriched.interviewTopics || enriched.interviewTopics.length === 0) {
    const defaultQs = getFallbackInterviewQuestions(node.title, key);
    enriched.interviewTopics = defaultQs.map((q) => q.question);
  }

  // 8. Career Impact
  if (!enriched.careerImpact) {
    enriched.careerImpact = `Mastering ${node.title} is key for moving from amateur builder to industry-grade professional, directly influencing code maintenance and system scalability.`;
  }

  return enriched;
}

// Mindmap Node Structure Generator for AI mindmaps
export interface MindmapNode {
  id: string;
  label: string;
  type: "root" | "main" | "child" | "leaf";
  x: number;
  y: number;
  color?: string;
}

export interface MindmapEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export function generateMindmapData(nodeTitle: string, skills: string[], tools: string[], interview: string[]): { nodes: MindmapNode[]; edges: MindmapEdge[] } {
  const nodes: MindmapNode[] = [];
  const edges: MindmapEdge[] = [];

  // Root Node (Center)
  nodes.push({ id: "root", label: nodeTitle, type: "root", x: 0, y: 0, color: "oklch(0.78 0.18 295)" });

  // Main branches: 1. Core Concepts, 2. Tools & Libraries, 3. Interview Prep, 4. Capstone Project
  const branches = [
    { id: "concepts", label: "Core Concepts", x: -160, y: -100, color: "oklch(0.80 0.16 140)" },
    { id: "tools", label: "Tools & Libraries", x: 160, y: -100, color: "oklch(0.74 0.16 230)" },
    { id: "interview", label: "Interview Readiness", x: -160, y: 100, color: "oklch(0.76 0.17 340)" },
    { id: "delivery", label: "Project Delivery", x: 160, y: 100, color: "oklch(0.84 0.13 85)" },
  ];

  branches.forEach((b) => {
    nodes.push({ id: b.id, label: b.label, type: "main", x: b.x, y: b.y, color: b.color });
    edges.push({ id: `e-root-${b.id}`, source: "root", target: b.id, animated: true });
  });

  // Concepts child nodes
  const conceptLeaves = skills.slice(0, 3);
  conceptLeaves.forEach((c, idx) => {
    const leafId = `c-leaf-${idx}`;
    nodes.push({ id: leafId, label: c, type: "leaf", x: -280, y: -140 + idx * 40 });
    edges.push({ id: `e-concepts-${leafId}`, source: "concepts", target: leafId });
  });

  // Tools child nodes
  const toolLeaves = tools.slice(0, 3);
  toolLeaves.forEach((t, idx) => {
    const leafId = `t-leaf-${idx}`;
    nodes.push({ id: leafId, label: t, type: "leaf", x: 280, y: -140 + idx * 40 });
    edges.push({ id: `e-tools-${leafId}`, source: "tools", target: leafId });
  });

  // Interview child nodes
  const interviewLeaves = interview.slice(0, 2);
  interviewLeaves.forEach((iItem, idx) => {
    const leafId = `i-leaf-${idx}`;
    nodes.push({ id: leafId, label: iItem.length > 25 ? iItem.substring(0, 25) + "..." : iItem, type: "leaf", x: -280, y: 60 + idx * 50 });
    edges.push({ id: `e-interview-${leafId}`, source: "interview", target: leafId });
  });

  // Project child nodes
  const projLeaves = ["Build Sandbox", "Write Unit Tests", "Deploy Demo"];
  projLeaves.forEach((pItem, idx) => {
    const leafId = `p-leaf-${idx}`;
    nodes.push({ id: leafId, label: pItem, type: "leaf", x: 280, y: 60 + idx * 40 });
    edges.push({ id: `e-delivery-${leafId}`, source: "delivery", target: leafId });
  });

  return { nodes, edges };
}

export function getFallbackMindmapAndResources(nodeTitle: string, domainSlug: string, tier: string): {
  resources: RoadmapResource[];
  mindmap: { nodes: any[]; edges: any[] };
} {
  const dummyNode: RoadmapNode = {
    id: "temp",
    title: nodeTitle,
    why: "",
    prerequisites: [],
    outcome: "",
    hours: 10,
    difficulty: "easy",
    resources: [],
    projects: [],
  };
  const enrichedNode = enrichRoadmapNode(dummyNode, domainSlug);
  const resources = enrichedNode.resources;

  const key = matchKey(nodeTitle) || matchKey(domainSlug) || "general";
  const docUrl = resources[0]?.url || "https://developer.mozilla.org";

  let branches = [
    { label: "Core Principles", info: `Foundational pillars and basics of ${nodeTitle}`, source: docUrl },
    { label: "Ecosystem Tools", info: `Required developer tooling and libraries for ${nodeTitle}`, source: `https://github.com/search?q=${encodeURIComponent(nodeTitle)}` },
    { label: "Practical Projects", info: `Hands-on application and capstone projects`, source: `https://github.com/search?q=${encodeURIComponent(nodeTitle + " starter")}` },
    { label: "Interview Success", info: `Key test concepts, system design, and algorithms`, source: `https://leetcode.com` },
  ];

  if (key === "react") {
    branches = [
      { label: "JSX & Elements", info: "Declarative UI structure and compilation in React", source: "https://react.dev/learn/writing-markup-with-jsx" },
      { label: "State & Hooks", info: "Managing local reactivity using useState, useEffect, and custom hooks", source: "https://react.dev/reference/react" },
      { label: "Reconciliation", info: "Virtual DOM diffing algorithm that optimizes rendering updates", source: "https://react.dev/learn/render-and-commit" },
      { label: "Data Flow", info: "Unidirectional state propagation via props and Context API", source: "https://react.dev/learn/passing-data-deeply-with-context" },
    ];
  } else if (key === "nextjs") {
    branches = [
      { label: "App Router", info: "File-system routing with layouts, pages, and loading UI states", source: "https://nextjs.org/docs/app/building-your-application/routing" },
      { label: "Server Components", info: "React Server Components (RSC) rendered on the server for speed", source: "https://nextjs.org/docs/app/building-your-application/rendering/server-components" },
      { label: "Data Rendering", info: "Static generation, server rendering, and incremental regeneration (ISR)", source: "https://nextjs.org/docs/app/building-your-application/data-fetching" },
      { label: "Optimizations", info: "Built-in image loader, script optimizer, and font bundles", source: "https://nextjs.org/docs/app/building-your-application/optimizing" },
    ];
  } else if (key === "python") {
    branches = [
      { label: "Core Syntax", info: "Variables, control flows, loops, and list comprehensions", source: "https://docs.python.org/3/tutorial/controlflow.html" },
      { label: "Data Layouts", info: "Built-in structures: lists, dicts, sets, and tuples", source: "https://docs.python.org/3/tutorial/datastructures.html" },
      { label: "OOP Features", info: "Classes, inheritance, magic methods, and encapsulation", source: "https://docs.python.org/3/tutorial/classes.html" },
      { label: "Standard Library", info: "Built-in modules like os, sys, datetime, and json", source: "https://docs.python.org/3/library/index.html" },
    ];
  } else if (key === "pandas") {
    branches = [
      { label: "DataFrames & Series", info: "Core 1D and 2D labeled data structures in Pandas", source: "https://pandas.pydata.org/docs/user_guide/dsintro.html" },
      { label: "Data Cleaning", info: "Handling missing values, dropping duplicates, and filtering rows", source: "https://pandas.pydata.org/docs/user_guide/missing_data.html" },
      { label: "Grouping & Aggs", info: "Split-apply-combine techniques using groupby and aggregation functions", source: "https://pandas.pydata.org/docs/user_guide/groupby.html" },
      { label: "File I/O", info: "Reading and writing CSV, Excel, JSON, and Parquet data formats", source: "https://pandas.pydata.org/docs/user_guide/io.html" },
    ];
  } else if (key === "cloud") {
    branches = [
      { label: "Infrastructure Models", info: "IaaS, PaaS, SaaS delivery models and public/private clouds", source: "https://aws.amazon.com/what-is-cloud-computing/" },
      { label: "Virtual Compute", info: "Running scalable virtual machine instances and workloads", source: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html" },
      { label: "Object Storage", info: "Highly scalable and durable cloud object stores", source: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" },
      { label: "Cloud Networking", info: "Virtual networks, subnets, route tables, and edge CDNs", source: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html" },
    ];
  } else if (key === "docker") {
    branches = [
      { label: "Docker Images", info: "Read-only templates defined by Dockerfiles to configure runtimes", source: "https://docs.docker.com/engine/reference/builder/" },
      { label: "Containers", info: "Isolated runnable instances of images executing inside sandboxes", source: "https://docs.docker.com/engine/reference/run/" },
      { label: "Compose Stack", info: "Orchestrating multi-container systems using docker-compose.yml", source: "https://docs.docker.com/compose/" },
      { label: "Volume & Network", info: "Persistent folder mounting and isolated container bridges", source: "https://docs.docker.com/storage/volumes/" },
    ];
  } else if (key === "kubernetes") {
    branches = [
      { label: "Pod Management", info: "Tightly coupled container groups sharing local network IPs", source: "https://kubernetes.io/docs/concepts/workloads/pods/" },
      { label: "Controllers", info: "Deployments and ReplicaSets ensuring correct pod copies are alive", source: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" },
      { label: "Service Load", info: "Service load balancer routing to active pods", source: "https://kubernetes.io/docs/concepts/services-networking/service/" },
      { label: "Config & Secret", info: "Mounting environment files and sensitive auth keys safely", source: "https://kubernetes.io/docs/concepts/configuration/secret/" },
    ];
  } else if (key === "aws") {
    branches = [
      { label: "Identity (IAM)", info: "Managing least-privilege access keys, roles, and user policies", source: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html" },
      { label: "Compute Services", info: "Virtual servers (EC2) and serverless function executors (Lambda)", source: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html" },
      { label: "Networking (VPC)", info: "Isolated networks, subnets, route tables, and gateways", source: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html" },
      { label: "Storage (S3)", info: "Highly durable key-value object store for static payloads", source: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html" },
    ];
  } else if (key === "sql") {
    branches = [
      { label: "DDL Schemas", info: "Defining tables, columns, constraints, and foreign key relations", source: "https://www.postgresql.org/docs/current/ddl.html" },
      { label: "DML Queries", info: "Selecting, inserting, updating, and deleting records dynamically", source: "https://www.postgresql.org/docs/current/dml.html" },
      { label: "Table Joins", info: "Combining datasets via INNER, LEFT, RIGHT, and FULL queries", source: "https://www.postgresql.org/docs/current/queries-join.html" },
      { label: "Query Speed", info: "Adding B-Tree indexes, analyzing query plans, and optimizing slow scans", source: "https://www.postgresql.org/docs/current/indexes.html" },
    ];
  }

  const nodes: any[] = [];
  const edges: any[] = [];

  nodes.push({
    id: "root",
    label: nodeTitle,
    type: "root",
    info: `Central focus node covering ${nodeTitle} foundations and tracks.`,
    source: docUrl,
    x: 0,
    y: 0,
    color: "oklch(0.78 0.18 295)",
  });

  const coords = [
    { x: -160, y: -90, color: "oklch(0.80 0.16 140)" },
    { x: 160, y: -90, color: "oklch(0.74 0.16 230)" },
    { x: -160, y: 90, color: "oklch(0.76 0.17 340)" },
    { x: 160, y: 90, color: "oklch(0.84 0.13 85)" },
  ];

  branches.forEach((b, idx) => {
    const branchId = `branch-${idx}`;
    const coord = coords[idx];
    nodes.push({
      id: branchId,
      label: b.label,
      type: "main",
      info: b.info,
      source: b.source,
      x: coord.x,
      y: coord.y,
      color: coord.color,
    });
    edges.push({
      id: `edge-root-${branchId}`,
      source: "root",
      target: branchId,
      animated: true,
    });

    const leaves = [
      { label: `${b.label} Part A`, info: `Detailed implementation details for ${b.label} subtopics.` },
      { label: `${b.label} Part B`, info: `Advanced optimization and architectural patterns for ${b.label}.` },
    ];

    leaves.forEach((l, lIdx) => {
      const leafId = `leaf-${idx}-${lIdx}`;
      const leafX = coord.x > 0 ? coord.x + 110 : coord.x - 110;
      const leafY = coord.y + (lIdx === 0 ? -30 : 30);
      nodes.push({
        id: leafId,
        label: l.label,
        type: "leaf",
        info: l.info,
        source: b.source,
        x: leafX,
        y: leafY,
      });
      edges.push({
        id: `edge-${branchId}-${leafId}`,
        source: branchId,
        target: leafId,
      });
    });
  });

  return { resources, mindmap: { nodes, edges } };
}
