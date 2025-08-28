import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST" });

  const { prompt } = req.body;
  if (!prompt || !prompt.trim()) return res.status(400).json({ error: "Prompt required" });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful cooking assistant. Return a recipe (title, ingredients bullet list, steps). Keep output concise." },
          { role: "user", content: `Generate a recipe based on: ${prompt}. Provide title, ingredients (no quantities required), and steps.` }
        ],
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response?.data?.choices?.[0]?.message?.content || "";
    res.status(200).json({ recipe: text });
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch AI response", details: err.response?.data || err.message });
  }
}
