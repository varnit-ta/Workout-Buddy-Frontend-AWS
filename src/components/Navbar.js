import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

import './styles/Navbar.css'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Workout Buddy</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <Link to='/'>Dashboard</Link>
              <Link to='/workouts'>Workouts</Link>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar