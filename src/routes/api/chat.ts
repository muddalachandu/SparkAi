import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { convertToModelMessages, type UIMessage } from "ai";
import { streamTextResilient } from "@/lib/ai-gateway";

type Body = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as Body;
        if (!Array.isArray(messages)) {
          return new Response("messages required", { status: 400 });
        }

        try {
          const result = await streamTextResilient({
            system:
              "You are ProjectSpark AI — a brilliant, encouraging mentor for students, developers, and engineers. Help with project ideas, learning roadmaps, code, and architecture. Use markdown with code blocks when helpful.",
            messages: await convertToModelMessages(messages as UIMessage[]),
            abortSignal: request.signal,
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (error) {
          console.warn("[api/chat] LLM streaming failed, falling back to mock response:", error);
          
          let lastUserMessage = "";
          try {
            const userMsgs = (messages as any[]).filter(m => m.role === "user");
            const lastMsg = userMsgs[userMsgs.length - 1];
            if (lastMsg) {
              if (typeof lastMsg.content === "string" && lastMsg.content) {
                lastUserMessage = lastMsg.content;
              } else if (Array.isArray(lastMsg.parts)) {
                lastUserMessage = lastMsg.parts
                  .filter((p: any) => p && p.type === "text")
                  .map((p: any) => p.text)
                  .join("\n");
              }
            }
          } catch (e) {
            console.error("[api/chat] error parsing user message:", e);
          }

          let reply = "";
          const text = lastUserMessage.toLowerCase();
          
          if (text.includes("hello") || text.includes("hi ") || text === "hi" || text.includes("hey")) {
            reply = `Hello! I am ProjectSpark AI, your developer growth mentor. 🚀\n\nHow can I help you today? Ask me about:\n1. **Interactive Roadmaps** in the Roadmap Planner.\n2. **LeetCode Interview questions** from 650+ companies.\n3. **Free programming reference books** & CLI cheat sheets.\n4. **Build Your Own X challenges** for building databases, Git, or Web Servers.\n5. **Portfolio Website Builder** from your resume.`;
          } else if (text.includes("roadmap") || text.includes("curriculum") || text.includes("study plan")) {
            reply = `You can explore our **Roadmap Planner** to design custom learning paths for Web Dev, AI/ML, Cybersecurity, Cloud, and more! \n\nEach roadmap node lets you generate structured study plans, solve practice tasks, take quizzes, and access free textbooks. Tasks containing keywords (like Git or SQLite) will show a special badge linking you directly to practical **Build Your Own X** coding guides!`;
          } else if (text.includes("interview") || text.includes("leetcode") || text.includes("company")) {
            reply = `Our **Interview Prep** section compiles real interview questions from over 650+ tech companies (like Google, Amazon, Netflix, Citadel) loaded dynamically from LeetCode.\n\nYou can filter by company and select timeframes (Last 30 Days, Last 6 Months, or All Time) to see the most frequent problems. Click any problem to open it directly on LeetCode!`;
          } else if (text.includes("book") || text.includes("textbook") || text.includes("secret knowledge")) {
            reply = `Our **Books & Docs Hub** gives you:\n1. **Free Programming Books:** Over 2,200+ curated programming textbooks across all major languages and frameworks.\n2. **Secret Knowledge CLI:** A cheatsheet reference of security tools, one-liner bash utilities, and Docker guides.\n\nRecommended books will also show up dynamically in your Roadmap Node Drawers under the Resources tab!`;
          } else if (text.includes("build") || text.includes("byox") || text.includes("challenge") || text.includes("redis") || text.includes("git")) {
            reply = `In **Build Your Own X**, you can:\n1. **Build Projects:** Follow structured templates in Go, Rust, Python, or Node.js to build Redis, Git, SQLite, or a DNS server from scratch.\n2. **Dynamic Guides:** Browse, filter, and search a full dynamic catalog of step-by-step guides parsed directly from the popular CodeCrafters list.\n3. **Earn XP:** Check off implementation milestones to claim gamified experience points!`;
          } else if (text.includes("portfolio") || text.includes("resume") || text.includes("template")) {
            reply = `Our **Portfolio Builder** lets you paste or drag-and-drop a resume to parse your contact info, education, skills, experience, and hobbies automatically. \n\nYou can preview your website in three high-end templates (Cyber, Retro, Minimalist), or use the **AI Custom Style Generator** to create a custom HTML page from a style prompt!`;
          } else {
            reply = `I am ProjectSpark AI, your virtual pairing partner! 💻\n\nI am currently running in offline/resilient mode because the external LLM provider keys are offline or unconfigured. \n\nHowever, you can still fully use all of ProjectSpark's core interactive modules:\n- 🗺️ **Roadmaps:** Choose a node and complete study tasks.\n- 🎓 **Study Guide:** Generate curriculum schedules.\n- 💻 **Build Your Own X:** Build databases, Git, or Web Servers.\n- 🏢 **Interview Prep:** Solve company-wise LeetCode problems.\n- 📚 **Books Hub:** Read thousands of free programming books.\n- 💼 **Portfolio Builder:** Scan resumes and export HTML web designs.`;
          }

          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            async start(controller) {
              const chunks = reply.match(/.{1,8}/g) || [reply];
              for (const chunk of chunks) {
                const line = `0:${JSON.stringify(chunk)}\n`;
                controller.enqueue(encoder.encode(line));
                await new Promise((r) => setTimeout(r, 15));
              }
              controller.close();
            },
          });
          
          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "x-vercel-ai-data-stream": "v1",
            },
          });
        }
      },
    },
  },
});
