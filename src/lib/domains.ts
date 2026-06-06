// Domain catalog powering the Resources Hub and roadmap viewer.
// Each entry is a learnable track. Roadmaps for any slug below are either
// hand-seeded (see roadmap-catalog.ts) or generated on demand and cached.

export type Domain = {
  slug: string;
  name: string;
  category: string;
  blurb: string;
  tags: string[];
  icon: string;
  galaxyCluster: string;
  colorTheme: string;
};

const RAW_DOMAINS = [
  // AI / ML
  {
    slug: "machine-learning",
    name: "Machine Learning",
    category: "AI / ML",
    blurb: "Models that learn from data — regression, trees, clustering, evaluation.",
    tags: ["ml", "ai", "sklearn"],
  },
  {
    slug: "deep-learning",
    name: "Deep Learning",
    category: "AI / ML",
    blurb: "Neural networks, CNNs, RNNs, transformers and modern architectures.",
    tags: ["dl", "pytorch", "tensorflow"],
  },
  {
    slug: "generative-ai",
    name: "Generative AI",
    category: "AI / ML",
    blurb: "LLMs, diffusion models, RAG and building GenAI products.",
    tags: ["genai", "llm", "rag"],
  },
  {
    slug: "agentic-ai",
    name: "Agentic AI",
    category: "AI / ML",
    blurb: "Tool-using agents, planning, multi-step reasoning, agent frameworks.",
    tags: ["agents", "langchain"],
  },
  {
    slug: "prompt-engineering",
    name: "Prompt Engineering",
    category: "AI / ML",
    blurb: "Designing prompts, evaluation, structured outputs and guardrails.",
    tags: ["llm", "prompts"],
  },
  {
    slug: "ai-engineering",
    name: "AI Engineering",
    category: "AI / ML",
    blurb: "Shipping AI features: evals, retrieval, latency, cost, observability.",
    tags: ["ai", "production"],
  },
  {
    slug: "mlops",
    name: "MLOps",
    category: "AI / ML",
    blurb: "Model lifecycle: pipelines, registries, monitoring, drift, CI/CD.",
    tags: ["ops", "ml"],
  },
  {
    slug: "computer-vision",
    name: "Computer Vision",
    category: "AI / ML",
    blurb: "Image and video understanding with classical and deep methods.",
    tags: ["cv", "vision"],
  },
  {
    slug: "nlp",
    name: "NLP",
    category: "AI / ML",
    blurb: "Tokenization, embeddings, classifiers, sequence models, modern LLMs.",
    tags: ["nlp", "text"],
  },
  {
    slug: "llms",
    name: "LLMs",
    category: "AI / ML",
    blurb: "Architecture, fine-tuning, RAG, evals and deployment of large models.",
    tags: ["llm"],
  },

  // Data
  {
    slug: "data-science",
    name: "Data Science",
    category: "Data",
    blurb: "Statistics, EDA, modeling and storytelling with data.",
    tags: ["python", "stats"],
  },
  {
    slug: "data-analytics",
    name: "Data Analytics",
    category: "Data",
    blurb: "SQL, dashboards, business metrics and insight delivery.",
    tags: ["sql", "bi"],
  },
  {
    slug: "data-engineering",
    name: "Data Engineering",
    category: "Data",
    blurb: "Pipelines, warehouses, streaming and reliable analytics infra.",
    tags: ["etl", "spark"],
  },

  // Frontend
  {
    slug: "frontend",
    name: "Frontend",
    category: "Frontend",
    blurb: "HTML, CSS, JS, accessibility, performance and modern frameworks.",
    tags: ["web", "ui"],
  },
  {
    slug: "react",
    name: "React",
    category: "Frontend",
    blurb: "Components, hooks, state, data fetching and React ecosystem.",
    tags: ["react", "jsx"],
  },
  {
    slug: "nextjs",
    name: "Next.js",
    category: "Frontend",
    blurb: "App router, server components, data fetching and deployment.",
    tags: ["react", "ssr"],
  },
  {
    slug: "angular",
    name: "Angular",
    category: "Frontend",
    blurb: "Modules, components, RxJS, DI and enterprise patterns.",
    tags: ["ts", "rxjs"],
  },
  {
    slug: "vue",
    name: "Vue",
    category: "Frontend",
    blurb: "Reactive UI with Composition API, Pinia and Nuxt.",
    tags: ["vue", "nuxt"],
  },
  {
    slug: "javascript",
    name: "JavaScript",
    category: "Languages",
    blurb: "Modern JS: types, async, modules, tooling and the runtime.",
    tags: ["js"],
  },
  {
    slug: "typescript",
    name: "TypeScript",
    category: "Languages",
    blurb: "Static types for JS — generics, inference, advanced patterns.",
    tags: ["ts"],
  },

  // Backend
  {
    slug: "backend",
    name: "Backend",
    category: "Backend",
    blurb: "APIs, databases, auth, caching and production reliability.",
    tags: ["api", "db"],
  },
  {
    slug: "fullstack",
    name: "Full Stack",
    category: "Full Stack",
    blurb: "End-to-end product engineering across web, API and data.",
    tags: ["web"],
  },
  {
    slug: "nodejs",
    name: "Node.js",
    category: "Backend",
    blurb: "Server-side JavaScript, async I/O, frameworks and tooling.",
    tags: ["node", "js"],
  },
  {
    slug: "spring-boot",
    name: "Spring Boot",
    category: "Backend",
    blurb: "Java microservices, JPA, security and cloud-native patterns.",
    tags: ["java"],
  },
  {
    slug: "django",
    name: "Django",
    category: "Backend",
    blurb: "Batteries-included Python web framework with ORM and admin.",
    tags: ["python"],
  },
  {
    slug: "fastapi",
    name: "FastAPI",
    category: "Backend",
    blurb: "Modern Python APIs with type hints, async and Pydantic.",
    tags: ["python", "api"],
  },
  {
    slug: "laravel",
    name: "Laravel",
    category: "Backend",
    blurb: "Elegant PHP framework with Eloquent, queues and Livewire.",
    tags: ["php"],
  },

  // Languages
  {
    slug: "python",
    name: "Python",
    category: "Languages",
    blurb: "From basics to async, packaging, testing and idiomatic patterns.",
    tags: ["python"],
  },
  {
    slug: "java",
    name: "Java",
    category: "Languages",
    blurb: "Core language, JVM, concurrency and the modern Java ecosystem.",
    tags: ["java"],
  },
  {
    slug: "c",
    name: "C",
    category: "Languages",
    blurb: "Memory model, pointers, systems programming foundations.",
    tags: ["c"],
  },
  {
    slug: "cpp",
    name: "C++",
    category: "Languages",
    blurb: "Modern C++, RAII, templates, concurrency and STL.",
    tags: ["cpp"],
  },
  {
    slug: "csharp",
    name: "C#",
    category: "Languages",
    blurb: ".NET ecosystem, LINQ, async and ASP.NET.",
    tags: ["dotnet"],
  },
  {
    slug: "rust",
    name: "Rust",
    category: "Languages",
    blurb: "Ownership, lifetimes, traits and fearless concurrency.",
    tags: ["rust"],
  },
  {
    slug: "go",
    name: "Go",
    category: "Languages",
    blurb: "Simplicity, goroutines, channels and cloud-native services.",
    tags: ["go"],
  },
  {
    slug: "kotlin",
    name: "Kotlin",
    category: "Languages",
    blurb: "Modern JVM language, coroutines, Android and KMP.",
    tags: ["kotlin"],
  },
  {
    slug: "swift",
    name: "Swift",
    category: "Languages",
    blurb: "Apple platforms, SwiftUI, concurrency and protocols.",
    tags: ["swift"],
  },

  // Cloud & DevOps
  {
    slug: "devops",
    name: "DevOps",
    category: "Cloud & DevOps",
    blurb: "CI/CD, infra-as-code, observability and platform engineering.",
    tags: ["ops"],
  },
  {
    slug: "cloud-computing",
    name: "Cloud Computing",
    category: "Cloud & DevOps",
    blurb: "Compute, storage, networking and managed services in the cloud.",
    tags: ["cloud"],
  },
  {
    slug: "aws",
    name: "AWS",
    category: "Cloud & DevOps",
    blurb: "Core AWS services, IAM, networking and serverless patterns.",
    tags: ["aws"],
  },
  {
    slug: "azure",
    name: "Azure",
    category: "Cloud & DevOps",
    blurb: "Azure compute, identity, data and developer platform.",
    tags: ["azure"],
  },
  {
    slug: "gcp",
    name: "GCP",
    category: "Cloud & DevOps",
    blurb: "GCP compute, data, AI and serverless services.",
    tags: ["gcp"],
  },
  {
    slug: "docker",
    name: "Docker",
    category: "Cloud & DevOps",
    blurb: "Images, containers, networks, volumes and Compose.",
    tags: ["docker"],
  },
  {
    slug: "kubernetes",
    name: "Kubernetes",
    category: "Cloud & DevOps",
    blurb: "Pods, services, deployments, helm and platform patterns.",
    tags: ["k8s"],
  },
  {
    slug: "terraform",
    name: "Terraform",
    category: "Cloud & DevOps",
    blurb: "Declarative infra-as-code: modules, state and pipelines.",
    tags: ["iac"],
  },

  // Cybersecurity
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    category: "Cybersecurity",
    blurb: "Defensive and offensive fundamentals across the stack.",
    tags: ["security"],
  },
  {
    slug: "ethical-hacking",
    name: "Ethical Hacking",
    category: "Cybersecurity",
    blurb: "Recon, exploitation, post-exploitation and reporting.",
    tags: ["pentest"],
  },
  {
    slug: "soc-analyst",
    name: "SOC Analyst",
    category: "Cybersecurity",
    blurb: "Detection, triage, SIEM, IR and threat intel.",
    tags: ["blueteam"],
  },
  {
    slug: "pen-testing",
    name: "Penetration Testing",
    category: "Cybersecurity",
    blurb: "Web, network and cloud pentesting methodologies.",
    tags: ["redteam"],
  },
  {
    slug: "digital-forensics",
    name: "Digital Forensics",
    category: "Cybersecurity",
    blurb: "Evidence, disk and memory forensics, IR.",
    tags: ["dfir"],
  },
  {
    slug: "network-security",
    name: "Network Security",
    category: "Cybersecurity",
    blurb: "Protocols, firewalls, VPNs and segmentation.",
    tags: ["netsec"],
  },

  // Blockchain
  {
    slug: "blockchain",
    name: "Blockchain",
    category: "Blockchain",
    blurb: "Distributed ledgers, consensus and cryptography basics.",
    tags: ["web3"],
  },
  {
    slug: "web3",
    name: "Web3",
    category: "Blockchain",
    blurb: "Wallets, dApps, indexing and decentralized UX.",
    tags: ["web3"],
  },
  {
    slug: "solidity",
    name: "Solidity",
    category: "Blockchain",
    blurb: "Smart contracts, security patterns and tooling.",
    tags: ["eth"],
  },

  // Embedded / Systems
  {
    slug: "iot",
    name: "IoT",
    category: "Systems",
    blurb: "Sensors, MCUs, protocols and edge gateways.",
    tags: ["iot"],
  },
  {
    slug: "embedded",
    name: "Embedded Systems",
    category: "Systems",
    blurb: "Bare metal, RTOS, drivers and low-level debugging.",
    tags: ["embedded"],
  },
  {
    slug: "robotics",
    name: "Robotics",
    category: "Systems",
    blurb: "Kinematics, control, perception and software stacks.",
    tags: ["robotics"],
  },
  {
    slug: "ros",
    name: "ROS",
    category: "Systems",
    blurb: "Robot Operating System nodes, topics and packages.",
    tags: ["ros"],
  },
  {
    slug: "system-design",
    name: "System Design",
    category: "Systems",
    blurb: "Scalability, reliability and trade-offs at scale.",
    tags: ["scale"],
  },
  {
    slug: "software-architecture",
    name: "Software Architecture",
    category: "Systems",
    blurb: "Patterns, boundaries, evolution and decision records.",
    tags: ["arch"],
  },
  {
    slug: "microservices",
    name: "Microservices",
    category: "Systems",
    blurb: "Service boundaries, messaging, data and platform.",
    tags: ["ms"],
  },

  // Mobile
  {
    slug: "mobile",
    name: "Mobile Development",
    category: "Mobile",
    blurb: "Native and cross-platform mobile fundamentals.",
    tags: ["mobile"],
  },
  {
    slug: "android",
    name: "Android",
    category: "Mobile",
    blurb: "Kotlin, Jetpack Compose, architecture and Play release.",
    tags: ["android"],
  },
  {
    slug: "flutter",
    name: "Flutter",
    category: "Mobile",
    blurb: "Dart, widgets, state management and multi-platform.",
    tags: ["flutter"],
  },
  {
    slug: "react-native",
    name: "React Native",
    category: "Mobile",
    blurb: "RN + Expo, navigation, native modules and release.",
    tags: ["rn"],
  },
  {
    slug: "ios",
    name: "iOS",
    category: "Mobile",
    blurb: "Swift, SwiftUI, architecture and App Store release.",
    tags: ["ios"],
  },

  // Game
  {
    slug: "game-dev",
    name: "Game Development",
    category: "Game Dev",
    blurb: "Game loops, math, rendering and gameplay programming.",
    tags: ["games"],
  },
  {
    slug: "unity",
    name: "Unity",
    category: "Game Dev",
    blurb: "C#, GameObjects, physics, shaders and shipping.",
    tags: ["unity"],
  },
  {
    slug: "unreal",
    name: "Unreal Engine",
    category: "Game Dev",
    blurb: "Blueprints, C++, rendering and multiplayer.",
    tags: ["unreal"],
  },

  // Design
  {
    slug: "ui-ux",
    name: "UI / UX",
    category: "Design",
    blurb: "Research, IA, interaction, visual design and systems.",
    tags: ["design"],
  },
  {
    slug: "figma",
    name: "Figma",
    category: "Design",
    blurb: "Auto layout, components, variables and prototyping.",
    tags: ["figma"],
  },
  {
    slug: "product-design",
    name: "Product Design",
    category: "Design",
    blurb: "End-to-end product thinking and craft.",
    tags: ["product"],
  },

  // Career / CP
  {
    slug: "dsa",
    name: "DSA",
    category: "Career",
    blurb: "Data structures, algorithms and problem-solving patterns.",
    tags: ["dsa"],
  },
  {
    slug: "competitive-programming",
    name: "Competitive Programming",
    category: "Career",
    blurb: "Patterns, contests and high-performance problem solving.",
    tags: ["cp"],
  },
  {
    slug: "leetcode",
    name: "LeetCode Prep",
    category: "Career",
    blurb: "Top patterns, mock interviews and behavioral prep.",
    tags: ["interview"],
  },
];

