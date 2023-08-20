import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import backendUrl from "../configBackend";


function Signup() {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  function toLogin() {
    navigate("/");
  }
    function signup(){
      axios.post(`${backendUrl}/user/signup`, {email,password}).then(({ data}) => {
        if(data.token) {
          localStorage.setItem("token",data.token);
          navigate("/profile")
        }else{
          alert(data.msg)
        }
    })
  }

  return ( 
    <div className="homepage-container">
    <h1 className="app-title">Workout Tracker</h1>
    <div className=" flex-col input-button-container">
      <input 
      type="email" 
      placeholder="email" 
      className="signup-login-input"
      onChange = {(e)=>{
        setEmail(e.target.value);
      }}
      />
      <input 
      type="password" 
      placeholder="password"
      className="signup-login-input"
      onChange = {(e)=>{
        setPassword(e.target.value)
      }}
      />
      <button
      className="btn primary-btn"
       onClick={()=>{
        signup();
      }}>
        Signup</button>
        </div>

      <div className="flex-col text-anchor-container description-text">
        <p>
          If you have an account {" "}
          </p>
          <a
          className="signup-login-anchor"
            onClick={() => {
              toLogin();
            }}
          >
            {" "}
            Login
          </a>
      </div>
     
    </div>
  );
}
  export default Signup;
  