import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./Styles/Variables.css"
import "./Styles/Base.css"
import "./Styles/Signup-Login.css"
import "./Styles/Profile.css"
import "./Styles/ExerciseLibrary.css"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);