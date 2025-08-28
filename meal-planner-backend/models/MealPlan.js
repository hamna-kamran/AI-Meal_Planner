// models/MealPlan.js
const mongoose = require("mongoose");

const DaySchema = new mongoose.Schema({
  Breakfast: { type: String, default: "" },
  Lunch: { type: String, default: "" },
  Dinner: { type: String, default: "" },
}, { _id: false });

const MealPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weekStart: { type: Date, required: true }, // Monday of that week
    plan: {
      Monday:   { type: DaySchema, default: () => ({}) },
      Tuesday:  { type: DaySchema, default: () => ({}) },
      Wednesday:{ type: DaySchema, default: () => ({}) },
      Thursday: { type: DaySchema, default: () => ({}) },
      Friday:   { type: DaySchema, default: () => ({}) },
      Saturday: { type: DaySchema, default: () => ({}) },
      Sunday:   { type: DaySchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

// Make sure one document per user per week
MealPlanSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

module.exports = mongoose.model("MealPlan", MealPlanSchema);
