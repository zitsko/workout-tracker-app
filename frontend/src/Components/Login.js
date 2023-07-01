import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  function toSignup() {
    navigate("/signup");
  }

  function login(){
    axios
    .post("http://localhost:3636/user/login", {email,password})
    .then(({ data}) => {
      if(data.token) {
        localStorage.setItem("token",data.token);
        navigate("/profile")
      }else{
        alert(data.msg)
      }
  })
}

  return (
    <div className="signup-login-container">
      <h1 className="app-title">Workout Tracker</h1>
       <input 
      type="email" 
      placeholder="email" 
      onChange = {(e)=>{
        setEmail(e.target.value);
      }}
      />
      <input 
      type="password" 
      placeholder="password"
      onChange = {(e)=>{
        setPassword(e.target.value)
      }}
      />
       <button onClick={()=>{
        login();
      }}>Login</button>
      <p>
        If you do not have an account{" "}
        <a
          onClick={() => {
            toSignup();
          }}
        >
          {" "}
          Signup Here
        </a>
      </p>
    </div>
  );
}

export default Login;
