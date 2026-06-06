const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "../.env");
  if (!fs.existsSync(envPath)) return;
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

async function run() {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    console.error("No XAI_API_KEY found");
    return;
  }
  console.log("Fetching X.ai models with key:", key.substring(0, 10) + "...");
  try {
    const res = await fetch("https://api.x.ai/v1/models", {
      headers: {
        "Authorization": `Bearer ${key}`
      }
    });
    if (!res.ok) {
      console.error("Status:", res.status);
      console.error("Response:", await res.text());
      return;
    }
    const data = await res.json();
    console.log("Models:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

run();
