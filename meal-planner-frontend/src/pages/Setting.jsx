import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Setting.css"; // ensure this is imported somewhere globally (e.g., index.js) too

function applyTheme(theme) {
  // Use data attributes instead of replacing className (safer, doesn't wipe other classes)
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
}

function SettingsForm() {
  const [formData, setFormData] = useState({
    theme: "light",
    notifications: true,
  });
  const [loading, setLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // ✅ GET current user from backend
          const res = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const themeFromDb = res.data?.theme || localStorage.getItem("theme") || "light";
          const notificationsFromDb =
            typeof res.data?.notifications === "boolean"
              ? res.data.notifications
              : (localStorage.getItem("notifications") === "false" ? false : true);

          setFormData({
            theme: themeFromDb,
            notifications: notificationsFromDb,
          });

          applyTheme(themeFromDb);
          localStorage.setItem("theme", themeFromDb);
          localStorage.setItem("notifications", String(notificationsFromDb));
        } else {
          // Fall back to localStorage
          const storedTheme = localStorage.getItem("theme") || "light";
          const storedNotif = localStorage.getItem("notifications");
          const notifications = storedNotif === null ? true : storedNotif === "true";

          setFormData({ theme: storedTheme, notifications });
          applyTheme(storedTheme);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        const storedTheme = localStorage.getItem("theme") || "light";
        const storedNotif = localStorage.getItem("notifications");
        const notifications = storedNotif === null ? true : storedNotif === "true";
        setFormData({ theme: storedTheme, notifications });
        applyTheme(storedTheme);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (name === "theme") {
      applyTheme(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // ✅ FIXED endpoint (auth not users)
        await axios.put(
          "http://localhost:5000/api/auth/settings",
          {
            theme: formData.theme,
            notifications: formData.notifications,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      localStorage.setItem("theme", formData.theme);
      localStorage.setItem("notifications", String(formData.notifications));

      applyTheme(formData.theme);

      alert("✅ Settings updated successfully");
    } catch (error) {
      console.error("❌ Error updating settings:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errMsg = "Error updating settings";
      if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      } else if (error.response?.data) {
        errMsg = JSON.stringify(error.response.data);
      } else {
        errMsg = error.message;
      }

      alert(`❌ Failed: ${errMsg}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("theme");
      localStorage.removeItem("notifications");

      alert("✅ Account deleted. You will be logged out.");
      // window.location.href = "/login";
    } catch (error) {
      console.error("❌ Delete account error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errMsg = "Failed to delete account";
      if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      } else if (error.response?.data) {
        errMsg = JSON.stringify(error.response.data);
      } else {
        errMsg = error.message;
      }

      alert(`❌ Failed: ${errMsg}`);
    }
  };

  if (loading) {
    return (
      <div className="settings-container">
        <div className="settings-card">Loading…</div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">Settings</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          {/* Theme */}
          <div className="settings-option">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="settings-select"
            >
              <option value="light">Light</option>
              <option value="dim">Dim</option>
              <option value="blue">Blue</option>
              <option value="sepia">Sepia</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="settings-option">
            <label htmlFor="notifications">Enable Notifications</label>
            <input
              id="notifications"
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-save">Save Settings</button>

          <button type="button" className="btn-delete" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default SettingsForm;
