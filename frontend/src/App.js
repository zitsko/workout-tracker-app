import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";

function App() {
  return (
    <div>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
