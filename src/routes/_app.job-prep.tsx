import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playClick, playHover, playSuccess } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { DSA_SHEET_TOPICS, DSA_COMPANIES, DSA_TOTAL_QUESTIONS, type DSATopic } from "@/lib/dsaSheetData";

const jobPrepSearchSchema = z.object({
  company: z.string().optional(),
  timeframe: z.string().optional(),
});

export const Route = createFileRoute("/_app/job-prep")({
  validateSearch: jobPrepSearchSchema,
  head: () => ({ meta: [{ title: "Interview Prep — ProjectSpark" }] }),
  component: InterviewPrep,
});

export type LeetCodeQuestion = {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: string;
  frequency: number; // percentage
  url: string;
};

// Helper to format company folder names into human-readable titles
export function formatCompanyName(name: string): string {
  if (!name) return "";
  if (name === "1kosmos") return "1Kosmos";
  if (name === "6sense") return "6sense";
  if (name === "c3-ai") return "C3 AI";
  if (name === "bcg") return "BCG";
  if (name === "hrt") return "HRT";
  if (name === "jpmorgan") return "JPMorgan Chase";
  if (name === "tcs") return "TCS";
  if (name === "l&t" || name === "larsen-toubro") return "Larsen & Toubro";
  return name
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Compact helper to parse CSV with support for double-quoted comma values
export function parseCSV(csvText: string): LeetCodeQuestion[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length <= 1) return [];

  const questions: LeetCodeQuestion[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row: string[] = [];
    let inQuotes = false;
    let currentToken = "";

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentToken.trim());
        currentToken = "";
      } else {
        currentToken += char;
      }
    }
    row.push(currentToken.trim());

    if (row.length < 6) continue;

    const id = parseInt(row[0], 10);
    const url = row[1];
    const title = row[2].replace(/^"(.*)"$/, "$1"); // remove surrounding quotes
    const diffRaw = row[3];
    const difficulty = (diffRaw === "Easy" || diffRaw === "Medium" || diffRaw === "Hard") ? diffRaw : "Easy";
    const acceptance = row[4];
    const freqRaw = row[5].replace('%', '');
    const frequency = parseFloat(freqRaw);

    if (isNaN(id)) continue;

    questions.push({
      id,
      url: url || `https://leetcode.com/problems/${title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}`,
      title,
      difficulty,
      acceptance,
      frequency: isNaN(frequency) ? 0 : frequency
    });
  }

  return questions;
}

