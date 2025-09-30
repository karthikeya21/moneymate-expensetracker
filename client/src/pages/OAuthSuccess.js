import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userString = params.get("user");

    if (token) {
      const user = JSON.parse(decodeURIComponent(userString));
      localStorage.setItem("moneymate-user", JSON.stringify({ token,user }));
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Signing you in...</div>;
}
