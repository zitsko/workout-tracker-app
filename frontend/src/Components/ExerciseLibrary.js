import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [muscle, setMuscle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  //fetch exercises when muscle or search term change
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          "https://api.api-ninjas.com/v1/exercises",
          {
            headers: {
              "X-Api-Key": "Ib/1FZxdSEDqHVwJsFUITw==n5Fkr1R4C1v7GwFI",
              "Content-Type": "application/json",
            },
            params: {
              muscle,
              name: searchTerm,
            },
          }
        );
        setExercises(response.data);
      } catch (error) {
        console.error("Error:", error.response.data);
      }
    };

    fetchExercises();
  }, [muscle, searchTerm]);

  //input handling
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };




  return (
    <div className="library-container">
      <div className="library-title-input-container flex-col">
        <h1 className="library-title">Workout Exercise Library</h1>

        <div className="search-input-container flex-row">
          <input
            type="text"
            placeholder="Search exercises by muscle..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input library-input-bar"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="lg"
            className="faMagnifyingGlass"
          />
        </div>
      </div>

      <ul className="library-exercises-list">
        {exercises.map((exercise) => (
          <li key={exercise.name} className="library-exercise">
            <h2
              className="exercise-name"
              onClick={() => copyToClipboard(exercise.name)}
            >
              {exercise.name}
            </h2>
            <p>
              {" "}
              <span>Type:</span> {exercise.type}
            </p>
            <p>
              {" "}
              <span>Muscle:</span> {exercise.muscle}
            </p>
            <p>
              <span>Equipment:</span>
              {exercise.equipment}
            </p>
            <p>
              {" "}
              <span>Difficulty:</span> {exercise.difficulty}
            </p>

            <p
            className={`description-text instructions-text `}
          >
            <span>Instructions:</span> {exercise.instructions}
          </p>
        </li>
      ))}
    </ul>
    </div>
  );
}

export default ExerciseLibrary;