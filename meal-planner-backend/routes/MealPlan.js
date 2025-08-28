// routes/MealPlan.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/AuthMiddleware");
const MealPlan = require("../models/MealPlan");

// Monday as the start of week
function getWeekStart(dateLike) {
  const d = new Date(dateLike);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // Sun=0..Sat=6
  const diff = (day === 0 ? -6 : 1) - day; // move to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

// Initialize an empty plan shape
function emptyPlan() {
  const base = { Breakfast: "", Lunch: "", Dinner: "" };
  return {
    Monday:    { ...base },
    Tuesday:   { ...base },
    Wednesday: { ...base },
    Thursday:  { ...base },
    Friday:    { ...base },
    Saturday:  { ...base },
    Sunday:    { ...base },
  };
}

/**
 * CREATE or UPSERT this week’s plan
 * body: { mealPlan: { Monday: {Breakfast, Lunch, Dinner}, ... } }
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { mealPlan } = req.body;
    if (!mealPlan) return res.status(400).json({ message: "mealPlan is required" });

    const weekStart = getWeekStart(new Date());

    const sanitized = { ...emptyPlan(), ...mealPlan };
    // ensure each day exists and fields exist
    for (const day of Object.keys(sanitized)) {
      sanitized[day] = {
        Breakfast: sanitized[day]?.Breakfast || "",
        Lunch:     sanitized[day]?.Lunch     || "",
        Dinner:    sanitized[day]?.Dinner    || "",
      };
    }

    const plan = await MealPlan.findOneAndUpdate(
      { userId: req.user.id, weekStart },
      { $set: { plan: sanitized } },
      { new: true, upsert: true }
    );

    res.status(201).json(plan);
  } catch (err) {
    console.error("Create/Upsert MealPlan error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE by id
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { mealPlan } = req.body;
    if (!mealPlan) return res.status(400).json({ message: "mealPlan is required" });

    const sanitized = { ...emptyPlan(), ...mealPlan };
    for (const day of Object.keys(sanitized)) {
      sanitized[day] = {
        Breakfast: sanitized[day]?.Breakfast || "",
        Lunch:     sanitized[day]?.Lunch     || "",
        Dinner:    sanitized[day]?.Dinner    || "",
      };
    }

    const updated = await MealPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { plan: sanitized } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update MealPlan error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * READ all plans for user (newest first)
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const plans = await MealPlan.find({ userId: req.user.id }).sort({ weekStart: -1 });
    res.json(plans);
  } catch (err) {
    console.error("Get MealPlans error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE by id
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await MealPlan.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete MealPlan error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
