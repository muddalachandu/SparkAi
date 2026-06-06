import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useRef, useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { useSceneStore } from "@/hooks/use-scene-store";
import { InfiniteCarousel } from "@/components/InfiniteCarousel";
import { playHover, playClick } from "@/lib/sounds";
import {
  Sparkles,
  Brain,
  Rocket,
  Code2,
  Compass,
  MessageSquare,
  GraduationCap,
  ArrowRight,
  Github,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProjectSpark — Generate ideas, learn anything, build with AI" },
      {
        name: "description",
        content:
          "The futuristic AI OS combining ChatGPT, GitHub, Coursera & Notion AI for students, developers and founders.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Sparkles,
    title: "Project Generator",
    desc: "AI-crafted, schema-validated project ideas across 10+ domains.",
  },
  {
    icon: Brain,
    title: "AI Mentor",
    desc: "Step-by-step build guidance with milestones and checklists.",
  },
  {
    icon: GraduationCap,
    title: "Study Guide",
    desc: "Personalized weekly roadmaps with mini-projects and quizzes.",
  },
  {
    icon: MessageSquare,
    title: "Universal Chatbot",
    desc: "Streaming AI chat with markdown, code highlighting and memory.",
  },
  {
    icon: Compass,
    title: "Roadmap Planner",
    desc: "Career timelines from junior to senior with skills & projects.",
  },
  {
    icon: Code2,
    title: "AI Project Builder",
    desc: "Folder structure, starter code, schemas and deployment guides.",
  },
];

const stats = [
  { n: "10+", l: "domains" },
  { n: "17", l: "modules" },
  { n: "∞", l: "ideas" },
  { n: "1", l: "OS" },
];

// Magnetic effect helper wrapper for CTAs
function Magnetic({ children }: { children: React.ReactElement }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    const reach = 100;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    if (distance < reach) {
      const strength = 0.35;
      setPosition({ x: distanceX * strength, y: distanceY * strength });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

// Framer motion variants for clean scroll-storytelling
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 14,
    },
  },
} as const;

