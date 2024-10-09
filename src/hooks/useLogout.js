import { useAuthContext } from './useAuthContext';
import { useWorkoutsContext } from './useWorkoutsContext';
import { signOut } from '@aws-amplify/auth';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchWorkouts } = useWorkoutsContext();

  const logout = async () => {
    try {
      await signOut();

      localStorage.removeItem('userClaims');
      localStorage.removeItem('user');

      dispatch({ type: 'LOGOUT' });
      dispatchWorkouts({ type: 'SET_WORKOUTS', payload: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { logout };
};
