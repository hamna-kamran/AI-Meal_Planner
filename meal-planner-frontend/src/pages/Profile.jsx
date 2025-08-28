import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

export default function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const token = localStorage.getItem("token");

  // ✅ Fetch user profile
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData({ name: data.name, email: data.email, password: "" });
      })
      .catch((err) => console.error(err));
  }, [token]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Save profile updates
  const handleSave = () => {
    fetch("http://localhost:5000/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setEditMode(false);
        setFormData({ name: data.name, email: data.email, password: "" });
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Profile
          </Typography>

          {editMode ? (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password (leave blank to keep same)"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                style={{ marginRight: "10px", marginTop: "10px" }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setEditMode(false)}
                style={{ marginTop: "10px" }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1">
                <strong>Name:</strong> {user.name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {user.email}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setEditMode(true)}
                style={{ marginTop: "15px" }}
              >
                Edit Profile
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