function Landing() {
  const { scrollYProgress } = useScroll();
  const { setScene, setState } = useSceneStore();
  
  useEffect(() => {
    setScene("landing");
  }, [setScene]);
  
  // Dynamic 3D mapping mappings based on scroll progression
  const scaleVal = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [1.25, 1.6, 0.95, 1.4, 1.15]);
  const particlesVal = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [1.0, 1.6, 0.5, 1.3, 0.7]);
  const camZ = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [4.0, 3.4, 5.0, 4.2, 4.0]);
  const camY = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0.0, -0.4, 0.6, -0.2, 0.1]);
  const colorVal = useTransform(
    scrollYProgress, 
    [0, 0.35, 0.7, 1], 
    ["#c084fc", "#38bdf8", "#ec4899", "#818cf8"]
  );

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
      setState({
        coreScale: scaleVal.get(),
        particlesIntensity: particlesVal.get(),
        cameraPosition: [1.1 * (1 - latest), camY.get(), camZ.get()],
        glowColor: colorVal.get(),
      });
    });
    return () => unsub();
  }, [scrollYProgress, scaleVal, particlesVal, camY, camZ, colorVal, setState]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            onMouseEnter={playHover}
            onClick={playClick}
            className="hidden rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline-block transition-colors"
          >
            Sign in
          </Link>
          <Magnetic>
            <Link
              to="/login"
              onMouseEnter={playHover}
              onClick={playClick}
              className="rounded-xl bg-gradient-spark px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow block"
            >
              Get started
            </Link>
          </Magnetic>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 pt-12 pb-24 lg:grid-cols-2 lg:pt-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-spark animate-pulse" />
            Now with AI Mentor & threaded chat
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 max-w-2xl text-5xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl"
          >
            The AI operating system for{" "}
            <span className="text-gradient">builders &amp; learners</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Generate project ideas, learn any technology, and build production apps with an AI
            mentor — all from one futuristic workspace.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Link
                to="/generator"
                onMouseEnter={playHover}
                onClick={playClick}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-spark px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110"
              >
                Generate project ideas{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                to="/chat"
                onMouseEnter={playHover}
                onClick={playClick}
                className="rounded-2xl border border-border bg-card/50 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:border-spark/40 hover:bg-card block"
              >
                Talk with AI
              </Link>
            </Magnetic>
          </motion.div>
        </div>

        {/* 3D AI Orb Placeholder viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative aspect-square w-full max-w-[560px] mx-auto pointer-events-none"
        >
          {/* Allow global canvas to show through cleanly */}
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-spark opacity-25 blur-3xl" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="glass grid grid-cols-2 gap-6 rounded-3xl p-8 md:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.l}
              variants={cardVariants}
              className="text-center"
            >
              <div className="font-display text-4xl font-semibold text-gradient">{s.n}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {s.l}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Infinite technology & feature carousel */}
      <div className="relative z-10 my-8">
        <InfiniteCarousel />
      </div>

      {/* Features bento */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-semibold sm:text-5xl"
          >
            Everything you need to ship
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground"
          >
            Seven tools in one. Built for the AI-native era.
          </motion.p>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="mt-12 grid gap-4 md:grid-cols-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              className={`glass group rounded-3xl p-6 transition-shadow hover:shadow-glow ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-spark text-primary-foreground shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-semibold sm:text-5xl"
          >
            Simple pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground"
          >
            Start free. Upgrade when you ship.
          </motion.p>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {[
            { name: "Free", price: "$0", feats: ["10 ideas / month", "AI chat", "Basic mentor"] },
            {
              name: "Pro",
              price: "$12",
              feats: ["Unlimited ideas", "All AI models", "Roadmaps & guides", "Priority speed"],
              hot: true,
            },
            {
              name: "Team",
              price: "$29",
              feats: ["Everything in Pro", "Team workspaces", "Shared projects", "SSO"],
            },
          ].map((p) => (
            <motion.div
              key={p.name}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className={`glass relative rounded-3xl p-8 ${p.hot ? "ring-spark border-spark/40" : ""}`}
            >
              {p.hot && (
                <div className="absolute -top-3 left-6 rounded-full bg-gradient-spark px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="font-display text-lg">{p.name}</div>
              <div className="mt-2 font-display text-5xl font-semibold">
                {p.price}
                <span className="text-base text-muted-foreground">/mo</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-spark" />
                    {f}
                  </li>
                ))}
              </ul>
              <Magnetic>
                <Link
                  to="/login"
                  className={`mt-8 inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-medium ${p.hot ? "bg-gradient-spark text-primary-foreground shadow-glow" : "border border-border bg-card/50"} block text-center`}
                >
                  Get started
                </Link>
              </Magnetic>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 mx-auto max-w-3xl px-6 py-24">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-4xl font-semibold sm:text-5xl"
        >
          Frequently asked
        </motion.h2>
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mt-10 space-y-3"
        >
          {[
            [
              "Is it free?",
              "Yes — you can use ProjectSpark free with monthly limits. Pro unlocks unlimited generations.",
            ],
            [
              "What AI models?",
              "We default to fast Gemini & GPT models via the Lovable AI Gateway — no API keys required.",
            ],
            [
              "Can I export my projects?",
              "Yes — every generated idea can be saved, bookmarked and shared.",
            ],
          ].map(([q, a]) => (
            <motion.details
              key={q}
              variants={cardVariants}
              className="glass group rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                {q}
                <span className="text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </motion.details>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
          className="glass-strong relative overflow-hidden rounded-3xl p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-spark opacity-15" />
          <Rocket className="relative mx-auto h-10 w-10 text-spark" />
          <h2 className="relative mt-4 text-4xl font-semibold sm:text-5xl">
            Ready to spark something?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Join builders generating their next portfolio project right now.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Magnetic>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-spark px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <Logo />
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ProjectSpark — Built with Lovable.
          </div>
          <a href="https://github.com" className="text-muted-foreground hover:text-foreground">
            <Github className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
