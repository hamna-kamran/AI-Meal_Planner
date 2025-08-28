// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { OpenAI } = require("openai");
const { Groq } = require("groq-sdk");

// Import routes
const authRoutes = require("./routes/auth");
const mealPlanRoutes = require("./routes/MealPlan");
const aiRoutes = require("./routes/ai");

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:3000", // frontend
  credentials: true,
}));
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Recipe endpoint
app.post("/api/recipe", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Call Groq LLaMA-3 model
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: `Generate a recipe with: ${prompt}` }],
      model: "llama3-8b-8192", // free Groq model
    });

    const recipe = response.choices[0]?.message?.content?.trim();
    res.json({ recipe });
  } catch (err) {
    console.error("Groq API error:", err);
    res.status(500).json({ error: "Failed to generate recipe", details: err.message });
  }
});


// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
