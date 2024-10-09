import { useAuthContext } from '../hooks/useAuthContext';
import workoutTypes from '../db/workoutTypes.json';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

const WorkoutBox = ({ workout, selectedDay }) => {
    const { user } = useAuthContext();
    const { dispatch } = useWorkoutsContext();

    const handleClick = async () => {
        if (!user) {
            return;
        }

        const response = await fetch(`https://4i0trokc7k.execute-api.eu-north-1.amazonaws.com/api/workout/${workout.workout_id}/days`, {
            method: 'DELETE',
            body: JSON.stringify({ userId: user?.claims?.sub, day: selectedDay }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const json = await response.json();

        if (response.ok) {
            console.log(json)
            dispatch({ type: 'MODIFY_WORKOUT', payload: json.workout });
        }
        if (!response.ok) {
            console.log(json.error);
        }
    };

    return (
        <div className='selected-days-workout-box'>
            <div>
                <p><strong>{workout.title}</strong></p>
                {workoutTypes.map((workoutType, index) => {
                    if (workoutType.name === workout.title) {
                        return (
                            <p key={index} className='calories'>
                                {workoutType.caloriesBurnedPerHour} kcal
                            </p>
                        );
                    }
                    return null;
                })}
            </div>

            <div>
                <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            </div>
        </div>
    );
};

export default WorkoutBox;
