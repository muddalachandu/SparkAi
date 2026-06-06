import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playClick, playSuccess, playHover } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { parseResumeForPortfolio, generateCustomPortfolio, updateCustomPortfolio } from "@/lib/resume.functions";
import { z } from "zod";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const portfolioSearchSchema = z.object({
  restoreId: z.string().optional(),
});

export const Route = createFileRoute("/_app/portfolio")({
  validateSearch: portfolioSearchSchema,
  head: () => ({ meta: [{ title: "Portfolio Builder — ProjectSpark" }] }),
  component: PortfolioBuilder,
});

type ThemeType = "Cyber" | "Retro" | "Minimalist" | "AI-Custom";

export function PortfolioBuilder() {
  const { restoreId } = Route.useSearch();
  const { user } = useAuth();

  const [selectedTheme, setSelectedTheme] = useState<ThemeType>("Cyber");
  const [showExportModal, setShowExportModal] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [generatingCustom, setGeneratingCustom] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("Arun Singh");
  const [focusTitle, setFocusTitle] = useState("AI Solutions Engineer");
  const [email, setEmail] = useState("arun.singh@sparklabs.ai");
  const [github, setGithub] = useState("github.com/arunsingh-ai");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/arun-spark");
  
  const [skills, setSkills] = useState("TypeScript, React, Node.js, PyTorch, Python, Docker");
  const [education, setEducation] = useState("B.S. in Computer Science, Stanford University (2025)");
  const [experience, setExperience] = useState("ML Engineer Intern at SparkLabs AI (Implemented vision transformer diagnostic pipelines)");
  const [projects, setProjects] = useState("Custom RESP Engine (Rust) - in-memory key-value store, Interactive Mindmap (React) - visual graphs");
  const [achievements, setAchievements] = useState("Hackathon Winner 2026, Dean's List (GPA 3.9/4.0)");
  const [hobbies, setHobbies] = useState("Chess, Watching Cricket, Hiking");

  const [generatedDetails, setGeneratedDetails] = useState<{
    fullName: string;
    focusTitle: string;
    email: string;
    github: string;
    linkedin: string;
    skills: string;
    education: string;
    experience: string;
    projects: string;
    achievements: string;
    hobbies: string;
  } | null>(null);

  useEffect(() => {
    if (restoreId && user) {
      const loadSaved = async () => {
        const { data, error } = await supabase
          .from("build_blueprints")
          .select("*")
          .eq("id", restoreId)
          .single();
        if (error) {
          toast.error("Failed to load saved portfolio");
          return;
        }
        if (data && data.blueprint) {
          const bp = data.blueprint as any;
          if (bp.category === "portfolio") {
            setFullName(bp.fullName || "");
            setFocusTitle(bp.focusTitle || "");
            setEmail(bp.email || "");
            setGithub(bp.github || "");
            setLinkedin(bp.linkedin || "");
            setSkills(bp.skills || "");
            setEducation(bp.education || "");
            setExperience(bp.experience || "");
            setProjects(bp.projects || "");
            setAchievements(bp.achievements || "");
            setHobbies(bp.hobbies || "");
            setCustomHtml(bp.customHtml || null);
            setSelectedTheme(bp.selectedTheme || "Cyber");
            setGeneratedDetails({
              fullName: bp.fullName || "",
              focusTitle: bp.focusTitle || "",
              email: bp.email || "",
              github: bp.github || "",
              linkedin: bp.linkedin || "",
              skills: bp.skills || "",
              education: bp.education || "",
              experience: bp.experience || "",
              projects: bp.projects || "",
              achievements: bp.achievements || "",
              hobbies: bp.hobbies || ""
            });
            toast.success("Restored saved portfolio!");
          }
        }
      };
      loadSaved();
    }
  }, [restoreId, user]);

  // Custom Prompt-to-Code state
  const [customPrompt, setCustomPrompt] = useState("");
  const [customHtml, setCustomHtml] = useState<string | null>(null);

  // Drag and drop / Paste state
  const [rawResumeText, setRawResumeText] = useState("");
  const parseResume = useServerFn(parseResumeForPortfolio);
  const generateCustom = useServerFn(generateCustomPortfolio);
  const updateCustom = useServerFn(updateCustomPortfolio);

  // Client-side regex/heuristic parser fallback
  const parseResumeHeuristic = (text: string) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    
    // 1. Email extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const parsedEmail = emailMatch ? emailMatch[0] : "";
    
    // 2. GitHub and LinkedIn links
    const ghMatch = text.match(/(github\.com\/[a-zA-Z0-9_-]+)/i);
    const parsedGithub = ghMatch ? ghMatch[0] : "";
    
    const liMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
    const parsedLinkedin = liMatch ? liMatch[0] : "";
    
    // 3. Name guess
    let parsedName = "";
    if (lines.length > 0) {
      const firstLine = lines[0];
      if (firstLine.length < 30 && /^[a-zA-Z\s.]+$/.test(firstLine)) {
        parsedName = firstLine;
      }
    }
    
    // 4. Focus Title
    const commonTitles = [
      "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
      "AI Engineer", "ML Engineer", "Data Scientist", "DevOps Engineer", "Cloud Solutions Architect",
      "Systems Programmer", "Security Analyst"
    ];
    let parsedTitle = "";
    for (const title of commonTitles) {
      if (text.toLowerCase().includes(title.toLowerCase())) {
        parsedTitle = title;
        break;
      }
    }
    if (!parsedTitle && lines.length > 1) {
      const secondLine = lines[1];
      if (secondLine.length < 40) parsedTitle = secondLine;
    }
    
    // 5. Skills
    let parsedSkills = "";
    const skillsKeywords = ["skills", "technologies", "languages", "core tools", "expertise"];
    let skillsIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (skillsKeywords.some(k => lineLower.startsWith(k) || lineLower.endsWith(k + ":"))) {
        skillsIndex = i;
        break;
      }
    }
    if (skillsIndex !== -1 && skillsIndex + 1 < lines.length) {
      parsedSkills = lines[skillsIndex + 1];
    } else {
      const knownSkills = [
        "React", "TypeScript", "JavaScript", "Node.js", "Python", "Go", "Rust", "C++",
        "Java", "Docker", "Kubernetes", "AWS", "GCP", "SQL", "PostgreSQL", "MongoDB",
        "PyTorch", "TensorFlow", "HTML", "CSS", "Git", "Next.js", "Vue"
      ];
      const foundSkills = knownSkills.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(text));
      parsedSkills = foundSkills.join(", ");
    }
    
    // 6. Education
    let parsedEducation = "";
    const eduIndex = lines.findIndex(l => /education|university|college|degree/i.test(l));
    if (eduIndex !== -1 && eduIndex + 1 < lines.length) {
      parsedEducation = lines[eduIndex] + " - " + lines[eduIndex + 1];
    } else {
      const eduMatch = text.match(/(Bachelor|Master|B\.S\.|M\.S\.|B\.Tech|M\.Tech|Ph\.D\.)[^.\n]+/i);
      parsedEducation = eduMatch ? eduMatch[0].trim() : "";
    }
    
    // 7. Experience
    let parsedExperience = "";
    const expIndex = lines.findIndex(l => /experience|work|employment/i.test(l));
    if (expIndex !== -1 && expIndex + 1 < lines.length) {
      parsedExperience = lines.slice(expIndex + 1, expIndex + 4).join(" ");
    } else {
      parsedExperience = "Professional developer focusing on building high-performance web systems.";
    }
    
    // 8. Projects
    let parsedProjects = "";
    const projectKeywords = ["project", "projects", "personal projects", "portfolio projects", "challenges"];
    let projIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (projectKeywords.some(k => lineLower.startsWith(k) || lineLower.endsWith(k + ":"))) {
        projIndex = i;
        break;
      }
    }
    if (projIndex !== -1 && projIndex + 1 < lines.length) {
      parsedProjects = lines[projIndex + 1];
    } else {
      const knownProjects = text.match(/(?:built|created|developed|implemented)\s+([a-zA-Z0-9\s-]+(?:\bserver\b|\bapp\b|\bwebsite\b|\bengine\b|\bdatabase\b))/gi);
      parsedProjects = knownProjects ? knownProjects.slice(0, 3).map(p => p.trim()).join(", ") : "Custom RESP Engine (Rust), Interactive Mindmap (React)";
    }

    // 9. Hobbies (Separate from achievements)
    let parsedHobbies = "";
    const hobbyKeywords = ["hobby", "hobbies", "interests", "personal interests", "activities", "leisure"];
    let hobbyIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (hobbyKeywords.some(k => lineLower.startsWith(k) || lineLower.endsWith(k + ":"))) {
        hobbyIndex = i;
        break;
      }
    }
    if (hobbyIndex !== -1 && hobbyIndex + 1 < lines.length) {
      parsedHobbies = lines[hobbyIndex + 1];
    } else {
      const knownHobbies = ["chess", "cricket", "football", "reading", "gaming", "music", "traveling", "swimming", "sports"];
      const foundHobbies = knownHobbies.filter(h => new RegExp(`\\b${h}\\b`, 'i').test(text));
      parsedHobbies = foundHobbies.join(", ") || "Chess, Watching Cricket";
    }

    // 10. Achievements (Exclude Hobbies)
    let parsedAchievements = "";
    const achIndex = lines.findIndex(l => /achievement|award|honor|badge/i.test(l));
    if (achIndex !== -1 && achIndex + 1 < lines.length) {
      parsedAchievements = lines[achIndex + 1];
    } else {
      const parsedAwards = lines.filter(l => /award|winner|first place|hackathon|scholarship/i.test(l) && !/cricket|chess/i.test(l));
      parsedAchievements = parsedAwards.slice(0, 2).join(", ") || "Hackathon Competitor, Certified Developer";
    }
    
    return {
      fullName: parsedName || "Developer Candidate",
      focusTitle: parsedTitle || "Full Stack Engineer",
      email: parsedEmail || "developer@projectspark.ai",
      github: parsedGithub || "github.com",
      linkedin: parsedLinkedin || "linkedin.com",
      skills: parsedSkills || "JavaScript, TypeScript, React, Git",
      education: parsedEducation || "B.S. in Computer Science",
      experience: parsedExperience || "Software Developer at Spark Labs",
      projects: parsedProjects,
      achievements: parsedAchievements || "Ecosystem Contributor",
      hobbies: parsedHobbies
    };
  };

  const runResumeParser = async (textToParse: string) => {
    if (!textToParse.trim()) {
      toast.error("Please paste resume text or drag a file first.");
      return;
    }
    playClick();
    setParsing(true);
    toast.info("AI Scanner analyzing resume layers...");
    
    try {
      const parsed = await parseResume({ data: { resumeText: textToParse } });
      
      if (parsed) {
        setFullName(parsed.fullName);
        setFocusTitle(parsed.focusTitle);
        setEmail(parsed.email);
        setGithub(parsed.github);
        setLinkedin(parsed.linkedin);
        setSkills(parsed.skills);
        setEducation(parsed.education);
        setExperience(parsed.experience);
        setProjects(parsed.projects);
        setAchievements(parsed.achievements);
        setHobbies(parsed.hobbies);
        
        awardXP(50, "Used AI Resume Parser");
        toast.success("AI parsed resume and populated all fields successfully!");
      }
    } catch (err) {
      console.warn("AI resume parser failed, falling back to local client-side regex engine:", err);
      const fallbackData = parseResumeHeuristic(textToParse);
      
      setFullName(fallbackData.fullName);
      setFocusTitle(fallbackData.focusTitle);
      setEmail(fallbackData.email);
      setGithub(fallbackData.github);
      setLinkedin(fallbackData.linkedin);
      setSkills(fallbackData.skills);
      setEducation(fallbackData.education);
      setExperience(fallbackData.experience);
      setProjects(fallbackData.projects);
      setAchievements(fallbackData.achievements);
      setHobbies(fallbackData.hobbies);
      
      awardXP(30, "Parsed resume with local client engine");
      toast.success("Local regex engine extracted all fields successfully!");
    } finally {
      setParsing(false);
    }
  };

  const runCustomGenerator = async () => {
    if (!customPrompt.trim()) {
      toast.error("Please enter a style design prompt.");
      return;
    }
    playClick();
    setGeneratingCustom(true);
    toast.info(customHtml ? "AI Custom Designer updating layout..." : "AI Custom Designer composing layout files...");
    
    const details = {
      fullName,
      focusTitle,
      email,
      github,
      linkedin,
      skills,
      education,
      experience,
      projects,
      achievements,
      hobbies,
    };

    try {
      let result;
      if (customHtml) {
        result = await updateCustom({
          data: {
            html: customHtml,
            details,
            prompt: customPrompt,
          },
        });
      } else {
        result = await generateCustom({
          data: {
            details,
            prompt: customPrompt,
          },
        });
      }
      
      if (result && result.html) {
        setCustomHtml(result.html);
        setGeneratedDetails(details);
        setSelectedTheme("AI-Custom");
        awardXP(60, customHtml ? "Iterated custom AI portfolio styling" : "Generated custom AI portfolio styling");
        toast.success(customHtml ? "Custom portfolio layout updated!" : "Custom portfolio layout ready!");
        setCustomPrompt("");
      }
    } catch (err) {
      console.error(err);
      toast.error("AI custom designer failed. Try checking your API key configurations.");
    } finally {
      setGeneratingCustom(false);
    }
  };

  const getProcessedHtml = () => {
    if (selectedTheme !== "AI-Custom" || !customHtml) {
      return getExportCodeInternal();
    }
    if (!generatedDetails) return customHtml;
    
    let html = customHtml;
    const fields: (keyof typeof generatedDetails)[] = [
      "fullName",
      "focusTitle",
      "email",
      "github",
      "linkedin",
      "skills",
      "education",
      "experience",
      "projects",
      "achievements",
      "hobbies"
    ];
    
    const currentDetails = {
      fullName,
      focusTitle,
      email,
      github,
      linkedin,
      skills,
      education,
      experience,
      projects,
      achievements,
      hobbies
    };

    const replacePlaceholder = (htmlText: string, search: string, replacement: string) => {
      if (!search || !replacement) return htmlText;
      const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      return htmlText.replace(new RegExp(escaped, 'gi'), replacement);
    };

    for (const field of fields) {
      const oldVal = generatedDetails[field];
      const newVal = currentDetails[field];
      if (oldVal && newVal && oldVal !== newVal) {
        html = replacePlaceholder(html, oldVal, newVal);
      }
    }
    
    return html;
  };

  const handleSavePortfolio = async () => {
    if (!user) {
      toast.error("Please login to save portfolios");
      return;
    }
    const { error } = await supabase.from("build_blueprints").insert({
      user_id: user.id,
      title: `Portfolio: ${fullName}`,
      description: focusTitle || "Developer Portfolio",
      technologies: skills.split(",").map(s => s.trim()).filter(Boolean),
      blueprint: {
        category: "portfolio",
        fullName,
        focusTitle,
        email,
        github,
        linkedin,
        skills,
        education,
        experience,
        projects,
        achievements,
        hobbies,
        customHtml: getProcessedHtml(),
        selectedTheme
      } as any
    });
    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success(`Saved portfolio for ${fullName} to your Saved items!`);
      awardXP(25, `Saved portfolio: ${fullName}`);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          if (text) {
            setRawResumeText(text);
            runResumeParser(text);
          }
        };
        reader.readAsText(file);
      } else {
        toast.error("For PDFs or Word files, please copy and paste the text directly into the text area below!");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setRawResumeText(text);
          runResumeParser(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerExport = () => {
    playSuccess();
    setShowExportModal(true);
    awardXP(40, "Exported portfolio template");
    toast.success("Portfolio website generated!");
  };

  const getExportCode = () => {
    if (selectedTheme === "AI-Custom" && customHtml) {
      return getProcessedHtml();
    }
    return getExportCodeInternal();
  };

  const getExportCodeInternal = () => {

    const themeCSS = selectedTheme === "Cyber" 
      ? `body { background: #0a0a16; color: #f3f4f6; font-family: 'Space Grotesk', sans-serif; padding-bottom: 50px; }
         .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(167,139,250,0.2); box-shadow: 0 0 15px rgba(167,139,250,0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px; }
         .accent-text { color: #a78bfa; text-shadow: 0 0 5px #a78bfa; font-weight: bold; }
         a { color: #818cf8; text-decoration: none; }
         .pill { background: rgba(167,139,250,0.15); border: 1px solid rgba(167,139,250,0.3); color: #a78bfa; padding: 4px 10px; border-radius: 8px; font-size: 11px; display: inline-block; margin: 4px; }`
      : selectedTheme === "Retro"
      ? `body { background: #0c0f0a; color: #4af626; font-family: monospace; padding-bottom: 50px; }
         .card { border: 1px solid #4af626; padding: 20px; margin-bottom: 20px; }
         .accent-text { color: #4af626; font-weight: bold; }
         a { color: #4af626; text-decoration: underline; }
         .pill { border: 1px dashed #4af626; color: #4af626; padding: 2px 8px; display: inline-block; margin: 4px; }`
      : `body { background: #ffffff; color: #1f2937; font-family: sans-serif; padding-bottom: 50px; }
         .card { border: 1px solid #e5e7eb; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
         .accent-text { color: #2563eb; font-weight: bold; }
         a { color: #2563eb; text-decoration: none; }
         .pill { background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 6px; font-size: 11px; display: inline-block; margin: 4px; }`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fullName} | Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    ${themeCSS}
    .container { max-width: 800px; margin: 50px auto; padding: 20px; }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    p { line-height: 1.6; }
    .contact-links { margin: 15px 0; }
    .contact-links a { margin-right: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1>${fullName}</h1>
      <p class="accent-text">${focusTitle}</p>
      <div class="contact-links">
        <a href="mailto:${email}">${email}</a>
        <a href="https://${github}">${github}</a>
        <a href="https://${linkedin}">${linkedin}</a>
      </div>
    </div>
    
    <div class="card">
      <h3>Core Expertise</h3>
      <div style="margin-top: 10px;">
        ${skills.split(",").map(s => `<span class="pill">${s.trim()}</span>`).join("")}
      </div>
    </div>

    <div class="card">
      <h3>Education</h3>
      <p>${education}</p>
    </div>

    <div class="card">
      <h3>Professional Experience</h3>
      <p>${experience}</p>
    </div>

    <div class="card">
      <h3>Key Projects</h3>
      <p>${projects}</p>
    </div>

    <div class="card">
      <h3>Achievements</h3>
      <p>${achievements}</p>
    </div>

    <div class="card">
      <h3>Hobbies & Interests</h3>
      <p>${hobbies}</p>
    </div>
  </div>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    playSuccess();
    navigator.clipboard.writeText(getExportCode());
    toast.success("HTML code copied to clipboard!");
  };

  // Preview styling setups
  const getThemePreviewStyles = () => {
    switch (selectedTheme) {
      case "Retro":
        return {
          bg: "bg-[#0b0d08] border-[#4af626]/20",
          text: "text-[#4af626] font-mono",
          card: "border border-[#4af626]/30 bg-black/60",
          accent: "text-[#4af626]",
          pill: "bg-[#4af626]/10 border border-[#4af626]/30 text-[#4af626]"
        };
      case "Minimalist":
        return {
          bg: "bg-white border-zinc-200",
          text: "text-zinc-800 font-sans",
          card: "border border-zinc-200 bg-zinc-50",
          accent: "text-blue-600",
          pill: "bg-zinc-200 text-zinc-700"
        };
      default: // Cyber Glassmorphism
        return {
          bg: "bg-[#0c0d21] border-[#c084fc]/15",
          text: "text-foreground font-display",
          card: "glass-panel bg-white/2 border-white/5 shadow-glow",
          accent: "text-spark",
          pill: "bg-spark/10 border border-spark/20 text-spark"
        };
    }
  };

  const styles = getThemePreviewStyles();

  return (
    <PageShell>
      <PageHeader
        icon={Icons.FolderHeart}
        title="AI Portfolio Builder & Resume Parser"
        description="Craft a high-performance developer portfolio website from form fields or automatically parse your existing resume using AI."
        actions={
          <button
            onClick={handleSavePortfolio}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60 bg-gradient-spark text-primary-foreground font-semibold"
          >
            <Icons.Bookmark className="h-3.5 w-3.5" />
            <span>Save Portfolio</span>
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
        
        {/* Left Control Panel */}
        <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-1" data-lenis-prevent>
          
          {/* AI Resume Parser Option */}
          <div className="glass relative overflow-hidden rounded-3xl bg-card/45 border-white/10 p-4 space-y-3 shrink-0">
            <h3 className="font-display text-xs font-bold text-foreground flex items-center gap-1.5">
              <Icons.Brain className="h-4 w-4 text-spark animate-pulse" />
              <span>AI Resume Parser</span>
            </h3>
            
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById("resume-file-input")?.click()}
              className="border border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-spark/50 transition bg-white/2 text-[11px] text-muted-foreground relative"
            >
              <input
                type="file"
                id="resume-file-input"
                accept=".txt,.md,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Icons.UploadCloud className="h-6 w-6 mx-auto mb-2 text-spark" />
              <p>Drag & Drop Resume TXT/MD/JSON here</p>
              <p className="text-[9px] opacity-60 mt-1">Or click to select a file (PDF/Word? Paste below)</p>
            </div>

            <textarea
              value={rawResumeText}
              onChange={e => setRawResumeText(e.target.value)}
              placeholder="Paste raw resume text here to parse..."
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-[10px] text-foreground outline-none focus:border-spark resize-none"
            />

            <button
              onClick={() => runResumeParser(rawResumeText)}
              disabled={parsing}
              className="w-full py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-purple-500/20 transition disabled:opacity-50"
            >
              {parsing ? <Icons.Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icons.Cpu className="h-3.5 w-3.5" />}
              <span>{parsing ? "Parsing Resume..." : "Run AI Resume Parser"}</span>
            </button>
          </div>

          {/* AI Custom Theme generator */}
          <div className="glass relative overflow-hidden rounded-3xl bg-card/45 border-white/10 p-4 space-y-3 shrink-0">
            <h3 className="font-display text-xs font-bold text-foreground flex items-center gap-1.5">
              <Icons.Sparkles className="h-4 w-4 text-spark" />
              <span>AI Custom Layout Prompt</span>
            </h3>
            <textarea
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Describe a design (e.g. 'Vaporwave theme with neon purple borders and a Space Invader feel' or 'Minimalist green warm card layout')..."
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-[10px] text-foreground outline-none focus:border-spark resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={runCustomGenerator}
                disabled={generatingCustom}
                className="flex-1 py-1.5 rounded-lg bg-gradient-spark text-primary-foreground font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-[1.02] transition disabled:opacity-50 shadow-glow"
              >
                {generatingCustom ? <Icons.Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icons.Palette className="h-3.5 w-3.5" />}
                <span>{generatingCustom ? "Designing..." : customHtml ? "Update Design" : "Generate Custom Page"}</span>
              </button>
              
              {customHtml && (
                <button
                  onClick={() => {
                    playClick();
                    setCustomHtml(null);
                    setCustomPrompt("");
                    setSelectedTheme("Cyber");
                    toast.success("AI Custom design reset to default templates!");
                  }}
                  className="py-1.5 px-3 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 font-semibold text-[10px] uppercase tracking-wider transition"
                  title="Reset Layout"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Form details */}
          <div className="glass relative overflow-hidden rounded-3xl bg-card/45 border-white/10 p-4 space-y-3 shrink-0">
            <h3 className="font-display text-xs font-bold text-foreground">Developer Details Form</h3>
            
            <div className="space-y-3 text-[11px]">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Full Name</label>
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Focus Title</label>
                <input
                  value={focusTitle}
                  onChange={e => setFocusTitle(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Contact Email</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">GitHub Link</label>
                  <input
                    value={github}
                    onChange={e => setGithub(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-background px-2 py-1 text-[10px] text-foreground outline-none focus:border-spark"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">LinkedIn Link</label>
                  <input
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-background px-2 py-1 text-[10px] text-foreground outline-none focus:border-spark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Technical Skills (comma list)</label>
                <input
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Education</label>
                <input
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Experience Summary</label>
                <textarea
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark resize-none"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Key Projects</label>
                <textarea
                  value={projects}
                  onChange={e => setProjects(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark resize-none"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Achievements & Awards</label>
                <input
                  value={achievements}
                  onChange={e => setAchievements(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Personal Hobbies & Interests</label>
                <input
                  value={hobbies}
                  onChange={e => setHobbies(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark"
                />
              </div>
            </div>
          </div>

          {/* Theme customizer */}
          <div className="glass relative overflow-hidden rounded-3xl bg-card/45 border-white/10 p-4 space-y-3 shrink-0">
            <label className="block text-[9px] uppercase tracking-wider text-muted-foreground">Theme Templates</label>
            <div className="grid grid-cols-4 gap-1 font-semibold">
              {(["Cyber", "Retro", "Minimalist", "AI-Custom"] as const).map(theme => {
                const disabled = theme === "AI-Custom" && !customHtml;
                return (
                  <button
                    key={theme}
                    disabled={disabled}
                    onClick={() => { playClick(); setSelectedTheme(theme); }}
                    className={`py-1.5 px-0.5 rounded-lg border text-[9px] uppercase tracking-wider text-center transition ${selectedTheme === theme ? "border-spark bg-spark/10 text-spark" : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground disabled:opacity-30"}`}
                  >
                    {theme}
                  </button>
                );
              })}
            </div>

            <button
              onClick={triggerExport}
              className="w-full py-2 rounded-xl bg-gradient-spark text-primary-foreground font-semibold shadow-glow hover:opacity-95 transition mt-2 text-xs flex items-center justify-center gap-1.5"
            >
              <Icons.Download className="h-4 w-4" />
              <span>Export Website Bundle</span>
            </button>
          </div>
        </div>

        {/* Right Preview Panel */}
        <div className="space-y-4 flex flex-col h-[85vh]">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1"><Icons.Monitor className="h-3.5 w-3.5 text-spark" /> Interactive Preview (Simulated browser)</span>
            <span className="text-[9px] opacity-60 font-mono">Theme: {selectedTheme}</span>
          </div>

          {selectedTheme === "AI-Custom" && customHtml ? (
            <div className="flex-1 rounded-3xl border border-white/10 overflow-hidden bg-white/5 flex flex-col">
              <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-black/40 text-[10px]">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[9px] uppercase tracking-wider opacity-60 font-mono text-spark">http://localhost:3000/portfolio (AI CUSTOM LAYOUT)</div>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="rounded bg-spark/20 border border-spark/30 px-2 py-0.5 text-spark hover:bg-spark/30 transition text-[9px]"
                >
                  Code View
                </button>
              </div>
              <iframe
                title="AI Custom Portfolio Preview"
                srcDoc={getProcessedHtml()}
                className="flex-1 w-full bg-white border-0"
              />
            </div>
          ) : (
            <div className={`flex-1 rounded-3xl border p-6 overflow-y-auto flex flex-col justify-between transition-colors duration-500 ${styles.bg} ${styles.text}`} data-lenis-prevent>
              <div className="space-y-4">
                {/* Mock website header */}
                <div className="flex justify-between items-center pb-3 border-b border-current/10">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[9px] uppercase tracking-wider opacity-60 font-mono">http://localhost:3000/portfolio</div>
                  <div className="w-6" />
                </div>

                {/* Title Section */}
                <div className="text-center py-6">
                  <h1 className="text-2xl font-bold font-display tracking-tight">{fullName}</h1>
                  <p className={`text-xs font-semibold uppercase tracking-widest mt-1.5 ${styles.accent}`}>{focusTitle}</p>
                  <div className="flex justify-center gap-4 text-[10px] mt-2 opacity-85">
                    <span>{email}</span>
                    <span>{github}</span>
                    <span>{linkedin}</span>
                  </div>
                </div>

                {/* Skills section */}
                <div className={`p-4 rounded-2xl ${styles.card}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5">Core Technical Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.split(",").map(skill => skill.trim()).filter(Boolean).map(skill => (
                      <span key={skill} className={`px-2 py-0.5 rounded text-[10px] font-semibold ${styles.pill}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education section */}
                <div className={`p-4 rounded-2xl ${styles.card}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5">Education</h3>
                  <p className="text-xs leading-normal">{education}</p>
                </div>

                {/* Experience section */}
                <div className={`p-4 rounded-2xl ${styles.card}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5">Professional Experience</h3>
                  <p className="text-xs leading-normal">{experience}</p>
                </div>

                {/* Projects section */}
                <div className={`p-4 rounded-2xl ${styles.card}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5">Key Projects</h3>
                  <p className="text-xs leading-normal">{projects}</p>
                </div>

                {/* Achievements section */}
                <div className={`p-4 rounded-2xl ${styles.card}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5">Ecosystem Achievements</h3>
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                    {achievements.split(",").map(ach => ach.trim()).filter(Boolean).map((ach, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded-lg">
                        <Icons.Award className="h-3.5 w-3.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hobbies section */}
                <div className={`p-4 rounded-2xl ${styles.card}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5">Hobbies & Interests</h3>
                  <p className="text-xs leading-normal">{hobbies}</p>
                </div>
              </div>

              {/* Mock website footer */}
              <div className="text-center text-[9px] opacity-50 pt-4 border-t border-current/10 mt-6">
                © {new Date().getFullYear()} {fullName}. Built using ProjectSpark OS.
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Export Code Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-[540px] rounded-3xl border border-white/10 bg-card p-6 shadow-glow">
            <button onClick={() => setShowExportModal(false)} className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground transition">
              <Icons.X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-base font-bold text-foreground mb-2 flex items-center gap-2">
              <Icons.FileCode className="h-5 w-5 text-spark" /> Export HTML/CSS Code Bundle
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Paste this code inside an index.html file to launch your website on any static server.</p>
            
            <textarea
              readOnly
              value={getExportCode()}
              rows={12}
              className="w-full rounded-xl border border-white/10 bg-background/50 p-4 font-mono text-[10px] leading-relaxed text-spark outline-none"
            />

            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-foreground transition">
                Close
              </button>
              <button onClick={handleCopyCode} className="px-4.5 py-2 rounded-xl bg-gradient-spark text-primary-foreground font-semibold shadow-glow hover:opacity-95 transition text-xs flex items-center gap-1.5">
                <Icons.Copy className="h-4 w-4" />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </PageShell>
  );
}
