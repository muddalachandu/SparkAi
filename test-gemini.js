const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function run() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const names = data.models.map(m => m.name);
    console.log("Available models:", names);
  } catch (error) {
    console.error("Request failed:", error);
  }
}

run();
