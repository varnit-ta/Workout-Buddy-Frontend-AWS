import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { signUp, confirmSignUp, signIn, fetchAuthSession } from '@aws-amplify/auth'
import { jwtDecode } from 'jwt-decode'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [tempCredentials, setTempCredentials] = useState({ username: '', email: '', password: '' })
  const { dispatch } = useAuthContext()

  const signup = async (username, email, password) => {
    setIsLoading(true)
    setError(null)
    setTempCredentials({ username, email, password })

    try {
      console.log('Attempting signup with:', { username, email })
      
      const signUpResult = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name: username,
          },
          autoSignIn: {
            enabled: true
          }
        }
      })

      console.log('Signup result:', signUpResult)

      if (signUpResult.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setNeedsConfirmation(true)
        setIsLoading(false)
        return { userId: signUpResult.userId, needsConfirmation: true }
      }

    } catch (error) {
      console.error('Signup error:', error)
      setIsLoading(false)
      
      if (error.message) {
        setError(error.message)
      } else {
        setError('An error occurred during signup')
      }
      return { error: error.message }
    }
  }

  const confirmSignUpWithCode = async (code) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Attempting confirmation with:', { username: tempCredentials.username, code })
      
      await confirmSignUp({
        username: tempCredentials.username,
        confirmationCode: code
      })

      console.log('Confirmation successful, attempting sign in')

      const signInResult = await signIn({
        username: tempCredentials.username,
        password: tempCredentials.password
      })

      console.log('Sign in result:', signInResult)

      const session = await fetchAuthSession()
      
      if (!session?.tokens) {
        throw new Error('No session tokens available')
      }

      const decodedToken = jwtDecode(session.tokens.idToken.toString())

      const userObject = {
        username: tempCredentials.username,
        email: tempCredentials.email,
        id: signInResult.userId,
        token: session.tokens.idToken.toString(),
        accessToken: session.tokens.accessToken.toString(),
        refreshToken: session.tokens.refreshToken.toString(),
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
      }

      localStorage.setItem('userClaims', JSON.stringify(userObject))
      dispatch({ type: 'LOGIN', payload: userObject })
      setTempCredentials({ username: '', email: '', password: '' })
      setIsLoading(false)
      setNeedsConfirmation(false)
      return { success: true }

    } catch (error) {
      console.error('Confirmation error:', error)
      setIsLoading(false)
      setError(error.message || 'Failed to confirm signup')
      return { error: error.message }
    }
  }

  return { 
    signup, 
    confirmSignUpWithCode,
    isLoading, 
    error, 
    needsConfirmation 
  }
}