const categoryMap: Record<string, string> = {
  "AI / ML": "AI & Data",
  Data: "Databases",
  Frontend: "Frontend",
  Backend: "Backend",
  "Full Stack": "Web Development",
  Languages: "Programming Languages",
  "Cloud & DevOps": "DevOps",
  Cybersecurity: "Cybersecurity",
  Blockchain: "Blockchain",
  Mobile: "Mobile Development",
  "Game Dev": "Game Development",
  Design: "UI/UX",
  Systems: "System Design",
  Career: "DSA",
};

const categoryIcons: Record<string, string> = {
  "AI & Data": "Brain",
  Databases: "Database",
  Frontend: "Layout",
  Backend: "Server",
  "Web Development": "Globe",
  "Programming Languages": "Code2",
  DevOps: "GitBranch",
  Cybersecurity: "Shield",
  Blockchain: "Cpu",
  "Mobile Development": "Smartphone",
  "Game Development": "Gamepad",
  "UI/UX": "Palette",
  "System Design": "Layers",
  DSA: "GraduationCap",
};

const categoryClusters: Record<string, string> = {
  "AI & Data": "Artificial Intelligence & Core ML",
  Databases: "Data Engineering & Storage",
  Frontend: "Client-Side Engineering",
  Backend: "Server-Side Engineering",
  "Web Development": "Full Stack Web Engineering",
  "Programming Languages": "Languages & Systems Foundations",
  DevOps: "Cloud Operations & Deployment",
  Cybersecurity: "Security & Pentesting",
  Blockchain: "Web3 & Distributed Ledgers",
  "Mobile Development": "Mobile Applications",
  "Game Development": "Interactive Media & Games",
  "UI/UX": "Design & User Experience",
  "System Design": "Architectures & Infrastructures",
  DSA: "Algorithms & Problem Solving",
};

