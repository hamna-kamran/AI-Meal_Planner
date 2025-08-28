import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];
const meals = ["Breakfast", "Lunch", "Dinner"];

export default function MealPlanner() {
  const [mealPlan, setMealPlan] = useState({});
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch all saved plans
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/meal-plans", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 👈 send token
        },
      });
      setSavedPlans(res.data);
    } catch (err) {
      console.error("Error fetching plans:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // ✅ Update state on typing
  const handleChange = (day, meal, value) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value,
      },
    }));
  };

  // ✅ Save or Update in DB
  const handleSave = async () => {
    try {
      if (editingId) {
        // 🔄 Update existing plan
        await axios.put(
          `http://localhost:5000/api/meal-plans/${editingId}`,
          { mealPlan },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("✅ Meal plan updated!");
      } else {
        // 💾 Save new plan
        await axios.post(
          "http://localhost:5000/api/meal-plans",
          { mealPlan },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert("✅ Meal plan saved!");
      }
      setMealPlan({});
      setEditingId(null);
      fetchPlans();
    } catch (err) {
      console.error("Error saving plan:", err.response?.data || err.message);
      alert(`❌ Could not save plan: ${err.response?.data?.message || err.message}`);
    }
  };

  // ✅ Delete plan
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/meal-plans/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPlans();
    } catch (err) {
      console.error("Error deleting plan:", err.response?.data || err.message);
    }
  };

  // ✅ Edit plan
  const handleEdit = (plan) => {
    setMealPlan(plan.plan);
    setEditingId(plan._id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 scroll to form
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">🍴 Weekly Meal Planner</h2>

      {/* Save / Update Button */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <button className="btn btn-success" onClick={handleSave}>
          {editingId ? "🔄 Update Plan" : "💾 Save This Week"}
        </button>
        {editingId && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              setMealPlan({});
              setEditingId(null);
            }}
          >
            ❌ Cancel Edit
          </button>
        )}
      </div>

      {/* Planner Grid */}
      <div className="row">
        {daysOfWeek.map((day) => (
          <div key={day} className="col-md-4 mb-3">
            <div className="card shadow-lg">
              <div className="card-body">
                <h4 className="text-center">{day}</h4>
                {meals.map((meal) => (
                  <div key={meal} className="mb-2">
                    <label className="fw-bold">{meal}:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Enter ${meal}`}
                      value={mealPlan[day]?.[meal] || ""}
                      onChange={(e) => handleChange(day, meal, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Saved Plans */}
      <div className="mt-5">
        <h3 className="fw-bold">📌 Saved Meal Plans</h3>
        {loading ? (
          <p>Loading...</p>
        ) : savedPlans.length === 0 ? (
          <p className="text-muted">No saved plans yet.</p>
        ) : (
          savedPlans.map((plan) => (
            <div key={plan._id} className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>
                    🗓 Week of{" "}
                    {new Date(plan.weekStart).toLocaleDateString("en-GB")}
                  </h5>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(plan)}
                    >
                      ✏ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(plan._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-success">
                      <tr>
                        <th>Day</th>
                        {meals.map((meal) => (
                          <th key={meal}>{meal}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {daysOfWeek.map((day) => (
                        <tr key={day}>
                          <td className="fw-bold">{day}</td>
                          {meals.map((meal) => (
                            <td key={meal}>
                              {plan.plan?.[day]?.[meal] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
