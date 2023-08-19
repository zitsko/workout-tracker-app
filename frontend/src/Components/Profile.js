import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import backendUrl from "../configBackend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPowerOff,
  faPlus,
  faDumbbell,
  faTrash,
  faPencil,
  faCheck,
  faDeleteLeft,
} from "@fortawesome/free-solid-svg-icons";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);// -1 indicates no edit mode
  const [originalWorkout, setOriginalWorkout] = useState('');
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
    <div className="homepage-container">
      <div className="flex-row profile-header ">
        <h1 className="profile-name text-title">Welcome {user.email}</h1>
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
          placeholder={
            isEditing ? "Edit your routine..." : "Create your routine..."
          }
          value={isEditing ? updatedWorkouts[editIndex] : workout}
          className="border-bottom-input input-workout"
          onChange={(e) => {
            if (isEditing) {
              const updatedArray = [...updatedWorkouts];
              updatedArray[editIndex] = e.target.value;
              setUpdatedWorkouts(updatedArray);
            } else {
              setWorkout(e.target.value);
            }
          }}
        />

        <button
          className="btn primary-btn"
          onClick={() => {
            if (isEditing) {
              updateWorkout(workouts[editIndex]._id, editIndex);
              setEditIndex(-1);
            } else {
              addWorkout();
            }
            setIsEditing(false);
          }}
        >
          <FontAwesomeIcon icon={isEditing ? faCheck : faPlus} size="lg" />{" "}
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

            <button
              className="btn primary-btn"
              onClick={() => {
                if (isEditing && editIndex === index) {
                  updateWorkout(workouts[editIndex]._id, editIndex);
                  setEditIndex(-1);
                } else {
                  setIsEditing(true);
                  setEditIndex(index);
                  setWorkout(e.title);;
                }
              }}
            >
              <FontAwesomeIcon icon={faPencil} size="lg" />
            </button>

            <button
              className="btn delete-btn"
              onClick={() => deleteWorkout(e._id)}
            >
              <FontAwesomeIcon icon={faDeleteLeft} size="lg" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
