import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./styles.css"
import { Link, useNavigate } from "react-router-dom";

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
      const response = await axios.post(
        "http://localhost:4000/signin",
        JSON.stringify({ email, password }),
        { headers }
      );
      if (response.data.token) {
        setCookie("user_jwt", response.data.token, 7);
        const token = Cookies.get("user_jwt");
        if (token) {
          navigate('/');
        }
      }
    } catch (error) {
      setError("Error signing up");
    }
  };

  return (
      <div className="bg-[#0e2a36] flex flex-col justify-center items-center h-screen w-full fixed z-[100]">
        <form className="flex shadow-2xl flex-col justify-center rounded-lg items-center p-10 backdrop-blur-lg"
              onSubmit={handleSignup}>
          <h2 className="text-white text-4xl font-semibold my-5">Map Navigator Sign Up</h2>
          <input className="border-black space-y-4  rounded border-2 px-10 py-2 mx-10 my-2"
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Email"
                 required
          />
          <input className="border-black rounded border-2 px-10 py-2 mx-10 my-2"
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Password"
                 required
          />
          <button className="text-black bg-white rounded-lg text-xl m-5 px-10 py-2 font-semibold" type="submit">Sign Up
          </button>
          <p className="bg-transparent text-white text-md font-semibold">Already have an account?
            <Link to="/login" className="text-blue-600 underline font-semibold"> Sign In</Link></p>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
  );
};

export default Signup;
