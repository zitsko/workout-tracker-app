import { useState, useEffect } from 'react';
import axios from 'axios';

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [muscle, setMuscle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  //fetch exercises when muscle or search term change
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

    //input handling
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className='library-container'>
      <h1 className='library-title'>Workout Exercise Library</h1>
      <div>
        <input
          type="text"
          placeholder="Search exercises by muscle..."
          value={searchTerm}
          onChange={handleSearch}
          className='library-input-bar'
        />
      </div>

      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.name}>
            <h2>{exercise.name}</h2>
            <p> <span>Type:</span> {exercise.type}</p>
            <p> <span>Muscle:</span> {exercise.muscle}</p>
            <p><span>Equipment:</span>{exercise.equipment}</p>
            <p> <span>Difficulty:</span> {exercise.difficulty}</p>
            <p className='instructions-text'> <span>Instructions:</span> {exercise.instructions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExerciseLibrary;
