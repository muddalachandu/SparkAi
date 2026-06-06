import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playClick, playSuccess, playHover } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const booksSearchSchema = z.object({
  restoreId: z.string().optional(),
});

export const Route = createFileRoute("/_app/books")({
  validateSearch: booksSearchSchema,
  head: () => ({ meta: [{ title: "Books & Docs Hub — ProjectSpark" }] }),
  component: BooksDocsHub,
});

type BookItem = {
  id: string;
  title: string;
  author: string;
  category: string;
  format: string;
  url: string;
  description?: string;
  color?: string;
};

type CLICommand = {
  id: string;
  title: string;
  desc: string;
  command: string;
  category: "CLI Tools" | "Docker" | "Network Security" | "One-Liners";
};

// Fallback books in case offline/fetch fails
const FALLBACK_BOOKS: BookItem[] = [
  {
    id: "f1",
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    category: "JavaScript",
    format: "HTML",
    url: "https://eloquentjavascript.net/",
    description: "A modern introduction to programming, JavaScript, and the wonders of the digital world."
  },
  {
    id: "f2",
    title: "The Rust Programming Language",
    author: "Steve Klabnik & Carol Nichols",
    category: "Rust",
    format: "HTML",
    url: "https://doc.rust-lang.org/book/",
    description: "The official guide to programming in Rust, teaching safe, concurrent, and highly optimized code systems."
  },
  {
    id: "f3",
    title: "Go 101",
    author: "Tapir Liu",
    category: "Go",
    format: "HTML",
    url: "https://go101.org/",
    description: "A book focusing on Go syntax, semantics, and runtime Go architecture. Perfect for deep Go understanding."
  },
  {
    id: "f4",
    title: "Automate the Boring Stuff with Python",
    author: "Al Sweigart",
    category: "Python",
    format: "HTML",
    url: "https://automatetheboringstuff.com/",
    description: "Learn practical Python programming for complete beginners. Automate boring tasks in minutes."
  },
  {
    id: "f5",
    title: "Algorithms, 4th Edition",
    author: "Robert Sedgewick & Kevin Wayne",
    category: "Algorithms",
    format: "PDF",
    url: "https://algs4.cs.princeton.edu/home/",
    description: "The leading textbook on algorithms and data structures, cataloging sorting, graphs, and string processes."
  },
  {
    id: "f6",
    title: "Open Data Structures",
    author: "Pat Morin",
    category: "Algorithms",
    format: "PDF",
    url: "https://opendatastructures.org/",
    description: "An open source textbook covering standard sequences, queues, hashes, BSTs, and external memory sorting."
  },
  {
    id: "f7",
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio & Aaron Courville",
    category: "AI/ML",
    format: "HTML",
    url: "https://www.deeplearningbook.org/",
    description: "The definitive textbook on Deep Learning algorithms, covering CNNs, RNNs, optimizer engines, and generative modeling."
  },
  {
    id: "f8",
    title: "The Book of Secret Knowledge",
    author: "Trimstray",
    category: "Security",
    format: "GitHub",
    url: "https://github.com/trimstray/the-book-of-secret-knowledge",
    description: "An extensive curated list of libraries, security tools, cheatsheets, and CLI shell one-liners."
  },
  {
    id: "f9",
    title: "Computer Security: Art and Science",
    author: "Matt Bishop",
    category: "Security",
    format: "PDF",
    url: "https://nob.cs.ucdavis.edu/book/",
    description: "Learn foundational access control structures, cryptography protocols, security audits, and intrusion models."
  }
];

