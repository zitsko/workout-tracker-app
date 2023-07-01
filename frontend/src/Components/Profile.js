
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState("");
  const [workouts, setWorkouts] = useState([]);

  const [user, setUser] = useState({
    _id: "",
    email: "",
  });

  function getMyWorkouts(userId) {
    axios.get("http://localhost:3636/todo/" + userId).then(({ data }) => {
      setWorkouts(data);
    });
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .post("http://localhost:3636/user/verify", {
          token: localStorage.getItem("token"),
        })
        .then(({ data }) => {
          if (data._id) {
            setUser(data);
            getMyWorkouts(data._id);
          } else {
            navigate("/");
          }
        });
    } else {
      navigate("/");
    }
  }, []);

  function createWorkout() {
    axios
      .post("http://localhost:3636/todo/", {
        title: workout,
        userId: user._id,
      })
      .then(() => {
        setWorkout("");
        getMyWorkouts(user._id);
      });
  }

  function disconnect() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div>
      <button
        onClick={() => {
          disconnect();
        }}
      >
        Disconnect
      </button>
      <h1>Profile of {user.email}</h1>
      <input
        type="text"
        placeholder="workout"
        value={workout}
        onChange={(e) => {
          setWorkout(e.target.value);
        }}
      />
      <button
        onClick={() => {
          createWorkout();
        }}
      >
        Add Workout
      </button>
      <ul>
        {workouts.map((e) => (
          <li>{e.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;