import { useEffect } from "react";
import { isTokenExpired } from "../functions/isTokenExpired";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const isExpired = isTokenExpired(token);
      if (isExpired) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        navigate("/home");
      }
    }
  }, [navigate]);
  return (
    <div>
      <div>teste</div>
    </div>
  );
}

export default Home;
