import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  function redirectToExerciseLibrary() {
    window.open("/exercise-library", "_blank");
  }

  const [workout, setWorkout] = useState("");
  const [workouts, setWorkouts] = useState([]);


  const [updatedWorkouts, setUpdatedWorkouts] = useState([]);
 


  const [user, setUser] = useState({
    _id: "",
    email: "",
  });

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

  function getMyWorkouts(userId) {
    axios.get("http://localhost:3636/workout/" + userId)
    .then(({ data }) => {
      setWorkouts(data);
      setUpdatedWorkouts(new Array(data.length).fill(""));
    });
  }

  function addWorkout() {
    axios
      .post("http://localhost:3636/workout/", {
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
      .delete(`https://workout-tracker-api-har1.onrender.com/workout/${workoutId}`)
      .then(() => {
        getMyWorkouts(user._id);
      })
      .catch((error) => {
        console.log("Error deleting workout:", error);
      });
  }

  function resetWorkouts(userId)  {
    axios
    .delete("http://localhost:3636/workout/user/" + userId)
    .then(() => {
      console.log("Workouts reset successfully");
    })
    .catch((error) => {
      console.error("Error resetting workouts:", error);
    });
  setWorkouts([]);
  setUpdatedWorkouts([]);
};


  function updateWorkout(workoutId, index) {
    const updatedTitle = updatedWorkouts[index];
    axios
      .put(`http://localhost:3636/workout/${workoutId}`, { title: updatedTitle })
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
        Need some inspiration?Check out our  <a onClick={redirectToExerciseLibrary} className="library-link" >Exercise Library!</a> 
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

        <button className="reset-btn" onClick={resetWorkouts}>
    Reset Workouts
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

