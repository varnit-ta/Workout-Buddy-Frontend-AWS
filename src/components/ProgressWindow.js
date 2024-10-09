import './styles/ProgressWindow.css';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useEffect, useState } from 'react';
import workoutTypes from '../db/workoutTypes.json';


import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressWindow = () => {
    const { workouts } = useWorkoutsContext();
    const today = new Date().toLocaleString("en-us", { weekday: "long" });
    const yesterdayDay = new Date(Date.now() - 86400000).toLocaleString("en-us", { weekday: "long" });


    const yesterdayDate = new Date(Date.now() - 86400000).toLocaleDateString();
    const todayDate = new Date().toLocaleDateString();

    const [totalCalories, setTotalCalories] = useState(0);
    const [doneCalories, setDoneCalories] = useState(0);
    const [yesterdayTotalCalories, setYesterdayTotalCalories] = useState(0);
    const [yesterdayDoneCalories, setYesterdayDoneCalories] = useState(0);

    const calculateToday = () => {
        if (!workouts) return;

        let total = 0;
        let done = 0;

        let yesterdayTotal = 0;
        let yesterdayDone = 0;

        workouts.forEach((workout) => {
            if (workout.days_planned.includes(today)) {
                workoutTypes.forEach(workoutType => {
                    if (workoutType.name === workout.title) {
                        total += workoutType.caloriesBurnedPerHour;
                    }
                });                
            }

            if (workout.completed_days.includes(todayDate)) {
                workoutTypes.forEach(workoutType => {
                    if (workoutType.name === workout.title) {
                        done += workoutType.caloriesBurnedPerHour;
                    }
                })
            }

            if (workout.days_planned.includes(yesterdayDay)) {
                workoutTypes.forEach(workoutType => {
                    if (workoutType.name === workout.title) {
                        yesterdayTotal += workoutType.caloriesBurnedPerHour;
                    }
                })
            }

            if (workout.completed_days.includes(yesterdayDate)) {
                workoutTypes.forEach(workoutType => {
                    if (workoutType.name === workout.title) {
                        yesterdayDone += workoutType.caloriesBurnedPerHour;
                    }
                })
            }
        });

        setTotalCalories(total);
        setDoneCalories(done);
        setYesterdayTotalCalories(yesterdayTotal);
        setYesterdayDoneCalories(yesterdayDone);
    };

    useEffect(() => {
        calculateToday();
    }, [workouts, calculateToday]);    

    return (
        <div className="progress-window">

            <div className='circular-progress-bar'>
                <h4>Calories Burned</h4>
                <div style={{ width: "100px", aspectRatio: 1 / 1 }}>
                    <CircularProgressbar
                        value={ yesterdayDoneCalories !== 0? yesterdayDoneCalories * 100 / yesterdayTotalCalories : 0}
                        text={`${yesterdayDoneCalories !== 0? (yesterdayDoneCalories * 100 / yesterdayTotalCalories).toFixed(0) : 0}%`}
                        styles={buildStyles({
                            rotation: 0.25,
                            strokeLinecap: 'round',
                            textSize: '16px',
                            pathTransitionDuration: 0.5,
                            pathColor: '#1aac83',
                            textColor: 'black',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                        })}
                    />
                </div>
                <h4>Yesterday</h4>
            </div>

            <div className='circular-progress-bar'>
                <h4>Calories Burned</h4>
                <div style={{ width: "100px", aspectRatio: 1 / 1 }}>
                    <CircularProgressbar
                        value={ doneCalories !== 0? doneCalories * 100 / totalCalories : 0}
                        text={`${doneCalories !== 0? (doneCalories * 100 / totalCalories).toFixed(0) : 0}%`}
                        styles={buildStyles({
                            rotation: 0.25,
                            strokeLinecap: 'round',
                            textSize: '16px',
                            pathTransitionDuration: 0.5,
                            pathColor: '#1aac83',
                            textColor: 'black',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                        })}
                    />
                </div>
                <h4>Today</h4>
            </div>

        </div>
    );
};

export default ProgressWindow;
