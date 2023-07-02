import { useState, useEffect } from 'react';
import axios from 'axios';

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [muscle, setMuscle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          'https://api.api-ninjas.com/v1/exercises',
          {
            headers: {
              'X-Api-Key': 'Ib/1FZxdSEDqHVwJsFUITw==n5Fkr1R4C1v7GwFI',
              'Content-Type': 'application/json',
            },
            params: {
              muscle,
              name: searchTerm,
              // other optional parameters if needed
            },
          }
        );
        setExercises(response.data);
      } catch (error) {
        console.error('Error:', error.response.data);
      }
    };

    fetchExercises();
  }, [muscle, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>Exercise Library</h1>
      <div>
        <input
          type="text"
          placeholder="Search exercises by muscle..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.name}>
            <h3>{exercise.name}</h3>
            <p>Type: {exercise.type}</p>
            <p>Muscle: {exercise.muscle}</p>
            <p>Equipment:{exercise.equipment}</p>
            <p> Difficulty: {exercise.difficulty}</p>
            <p>Instructions: {exercise.instructions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExerciseLibrary;
