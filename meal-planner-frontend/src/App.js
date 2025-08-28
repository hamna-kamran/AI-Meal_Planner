import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MealPlanner from "./pages/MealPlanner";
import Recipe from "./pages/Recipe";
import ShoppingListAI from "./pages/ShoppingListAI";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Setting";
import Logout from "./pages/Logout";
import RecipeGenerator from "./pages/recipe-generator";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/recipes" element={<Recipe />} />
        <Route path="/shopping-list" element={<ShoppingListAI />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/recipe-generator" element={<RecipeGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
