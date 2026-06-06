const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });

async function testOpenAI() {
  console.log("Testing OpenAI Key...");
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say ok" }],
        max_tokens: 5
      })
    });
    const data = await response.json();
    if (data.choices && data.choices[0]) {
      console.log("OpenAI success! Response:", data.choices[0].message.content.trim());
      return true;
    } else {
      console.error("OpenAI failed response:", data);
      return false;
    }
  } catch (e) {
    console.error("OpenAI error:", e.message);
    return false;
  }
}

async function testOpenRouter() {
  console.log("Testing OpenRouter Key...");
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://projectspark.dev",
        "X-Title": "ProjectSpark"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: "Say ok" }],
        max_tokens: 5
      })
    });
    const data = await response.json();
    if (data.choices && data.choices[0]) {
      console.log("OpenRouter success! Response:", data.choices[0].message.content.trim());
      return true;
    } else {
      console.error("OpenRouter failed response:", data);
      return false;
    }
  } catch (e) {
    console.error("OpenRouter error:", e.message);
    return false;
  }
}

async function testGroq() {
  console.log("Testing Groq Key...");
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: "Say ok" }],
        max_tokens: 5
      })
    });
    const data = await response.json();
    if (data.choices && data.choices[0]) {
      console.log("Groq success! Response:", data.choices[0].message.content.trim());
      return true;
    } else {
      console.error("Groq failed response:", data);
      return false;
    }
  } catch (e) {
    console.error("Groq error:", e.message);
    return false;
  }
}

async function runAll() {
  const o = await testOpenAI();
  const r = await testOpenRouter();
  const g = await testGroq();
  console.log("\nTest summary:");
  console.log("OpenAI Key works:", o);
  console.log("OpenRouter Key works:", r);
  console.log("Groq Key works:", g);
}

runAll();
