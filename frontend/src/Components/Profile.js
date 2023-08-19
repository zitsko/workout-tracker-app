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
  const [editIndex, setEditIndex] = useState(-1); // -1 indicates no edit mode

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
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this workout?"
    ); 
  
    if (shouldDelete) {
      axios
        .delete(`${backendUrl}/workout/${workoutId}`)
        .then(() => {
          getMyWorkouts(user._id);
        })
        .catch((error) => {
          console.log("Error deleting workout:", error);
        });
    }
  }

function resetWorkouts(userId) {
  const shouldReset = window.confirm(
    "Are you sure you want to reset all workouts?"
  ); 

  if (shouldReset) {
    axios
      .delete(`${backendUrl}/workout/user/` + userId)
      .then(() => {
        console.log("Workouts reset successfully");
        setWorkouts([]);
        setUpdatedWorkouts([]);
      })
      .catch((error) => {
        console.error("Error resetting workouts:", error);
      });
  }
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
    const shouldLogout = window.confirm(
      "You are about to leave ,are you sure?"
    );
    if (shouldLogout) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }

  return (
    <ul className="workout-list">
      {workouts.map((e, index) => (
        <li className="flex-row workout-item" key={e._id}>
          <span className="workout-title">{e.title}</span>

          {editIndex === index ? (
            <input
              type="text"
              placeholder="edit here"
              value={updatedWorkouts[index]}
              onChange={(e) => {
                const updatedArray = [...updatedWorkouts];
                updatedArray[index] = e.target.value;
                setUpdatedWorkouts(updatedArray);
              }}
              className="workout-input"
            />
          ) : (
            <span className="workout-title">{updatedWorkouts[index]}</span>
          )}

          <button
            className="btn primary-btn"
            onClick={() => {
              if (editIndex === index) {
                // Save updates
                updateWorkout(e._id, index);
              }
              setEditIndex(editIndex === index ? -1 : index);
            }}
          >
            <FontAwesomeIcon icon={faPencil} size="lg" />
          </button>

          <button className="btn delete-btn" onClick={() => deleteWorkout(e._id)}>
            <FontAwesomeIcon icon={faDeleteLeft} size="lg" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Profile;
