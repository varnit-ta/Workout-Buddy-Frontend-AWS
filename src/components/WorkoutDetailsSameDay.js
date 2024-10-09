import { useAuthContext } from '../hooks/useAuthContext';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useState, useEffect } from 'react';
import './styles/WorkoutDetails.css';

const WorkoutDetails = ({ workouts }) => {
  const { user } = useAuthContext();
  const {dispatch} = useWorkoutsContext();
  const todayDate = new Date().toLocaleDateString();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (workouts.completed_days.includes(todayDate)) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    const endpointMethod = isChecked ? "PATCH" : "DELETE";

    const response = await fetch(`https://4i0trokc7k.execute-api.eu-north-1.amazonaws.com/api/workout/${workouts.workout_id}/dates`, {
      method: endpointMethod,
      body: JSON.stringify({ userId: user?.claims?.sub, date: todayDate }),
      headers: {
        "Content-Type": "application/json"
      },
    });
    const json = await response.json();
    

    if (response.ok){
      dispatch({ type: 'MODIFY_WORKOUT', payload: json.workout });
    }

    console.log(json);
  }

  return (
    <div className="workout-details">
      <div>
        <p><strong>{workouts.title}</strong></p>
        <p>Today</p>
      </div>

      <div className='checkbox'>
        <input type="checkbox" value={workouts.title} onChange={handleSubmit} checked={checked} />
      </div>
    </div>
  )
}

export default WorkoutDetails;
