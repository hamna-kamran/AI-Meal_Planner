import React, { useState } from "react";
import "./Recipe.css";

export default function Recipe() {
  const [searchTerm, setSearchTerm] = useState("");

  const sampleRecipes = [
    { title: "Jalebi Paratha", url: "https://www.youtube.com/embed/0EIHyVBAD_I" },
    { title: "Chicken Biryani", url: "https://www.youtube.com/embed/95BCU1n268w" },
    { title: "Pasta Alfredo", url: "https://www.youtube.com/embed/inFbRiUU_Ls" },
    { title: "Lentil Soup", url: "https://www.youtube.com/embed/BR67V-U72s8" },
    { title: "Grilled Sandwich", url: "https://www.youtube.com/embed/mAZjgqk87gk" },
    { title: "Homemade Pizza", url: "https://www.youtube.com/embed/SjtrSP4dER8" },
    { title: "Chocolate Cake", url: "https://www.youtube.com/embed/EaljSnLrJW8" },
    { title: "Mango Smoothie", url: "https://www.youtube.com/embed/kv9Qux0IEno" },
    { title: "Vegetable Stir Fry", url: "https://www.youtube.com/embed/spDs_wzn8To" },
    { title: "Butter Chicken", url: "https://www.youtube.com/embed/a03U45jFxOI" },
    { title: "Pancakes", url: "https://www.youtube.com/embed/NCMKedZvnyI" },
    { title: "Tandoori Chicken", url: "https://www.youtube.com/embed/ChrCqT9u-Ss" },
    { title: "Paneer Tikka", url: "https://www.youtube.com/embed/t1sqEKm1WJE" },
    { title: "Vegetable Fried Rice", url: "https://www.youtube.com/embed/P2tIt4bZNmI" },
    { title: "Fries", url: "https://www.youtube.com/embed/yM9r4V6Mr2w" },
    { title: "Ramen", url: "https://www.youtube.com/embed/EZ0PngUIGU4" },
  ];

  const filteredRecipes = sampleRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recipe-page">
      <h1 className="recipe-heading">🍳 Recipe Videos</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="recipe-grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, index) => (
            <div key={index} className="recipe-card">
              <div className="card-header">{recipe.title}</div>
              <iframe
                src={recipe.url}
                title={recipe.title}
                className="recipe-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))
        ) : (
          <div className="no-results">
            ❌ No recipes found for "<b>{searchTerm}</b>"
          </div>
        )}
      </div>
    </div>
  );
}
