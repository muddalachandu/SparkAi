import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playClick, playSuccess, playHover } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";
import { toast } from "sonner";
import { z } from "zod";

/** Collapsible on mobile, always-open sidebar on md+ */
function MobileCollapsible({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`w-full ${className}`}>
      <button
        className="md:hidden w-full flex items-center justify-between py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-foreground mb-2"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flex items-center gap-2">
          <Icons.Filter className="h-3.5 w-3.5 text-spark" />
          {label}
        </span>
        <Icons.ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`${open ? "flex flex-col gap-2" : "hidden"} md:flex md:flex-col md:gap-3 md:h-full`}>
        <div className="hidden md:block text-[9px] uppercase tracking-widest font-bold text-muted-foreground">{label}</div>
        {children}
      </div>
    </div>
  );
}

const byoxSearchSchema = z.object({
  query: z.string().optional(),
});

export const Route = createFileRoute("/_app/build-your-own-x")({
  validateSearch: byoxSearchSchema,
  head: () => ({ meta: [{ title: "Build Your Own X — ProjectSpark" }] }),
  component: BuildYourOwnX,
});

type Step = {
  id: string;
  title: string;
  desc: string;
};

type ProjectChallenge = {
  id: string;
  title: string;
  category: "Databases" | "Git" | "Networks" | "Compilers";
  difficulty: "Easy" | "Medium" | "Hard";
  iconName: keyof typeof Icons;
  description: string;
  xpValue: number;
  steps: Step[];
  languages: string[];
  resources: { title: string; url: string }[];
  snippets: Record<string, string>;
};

type ParsedTutorial = {
  id: string;
  title: string;
  category: string;
  languages: string[];
  url: string;
};

const CATEGORY_ICONS: Record<string, keyof typeof Icons> = {
  "Databases": "Database",
  "Git": "GitBranch",
  "Networks": "Network",
  "Distributed Systems": "Cpu",
  "3D Renderer": "Image",
  "AI Model": "Brain",
  "Blockchain / Cryptocurrency": "Coins",
  "Bot": "MessageSquare",
  "Command-Line Tool": "Terminal",
  "Docker": "Box",
  "Emulator / Virtual Machine": "Monitor",
  "Front-end Framework / Library": "Layers",
  "Game": "Gamepad2",
  "Operating System": "HardDrive",
  "Programming Language": "Code",
  "Regex Engine": "Search",
  "Search Engine": "Search",
  "Shell": "ChevronRightSquare",
  "Text Editor": "FileText",
  "Web Server": "Globe"
};