const COMMANDS: CLICommand[] = [
  {
    id: "c1",
    title: "Regex search file content (ripgrep)",
    desc: "Search directory files recursively for a string pattern with high performance.",
    command: "rg 'target_pattern' src/",
    category: "CLI Tools"
  },
  {
    id: "c2",
    title: "Parse & filter JSON responses (jq)",
    desc: "Query properties, format arrays, and filter fields from raw JSON logs.",
    command: "cat logs.json | jq '.logs[0].message'",
    category: "CLI Tools"
  },
  {
    id: "c3",
    title: "Interactive Fuzzy File Finder (fzf)",
    desc: "Quick search and match directory files fuzzily in the terminal.",
    command: "find . -type f | fzf",
    category: "CLI Tools"
  },
  {
    id: "c4",
    title: "Find ports usage (lsof)",
    desc: "List file descriptors and processes occupying a specific network port.",
    command: "lsof -i :8080",
    category: "CLI Tools"
  },
  {
    id: "c4_2",
    title: "Interactive process viewer (htop)",
    desc: "Monitor system resource usage, processes, threads, and CPU load in real time.",
    command: "htop",
    category: "CLI Tools"
  },
  {
    id: "c4_3",
    title: "Simplified CLI manuals (tldr)",
    desc: "Retrieve clean, simplified, community-driven markdown manuals and command examples.",
    command: "tldr tar",
    category: "CLI Tools"
  },
  {
    id: "c4_4",
    title: "Disk space analyzer (ncdu)",
    desc: "Explore disk usage per directory with an interactive ncurses terminal client.",
    command: "ncdu /var/log",
    category: "CLI Tools"
  },
  {
    id: "c5",
    title: "Prune Docker system structures",
    desc: "Purge all unused containers, volumes, dangling image caches, and networks.",
    command: "docker system prune -a --volumes",
    category: "Docker"
  },
  {
    id: "c6",
    title: "Live Container Stats Dashboard",
    desc: "Display continuous CPU, memory, and networking stats per container.",
    command: "docker stats --format \"table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\"",
    category: "Docker"
  },
  {
    id: "c7",
    title: "Debug network container hook",
    desc: "Spin up a temporary alpine container directly on the host network for utilities.",
    command: "docker run -it --rm --network host alpine sh",
    category: "Docker"
  },
  {
    id: "c7_2",
    title: "Inspect Container IP Address",
    desc: "Extract the private bridge network IP address of a running Docker container.",
    command: "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name",
    category: "Docker"
  },
  {
    id: "c7_3",
    title: "Clean Docker volume leakages",
    desc: "Wipe out all unlinked orphaned volumes to reclaim disk capacity.",
    command: "docker volume prune -f",
    category: "Docker"
  },
  {
    id: "c8",
    title: "Stealth SYN Port Scanning (nmap)",
    desc: "Run a stealthy TCP port scan on target nodes without full handshakes.",
    command: "nmap -sS -p 1-65535 target_ip",
    category: "Network Security"
  },
  {
    id: "c9",
    title: "Configure Firewall rules (ufw)",
    desc: "Explicitly authorize incoming traffic to TCP port 22 in Ubuntu systems.",
    command: "sudo ufw allow proto tcp from any to any port 22",
    category: "Network Security"
  },
  {
    id: "c10",
    title: "Capture port 80 traffic (tcpdump)",
    desc: "Intercept and print the first 100 packets related to HTTP requests on interface eth0.",
    command: "sudo tcpdump -i eth0 -n -s 0 -c 100 'tcp port 80'",
    category: "Network Security"
  },
  {
    id: "c10_2",
    title: "Query DNS Server Records (dig)",
    desc: "Retrieve address resolution records, nameservers, and SOA tags for domains.",
    command: "dig +nocmd example.com mx +noall +answer",
    category: "Network Security"
  },
  {
    id: "c10_3",
    title: "Test open socket port (nc)",
    desc: "Check if a target host is listening on a specific TCP port with netcat.",
    command: "nc -zv target_ip 443",
    category: "Network Security"
  },
  {
    id: "c11",
    title: "Find top 10 largest files",
    desc: "Perform a folder lookup compiling and sorting files by disk volume size.",
    command: "find . -type f -exec du -h {} + | sort -hr | head -n 10",
    category: "One-Liners"
  },
  {
    id: "c12",
    title: "Prune journal logs time limit",
    desc: "Clear journald log segments keeping only logs written in the last 3 days.",
    command: "sudo journalctl --vacuum-time=3d",
    category: "One-Liners"
  },
  {
    id: "c12_2",
    title: "Find and replace text recursively",
    desc: "Substitute a query string in all files under a directory using sed.",
    command: "find . -type f -name '*.txt' -exec sed -i 's/old_text/new_text/g' {} +",
    category: "One-Liners"
  },
  {
    id: "c12_3",
    title: "Generate secure random password",
    desc: "Construct a 16-character alphanumeric password with special characters from dev/urandom.",
    command: "tr -dc 'A-Za-z0-9!@#$%' < /dev/urandom | head -c 16; echo",
    category: "One-Liners"
  }
];

