import { Routes, Route, useNavigate } from 'react-router-dom'
import welcomeImage from './assets/lema_welcome.png'
import './App.css'
import Signup from './signup'
import Login from './login'
import profile from '../components/Profile'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="welcome-container">
      <img src={welcomeImage} className="welcome-image" alt="welcome" />

      <div className="welcometext">
        <h1>Welcome to Chattrix</h1>

        <p style={{ fontSize: '1.2rem', marginTop: '1rem', marginBottom: '2rem' }}>
          Share messages, photos and videos securely.
        </p>

        <button onClick={() => navigate('/signup')}>Sign Up</button>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />

    </Routes>
  )
}

export default App
