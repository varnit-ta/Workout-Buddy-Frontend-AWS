import React, { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import "./styles/WorkoutForm.css";
import workoutTypes from "../db/workoutTypes.json";
import loading from "../assets/loading.gif";

const WorkoutForm = () => {
  const { dispatch, workouts } = useWorkoutsContext();
  const { user } = useAuthContext();

  const daysOption = [
    "--Select a day--",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [title, setTitle] = useState("");
  const [load, setLoad] = useState(0);
  const [reps, setReps] = useState(0);
  const [selectedDays, setSelectedDays] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const [sendingData, setSendingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendingData(true);

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = {
      userId: user?.claims?.sub,
      title,
      load,
      reps,
      days_planned: selectedDays,
    };

    const response = await fetch(
      "https://4i0trokc7k.execute-api.eu-north-1.amazonaws.com/api/workout/",
      {
        method: "POST",
        body: JSON.stringify(workout),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setSendingData(false);
      if (json.error !== "Workout already exists") {
        setEmptyFields(json.emptyFields);
      }
    }
    if (response.ok) {
      setTitle("");
      setLoad(0);
      setReps(0);
      setError(null);
      setSelectedDays([]);
      setEmptyFields([]);
      setSendingData(false);

      if (json.createdNew) {
        dispatch({ type: "CREATE_WORKOUT", payload: json.workout });
      } else {
        dispatch({ type: "MODIFY_WORKOUT", payload: json.workout });
      }

      console.log(json);
    }
  };

  const handleDelete = (day) => {
    setSelectedDays(selectedDays.filter((d) => d !== day));
  };

  const handleSelectChange = (e) => {
    const selectedDay = e.target.value;
    setSelectedDays([...selectedDays, selectedDay]);
  };

  const availableDays = daysOption.filter((day) => !selectedDays.includes(day));

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h2>Add a New Workout</h2>

      <label>Exercise Title:</label>
      <select
        typeof="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      >
        {workoutTypes.map((type, i) => (
          <option key={i} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>

      <label>Days:</label>
      <select
        typeof="text"
        onChange={handleSelectChange}
        value=""
        className={emptyFields.includes("days_planned") ? "error" : ""}
      >
        {availableDays.map((day, i) => (
          <option key={i} value={day}>
            {day}
          </option>
        ))}
      </select>
      <ul>
        {selectedDays.map((day, i) => (
          <div key={i}>
            {day}
            <span onClick={() => handleDelete(day)}>&#10006;</span>
          </div>
        ))}
      </ul>

      <label>Load (in kg):</label>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes("load") ? "error" : ""}
      />

      <label>Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      {sendingData ? (
        <img src={loading} alt="loading" />
      ) : (
        <button>Add Workout</button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
