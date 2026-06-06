const fs = require("fs");
const path = require("path");
const { createOpenAICompatible } = require("@ai-sdk/openai-compatible");
const { createGoogleGenerativeAI } = require("@ai-sdk/google");
const { createAnthropic } = require("@ai-sdk/anthropic");
const { createCohere } = require("@ai-sdk/cohere");
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

async function testProvider(name, model) {
  console.log(`Testing provider: ${name}...`);
  try {
    const result = await generateText({
      model,
      prompt: "Say ok",
      maxTokens: 5,
    });
    console.log(`✅ Provider ${name} succeeded! Response: "${result.text.trim()}"`);
    return true;
  } catch (e) {
    console.error(`❌ Provider ${name} failed:`, e.message);
    return false;
  }
}

async function runTests() {
  const results = {};

  // 1. Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
      results.gemini = await testProvider("google-gemini", google("gemini-2.5-flash"));
    } catch (e) {
      console.error("Gemini init failed:", e.message);
    }
  }

  // 2. OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = createOpenAICompatible({
        name: "openai",
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: "https://api.openai.com/v1",
      });
      results.openai = await testProvider("openai", openai("gpt-4o-mini"));
    } catch (e) {
      console.error("OpenAI init failed:", e.message);
    }
  }

  // 3. Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      results.anthropic = await testProvider("anthropic", anthropic("claude-3-5-sonnet-latest"));
    } catch (e) {
      console.error("Anthropic init failed:", e.message);
    }
  }

  // 4. X.ai
  if (process.env.XAI_API_KEY) {
    try {
      const xai = createOpenAICompatible({
        name: "xai",
        apiKey: process.env.XAI_API_KEY,
        baseURL: "https://api.x.ai/v1",
      });
      results.xai = await testProvider("xai", xai("grok-2"));
    } catch (e) {
      console.error("X.ai init failed:", e.message);
    }
  }

  // 5. Cohere
  if (process.env.COHERE_API_KEY) {
    try {
      const cohere = createCohere({ apiKey: process.env.COHERE_API_KEY });
      results.cohere = await testProvider("cohere", cohere("command-r-08-2024"));
    } catch (e) {
      console.error("Cohere init failed:", e.message);
    }
  }

  // 6. OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const openrouter = createOpenAICompatible({
        name: "openrouter",
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        fetch: async (url, init) => {
          if (init && init.body) {
            try {
              const body = JSON.parse(init.body);
              body.max_tokens = 5;
              init.body = JSON.stringify(body);
            } catch {}
          }
          return fetch(url, init);
        }
      });
      results.openrouter = await testProvider("openrouter", openrouter("google/gemini-2.5-flash"));
    } catch (e) {
      console.error("OpenRouter init failed:", e.message);
    }
  }

  // 7. Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const groq = createOpenAICompatible({
        name: "groq",
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
      });
      results.groq = await testProvider("groq", groq("llama-3.1-8b-instant"));
    } catch (e) {
      console.error("Groq init failed:", e.message);
    }
  }

  console.log("\nSummary of all keys:", results);
}

runTests();
