import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import backendUrl from "../configBackend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const navigate = useNavigate();

  // function redirectToExerciseLibrary() {
  //   window.open("/exercise-library", "_blank");
  // }
  function redirectToExerciseLibrary() {
    const exerciseLibraryURL = `${window.location.origin}/exercise-library`;
    window.open(exerciseLibraryURL, "_blank");
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
        .post(`${backendUrl}/user/verify`, {
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
    axios.get(`${backendUrl}/workout/` + userId).then(({ data }) => {
      setWorkouts(data);
      setUpdatedWorkouts(new Array(data.length).fill(""));
    });
  }

  function addWorkout() {
    axios
      .post(`${backendUrl}/workout/`, {
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
      .delete(`${backendUrl}/workout/${workoutId}`)
      .then(() => {
        getMyWorkouts(user._id);
      })
      .catch((error) => {
        console.log("Error deleting workout:", error);
      });
  }

  function resetWorkouts(userId) {
    axios
      .delete(`${backendUrl}/workout/user/` + userId)
      .then(() => {
        console.log("Workouts reset successfully");
      })
      .catch((error) => {
        console.error("Error resetting workouts:", error);
      });
    setWorkouts([]);
    setUpdatedWorkouts([]);
  }

  function updateWorkout(workoutId, index) {
    const updatedTitle = updatedWorkouts[index];
    axios
      .put(`${backendUrl}/workout/${workoutId}`, { title: updatedTitle })
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
    <div className="homepage-container">
      <div className="flex-row profile-header ">
           <h1 className="profile-name text-title">
            Welcome {user.email}
        </h1>
        <button
          className="btn disconnect-btn"
          onClick={() => {
            disconnect();
          }}
        >
          <FontAwesomeIcon icon={faPowerOff} size="lg" />
        </button>
      </div>

      <p className="description-text">
        Do you want to set a workout routine to stay fit? Add your favorite
        exercises or workouts below to create a program that fits your needs!
        Need some inspiration?Check out our{" "}
        <a onClick={redirectToExerciseLibrary} className="library-link">
          Exercise Library!
        </a>
      </p>
      <div className="flex-row profile-input-button-container">
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
          className="btn primary-btn"
          onClick={() => {
            addWorkout();
          }}
        >
          <FontAwesomeIcon icon={faPlus} size="lg" />
         {" "}
          <FontAwesomeIcon icon={faDumbbell} size="lg" />
        </button>

        <button className="btn delete-btn" onClick={resetWorkouts}>
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </button>
      </div>

      <ul className="workout-list">
        {workouts.map((e, index) => (
          <li className="flex-row workout-item" key={e._id}>
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

            <button className="btn primary-btn" onClick={() => updateWorkout(e._id, index)}>
              
              <FontAwesomeIcon icon={faPencil} size="lg" />
            </button>

            <button className="btn delete-btn" onClick={() => deleteWorkout(e._id)}>
              
              <FontAwesomeIcon icon={faDeleteLeft} size="lg" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
