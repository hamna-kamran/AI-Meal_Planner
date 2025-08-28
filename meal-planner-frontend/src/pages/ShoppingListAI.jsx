import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./ShoppingListAI.css";

export default function ShoppingListAI() {
  const [dish, setDish] = useState("");
  const [items, setItems] = useState([]); 
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE || ""; 

  const fetchIngredients = async () => {
    if (!dish.trim()) return;
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/ai/ingredients`; 
      const res = await axios.post(url, { dishName: dish.trim() });
      const ing = (res.data?.ingredients || []).map((t) => ({ text: t, checked: false }));
      setItems(ing);
    } catch (e) {
      console.error("❌ Request failed:", e?.response?.data || e.message);
      const serverErr = e?.response?.data?.error || e.message || "Could not generate ingredients.";
      setError(`Server Error: ${serverErr}`);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (idx) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, checked: !it.checked } : it))
    );

  const remove = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const add = () => {
    const t = newItem.trim();
    if (!t) return;
    setItems((prev) => [...prev, { text: t, checked: false }]);
    setNewItem("");
  };

  const clearAll = () => setItems([]);

  const downloadTXT = () => {
    const content =
      `Shopping List for: ${dish || "Untitled Dish"}\n` +
      `----------------------------------------\n` +
      items.map((i) => `${i.checked ? "☑" : "☐"} ${i.text}`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(dish || "shopping-list").toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Shopping List${dish ? ` — ${dish}` : ""}`, 14, 16);
    doc.setFontSize(12);

    let y = 28;
    items.forEach((i, index) => {
      doc.rect(14, y - 4, 4, 4);
      if (i.checked) {
        doc.line(14, y - 4, 18, y);
        doc.line(18, y - 4, 14, y);
      }
      const text = doc.splitTextToSize(i.text, 170);
      doc.text(text, 22, y);
      y += 7 + (text.length - 1) * 6;

      if (y > 280 && index < items.length - 1) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${(dish || "shopping-list").toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div className="ai-list-container">
      <h2 className="ai-title">🛒 AI Shopping List</h2>

      <div className="ai-search">
        <input
          className="ai-input"
          placeholder="Type a dish, e.g., Chicken Biryani"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchIngredients()}
        />
        <button className="ai-btn primary" onClick={fetchIngredients} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && <div className="ai-error">{error}</div>}

      <div className="ai-actions">
        <input
          className="ai-input small"
          placeholder="Add custom item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="ai-btn" onClick={add}>Add</button>
        <div className="spacer" />
        <button className="ai-btn" onClick={downloadTXT} disabled={!items.length}>Download TXT</button>
        <button className="ai-btn" onClick={downloadPDF} disabled={!items.length}>Download PDF</button>
        <button className="ai-btn danger" onClick={clearAll} disabled={!items.length}>Clear</button>
      </div>

      <div className="ai-list">
        {items.length === 0 ? (
          <p className="ai-empty">No items yet. Generate a list above or add your own.</p>
        ) : (
          items.map((it, idx) => (
            <div key={idx} className={`ai-item ${it.checked ? "checked" : ""}`}>
              <label>
                <input type="checkbox" checked={it.checked} onChange={() => toggle(idx)} />
                <span>{it.text}</span>
              </label>
              <button className="ai-item-del" onClick={() => remove(idx)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
