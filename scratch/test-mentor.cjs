const fs = require("fs");
const path = require("path");
const { createOpenAICompatible } = require("@ai-sdk/openai-compatible");
const { generateText } = require("ai");

function loadEnv() {
  const envPath = path.join(__dirname, "../.env");
  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

loadEnv();

const SYSTEM = `Return ONLY valid JSON. Do not include markdown. Do not wrap in triple backticks. Do not include any explanation. All fields are mandatory.`;

async function test() {
  const openrouter = createOpenAICompatible({
    name: "openrouter",
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    fetch: async (url, init) => {
      if (init && init.body) {
        try {
          const body = JSON.parse(init.body);
          body.max_tokens = 2000;
          init.body = JSON.stringify(body);
        } catch {}
      }
      return fetch(url, init);
    }
  });

  const prompt = `You are an expert AI mentor. Build a structured learning plan as JSON.

Topic: System Design
Learner level: Beginner
Goal: Learn System Design

JSON shape:
{
  "topic": string,
  "overview": string,
  "prerequisites": string[] (3-6),
  "concepts": [{ "name": string, "explanation": string, "example": string }] (5-8 concepts),
  "practiceTasks": string[] (5-8),
  "nextSteps": string[] (3-5),
  "estimatedHours": number
}`;

  console.log("Generating plan via OpenRouter...");
  try {
    const result = await generateText({
      system: SYSTEM,
      model: openrouter("google/gemini-2.5-flash"),
      prompt,
    });
    console.log("RAW Output from OpenRouter:", result.text);
    
    // Test parsing
    const t = result.text.trim();
    let clean = t;
    if (t.startsWith("```")) {
      clean = t.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    }
    const first = clean.indexOf("{");
    const last = clean.lastIndexOf("}");
    if (first >= 0 && last > first) clean = clean.slice(first, last + 1);
    
    const parsed = JSON.parse(clean);
    console.log("Parsed successfully!", parsed);
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
