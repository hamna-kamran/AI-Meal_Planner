import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  return null; // nothing to show
}