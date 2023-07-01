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
    <div className="profile-container">
      <h1 className="profile-name">Profile of {user.email}</h1>
      <p className="description-text">
        Do you want to set a workout routine to stay fit? Add your favorite
        exercises or workouts below to create a program that fits your needs!
      </p>
      <div className="profile-input-button-container">
        <input
          type="text"
          placeholder="Add workouts"
          value={workout}
          className="input-workout"
          onChange={(e) => {
            setWorkout(e.target.value);
          }}
        />
        <button
          className="profile-btn create-btn"
          onClick={() => {
            createWorkout();
          }}
        >
          Add Workout
        </button>
        <button
          className="profile-btn disconnect-btn"
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </button>
      </div>

      <ul className="workout-list">
        {workouts.map((e) => (
          <li className="workout-item">{e.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
