import './styles/AllWorkouts.css';
import React, { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import WorkoutBox from './WorkoutBox';

const SelectionBar = ({ days, onDaySelect }) => {
    const [selectedDay, setSelectedDay] = useState(days[0]);

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        onDaySelect(day);
    };

    return (
        <div className="selection-bar">
            {days.map((day, index) => (
                <button
                    key={index}
                    className={day === selectedDay ? "active" : ""}
                    onClick={() => handleDaySelect(day)}
                >
                    {day}
                </button>
            ))}
        </div>
    );
};

const AllWorkouts = () => {
    const { workouts, dispatch } = useWorkoutsContext();
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [workoutsAvailable, setWorkoutsAvailable] = useState([]);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleDaySelect = (day) => {
        setSelectedDay(day);
    };

    useEffect(() => {
        const workoutsForSelectedDay = workouts.filter(workout => 
            Array.isArray(workout.days_planned) && workout.days_planned.includes(selectedDay)
        );
        setWorkoutsAvailable(workoutsForSelectedDay);
    }, [workouts, selectedDay, dispatch]);
    

    return (
        <div className="all-workouts">
            <SelectionBar days={days} onDaySelect={handleDaySelect} />

            <div className="selected-day-workouts">
                {
                    workoutsAvailable && workoutsAvailable.map((workout, index) => (
                        <WorkoutBox
                            key={index}
                            workout={workout}
                            selectedDay={selectedDay}
                        />
                    ))
                }
                {workoutsAvailable.length === 0 && <p>No workouts planned for {selectedDay}</p>}
            </div>
        </div>
    );
};

export default AllWorkouts;