const PROJECTS: ProjectChallenge[] = [
  {
    id: "redis",
    title: "Build Your Own Redis",
    category: "Databases",
    difficulty: "Medium",
    iconName: "Database",
    description: "Build an in-memory, key-value store implementing the Redis Serialization Protocol (RESP).",
    xpValue: 400,
    steps: [
      { id: "r1", title: "Respond to PING", desc: "Bind a TCP socket on port 6379, parse the RESP array format and reply with +PONG\\r\\n." },
      { id: "r2", title: "Handle Concurrency", desc: "Enable multiple clients to connect simultaneously by spawning a thread per connection or using async I/O." },
      { id: "r3", title: "SET & GET Commands", desc: "Store string values in a hash table in memory. Return bulk string RESP responses." },
      { id: "r4", title: "Key Expirations (TTL)", desc: "Implement active and passive key expiration. Clear expired keys on access or via a background loop." }
    ],
    languages: ["Go", "Rust", "Python", "Node.js"],
    resources: [
      { title: "Redis RESP Protocol Specification", url: "https://redis.io/docs/reference/protocol-spec/" },
      { title: "TCP Socket Programming Guide", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" }
    ],
    snippets: {
      Go: `package main\n\nimport (\n\t"fmt"\n\t"net"\n\t"os"\n)\n\nfunc main() {\n\tl, err := net.Listen("tcp", "0.0.0.0:6379")\n\tif err != nil {\n\t\tfmt.Println("Failed to bind to port 6379")\n\t\tos.Exit(1)\n\t}\n\tdefer l.Close()\n\n\tfor {\n\t\tconn, err := l.Accept()\n\t\tif err != nil {\n\t\t\tfmt.Println("Error accepting connection: ", err.Error())\n\t\t\tcontinue\n\t\t}\n\t\tgo handleConnection(conn)\n\t}\n}\n\nfunc handleConnection(conn net.Conn) {\n\tdefer conn.Close()\n\tconn.Write([]byte("+PONG\\r\\n"))\n}`,
      Rust: `use std::net::TcpListener;\nuse std::io::{Read, Write};\n\nfn main() {\n    let listener = TcpListener::bind("127.0.0.1:6379").unwrap();\n    println!("Server listening on port 6379");\n\n    for stream in listener.incoming() {\n        match stream {\n            Ok(mut stream) => {\n                let mut buffer = [0; 512];\n                stream.read(&mut buffer).unwrap();\n                stream.write_all(b"+PONG\\r\\n").unwrap();\n            }\n            Err(e) => { println!("Error: {}", e); }\n        }\n    }\n}`,
      Python: `import socket\n\ndef main():\n    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    server.bind(("127.0.0.1", 6379))\n    server.listen()\n    print("Redis listener activated on port 6379")\n    \n    while True:\n        conn, addr = server.accept()\n        data = conn.recv(1024)\n        conn.sendall(b"+PONG\\r\\n")\n        conn.close()\n\nif __name__ == "__main__":\n    main()`,
      "Node.js": `const net = require("net");\nconst server = net.createServer((socket) => {\n  socket.on("data", (data) => {\n    socket.write("+PONG\\r\\n");\n  });\n});\nserver.listen(6379, "127.0.0.1", () => {\n  console.log("RESP Engine listening on 6379");\n});`
    }
  },
  {
    id: "git",
    title: "Build Your Own Git",
    category: "Git",
    difficulty: "Hard",
    iconName: "GitBranch",
    description: "Write a version control tracker that initializes a repository, builds object hashes, compresses content, and reconstructs commit trees.",
    xpValue: 500,
    steps: [
      { id: "g1", title: "Initialize .git structure", desc: "Create the standard structure: objects, refs/heads, and a HEAD file targeting refs/heads/master." },
      { id: "g2", title: "Read and write blob objects", desc: "Compress file content using zlib, calculate the SHA-1 hash, and write objects to .git/objects/xx/yyyy." },
      { id: "g3", title: "Build Git Trees", desc: "Generate commit trees from directories containing file references and nested subdirectory pointers." },
      { id: "g4", title: "Write Commit Logs", desc: "Format commit objects detailing author, timestamp, parent trees, and commit messages." }
    ],
    languages: ["Rust", "Go", "Python", "Node.js"],
    resources: [
      { title: "Git Internals - Plumbling and Porcelain", url: "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects" },
      { title: "Zlib Compression Documentation", url: "https://www.zlib.net/" }
    ],
    snippets: {
      Rust: `use std::fs;\nuse std::path::Path;\n\nfn init_repository() {\n    let git_dir = Path::new(".git");\n    fs::create_dir_all(git_dir.join("objects")).unwrap();\n    fs::create_dir_all(git_dir.join("refs/heads")).unwrap();\n    fs::write(git_dir.join("HEAD"), "ref: refs/heads/master\\n").unwrap();\n    println!("Initialized empty Git repository");\n}`,
      Go: `package main\n\nimport (\n\t"fmt"\n\t"os"\n\t"path/filepath"\n)\n\nfunc initRepository() {\n\tos.MkdirAll(filepath.Join(".git", "objects"), 0755)\n\tos.MkdirAll(filepath.Join(".git", "refs", "heads"), 0755)\n\tos.WriteFile(filepath.Join(".git", "HEAD"), []byte("ref: refs/heads/master\\n"), 0644)\n\tfmt.Println("Initialized empty Git repository")\n}`,
      Python: `import os\n\ndef init_repository():\n    os.makedirs(".git/objects", exist_ok=True)\n    os.makedirs(".git/refs/heads", exist_ok=True)\n    with open(".git/HEAD", "w") as f:\n        f.write("ref: refs/heads/master\\n")\n    print("Initialized empty Git repository")`,
      "Node.js": `const fs = require("fs");\nconst path = require("path");\nfunction initRepository() {\n  fs.mkdirSync(path.join(".git", "objects"), { recursive: true });\n  fs.mkdirSync(path.join(".git", "refs", "heads"), { recursive: true });\n  fs.writeFileSync(path.join(".git", "HEAD"), "ref: refs/heads/master\\n");\n  console.log("Initialized empty Git repository");\n}`
    }
  },
  {
    id: "sqlite",
    title: "Build Your Own SQLite",
    category: "Databases",
    difficulty: "Hard",
    iconName: "Table",
    description: "Implement a SQL parser, virtual machine compiler, and file-serialized B-Tree layout to retrieve and persist database rows.",
    xpValue: 600,
    steps: [
      { id: "s1", title: "Build REPL Loop", desc: "Design a CLI prompt that accepts SQL statements (.exit, select, insert) and triggers command routers." },
      { id: "s2", title: "SQL Parser & Tokenizer", desc: "Tokenize input strings and compile statements into a binary virtual machine instructions tree." },
      { id: "s3", title: "B-Tree Row Indexing", desc: "Implement key-value lookups inside binary page blocks using nested B-Tree structures." },
      { id: "s4", title: "Page Storage Serialization", desc: "Write pages directly to disk blocks and read them back safely on query startup." }
    ],
    languages: ["Go", "Rust", "Python"],
    resources: [
      { title: "Database System Concepts - Silberschatz", url: "https://db-book.com/" },
      { title: "B-Tree Data Structure Overview", url: "https://en.wikipedia.org/wiki/B-tree" }
    ],
    snippets: {
      Go: `package main\n\nimport (\n\t"bufio"\n\t"fmt"\n\t"os"\n\t"strings"\n)\n\nfunc main() {\n\treader := bufio.NewReader(os.Stdin)\n\tfor {\n\t\tfmt.Print("spark-sql> ")\n\t\tinput, _ := reader.ReadString('\\n')\n\t\tinput = strings.TrimSpace(input)\n\t\tif input == ".exit" {\n\t\t\tbreak\n\t\t}\n\t\texecuteStatement(input)\n\t}\n}\nfunc executeStatement(input string) { fmt.Printf("Executing statement: %s\\n", input) }`,
      Rust: `use std::io::{self, Write};\n\nfn main() {\n    loop {\n        print!("spark-sql> ");\n        io::stdout().flush().unwrap();\n        let mut input = String::new();\n        io::stdin().read_line(&mut input).unwrap();\n        let trimmed = input.trim();\n        if trimmed == ".exit" { break; }\n        println!("Executing statement: {}", trimmed);\n    }\n}`,
      Python: `import sys\ndef main():\n    while True:\n        sys.stdout.write("spark-sql> ")\n        sys.stdout.flush()\n        line = sys.stdin.readline().strip()\n        if not line: continue\n        if line == ".exit": break\n        print(f"Executing: {line}")\nif __name__ == "__main__": main()`
    }
  },
  {
    id: "dns",
    title: "Build Your Own DNS Server",
    category: "Networks",
    difficulty: "Medium",
    iconName: "Network",
    description: "Write a UDP server that binds to port 53, parses query packet payloads, indexes domains, and delegates recursive lookup requests.",
    xpValue: 350,
    steps: [
      { id: "d1", title: "Bind UDP socket", desc: "Bind a socket to port 53 using UDP transport, and receive binary network buffer packets." },
      { id: "d2", title: "Parse DNS Headers", desc: "Interpret the 12-byte header details: Transaction ID, Flags, Question Count, Answer Count." },
      { id: "d3", title: "Parse DNS Question", desc: "Extract the queried domain name (encoded as labels length tags) and record query type (A, AAAA, MX)." },
      { id: "d4", title: "Cache Resolution", desc: "Formulate answer packets mapped from a local config dictionary and return a complete UDP response." }
    ],
    languages: ["Go", "Rust", "Node.js"],
    resources: [
      { title: "RFC 1035 - Domain Names - Implementation Spec", url: "https://datatracker.ietf.org/doc/html/rfc1035" },
      { title: "DNS Packet Anatomy", url: "https://www.netburner.com/learn/dns-packet-anatomy/" }
    ],
    snippets: {
      Go: `package main\n\nimport (\n\t"fmt"\n\t"net"\n)\n\nfunc main() {\n\tconn, err := net.ListenUDP("udp", &net.UDPAddr{Port: 53, IP: net.ParseIP("0.0.0.0")})\n\tif err != nil { fmt.Printf("UDP Bind failed: %v\\n", err); return }\n\tdefer conn.Close()\n\tbuf := make([]byte, 512)\n\tfor {\n\t\tn, addr, _ := conn.ReadFromUDP(buf)\n\t\tfmt.Printf("Received %d bytes from %v\\n", n, addr)\n\t\tconn.WriteToUDP([]byte{0x00, 0x00, 0x81, 0x80}, addr)\n\t}\n}`,
      Rust: `use std::net::UdpSocket;\nfn main() {\n    let socket = UdpSocket::bind("0.0.0.0:53").expect("Failed to bind UDP port 53");\n    let mut buf = [0; 512];\n    loop {\n        let (amt, src) = socket.recv_from(&mut buf).unwrap();\n        println!("Received {} bytes from {}", amt, src);\n        socket.send_to(&[0; 12], &src).unwrap();\n    }\n}`,
      "Node.js": `const dgram = require("dgram");\nconst server = dgram.createSocket("udp4");\nserver.on("message", (msg, rinfo) => {\n  server.send(Buffer.alloc(12), rinfo.port, rinfo.address);\n});\nserver.bind(53);`
    }
  }
];

export function BuildYourOwnX() {
  const { query } = Route.useSearch();
  const [selectedProj, setSelectedProj] = useState<ProjectChallenge | null>(PROJECTS[0]);
  const [selectedLang, setSelectedLang] = useState<string>(PROJECTS[0].languages[0]);

  // Dynamic Catalog States
  const [liveTutorials, setLiveTutorials] = useState<ParsedTutorial[]>([]);
  const [categories, setCategories] = useState<string[]>(["All", "Databases", "Git", "Networks"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchVal, setSearchVal] = useState(query || "");
  const [loading, setLoading] = useState(false);

  // Selected dynamic tutorial
  const [selectedTutorial, setSelectedTutorial] = useState<ParsedTutorial | null>(null);

  // Checked steps and completed dynamic tutorials saved locally
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [completedTutorials, setCompletedTutorials] = useState<Record<string, boolean>>({});

  // Fetch and parse the raw codecrafters README.md
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://raw.githubusercontent.com/codecrafters-io/build-your-own-x/master/README.md");
        if (!res.ok) throw new Error("Catalog fetch failed");

        const markdown = await res.text();
        const lines = markdown.split(/\r?\n/);

        const tutorialsList: ParsedTutorial[] = [];
        const cats = new Set<string>(["All", "Databases", "Git", "Networks"]);

        let currentCat = "";

        lines.forEach(line => {
          const l = line.trim();
          if (!l) return;

          // Match category header
          const catHeaderMatch = l.match(/^####\s*Build\s+your\s+own\s+[`']?([^`'\n]+)[`']?/i);
          if (catHeaderMatch) {
            let catName = catHeaderMatch[1].trim();
            // Normalize categories to match custom ones
            if (catName.toLowerCase() === "database") catName = "Databases";
            if (catName.toLowerCase() === "network stack" || catName.toLowerCase() === "web server") catName = "Networks";
            if (catName.toLowerCase() === "git") catName = "Git";

            currentCat = catName;
            cats.add(catName);
            return;
          }

          // Match list item bullet
          if (l.startsWith("* ") && currentCat) {
            let lang = "Unknown";
            let title = "";
            let url = "";

            // Extract language inside **Language**
            const langMatch = l.match(/\*\*([^*]+)\*\*/);
            if (langMatch) {
              lang = langMatch[1].trim();
            }

            // Extract title inside _Title_
            const titleMatch = l.match(/_(.*?)_/);
            if (titleMatch) {
              title = titleMatch[1].trim();
            } else {
              const linkMatch = l.match(/\[([^\]]+)\]/);
              if (linkMatch) {
                title = linkMatch[1].replace(/\*\*.*?\*\*/g, "").replace(/^[:\s-]+/, "").replace(/^[_\s-]+/, "").trim();
              }
            }

            // Extract URL
            const urlMatch = l.match(/\((https?:\/\/[^\s)]+)\)/);
            if (urlMatch) {
              url = urlMatch[1].trim();
            }

            if (title && url) {
              tutorialsList.push({
                id: `live-${tutorialsList.length}`,
                title: `${title} (${lang})`,
                category: currentCat,
                languages: lang.split(/\s*[\/,]\s*/).map(s => s.trim()),
                url: url
              });
            }
          }
        });

        setLiveTutorials(tutorialsList);
        const uniqueCats = Array.from(cats).filter(c => c.toLowerCase() !== "all");
        setCategories(["All", ...uniqueCats.sort()]);
      } catch (err) {
        console.warn("Failed to load dynamic tutorials catalog, using offline defaults:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // Load local storage states
  useEffect(() => {
    try {
      const storedSteps = localStorage.getItem("spark-byox-checked-steps");
      if (storedSteps) setCheckedSteps(JSON.parse(storedSteps));

      const storedTuts = localStorage.getItem("spark-completed-byox-tutorials");
      if (storedTuts) setCompletedTutorials(JSON.parse(storedTuts));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Deep link search match
  useEffect(() => {
    if (query) {
      setSearchVal(query);
      setSelectedCategory("All");

      // Auto select matching custom project
      const customMatch = PROJECTS.find(p => p.id.toLowerCase().includes(query.toLowerCase()) || p.title.toLowerCase().includes(query.toLowerCase()));
      if (customMatch) {
        setSelectedProj(customMatch);
        setSelectedLang(customMatch.languages[0]);
        setSelectedTutorial(null);
      }
    }
  }, [query]);

  const toggleStep = (stepId: string, xpValue: number) => {
    const isChecked = !checkedSteps[stepId];
    const next = { ...checkedSteps, [stepId]: isChecked };
    setCheckedSteps(next);
    localStorage.setItem("spark-byox-checked-steps", JSON.stringify(next));

    if (isChecked) {
      playSuccess();
      awardXP(xpValue, `Step completed in ${selectedProj?.title}`);
      toast.success(`Completed step! +${xpValue} XP`);
    } else {
      playClick();
    }
  };

  const claimTutorialXP = (tut: ParsedTutorial) => {
    if (completedTutorials[tut.id]) {
      toast.info("Opened guide (XP already claimed).");
      return;
    }
    const next = { ...completedTutorials, [tut.id]: true };
    setCompletedTutorials(next);
    localStorage.setItem("spark-completed-byox-tutorials", JSON.stringify(next));

    playSuccess();
    awardXP(100, `Completed BYOX tutorial: ${tut.title}`);
    toast.success(`Completed! +100 XP awarded.`);
  };

  const getProjProgress = (proj: ProjectChallenge) => {
    const total = proj.steps.length;
    const completed = proj.steps.filter(s => checkedSteps[s.id]).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getFilteredCustomProjects = () => {
    return PROJECTS.filter(p => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchSearch = p.title.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.category.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.languages.some(l => l.toLowerCase().includes(searchVal.toLowerCase()));
      return matchCat && matchSearch;
    });
  };

  const getFilteredLiveTutorials = () => {
    return liveTutorials.filter(t => {
      const matchCat = selectedCategory === "All" || t.category === selectedCategory;
      const matchSearch = t.title.toLowerCase().includes(searchVal.toLowerCase()) ||
        t.category.toLowerCase().includes(searchVal.toLowerCase()) ||
        t.languages.some(l => l.toLowerCase().includes(searchVal.toLowerCase()));
      return matchCat && matchSearch;
    });
  };

  const currentSnippet = selectedProj ? (selectedProj.snippets[selectedLang] || "// No snippet available for this language.") : "";

  return (
    <PageShell>
      <PageHeader
        icon={Icons.Cpu}
        title="Build Your Own X Challenges"
        description="Step-by-step interactive coding challenges alongside a dynamically compiled directory of build-your-own-x tutorials from GitHub."
      />

      <div className="space-y-4 animate-in fade-in duration-300">

        {/* Search header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Icons.Library className="h-3.5 w-3.5 text-spark" />
            <span>Parsed Catalog ({getFilteredCustomProjects().length + getFilteredLiveTutorials().length} guides)</span>
            {loading && <Icons.Loader2 className="h-3.5 w-3.5 animate-spin text-spark" />}
          </div>

          <div className="relative w-full md:w-80">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tutorials by language or title..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-background/50 pl-9 pr-4 py-1.5 text-xs text-foreground outline-none focus:border-spark focus:ring-1 focus:ring-spark/30 transition-all"
            />
            {searchVal && (
              <button onClick={() => setSearchVal("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Icons.X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr] items-start">

          {/* Categories Sidebar — collapsible on mobile, sticky panel on md+ */}
          <MobileCollapsible label="Topics" className="md:sticky md:top-6 md:h-[calc(100vh-48px)] md:flex-col glass rounded-3xl bg-card/45 border-white/10 p-4">
            <div
              className="flex flex-col gap-2.5 md:flex-1 md:min-h-0 md:overflow-y-auto pr-1 font-semibold text-xs [&::-webkit-scrollbar]:hidden max-h-64 overflow-y-auto md:max-h-none"
              style={{ scrollbarWidth: "none" }}
              data-lenis-prevent
            >
              {categories.map(cat => {
                const IconComp = (Icons[CATEGORY_ICONS[cat] || "Cpu"] || Icons.Cpu) as any;
                return (
                  <button
                    key={cat}
                    onClick={() => { playClick(); setSelectedCategory(cat); }}
                    className={`w-full py-2.5 px-3.5 rounded-xl border text-left transition flex items-center gap-2.5 shrink-0 ${selectedCategory === cat ? "border-spark bg-spark/10 text-spark font-bold" : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground hover:bg-white/3"}`}
                    title={cat}
                  >
                    <IconComp className="h-4 w-4 shrink-0" />
                    <span className="text-left break-words leading-tight flex-1">{cat}</span>
                  </button>
                );
              })}
            </div>
          </MobileCollapsible>

          {/* Details & List view */}
          <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">

            {/* List panel — natural scroll on mobile */}
            <div className="flex flex-col md:sticky md:top-6 md:h-[calc(100vh-48px)] w-full">
              <div className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground shrink-0 mb-4">Tutorial Guides</div>
              <div
                className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 pb-10 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                data-lenis-prevent
              >

                {/* 1. Custom Interactive Projects */}
                {getFilteredCustomProjects().map(proj => {
                  const active = selectedProj?.id === proj.id && !selectedTutorial;
                  const progress = getProjProgress(proj);
                  const ChallengeIcon = (Icons[proj.iconName] || Icons.Cpu) as any;

                  return (
                    <div
                      key={proj.id}
                      onClick={() => { playClick(); setSelectedProj(proj); setSelectedTutorial(null); }}
                      className={`p-3.5 rounded-2xl border cursor-pointer hover:border-spark/30 transition-all shrink-0 ${active ? "border-spark bg-spark/5" : "border-white/5 bg-white/2"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${active ? "bg-spark/20 text-spark" : "bg-white/5 text-muted-foreground"}`}>
                          <ChallengeIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-foreground truncate">{proj.title}</h4>
                          <span className="text-[8px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.2 rounded mt-1 inline-block uppercase">Interactive</span>
                        </div>
                      </div>

                      <div className="mt-3.5 space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                          <span>Checklist</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-spark shadow-glow transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 2. Parsed dynamic tutorials */}
                {getFilteredLiveTutorials().map(tut => {
                  const active = selectedTutorial?.id === tut.id;
                  const isDone = !!completedTutorials[tut.id];

                  return (
                    <div
                      key={tut.id}
                      onClick={() => { playClick(); setSelectedTutorial(tut); setSelectedProj(null); }}
                      className={`p-3 rounded-2xl border cursor-pointer hover:border-white/10 transition-all flex items-center justify-between gap-3 shrink-0 ${active ? "border-white/25 bg-white/5" : "border-white/5 bg-white/1"} ${isDone ? "border-emerald-500/20 bg-emerald-500/5" : ""}`}
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs font-semibold truncate ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>{tut.title}</h4>
                        <span className="text-[9px] text-muted-foreground block mt-0.5">{tut.category}</span>
                      </div>
                      <div className="shrink-0">
                        {isDone ? (
                          <Icons.CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-500/10" />
                        ) : (
                          <Icons.ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                        )}
                      </div>
                    </div>
                  );
                })}

                {getFilteredCustomProjects().length === 0 && getFilteredLiveTutorials().length === 0 && (
                  <div className="text-center text-xs text-muted-foreground py-20">No matching guides found.</div>
                )}

              </div>
            </div>

            {/* Preview detail panel */}
            <div className="sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto w-full">

              {/* Dynamic tutorial selected */}
              {selectedTutorial && (
                <HolographicPanel className="p-6 flex flex-col justify-between" innerClassName="flex flex-col h-full">
                  <div className="space-y-5 pr-1">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-white/10 text-muted-foreground uppercase tracking-wider">
                        {selectedCategory === "All" ? selectedTutorial.category : selectedCategory}
                      </span>
                      <h2 className="text-lg font-bold text-foreground mt-2 leading-snug">{selectedTutorial.title}</h2>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                        This is a step-by-step programming tutorial parsed from the official codecrafters Build Your Own X library. Follow this external repository guide to construct this software component from scratch.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1.5 rounded-lg text-purple-400 font-mono font-bold text-xs">
                      <Icons.Award className="h-4 w-4" />
                      <span>+100 XP Completion Reward</span>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-background/40 p-4 space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Languages Utilized</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTutorial.languages.map(l => (
                          <span key={l} className="px-2.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-semibold text-foreground">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 shrink-0 flex gap-2">
                    <a
                      href={selectedTutorial.url}
                      onClick={() => claimTutorialXP(selectedTutorial)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-spark text-primary-foreground font-semibold shadow-glow text-center text-xs flex items-center justify-center gap-1.5 hover:scale-[1.01] transition"
                    >
                      <Icons.ExternalLink className="h-4 w-4" />
                      <span>Launch Guide & Claim XP</span>
                    </a>
                  </div>
                </HolographicPanel>
              )}

              {/* Custom challenge selected */}
              {selectedProj && !selectedTutorial && (
                <HolographicPanel className="p-6 flex flex-col justify-between" innerClassName="flex flex-col h-full">
                  <div className="space-y-5 pr-1">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/5">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-spark/10 border border-spark/20 text-spark uppercase tracking-wider">
                          {selectedProj.category}
                        </span>
                        <h2 className="text-lg font-bold text-foreground mt-1">{selectedProj.title}</h2>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{selectedProj.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 px-2 py-0.8 rounded text-purple-400 font-mono font-bold text-[10px]">
                          <Icons.Award className="h-3.5 w-3.5" />
                          <span>+{selectedProj.xpValue} XP</span>
                        </div>
                      </div>
                    </div>

                    {/* Language template snippets */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          <Icons.Code className="h-3.5 w-3.5 text-spark" /> Getting Started Code
                        </label>
                        <div className="flex gap-1.5">
                          {selectedProj.languages.map(lang => (
                            <button
                              key={lang}
                              onClick={() => { playClick(); setSelectedLang(lang); }}
                              className={`px-2.5 py-1 rounded-lg border text-[9px] uppercase tracking-wider font-semibold transition ${selectedLang === lang ? "border-spark bg-spark/10 text-spark" : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground"}`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative rounded-2xl border border-white/5 bg-background/50 overflow-hidden">
                        <button
                          onClick={() => {
                            playSuccess();
                            navigator.clipboard.writeText(currentSnippet);
                            toast.success("Copied template to clipboard!");
                          }}
                          className="absolute right-3 top-3 z-10 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-muted-foreground hover:text-foreground transition"
                          title="Copy Code"
                        >
                          <Icons.Copy className="h-3.5 w-3.5" />
                        </button>
                        <pre className="p-3.5 font-mono text-[10px] leading-relaxed text-spark overflow-x-auto max-h-[150px] select-text">
                          <code>{currentSnippet}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Steps checklist */}
                    <div className="space-y-2.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <Icons.CheckSquare className="h-3.5 w-3.5 text-spark" /> Implementation Checklist
                      </label>
                      <div className="space-y-2">
                        {selectedProj.steps.map((step, idx) => {
                          const isDone = !!checkedSteps[step.id];
                          const stepXp = Math.round(selectedProj.xpValue / selectedProj.steps.length);
                          return (
                            <div
                              key={step.id}
                              onClick={() => toggleStep(step.id, stepXp)}
                              className={`flex gap-3 p-2.5 rounded-xl border cursor-pointer transition ${isDone ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/1 border-white/5 hover:border-white/10"}`}
                            >
                              <div className="shrink-0 pt-0.5">
                                {isDone ? (
                                  <Icons.CheckCircle className="h-4 w-4 text-emerald-400 fill-emerald-500/10" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-white/20 hover:border-spark" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-foreground">Step {idx + 1}: {step.title}</span>
                                  <span className="text-[8px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/10 px-1 rounded">+{stepXp} XP</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </HolographicPanel>
              )}

            </div>

          </div>

        </div>

      </div>
    </PageShell>
  );
}
