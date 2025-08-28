const express = require("express");
const axios = require("axios");
const router = express.Router();

function safeParseIngredients(text) {
  try {
    const obj = JSON.parse(text);
    if (Array.isArray(obj.ingredients)) return obj.ingredients;
  } catch (_) {}
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const obj = JSON.parse(match[0]);
      if (Array.isArray(obj.ingredients)) return obj.ingredients;
    } catch (_) {}
  }
  const lines = text
    .split(/\r?\n/)
    .map(s => s.replace(/^[-*•\d.]+\s*/, "").trim())
    .filter(Boolean);
  return [...new Set(lines)];
}

async function callGroq(prompt) {
  const model = process.env.AI_MODEL || "llama-3.1-8b-instant";
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const res = await axios.post(
    url,
    {
      model,
      messages: [
        { role: "system", content: "Return ONLY JSON: {\"ingredients\":[\"...\"]}. No commentary." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 20000
    }
  );
  return res.data?.choices?.[0]?.message?.content || "";
}

async function callGemini(prompt) {
  const model = process.env.AI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                'Return ONLY JSON object like {"ingredients":["ingredient1","ingredient2"]} with no commentary.\n' +
                prompt
            }
          ]
        }
      ],
      generationConfig: { temperature: 0.2 }
    },
    { timeout: 20000 }
  );
  const parts = res.data?.candidates?.[0]?.content?.parts || [];
  return parts.map(p => p.text || "").join("");
}

router.post("/ingredients", async (req, res) => {
  try {
    const dishName = (req.body?.dishName || "").trim();
    if (!dishName) return res.status(400).json({ error: "Dish name is required" });

    const userPrompt = `Dish: "${dishName}". Only common grocery items, no quantities, no steps. Return exactly: {"ingredients":[...]} `;

    let raw = "";
    if ((process.env.AI_PROVIDER || "groq").toLowerCase() === "gemini") {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY missing" });
      }
      raw = await callGemini(userPrompt);
    } else {
      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: "GROQ_API_KEY missing" });
      }
      raw = await callGroq(userPrompt);
    }

    let ingredients = safeParseIngredients(raw)
      .map(s => s.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    ingredients = [...new Set(ingredients)]
      .map(i => i.replace(/\b\d+([./]\d+)?\s*(cup|tsp|tbsp|g|kg|ml|l|oz|ounce|pound|lb)s?\b/ig, "").trim())
      .filter(Boolean);

    if (ingredients.length === 0) {
      ingredients = ["onion", "garlic", "tomato", "salt", "pepper"];
    }

    res.json({ ingredients });
  } catch (err) {
    console.error("❌ AI API Error:", err?.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch AI response",
      details: err?.response?.data || err.message
    });
  }
});

module.exports = router;
