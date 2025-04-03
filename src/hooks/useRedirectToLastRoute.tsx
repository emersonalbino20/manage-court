import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useRedirectToLastRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const lastRoute = localStorage.getItem("lastVisitedRoute");

    if (lastRoute && lastRoute !== "/login") {
      navigate(lastRoute);
    }
  }, []);
};

export default useRedirectToLastRoute;

