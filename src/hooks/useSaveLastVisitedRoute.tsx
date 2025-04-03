import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useSaveLastVisitedRoute = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/login" && location.pathname !== "/logout") {
      localStorage.setItem("lastVisitedRoute", location.pathname);
    }
  }, [location.pathname]);
};

export default useSaveLastVisitedRoute;

