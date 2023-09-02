import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import backendUrl from "../configBackend";
// import workoutBackground from "../workoutBackground.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function toSignup() {
    navigate("/signup");
  }

  function login() {
    axios
      .post(`${backendUrl}/user/login`, { email, password })
      .then(({ data }) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/profile");
        } else {
          alert(data.msg);
        }
      });
  }

  return (
    <div className="homepage-container login-background">
      <h1 className="app-title">Workout Tracker</h1>
      <div className="flex-col input-button-container">
        <input
          type="email"
          placeholder="email"
          className="signup-login-input"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          className="signup-login-input"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="btn primary-btn"
          onClick={() => {
            login();
          }}
        >
          Login
        </button>
      </div>
      <div className="flex-col text-anchor-container ">
        <p className="description-text">If you do not have an account </p>
        <a
          className="signup-login-anchor"
          onClick={() => {
            toSignup();
          }}
        >
          {" "}
          Signup Here
        </a>
      </div>
    </div>
  );
}

export default Login;
