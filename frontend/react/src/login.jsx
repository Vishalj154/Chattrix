import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useToast } from './context/ToastContext'
import { Eye, EyeOff } from 'lucide-react';
import './index.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { login, loginWithGoogle } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Logs in and returns whether the Firestore profile exists
            const result = await login(email, password)
            showToast("Login successful!", "success")

            // Post-login workflow redirection
            if (result.hasProfile) {
                navigate("/app/chats")
            } else {
                navigate("/setup-profile")
            }
        } catch (err) {
            console.error("Login: error occurred during submit", err)
            let message = err.message
            if (err.code === "auth/invalid-credential" || err.code === "auth/invalid-email" || err.code === "auth/wrong-password") {
                message = "Invalid email or password. Please check your credentials."
            } else if (err.code === "auth/user-not-found") {
                message = "No user account exists for this email address."
            } else if (err.code === "auth/too-many-requests") {
                message = "Too many login attempts. Please try again later."
            }
            showToast(message, "error")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            // Logs in via Google and creates/merges Firestore profile
            const result = await loginWithGoogle()
            showToast("Google login successful!", "success")

            // Post-login workflow redirection
            if (result.hasProfile) {
                navigate("/app/chats")
            } else {
                navigate("/setup-profile")
            }
        } catch (err) {
            console.error("Login: error occurred during Google Auth", err)
            showToast(err.message || "Failed to log in with Google.", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='auth-card'>
            <Link to="/" className="back-to-home">back to home</Link>
            <h1>Login here</h1>
            <form onSubmit={handleSubmit} className="auth-form">

                {/* Email Row */}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        disabled={loading}
                    />
                </div>

                {/* Password Row */}
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="toggle-password-button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Grid row aligning Forgot Password under the password input field */}
                <div className="form-group">
                    <div></div> {/* Dummy spacer for left column */}
                    <div style={{ textAlign: 'right', marginTop: '-6px' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.9em', color: '#4dc0b5', textDecoration: 'none', fontWeight: '600' }}>
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                <button className={`btn-primary ${loading ? 'loading' : ''}`} type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : "Submit"}
                </button>

                <div className="divider">
                    <span>or</span>
                </div>

                <button className={`btn-google ${loading ? 'loading' : ''}`}
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}>
                    <img src="https://www.google.com/favicon.ico" alt="Google icon" /> Continue with Google
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '4px', fontSize: '0.95em', color: '#6b7280' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#4dc0b5', textDecoration: 'none', fontWeight: '600' }}>
                    Sign Up
                </Link>
            </div>
        </div>
    )
}

export default Login