export const COMPANIES: string[] = [
  "1kosmos",
  "6sense",
  "accelya",
  "accenture",
  "accolite",
  "acko",
  "acorns",
  "activision",
  "adobe",
  "adp",
  "aetion",
  "affinity",
  "affirm",
  "agoda",
  "airbnb",
  "airbus",
  "airtel",
  "airwallex",
  "akamai",
  "akuna-capital",
  "alibaba",
  "allincall",
  "alphonso",
  "alten",
  "altimetrik",
  "amadeus",
  "amazon",
  "amd",
  "amdocs",
  "american-airlines",
  "american-express",
  "amplitude",
  "analytics-quotient",
  "andela",
  "anduril",
  "anthropic",
  "anyscale",
  "aon",
  "apolloio",
  "appdynamics",
  "appfolio",
  "apple",
  "applied-intuition",
  "aqr-capital-management",
  "arcesium",
  "argo-ai",
  "arista-networks",
  "asana",
  "ascend",
  "athenahealth",
  "atlassian",
  "att",
  "attentive",
  "audible",
  "auriga",
  "aurora",
  "autodesk",
  "avalara",
  "avito",
  "axis-bank",
  "axon",
  "baidu",
  "bank-of-america",
  "barclays",
  "bcg",
  "bending-spoons",
  "bill-com",
  "bitgo",
  "blackbuck",
  "blackrock",
  "blackstone",
  "blend",
  "blinkit",
  "bloomberg",
  "bloomreach",
  "blue-origin",
  "bnp-paribas",
  "bny-mellon",
  "boeing",
  "bolt",
  "bookingcom",
  "box",
  "bp",
  "braze",
  "bridgewater-associates",
  "brillio",
  "broadcom",
  "browserstack",
  "bt-group",
  "buyhatke",
  "bytedance",
  "c3-ai",
  "cadence",
  "canonical",
  "canva",
  "capgemini",
  "capital-one",
  "careem",
  "cars24",
  "carwale",
  "cashfree",
  "caterpillar",
  "cerner",
  "chalo",
  "chargebee",
  "checkpoint",
  "chewy",
  "chime",
  "chubb",
  "ciena",
  "circle",
  "cisco",
  "citadel",
  "citi",
  "citrix",
  "clari",
  "cleartrip",
  "clevertap",
  "cloudera",
  "cloudflare",
  "clutter",
  "cme-group",
  "cockroach-labs",
  "code-studio",
  "coditas",
  "cognizant",
  "cohesity",
  "coinbase",
  "coindcx",
  "coinswitch-kuber",
  "comcast",
  "commvault",
  "compass",
  "confluent",
  "couchbase",
  "coupa",
  "coupang",
  "coursera",
  "coveo",
  "cred",
  "criteo",
  "crowdstrike",
  "cruise-automation",
  "ctc",
  "curefit",
  "cvent",
  "cyntexa",
  "cyware",
  "dailyhunt",
  "darwinbox",
  "dassault-sysetmes",
  "dataart",
  "databricks",
  "datadog",
  "dataminr",
  "de-shaw",
  "deepmind",
  "delhivery",
  "deliveroo",
  "dell",
  "deloitte",
  "deltax",
  "deutsche-bank",
  "devrev",
  "dialpad",
  "directi",
  "discord",
  "discovery",
  "disney",
  "dji",
  "docusign",
  "doordash",
  "dp-world",
  "drawbridge",
  "dream11",
  "dropbox",
  "druva",
  "drw",
  "dtcc",
  "dunzo",
  "duolingo",
  "earnin",
  "ebay",
  "edelweiss",
  "electronic-arts",
  "elitmus",
  "envoy",
  "epam-systems",
  "epic-games",
  "epic-systems",
  "epifi",
  "equinix",
  "ericsson",
  "etsy",
  "exl",
  "expedia",
  "ey",
  "f5-networks",
  "factset",
  "faire",
  "fallible",
  "fanatics",
  "fast",
  "fastenal",
  "fico",
  "fidelity",
  "fidessa",
  "figma",
  "fiverr",
  "fivetran",
  "flatiron-health",
  "fleetx",
  "flexera",
  "flexport",
  "flipkart",
  "fortinet",
  "forusall",
  "fourkites",
  "fpt",
  "fractal-analytics",
  "freecharge",
  "freshworks",
  "fynd",
  "gainsight",
  "gameskraft",
  "garena",
  "garmin",
  "gartner",
  "ge-digital",
  "ge-healthcare",
  "geico",
  "general-electric",
  "general-motors",
  "gilt-groupe",
  "github",
  "glassdoor",
  "globallogic",
  "glovo",
  "godaddy",
  "gojek",
  "goldman-sachs",
  "google",
  "gopuff",
  "goto",
  "grab",
  "grammarly",
  "graviton",
  "groupon",
  "groww",
  "grubhub",
  "gsa-capital",
  "gsn-games",
  "guidewire",
  "gusto",
  "harness",
  "hashedin",
  "hbo",
  "hcl",
  "helix",
  "highspot",
  "hilabs",
  "hive",
  "honey",
  "honeywell",
  "hopper",
  "hotstar",
  "houzz",
  "hp",
  "hpe",
  "hrt",
  "hsbc",
  "htc",
  "huawei",
  "hubspot",
  "hulu",
  "ibm",
  "iit-bombay",
  "imc",
  "impact-analytics",
  "impetus",
  "increff",
  "indeed",
  "info-edge",
  "informatica",
  "infosys",
  "inmobi",
  "innovaccer",
  "instabase",
  "instacart",
  "intel",
  "interactive-brokers",
  "intercom",
  "intuit",
  "ivp",
  "ixigo",
  "ixl",
  "jane-street",
  "jd",
  "jeavio",
  "jingchi",
  "jio",
  "josh-technology",
  "jpmorgan",
  "jtg",
  "jump-trading",
  "juspay",
  "kakao",
  "karat",
  "kickdrum",
  "kla",
  "kla-tencor",
  "kotak-mahindra-bank",
  "kpmg",
  "larsen-toubro",
  "leap-motion",
  "lendingkart",
  "lenskart",
  "lg-electronics",
  "liberty-mutual",
  "liftoff",
  "lime",
  "line",
  "linkedin",
  "liveramp",
  "livspace",
  "lowe",
  "lti",
  "lucid",
  "luxoft",
  "lyft",
  "machine-zone",
  "machinezone",
  "maersk",
  "makemytrip",
  "mapbox",
  "maq-software",
  "marqeta",
  "mastercard",
  "mathworks",
  "mcafee",
  "mcdonalds",
  "mckinsey",
  "medianet",
  "meesho",
  "meituan",
  "mercari",
  "meta",
  "micro1",
  "microsoft",
  "microstrategy",
  "millennium",
  "mindtickle",
  "mindtree",
  "mishipay",
  "mitsogo",
  "mixpanel",
  "mobileye",
  "mobisy",
  "moengage",
  "moloco",
  "moneylion",
  "mongodb",
  "morgan-stanley",
  "motive",
  "moveworks",
  "mphasis",
  "msci",
  "murex",
  "mykaarma",
  "myntra",
  "nagarro",
  "nasdaq",
  "national-instruments",
  "national-payments-coorperation-india",
  "natwest",
  "navan",
  "naver",
  "navi",
  "ncr",
  "nerdwallet",
  "netapp",
  "netcracker-technology",
  "netease",
  "netflix",
  "netskope",
  "netsuite",
  "newsbreak",
  "nextdoor",
  "nextjump",
  "niantic",
  "nielsen",
  "nike",
  "nokia",
  "noon",
  "nordstrom",
  "notion",
  "npci",
  "nuro",
  "nutanix",
  "nvidia",
  "nykaa",
  "observeai",
  "odoo",
  "okta",
  "okx",
  "ola",
  "olx",
  "openai",
  "opentext",
  "oppo",
  "optiver",
  "optum",
  "oracle",
  "oscar-health",
  "otterai",
  "oyo",
  "ozon",
  "palantir",
  "palo-alto-networks",
  "park",
  "patreon",
  "paycom",
  "paypal",
  "paypay",
  "paytm",
  "payu",
  "peak6",
  "pega",
  "peloton",
  "persistent-systems",
  "philips",
  "phonepe",
  "pickrr",
  "pinterest",
  "plaid",
  "playsimple",
  "pocket-gems",
  "point72",
  "polar",
  "ponyai",
  "pornhub",
  "porter",
  "poshmark",
  "postman",
  "postmates",
  "poynt",
  "practo",
  "publicis-sapient",
  "pubmatic",
  "pure",
  "pure-storage",
  "purplle",
  "pwc",
  "qualcomm",
  "qualtrics",
  "qualys",
  "quantcast",
  "quantiphi",
  "quince",
  "quora",
  "rackspace",
  "radius",
  "rakuten",
  "rally-health",
  "ramp-2",
  "razorpay",
  "rbc",
  "redbus",
  "reddit",
  "redfin",
  "reliance-retails",
  "remitly",
  "retailmenot",
  "revolut",
  "riot-games",
  "ripple",
  "rippling",
  "rivian",
  "robinhood",
  "roblox",
  "rokt",
  "roku",
  "rubrik",
  "salesforce",
  "sambanova",
  "samsara",
  "samsung",
  "sap",
  "scale-ai",
  "scaler",
  "schlumberger",
  "schneider-electric",
  "schrodinger",
  "sentry",
  "servicenow",
  "sharechat",
  "shift-technology",
  "shipsy",
  "shopback",
  "shopee",
  "shopify",
  "shopup",
  "siemens",
  "sig",
  "sigmoid",
  "singlestore",
  "sixt",
  "slice",
  "smartnews",
  "smartsheet",
  "snapchat",
  "snapdeal",
  "snowflake",
  "societe-generale",
  "sofi",
  "softwire",
  "sonatus",
  "sony",
  "soti",
  "soundhound",
  "spacex",
  "spinny",
  "splunk",
  "spotify",
  "sprinklr",
  "square",
  "squarepoint-capital",
  "squarespace",
  "stackadapt",
  "stackline",
  "starbucks",
  "state-farm",
  "strava",
  "stripe",
  "sumologic",
  "swiggy",
  "syfe",
  "symantec",
  "synopsys",
  "ta-digital",
  "tableau",
  "tanium",
  "target",
  "tcs",
  "tech-mahindra",
  "tekion",
  "tencent",
  "teradata",
  "tesco",
  "tesla",
  "texas-instruments",
  "the-trade-desk",
  "thomson-reuters",
  "thoughtspot",
  "thoughtworks",
  "thousandeyes",
  "thumbtack",
  "tiaa",
  "tiger-analytics",
  "tiktok",
  "tinder",
  "tinkoff",
  "toast",
  "tokopedia",
  "tomtom",
  "toptal",
  "tower-research",
  "tracxn",
  "traveloka",
  "trend-micro",
  "trexquant",
  "trilogy",
  "tripactions",
  "tripadvisor",
  "triplebyte",
  "turing",
  "turvo",
  "tusimple",
  "twilio",
  "twitch",
  "twitter",
  "two-sigma",
  "uber",
  "ubisoft",
  "ubs",
  "udemy",
  "uipath",
  "ukg",
  "unbxd",
  "unity",
  "unstop",
  "upstart",
  "urban-company",
  "ust",
  "valve",
  "veeva",
  "verily",
  "veritas",
  "verizon",
  "verkada",
  "viasat",
  "vimeo",
  "virtu",
  "virtusa",
  "visa",
  "vk",
  "vmware",
  "walmart-labs",
  "warnermedia",
  "wayfair",
  "waymo",
  "wayve",
  "wealthfront",
  "wells-fargo",
  "weride",
  "western-digital",
  "whatfix",
  "whatnot",
  "winzo",
  "wipro",
  "wise",
  "wish",
  "wissen",
  "wix",
  "workday",
  "works-applications",
  "worldquant",
  "woven-by-toyota",
  "xing",
  "yahoo",
  "yandex",
  "yatra",
  "yelp",
  "yugabyte",
  "zalando",
  "zappos",
  "zemoso",
  "zendesk",
  "zenefits",
  "zepto",
  "zeta",
  "zeta-suite",
  "zillow",
  "zip",
  "ziprecruiter",
  "zluri",
  "zocdoc",
  "zoho",
  "zomato",
  "zoom",
  "zoox",
  "zopsmart",
  "zs-associates",
  "zscaler",
  "zulily",
  "zynga"
];