const categoryColors: Record<string, string> = {
  "AI & Data": "violet",
  Databases: "emerald",
  Frontend: "cyan",
  Backend: "indigo",
  "Web Development": "blue",
  "Programming Languages": "sky",
  DevOps: "orange",
  Cybersecurity: "rose",
  Blockchain: "fuchsia",
  "Mobile Development": "teal",
  "Game Development": "rose",
  "UI/UX": "amber",
  "System Design": "indigo",
  DSA: "violet",
};

export const DOMAINS: Domain[] = RAW_DOMAINS.map((d) => {
  const category = categoryMap[d.category] || d.category;
  let icon = categoryIcons[category] || "Code2";
  const galaxyCluster = categoryClusters[category] || "Specialized Tracks";
  let colorTheme = categoryColors[category] || "blue";

  if (d.slug === "react") {
    icon = "Layout";
    colorTheme = "cyan";
  } else if (d.slug === "nextjs") {
    icon = "Globe";
    colorTheme = "indigo";
  } else if (d.slug === "python") {
    icon = "Code2";
    colorTheme = "blue";
  } else if (d.slug === "machine-learning") {
    icon = "Brain";
    colorTheme = "violet";
  } else if (d.slug === "generative-ai") {
    icon = "Sparkles";
    colorTheme = "violet";
  } else if (d.slug === "aws") {
    icon = "Cloud";
    colorTheme = "orange";
  } else if (d.slug === "devops") {
    icon = "GitBranch";
    colorTheme = "orange";
  } else if (d.slug === "cybersecurity") {
    icon = "Shield";
    colorTheme = "rose";
  } else if (d.slug === "dsa") {
    icon = "GraduationCap";
    colorTheme = "violet";
  } else if (d.slug === "system-design") {
    icon = "Layers";
    colorTheme = "indigo";
  } else if (d.slug === "flutter") {
    icon = "Smartphone";
    colorTheme = "cyan";
  } else if (d.slug === "ui-ux") {
    icon = "Palette";
    colorTheme = "amber";
  }

  return {
    ...d,
    category,
    icon,
    galaxyCluster,
    colorTheme,
  };
});

export const DOMAIN_BY_SLUG: Record<string, Domain> = Object.fromEntries(
  DOMAINS.map((d) => [d.slug, d]),
);

export const CATEGORIES = Array.from(new Set(DOMAINS.map((d) => d.category)));
