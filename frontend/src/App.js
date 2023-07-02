import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import ExerciseLibrary from "./Components/ExerciseLibrary"

function App() {
  return (
    <div>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/exercise-library" element={<ExerciseLibrary />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
