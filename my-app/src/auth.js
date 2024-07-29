import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = Cookies.get("user_jwt");
    if (token) {
      axios.post("http://localhost:4000/verify-token", { token })
        .then(response => {
          if (!response.data.valid) {
            Cookies.remove("user_jwt");
            setIsAuthenticated(false); // Ensure state is updated
          } else {
            setIsAuthenticated(true);
          }
        })
        .catch(error => {
          Cookies.remove("user_jwt");
          setIsAuthenticated(false); // Ensure state is updated
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;