export function InterviewPrep() {
  const { company, timeframe } = Route.useSearch();
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState<"company" | "topic">("company");
  const [selectedCompany, setSelectedCompany] = useState<string>(company || "google");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"30days" | "3months" | "6months" | "all">(
    (timeframe as any) || "all"
  );
  const [companyQuery, setCompanyQuery] = useState("");
  const [lcSearch, setLcSearch] = useState("");
  const [questions, setQuestions] = useState<LeetCodeQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (company) setSelectedCompany(company);
    if (timeframe) setSelectedTimeframe(timeframe as any);
  }, [company, timeframe]);

  const handleSaveCompany = async () => {
    if (!user) {
      toast.error("Please login to save interview prep lists");
      return;
    }
    const companyTitle = formatCompanyName(selectedCompany);
    const { error } = await supabase.from("build_blueprints").insert({
      user_id: user.id,
      title: `${companyTitle} LeetCode Questions`,
      description: `Interview Prep questions for ${companyTitle} (${selectedTimeframe === "all" ? "All Time" : selectedTimeframe === "30days" ? "Last 30 Days" : selectedTimeframe === "3months" ? "Last 3 Months" : "Last 6 Months"})`,
      technologies: [selectedCompany],
      blueprint: {
        category: "interview_prep",
        company: selectedCompany,
        timeframe: selectedTimeframe,
        companyName: companyTitle,
        questionsCount: questions.length,
        questions: questions.slice(0, 50).map(q => ({
          id: q.id,
          title: q.title,
          difficulty: q.difficulty,
          acceptance: q.acceptance,
          frequency: q.frequency,
          url: q.url
        }))
      } as any
    });
    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success(`Saved ${companyTitle} questions to Saved items!`);
      awardXP(20, `Saved interview prep: ${companyTitle}`);
    }
  };

  // Dynamic CSV fetching from LeetCode Company-wise Questions repository
  useEffect(() => {
    let active = true;
    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const tfFile = {
          "30days": "thirty-days.csv",
          "3months": "three-months.csv",
          "6months": "six-months.csv",
          "all": "all.csv"
        }[selectedTimeframe];

        const url = `https://raw.githubusercontent.com/snehasishroy/leetcode-companywise-interview-questions/master/${selectedCompany}/${tfFile}`;
        const res = await fetch(url);

        if (!res.ok) {
          // Fallback to all.csv if a specific timeframe is missing
          if (selectedTimeframe !== "all") {
            const fallbackUrl = `https://raw.githubusercontent.com/snehasishroy/leetcode-companywise-interview-questions/master/${selectedCompany}/all.csv`;
            const fallbackRes = await fetch(fallbackUrl);
            if (fallbackRes.ok && active) {
              const csvText = await fallbackRes.text();
              const parsed = parseCSV(csvText);
              setQuestions(parsed);
              return;
            }
          }
          throw new Error(`Failed to fetch interview questions (${res.status}). This company may not have data for ${selectedTimeframe}.`);
        }

        if (active) {
          const csvText = await res.text();
          const parsed = parseCSV(csvText);
          setQuestions(parsed);
        }
      } catch (err: any) {
        if (active) {
          console.error(err);
          setError(err.message || "Failed to load questions from GitHub.");
          setQuestions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadQuestions();
    return () => {
      active = false;
    };
  }, [selectedCompany, selectedTimeframe]);

  // Filter companies in the sidebar
  const filteredCompanies = COMPANIES.filter(c =>
    c.toLowerCase().includes(companyQuery.toLowerCase()) ||
    formatCompanyName(c).toLowerCase().includes(companyQuery.toLowerCase())
  );

  // Filter questions by search query
  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(lcSearch.toLowerCase()) ||
    q.id.toString().includes(lcSearch)
  );

  return (
    <PageShell>
      <PageHeader
        icon={Icons.Terminal}
        title="Interview Prep"
        description="Company-wise LeetCode interview questions and a comprehensive topic-wise DSA sheet with 375+ curated problems and company tags."
        actions={
          activeSection === "company" ? (
            <button
              onClick={handleSaveCompany}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60 bg-gradient-spark text-primary-foreground font-semibold cursor-none"
            >
              <Icons.Bookmark className="h-3.5 w-3.5" />
              <span>Save Company List</span>
            </button>
          ) : null
        }
      />

      {/* Section Toggle */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
        <button
          onClick={() => { playClick(); setActiveSection("company"); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 ${activeSection === "company"
            ? "border-spark text-foreground bg-spark/5"
            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/3"
            }`}
        >
          <Icons.Building2 className="h-3.5 w-3.5" />
          Company-Wise (LeetCode)
        </button>
        <button
          onClick={() => { playClick(); setActiveSection("topic"); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 ${activeSection === "topic"
            ? "border-spark text-foreground bg-spark/5"
            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/3"
            }`}
        >
          <Icons.BookOpen className="h-3.5 w-3.5" />
          Topic-Wise (DSA Sheet)
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-spark/20 text-spark font-bold">{DSA_TOTAL_QUESTIONS}+</span>
        </button>
      </div>

      {activeSection === "topic" ? (
        <TopicWiseDSASheet />
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Icons.Building2 className="h-3.5 w-3.5 text-spark" />
              <span>Company-Wise LeetCode Interview Bank</span>
            </div>

            {/* Question Search Bar */}
            <div className="relative w-full md:w-72">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions by title or ID..."
                value={lcSearch}
                onChange={e => setLcSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-background/50 pl-9 pr-4 py-1.5 text-xs text-foreground outline-none focus:border-spark focus:ring-1 focus:ring-spark/30 transition-all"
              />
              {lcSearch && (
                <button onClick={() => setLcSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Icons.X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Selection panels */}
          <div className="grid gap-4 md:grid-cols-[240px_1fr] items-start">
            {/* Companies Selector */}
            <div className="glass relative rounded-3xl bg-card/45 border-white/10 p-4 sticky top-6 h-[calc(100vh-48px)] w-full flex flex-col" data-lenis-prevent>
              <div className="flex flex-col gap-3 h-full">
                <div className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">Select Company</div>

                {/* Sidebar Company Search */}
                <div className="relative shrink-0">
                  <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search 650+ companies..."
                    value={companyQuery}
                    onChange={e => setCompanyQuery(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-background/30 pl-7 pr-3 py-1 text-[11px] text-foreground outline-none focus:border-spark transition-all"
                  />
                  {companyQuery && (
                    <button onClick={() => setCompanyQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <Icons.X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1 font-semibold [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", msOverflowStyle: "none", }} data-lenis-prevent>
                  {filteredCompanies.length === 0 ? (
                    <div className="text-center text-[10px] text-muted-foreground py-10">No companies found</div>
                  ) : (
                    filteredCompanies.map(company => (
                      <motion.button
                        key={company}
                        onClick={() => { playClick(); setSelectedCompany(company); }}
                        className={`py-2.5 px-3 rounded-lg border text-xs text-left flex items-center justify-between gap-2 ${selectedCompany === company ? "border-spark bg-spark/10 text-spark font-bold" : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                        whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, transition: { type: "spring", stiffness: 200 } }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="truncate">{formatCompanyName(company)}</span>
                        <Icons.ChevronRight className={`h-3 w-3 shrink-0 ${selectedCompany === company ? "translate-x-0.5" : "opacity-40"}`} />
                      </motion.button>
                    ))
                  )}
                </div>
                <div className="text-[9px] text-muted-foreground text-center py-1.5 shrink-0 border-t border-white/5 bg-white/1 rounded-lg">
                  {filteredCompanies.length} companies available
                </div>
              </div>
            </div>

            {/* Timeframe & Table Area */}
            <div className="flex flex-col sticky top-6 h-[calc(100vh-48px)] w-full">
              {/* Timeframes filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-4 shrink-0" data-lenis-prevent>
                <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground mr-2 hidden sm:inline">Timeframe:</span>
                {(["30days", "3months", "6months", "all"] as const).map(tf => {
                  const labels = {
                    "30days": "Last 30 Days",
                    "3months": "Last 3 Months",
                    "6months": "Last 6 Months",
                    "all": "All Time"
                  };
                  return (
                    <button
                      key={tf}
                      onClick={() => { playClick(); setSelectedTimeframe(tf); }}
                      className={`px-4 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition ${selectedTimeframe === tf ? "border-spark bg-spark/15 text-spark" : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                    >
                      {labels[tf]}
                    </button>
                  );
                })}
              </div>

              {/* Question List Table */}
              <HolographicPanel className="p-0 overflow-hidden border-white/5 flex-1 flex flex-col min-h-0" innerClassName="flex flex-col h-full w-full">
                <div
                  className="w-full flex-1 overflow-auto [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  data-lenis-prevent
                >
                  <table className="w-full text-left border-collapse text-xs table-fixed">
                    <thead className="sticky top-0 bg-card/95 backdrop-blur z-10">
                      <tr className="border-b border-white/5 bg-white/2 text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
                        <th className="py-3 px-4 w-20">ID</th>
                        <th className="py-3 px-4 w-2/5">Problem Title</th>
                        <th className="py-3 px-4 w-24">Difficulty</th>
                        <th className="py-3 px-4 w-24">Acceptance</th>
                        <th className="py-3 px-4 w-28">Frequency</th>
                        <th className="py-3 px-4 w-16 text-center">Solve</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-24 text-center text-muted-foreground">
                            <Icons.Loader2 className="h-8 w-8 mx-auto mb-2 text-spark animate-spin" />
                            <span>Streaming {formatCompanyName(selectedCompany)} LeetCode questions...</span>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={6} className="py-24 text-center text-muted-foreground px-4">
                            <Icons.AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                            <span className="block font-semibold text-foreground mb-1">Could not fetch exact timeframe data</span>
                            <span className="text-[11px] leading-relaxed opacity-80">{error}</span>
                          </td>
                        </tr>
                      ) : filteredQuestions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-24 text-center text-muted-foreground">
                            <Icons.Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                            <span>No questions found matching the criteria.</span>
                          </td>
                        </tr>
                      ) : (
                        filteredQuestions.slice(0, 200).map(q => {
                          const diffStyles = {
                            Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                            Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                            Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20"
                          }[q.difficulty];

                          return (
                            <tr key={q.id} className="border-b border-white/5 hover:bg-white/1 transition-colors">
                              <td className="py-3 px-4 font-mono text-muted-foreground">#{q.id}</td>
                              <td className="py-3 px-4 font-semibold text-foreground truncate">
                                <a
                                  href={q.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onMouseEnter={playHover}
                                  onClick={() => { playClick(); awardXP(10, `Explored LeetCode problem: ${q.title}`); }}
                                  className="flex items-center gap-1.5 hover:text-spark hover:underline transition group truncate"
                                >
                                  <span className="truncate">{q.title}</span>
                                  <Icons.ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                </a>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${diffStyles}`}>
                                  {q.difficulty}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-muted-foreground">{q.acceptance}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-spark shadow-glow rounded-full"
                                      style={{ width: `${q.frequency}%` }}
                                    />
                                  </div>
                                  <span className="font-mono text-[10px] text-muted-foreground w-8 text-right shrink-0">{q.frequency.toFixed(1)}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <a
                                  href={q.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center p-1.5 rounded-lg border border-white/5 bg-white/2 hover:border-spark/50 hover:bg-spark/10 text-muted-foreground hover:text-spark transition"
                                >
                                  <Icons.Play className="h-3 w-3 fill-current" />
                                </a>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                  {filteredQuestions.length > 200 && (
                    <div className="text-[9px] text-muted-foreground text-center py-2 shrink-0 border-t border-white/5 bg-white/1 rounded-lg">
                      Showing top 200 of {filteredQuestions.length} questions. Search to refine.
                    </div>
                  )}
                </div>
              </HolographicPanel>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

// ─── Company Tooltip — shows all companies on hover ───────────────────────────
function CompanyTooltip({ companies }: { companies: string[] }) {
  const [open, setOpen] = useState(false);
  const preview = companies.slice(0, 3);
  const rest = companies.slice(3);
  return (
    <div className="relative inline-flex items-center gap-1 flex-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {preview.map(co => (
        <span key={co} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 border border-white/10 text-muted-foreground whitespace-nowrap">
          {co}
        </span>
      ))}
      {rest.length > 0 && (
        <span className="px-1.5 py-0.5 rounded text-[9px] bg-spark/10 border border-spark/20 text-spark font-semibold cursor-default whitespace-nowrap">
          +{rest.length} more
        </span>
      )}
      {open && rest.length > 0 && (
        <div className="absolute left-0 top-full mt-1 z-50 rounded-xl border border-white/15 bg-card/98 backdrop-blur-xl p-3 shadow-2xl min-w-max max-w-sm">
          <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">All Companies ({companies.length})</div>
          <div className="flex flex-wrap gap-1">
            {companies.map(co => (
              <span key={co} className="px-1.5 py-0.5 rounded text-[9px] bg-white/8 border border-white/10 text-foreground whitespace-nowrap">
                {co}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Topic Wise DSA Sheet Component ──────────────────────────────────────────
function TopicWiseDSASheet() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [companyFilter, setCompanyFilter] = useState<string>("All");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(["arrays-1"]));
  const [solved, setSolved] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("dsa_solved") || "[]") as number[]); }
    catch { return new Set<number>(); }
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const colorBar: Record<string, string> = {
    blue: "bg-blue-500", purple: "bg-purple-500", green: "bg-green-500",
    orange: "bg-orange-500", teal: "bg-teal-500", pink: "bg-pink-500",
    yellow: "bg-yellow-500", red: "bg-red-500", cyan: "bg-cyan-500",
    indigo: "bg-indigo-500", amber: "bg-amber-500", rose: "bg-rose-500",
    lime: "bg-lime-500", emerald: "bg-emerald-500", violet: "bg-violet-500",
  };
  const colorBadge: Record<string, string> = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/25",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/25",
    green: "text-green-400 bg-green-500/10 border-green-500/25",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/25",
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/25",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/25",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25",
    red: "text-red-400 bg-red-500/10 border-red-500/25",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/25",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/25",
    lime: "text-lime-400 bg-lime-500/10 border-lime-500/25",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/25",
  };
  const diffBadge: Record<string, string> = {
    Easy: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
    Medium: "text-amber-400  bg-amber-500/10  border border-amber-500/20",
    Hard: "text-rose-400   bg-rose-500/10   border border-rose-500/20",
  };

  const toggleSolved = (id: number) => {
    playClick();
    setSolved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else { next.add(id); awardXP(15, "Marked DSA problem solved"); }
      try { localStorage.setItem("dsa_solved", JSON.stringify([...next])); } catch { }
      return next;
    });
  };

  const copyLink = (url: string, id: number) => {
    navigator.clipboard.writeText(url).then(() => {
      playSuccess(); setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const toggleTopic = (id: string) => {
    playClick();
    setExpandedTopics(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getFilteredQs = (topic: DSATopic) =>
    topic.questions.filter(q => {
      const ms = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
      const md = difficultyFilter === "All" || q.difficulty === difficultyFilter;
      const mc = companyFilter === "All" || q.companies.includes(companyFilter);
      return ms && md && mc;
    });

  const solvedCount = solved.size;
  const solvedPct = DSA_TOTAL_QUESTIONS > 0 ? Math.round((solvedCount / DSA_TOTAL_QUESTIONS) * 100) : 0;
  const totalFiltered = DSA_SHEET_TOPICS.reduce((s, t) => s + getFilteredQs(t).length, 0);
  const topCompanies = ["All", "Amazon", "Google", "Microsoft", "Facebook", "Apple", "Adobe", "Uber", "Bloomberg", "Samsung", "Flipkart", "Goldman Sachs", "LinkedIn", "Airbnb"];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-300">

      <div className="space-y-4 shrink-0 pb-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: DSA_TOTAL_QUESTIONS, cls: "text-spark" },
            { label: "Solved", value: solvedCount, cls: "text-emerald-400" },
            { label: "Remaining", value: DSA_TOTAL_QUESTIONS - solvedCount, cls: "text-amber-400" },
            { label: "Progress", value: `${solvedPct}%`, cls: "text-violet-400" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-white/8 bg-card/40 px-4 py-3">
              <div className={`text-xl font-black font-display ${s.cls}`}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Global progress bar */}
        <div className="rounded-2xl border border-white/8 bg-card/40 px-5 py-3 flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground shrink-0 w-28">Overall Progress</span>
          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-gradient-spark rounded-full transition-all duration-700" style={{ width: `${solvedPct}%` }} />
          </div>
          <span className="text-xs font-bold text-spark shrink-0">{solvedCount}/{DSA_TOTAL_QUESTIONS}</span>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-white/8 bg-card/40 px-5 py-3.5 flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <input
              type="text" placeholder="Search questions..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="rounded-xl border border-white/10 bg-background/50 pl-7 pr-7 py-1.5 text-xs text-foreground outline-none focus:border-spark transition-all w-52"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Icons.X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="w-px h-5 bg-white/10" />
          {(["All", "Easy", "Medium", "Hard"] as const).map(d => (
            <button key={d} onClick={() => { playClick(); setDifficultyFilter(d); }}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition ${difficultyFilter === d
                ? d === "All" ? "border-spark bg-spark/15 text-spark"
                  : d === "Easy" ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                    : d === "Medium" ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
                      : "border-rose-500/50 bg-rose-500/15 text-rose-400"
                : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
            >{d}</button>
          ))}
          <div className="w-px h-5 bg-white/10" />
          <select value={companyFilter} onChange={e => { playClick(); setCompanyFilter(e.target.value); }}
            className="rounded-xl border border-white/10 bg-background/50 px-3 py-1.5 text-xs text-foreground outline-none focus:border-spark transition-all"
          >
            {topCompanies.map(c => <option key={c} value={c}>{c}</option>)}
            <optgroup label="─── More Companies ───">
              {DSA_COMPANIES.filter(c => !topCompanies.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
            </optgroup>
          </select>
          <div className="ml-auto flex items-center gap-2">
            {(searchQuery || difficultyFilter !== "All" || companyFilter !== "All") && (
              <span className="text-[10px] text-spark font-semibold">{totalFiltered} results</span>
            )}
            <button onClick={() => {
              playClick();
              setExpandedTopics(expandedTopics.size === DSA_SHEET_TOPICS.length
                ? new Set() : new Set(DSA_SHEET_TOPICS.map(t => t.id)));
            }} className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/10 bg-background/50 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition">
              {expandedTopics.size === DSA_SHEET_TOPICS.length
                ? <><Icons.ChevronsUp className="h-3 w-3" />Collapse All</>
                : <><Icons.ChevronsDown className="h-3 w-3" />Expand All</>}
            </button>
          </div>
        </div>
      </div>

      {/* Topic Accordions */}
      <div
        className="space-y-2 overflow-y-auto flex-1 min-h-0 pb-10 pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        data-lenis-prevent
      >
        {DSA_SHEET_TOPICS.map(topic => {
          const fqs = getFilteredQs(topic);
          const isExpanded = expandedTopics.has(topic.id);
          const topicSolved = topic.questions.filter(q => solved.has(q.id)).length;
          const topicPct = topic.questions.length > 0 ? Math.round((topicSolved / topic.questions.length) * 100) : 0;
          const badge = colorBadge[topic.color] ?? colorBadge.blue;
          const bar = colorBar[topic.color] ?? "bg-blue-500";

          if ((searchQuery || difficultyFilter !== "All" || companyFilter !== "All") && fqs.length === 0) return null;

          return (
            <div key={topic.id} className="rounded-2xl border border-white/8 overflow-hidden bg-card/35">
              {/* color accent strip */}
              <div className={`h-0.5 w-full ${bar} opacity-40`} />

              {/* Header */}
              <button onClick={() => toggleTopic(topic.id)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-2.5 w-2.5 rounded-full ${bar} opacity-80 shrink-0`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-[13px] text-foreground">{topic.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge}`}>{fqs.length}Q</span>
                      {topicSolved > 0 && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">{topicSolved} done</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-20 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full ${bar} opacity-70 rounded-full transition-all`} style={{ width: `${topicPct}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground">{topicPct}%</span>
                      <span className="text-[9px] text-emerald-400">{topic.questions.filter(q => q.difficulty === "Easy").length}E</span>
                      <span className="text-[9px] text-amber-400">{topic.questions.filter(q => q.difficulty === "Medium").length}M</span>
                      <span className="text-[9px] text-rose-400">{topic.questions.filter(q => q.difficulty === "Hard").length}H</span>
                    </div>
                  </div>
                </div>
                <Icons.ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
              </button>

              {/* Questions Table */}
              {isExpanded && (
                <div className="border-t border-white/5 overflow-x-auto">
                  {fqs.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">No questions match current filters.</div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-white/2 text-[9px] uppercase tracking-wider text-muted-foreground font-bold border-b border-white/5">
                          <th className="py-2.5 px-4 w-10">✓</th>
                          <th className="py-2.5 px-3 w-10">#</th>
                          <th className="py-2.5 px-3">Problem</th>
                          <th className="py-2.5 px-3 w-24">Difficulty</th>
                          <th className="py-2.5 px-3">Companies</th>
                          <th className="py-2.5 px-3 w-20 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fqs.map(q => {
                          const isSolved = solved.has(q.id);
                          return (
                            <tr key={q.id} className={`border-b border-white/3 transition-colors group ${isSolved ? "bg-emerald-500/4 hover:bg-emerald-500/6" : "hover:bg-white/2"}`}>
                              {/* Solved checkbox */}
                              <td className="py-2.5 px-4">
                                <button onClick={() => toggleSolved(q.id)} title={isSolved ? "Mark unsolved" : "Mark solved"}
                                  className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${isSolved ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" : "border-white/20 bg-white/3 hover:border-emerald-500/50 text-transparent"}`}
                                >
                                  {isSolved && <Icons.Check className="h-2.5 w-2.5" />}
                                </button>
                              </td>
                              {/* ID */}
                              <td className="py-2.5 px-3 font-mono text-muted-foreground text-[10px]">{q.id}</td>
                              {/* Title */}
                              <td className="py-2.5 px-3 max-w-[280px]">
                                <a href={q.url} target="_blank" rel="noopener noreferrer"
                                  onMouseEnter={playHover}
                                  onClick={() => { playClick(); awardXP(10, `Opened: ${q.title}`); }}
                                  className={`flex items-center gap-1.5 group/link transition font-semibold truncate ${isSolved ? "line-through text-muted-foreground/50 hover:text-muted-foreground" : "text-foreground hover:text-spark"}`}
                                >
                                  <span className="truncate">{q.title}</span>
                                  <Icons.ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-50 transition shrink-0" />
                                </a>
                              </td>
                              {/* Difficulty */}
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${diffBadge[q.difficulty]}`}>{q.difficulty}</span>
                              </td>
                              {/* Companies — hover to see all */}
                              <td className="py-2.5 px-3">
                                <CompanyTooltip companies={q.companies} />
                              </td>
                              {/* Actions */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button onClick={() => copyLink(q.url, q.id)} title="Copy link"
                                    className={`p-1.5 rounded-lg border transition ${copiedId === q.id ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-white/5 bg-white/2 text-muted-foreground hover:border-spark/40 hover:bg-spark/8 hover:text-spark"}`}
                                  >
                                    {copiedId === q.id ? <Icons.Check className="h-3 w-3" /> : <Icons.Copy className="h-3 w-3" />}
                                  </button>
                                  <a href={q.url} target="_blank" rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg border border-white/5 bg-white/2 hover:border-spark/50 hover:bg-spark/10 text-muted-foreground hover:text-spark transition"
                                  >
                                    <Icons.Play className="h-3 w-3 fill-current" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
