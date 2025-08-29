import React from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom"; // ✅ FIXED

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Welcome Line */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Welcome to Your Dashboard 🎉</h1>
        <p className="text-muted fs-5">
          Manage your meal plans and explore all features here.
        </p>
      </div>

      {/* Cards Section */}
      <Row className="g-4">
        <Col md={6}>
          <Card
            as={Link} // ✅ use React Router Link
            to="/recipe-generator"
            className="shadow-lg text-center p-4"
            style={{
              height: "200px",
              background: "#FFB6C1",
              borderRadius: "15px",
              cursor: "pointer",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Card.Body>
              <h3 className="fw-bold">🍽 Recipe Generator</h3>
              <p>Plan and customize your meals with ease.</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
  as={Link} // ✅ use React Router Link
  to="/shopping-list"
  className="shadow-lg text-center p-4"
  style={{
    height: "200px",
    background: "#87CEFA",
    borderRadius: "15px",
    cursor: "pointer",
    textDecoration: "none",
    color: "inherit",
  }}
>
  <Card.Body>
    <h3 className="fw-bold">📋 Grocery List</h3>
    <p>Generate and manage your shopping list.</p>
  </Card.Body>
</Card>

        </Col>

        <Col md={6}>
          <Link to="/meal-planner" style={{ textDecoration: "none" }}>
  <Card
    className="shadow-lg text-center p-4"
    style={{
      height: "200px",
      background: "#90EE90",
      borderRadius: "15px",
    }}
  >
    <Card.Body>
      <h3 className="fw-bold">🧑‍🍳 Weekly Meal Planner</h3>
      <p>Discover and save your favorite recipes.</p>
    </Card.Body>
  </Card>
</Link>
        </Col>

        <Col md={6}>
          <Card
            className="shadow-lg text-center p-4"
            style={{
              height: "200px",
              background: "#FFD700",
              borderRadius: "15px",
            }}
          >
            <Card.Body>
              <h3 className="fw-bold">📊 Abhi socha nai</h3>
              <p>Track your progress and meal statistics.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
