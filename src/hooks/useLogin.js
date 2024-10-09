import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { signIn, fetchAuthSession } from '@aws-amplify/auth';
import {jwtDecode} from 'jwt-decode';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (username, email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const user = await signIn({ username, password });
            const session = await fetchAuthSession();

            if (!session?.tokens?.idToken) {
                throw new Error('Invalid session tokens');
            }

            const { tokens: { idToken } } = session;
            const decodedToken = jwtDecode(idToken.toString());

            const userObject = {
                username: username,
                email: email,
                id: user?.sub,
                claims: {
                    sub: decodedToken.sub,
                    email_verified: decodedToken.email_verified,
                    iss: decodedToken.iss,
                    'cognito:username': decodedToken['cognito:username'],
                    origin_jti: decodedToken.origin_jti,
                    aud: decodedToken.aud,
                    event_id: decodedToken.event_id,
                    token_use: decodedToken.token_use,
                    auth_time: decodedToken.auth_time,
                    exp: decodedToken.exp,
                    iat: decodedToken.iat,
                    jti: decodedToken.jti,
                }
            };

            localStorage.setItem('userClaims', JSON.stringify(userObject));
            dispatch({ type: 'LOGIN', payload: userObject });
            setIsLoading(false);
            return userObject;

        } catch (error) {
            setIsLoading(false);

            console.log('Login error:', error);

            switch (error.name) {
                case 'UserNotConfirmedException':
                    setError('Please verify your email address');
                    break;
                case 'NotAuthorizedException':
                    setError('Incorrect username or password');
                    break;
                case 'UserNotFoundException':
                    setError('User not found');
                    break;
                default:
                    setError(error.message || 'Failed to login');
            }
        }
    };

    return { login, isLoading, error };
};
