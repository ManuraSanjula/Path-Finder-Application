import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {

    const setCookie = (name, value, days) => {
      Cookies.set(name, value, {
        expires: days,
        path: '/', // Ensures the cookie is available on all paths of the domain
        sameSite: 'Strict', // Adjust based on your requirements: 'Lax', 'Strict', or 'None'
        secure: 'production', // Ensure secure attribute is true in production
      });
    };


    e.preventDefault();
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const data = {
        operation: "insert",
        key: email,
        value: password,
      };
      const response = await axios.post(
        "http://localhost:4000/signin",
        JSON.stringify({ email, password }),
        { headers }
      );
      if (response.data.token) {
        setCookie("user_jwt", response.data.token, 7);
      }
    } catch (error) {
      setError("Error signing up");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Signup</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Signup;