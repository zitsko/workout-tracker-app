import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [updatedWorkouts, setUpdatedWorkouts] = useState([]);

  const [user, setUser] = useState({
    _id: "",
    email: "",
  });

  function getMyWorkouts(userId) {
    axios.get("http://localhost:3636/todo/" + userId).then(({ data }) => {
      setWorkouts(data);
      setUpdatedWorkouts(new Array(data.length).fill(""));
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

  function addWorkout() {
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

  function deleteWorkout(workoutId) {
    axios
      .delete(`http://localhost:3636/todo/${workoutId}`)
      .then(() => {
        getMyWorkouts(user._id);
      })
      .catch((error) => {
        console.log("Error deleting workout:", error);
      });
  }

  function updateWorkout(workoutId, index) {
    const updatedTitle = updatedWorkouts[index];
    axios
      .put(`http://localhost:3636/todo/${workoutId}`, { title: updatedTitle })
      .then(() => {
        const updatedArray = [...updatedWorkouts];
        updatedArray[index] = "";
        setUpdatedWorkouts(updatedArray);
        getMyWorkouts(user._id);
      });
  }

  function disconnect() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-name">Profile of {user.email}</h1>
        <button
          className="disconnect-btn"
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </button>
      </div>

      <p className="description-text">
        Do you want to set a workout routine to stay fit? Add your favorite
        exercises or workouts below to create a program that fits your needs!
      </p>
      <div className="profile-input-button-container">
        <input
          type="text"
          placeholder="Create your routine..."
          value={workout}
          className="input-workout"
          onChange={(e) => {
            setWorkout(e.target.value);
          }}
        />
        <button
          className="add-btn"
          onClick={() => {
            addWorkout();
          }}
        >
          Add Workout
        </button>
      </div>

      <ul className="workout-list">
        {workouts.map((e, index) => (
          <li className="workout-item" key={e._id}>
            
            <span className="workout-title">{e.title}</span>

            <input
              type="text"
              placeholder="edit here"
              value={updatedWorkouts[index]}
              onChange={(e) => {
                const updatedArray = [...updatedWorkouts];
                updatedArray[index] = e.target.value;
                setUpdatedWorkouts(updatedArray);
              }}
              onClick={() => updateWorkout(e._id, index)}
              className="workout-input"
            />

            <button
              className="update-btn"
              onClick={() => updateWorkout(e._id, index)}
            >
              Update
            </button>

            <button
              className="delete-workout-btn"
              onClick={() => deleteWorkout(e._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
