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

async function testSDK() {
  console.log("Initializing OpenRouter with fetch interceptor...");
  try {
    const openrouter = createOpenAICompatible({
      name: "openrouter",
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        "HTTP-Referer": "https://projectspark.dev",
        "X-Title": "ProjectSpark",
      },
      fetch: async (url, init) => {
        if (init && init.body) {
          try {
            const body = JSON.parse(init.body);
            console.log("[Test Fetch Override] Intercepted outgoing request body model:", body.model);
            console.log("[Test Fetch Override] Old max_tokens value:", body.max_tokens);
            
            // Set max_tokens to 2000 tokens
            body.max_tokens = 2000;
            
            init.body = JSON.stringify(body);
            console.log("[Test Fetch Override] Forced max_tokens to 2000");
          } catch (e) {
            console.error("[Test Fetch Override] Error parsing body:", e);
          }
        }
        return fetch(url, init);
      }
    });

    console.log("Calling generateText...");
    const result = await generateText({
      model: openrouter("google/gemini-2.5-flash"),
      prompt: "Say ok",
    });
    console.log("SDK Success! Result:", result.text);
  } catch (e) {
    console.error("SDK Error:", e);
  }
}

testSDK();
