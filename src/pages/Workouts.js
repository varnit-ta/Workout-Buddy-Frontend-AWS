import { useEffect, useState } from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"
import { useAuthContext } from "../hooks/useAuthContext"

import WorkoutForm from '../components/WorkoutForm'

import './styles/Workouts.css'
import workoutTypes from '../db/workoutTypes.json'
import AllWorkouts from '../components/AllWorkouts'
import LoadingPage from './LoadingPage'

const WorkoutHistoryBox = ({ workouts, time }) => {
  return (
    <div className='workout-history-box'>
      <div>
        <p><strong>{workouts.title}</strong></p>
        {workoutTypes.map((workoutType) => {
          if (workoutType.name === workouts.title) {
            return (<p className='calories'>{workoutType.caloriesBurnedPerHour} kcal</p>)
          }
        })}
      </div>

      <p className='time'>{time + " >"}</p>


    </div>
  )
}

const WorkoutHistory = ({ workouts }) => {
  const today = new Date().toLocaleDateString();
  const yesterdayDate = new Date(Date.now() - 86400000).toLocaleDateString('en-US');

  return (
    <div className='workout-history-list'>
      {
        workouts && workouts.map((workout, index) => {
          if (Array.isArray(workout.completed_days) && workout.completed_days.includes(today)) {
            return (
              <WorkoutHistoryBox
                key={index}
                workouts={workout}
                time={"Today"}
              />
            );
          }
        })
      }
      
      {
        workouts && workouts.map((workout, index) => {
          if (Array.isArray(workout.completed_days) && workout.completed_days.includes(yesterdayDate)) {
            return (
              <WorkoutHistoryBox
                key={index}
                workouts={workout}
                time={"Yesterday"}
              />
            );
          }
        })
      }
    </div>
  );
};


const Home = () => {
  const { dispatch, workouts } = useWorkoutsContext()
  const { user } = useAuthContext()

  const [gotData, setGotData] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
          const response = await fetch("https://4i0trokc7k.execute-api.eu-north-1.amazonaws.com/api/workout?userId=" + user?.claims?.sub, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          if (!response.ok) {
              throw new Error('Failed to fetch workouts');
          }
  
          const json = await response.json(); 
          dispatch({ type: "SET_WORKOUTS", payload: json }); 
          setGotData(true);
      } catch (error) {
          console.error('Error fetching workouts:', error);
      }
  };

    if (user) {
      fetchWorkouts()
    }
  }, [dispatch, user])

  return (
    <div>
      {
        gotData ? (
          <div className='workouts-page' >
            <div className="left">
              <div className="all-workouts">
                <h2>Workouts</h2>
                <AllWorkouts />
              </div>

              <div className="workout-history">
                <h2>History</h2>
                <WorkoutHistory workouts={workouts} />
              </div>
            </div>


            <div className="right">
              <WorkoutForm />
            </div>
          </div >

        ) : (


          <div className="loading-screen">
            <LoadingPage />
          </div>
        )
      }
    </div>


  )
}

export default Home;