export function BooksDocsHub() {
  const { restoreId } = Route.useSearch();
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<"books" | "secret-knowledge">("books");

  useEffect(() => {
    if (restoreId && user) {
      const loadSaved = async () => {
        const { data, error } = await supabase
          .from("build_blueprints")
          .select("*")
          .eq("id", restoreId)
          .single();
        if (error) {
          toast.error("Failed to load saved book");
          return;
        }
        if (data && data.blueprint) {
          const bp = data.blueprint as any;
          if (bp.category === "book") {
            setBookSearch(bp.title || "");
            setSelectedBookCat("All");
            toast.success(`Found saved book: "${bp.title}"!`);
          }
        }
      };
      loadSaved();
    }
  }, [restoreId, user]);

  const handleSaveBook = async (book: BookItem) => {
    if (!user) {
      toast.error("Please login to save books");
      return;
    }
    const { error } = await supabase.from("build_blueprints").insert({
      user_id: user.id,
      title: book.title,
      description: book.author,
      technologies: [book.category],
      blueprint: {
        category: "book",
        id: book.id,
        title: book.title,
        author: book.author,
        url: book.url,
        categoryName: book.category,
        format: book.format,
        description: book.description || `Read this free reference book to master topics related to ${book.category}.`
      } as any
    });
    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success(`Saved "${book.title}" to Saved items!`);
      awardXP(10, `Saved book: ${book.title}`);
    }
  };

  // Free Books list and categories (loaded dynamically or falling back)
  const [booksList, setBooksList] = useState<BookItem[]>(FALLBACK_BOOKS);
  const [categories, setCategories] = useState<string[]>(["All", "JavaScript", "Rust", "Go", "Python", "Algorithms", "Security"]);
  const [loading, setLoading] = useState(false);

  // Search states
  const [bookSearch, setBookSearch] = useState("");
  const [selectedBookCat, setSelectedBookCat] = useState<string>("All");

  const [cliSearch, setCliSearch] = useState("");
  const [selectedCliCat, setSelectedCliCat] = useState<string>("All");

  // Fetch the live EbookFoundation database at mount
  useEffect(() => {
    const fetchLiveBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://raw.githubusercontent.com/EbookFoundation/free-programming-books-search/master/fpb.json");
        const data = await res.json();

        if (data && Array.isArray(data.children) && data.children[0] && Array.isArray(data.children[0].children)) {
          const enBlocks = data.children[0].children.filter((l: any) => l.language && l.language.code === "en");
          const list: BookItem[] = [];

          enBlocks.forEach((enLang: any) => {
            enLang.sections.forEach((s: any) => {
              const secName = s.section;
              if (Array.isArray(s.entries)) {
                s.entries.forEach((e: any) => {
                  list.push({
                    id: `live-${list.length}`,
                    title: e.title,
                    url: e.url,
                    author: e.author || "Unknown",
                    category: secName,
                    format: e.notes ? e.notes.join(", ") : "HTML"
                  });
                });
              }
              if (Array.isArray(s.subsections)) {
                s.subsections.forEach((sub: any) => {
                  const subName = sub.section;
                  if (Array.isArray(sub.entries)) {
                    sub.entries.forEach((e: any) => {
                      list.push({
                        id: `live-${list.length}`,
                        title: e.title,
                        url: e.url,
                        author: e.author || "Unknown",
                        category: `${secName} - ${subName}`,
                        format: e.notes ? e.notes.join(", ") : "HTML"
                      });
                    });
                  }
                });
              }
            });
          });

          if (list.length > 0) {
            setBooksList(list);

            // Extract unique categories list
            const cats = new Set<string>();
            list.forEach(b => {
              if (b.category) {
                const trimmed = b.category.trim();
                const lower = trimmed.toLowerCase();
                if (trimmed && lower !== "all" && lower !== "") {
                  cats.add(trimmed);
                }
              }
            });
            const sortedCats = Array.from(cats).sort((a, b) => a.localeCompare(b));
            setCategories(["All", ...sortedCats]);
          }
        }
      } catch (err) {
        console.warn("Failed to load live books catalog, using offline fallback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveBooks();
  }, []);

  const handleCopyCommand = (command: string) => {
    playSuccess();
    navigator.clipboard.writeText(command);
    toast.success("Command copied to clipboard!");
    awardXP(10, "Copied reference CLI command");
  };

  const getFilteredBooks = () => {
    return booksList.filter(book => {
      const matchCat = selectedBookCat === "All" || book.category === selectedBookCat;
      const matchText = book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        book.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
        book.category.toLowerCase().includes(bookSearch.toLowerCase());
      return matchCat && matchText;
    });
  };

  const getFilteredCommands = () => {
    return COMMANDS.filter(cmd => {
      const matchCat = selectedCliCat === "All" || cmd.category === selectedCliCat;
      const matchText = cmd.title.toLowerCase().includes(cliSearch.toLowerCase()) ||
        cmd.desc.toLowerCase().includes(cliSearch.toLowerCase()) ||
        cmd.command.toLowerCase().includes(cliSearch.toLowerCase());
      return matchCat && matchText;
    });
  };

  // Get a stable color gradient based on category string hash
  const getCategoryColor = (category: string) => {
    const gradients = [
      "from-amber-500/20 to-yellow-500/20",
      "from-orange-600/20 to-amber-700/20",
      "from-cyan-500/20 to-blue-600/20",
      "from-blue-500/20 to-indigo-600/20",
      "from-purple-500/20 to-indigo-700/20",
      "from-emerald-500/20 to-teal-700/20",
      "from-pink-500/20 to-purple-600/20",
      "from-rose-500/20 to-red-700/20"
    ];
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % gradients.length;
    return gradients[idx];
  };

  return (
    <PageShell>
      <PageHeader
        icon={Icons.BookOpen}
        title="Books & Docs Hub"
        description="Search EbookFoundation's free computer science reference books or browse Trimstray's Book of Secret Knowledge CLI cheatsheets."
      />

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-6 text-xs font-semibold overflow-x-auto">
        {(["books", "secret-knowledge"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { playClick(); setActiveSubTab(tab); }}
            className={`px-6 py-2.5 capitalize transition ${activeSubTab === tab ? "border-b-2 border-spark text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "books" ? "Free Programming Books" : "Secret Knowledge CLI"}
          </button>
        ))}
      </div>

      <div className="grid gap-6">

        {/* FREE PROGRAMMING BOOKS TAB */}
        {activeSubTab === "books" && (
          <div className="space-y-4 animate-in fade-in duration-300">

            {/* Filter & Search Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Icons.Library className="h-3.5 w-3.5 text-spark" />
                <span>Reference Catalog ({getFilteredBooks().length} books)</span>
                {loading && <Icons.Loader2 className="h-3.5 w-3.5 animate-spin text-spark" />}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search books by title, author, category..."
                  value={bookSearch}
                  onChange={e => setBookSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-background/50 pl-9 pr-4 py-1.5 text-xs text-foreground outline-none focus:border-spark focus:ring-1 focus:ring-spark/30 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[220px_1fr] items-start">
              {/* Categories Sidebar */}
              <div className="glass relative rounded-3xl bg-card/45 border-white/10 p-4 sticky top-6 h-[calc(100vh-48px)] w-full flex flex-col" data-lenis-prevent>
                <div className="flex flex-col gap-3 h-full">
                  <div className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground shrink-0">Categories</div>
                  <div
                    className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 font-semibold text-xs pr-1 [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    data-lenis-prevent
                  >
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { playClick(); setSelectedBookCat(cat); }}
                        className={`flex items-center justify-start text-left w-full py-2 px-3 rounded-lg border transition shrink-0 ${selectedBookCat === cat ? "border-spark bg-spark/10 text-spark font-bold" : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground"}`}
                        title={cat}
                      >
                        <span className="text-left break-words leading-tight w-full">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Book grid */}
              <div className="flex flex-col sticky top-6 h-[calc(100vh-48px)] w-full">
                <div
                  className="flex-1 min-h-0 overflow-y-auto pr-1 pb-10 [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  data-lenis-prevent
                >
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {getFilteredBooks().slice(0, 100).map(book => {
                      const gradient = book.color || getCategoryColor(book.category);
                      return (
                        <HolographicPanel key={book.id} className="p-4 flex flex-col justify-between min-h-[190px]">
                          <div className="space-y-3">
                            {/* Fake Book Cover Header */}
                            <div className={`h-20 w-full bg-gradient-to-br ${gradient} rounded-xl border border-white/5 flex flex-col justify-end p-3 relative overflow-hidden`}>
                              <div className="absolute top-2 right-2 text-spark opacity-10">
                                <Icons.BookOpen className="h-8 w-8" />
                              </div>
                              <span className="px-1.5 py-0.2 rounded bg-background/70 border border-white/10 text-[8px] text-spark font-bold w-fit uppercase mb-1 truncate max-w-full">
                                {book.category}
                              </span>
                              <h4 className="font-bold text-xs text-foreground truncate">{book.title}</h4>
                              <p className="text-[9px] text-muted-foreground truncate">{book.author}</p>
                            </div>

                            <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-3">
                              {book.description || `Read this free reference book to master topics related to ${book.category}. Accessible online immediately.`}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3 text-[11px]">
                            <span className="font-mono text-purple-400 bg-purple-500/10 border border-purple-500/10 px-2 py-0.5 rounded text-[8px] font-bold">
                              {book.format}
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleSaveBook(book)}
                                className="text-muted-foreground hover:text-spark p-1 rounded hover:bg-white/5 transition flex items-center gap-1 cursor-none"
                                title="Save Book"
                              >
                                <Icons.Bookmark className="h-3.5 w-3.5" />
                              </button>
                              <a
                                href={book.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={playHover}
                                onClick={() => { playClick(); awardXP(15, `Opened reference book: ${book.title}`); }}
                                className="text-xs font-semibold text-spark hover:underline flex items-center gap-1"
                              >
                                <span>Read Book</span>
                                <Icons.ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                        </HolographicPanel>
                      );
                    })}
                    {getFilteredBooks().length > 100 && (
                      <div className="sm:col-span-2 xl:col-span-3 p-4 text-center text-xs text-muted-foreground bg-white/2 rounded-2xl border border-white/5">
                        Showing top 100 of {getFilteredBooks().length} books. Use search to refine.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECRET KNOWLEDGE CLI TAB */}
        {activeSubTab === "secret-knowledge" && (
          <div className="space-y-4 animate-in fade-in duration-300">

            {/* Filter & Search Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Icons.Terminal className="h-3.5 w-3.5 text-spark" />
                <span>Command Shell Reference ({getFilteredCommands().length} entries)</span>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search commands, flags, descriptions..."
                  value={cliSearch}
                  onChange={e => setCliSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-background/50 pl-9 pr-4 py-1.5 text-xs text-foreground outline-none focus:border-spark focus:ring-1 focus:ring-spark/30 transition-all"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[200px_1fr] items-start">
              {/* CLI categories sidebar */}
              <div className="glass relative rounded-3xl bg-card/45 border-white/10 p-4 sticky top-6 h-[calc(100vh-48px)] w-full flex flex-col" data-lenis-prevent>
                <div className="flex flex-col gap-3 h-full">
                  <div className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground shrink-0">CLI Contexts</div>
                  <div
                    className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 font-semibold text-xs pr-1 [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    data-lenis-prevent
                  >
                    {["All", "CLI Tools", "Docker", "Network Security", "One-Liners"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => { playClick(); setSelectedCliCat(cat); }}
                        className={`flex items-center justify-start text-left w-full py-2 px-3 rounded-lg border transition shrink-0 ${selectedCliCat === cat ? "border-spark bg-spark/10 text-spark font-bold" : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground"}`}
                      >
                        <span className="text-left break-words leading-tight w-full">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Commands list */}
              <div className="flex flex-col sticky top-6 h-[calc(100vh-48px)] w-full">
                <div
                  className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1 pb-10 [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  data-lenis-prevent
                >
                  {getFilteredCommands().map(cmd => (
                    <HolographicPanel key={cmd.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.2 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold uppercase tracking-wider">
                            {cmd.category}
                          </span>
                          <h4 className="font-bold text-xs text-foreground truncate">{cmd.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-normal max-w-2xl">{cmd.desc}</p>

                        {/* Code block */}
                        <pre className="p-3 font-mono text-[11px] text-spark bg-background/50 rounded-xl border border-white/5 overflow-x-auto select-text w-full">
                          <code>{cmd.command}</code>
                        </pre>
                      </div>

                      <button
                        onClick={() => handleCopyCommand(cmd.command)}
                        className="shrink-0 py-2 px-3 rounded-xl border border-white/5 bg-white/2 hover:border-spark/50 hover:bg-spark/10 hover:text-spark text-muted-foreground font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition self-end md:self-center"
                      >
                        <Icons.Copy className="h-3.5 w-3.5" />
                        <span>Copy command</span>
                      </button>
                    </HolographicPanel>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </PageShell>
  );
}
