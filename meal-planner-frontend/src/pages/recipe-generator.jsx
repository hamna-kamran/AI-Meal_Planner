// pages/recipe-generator.jsx
import { useState } from "react";

export default function RecipeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
  if (!prompt.trim()) return setError("⚠️ Please enter some ingredients or a prompt.");
  
  setLoading(true);
  setError("");
  setRecipe("");

  try {
    const res = await fetch("http://localhost:5000/api/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    let data;
    try {
      data = await res.json();
    } catch (jsonError) {
      throw new Error("❌ Invalid JSON response from backend. The server might have crashed.");
    }

    if (!res.ok) {
      console.error("❌ Backend error:", data);
      throw new Error(
        `Backend error: ${data.error || "Unknown error"} ${
          data.details ? `→ ${JSON.stringify(data.details)}` : ""
        }`
      );
    }

    if (!data.recipe) {
      throw new Error("❌ No recipe returned from backend. Check your AI integration.");
    }

    setRecipe(data.recipe);
  } catch (e) {
    console.error("❌ Frontend catch error:", e);
    setError(
      `Something went wrong:\n${
        e.message || "Unknown error"
      }\n\n💡 Tips:\n- Check if backend is running (port 5000)\n- Verify your API key\n- See console for more details`
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={{ maxWidth: 900, margin: "36px auto", padding: 16 }}>
      <h1>🍽️ Recipe Generator (AI)</h1>
      <p>Enter ingredients or a short prompt (e.g. “I have chicken, tomatoes, rice”) and click Generate.</p>

      <textarea
        rows={4}
        style={{ width: "100%", padding: 12, fontSize: 16 }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. I have chicken, tomatoes, and onions — suggest a recipe"
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={handleGenerate} disabled={loading} style={{ padding: "10px 18px", background: "#1976d2", color: "white", border: "none", borderRadius: 6 }}>
          {loading ? "Generating..." : "Generate Recipe"}
        </button>
      </div>

      {error && <div style={{ color: "crimson", marginTop: 12 }}>{error}</div>}

      {recipe && (
        <div style={{ marginTop: 20, whiteSpace: "pre-wrap", background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
          <h2>Generated Recipe</h2>
          <div>{recipe}</div>
        </div>
      )}
    </div>
  );
}
