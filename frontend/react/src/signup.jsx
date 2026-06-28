import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useToast } from './context/ToastContext'
import { Eye, Eyeoff } from 'lucide-react'
import './index.css'

const Signup = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const { signup, loginWithGoogle } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Email validation
        if (!email.includes("@")) {
            showToast("Please enter a valid email address.", "error")
            setLoading(false)
            return
        }

        // Phone validation (exactly 10 digits)
        const phoneDigits = phone.replace(/\D/g, "")
        if (phoneDigits.length < 10) {
            showToast("Phone number must be at least 10 digits.", "error")
            setLoading(false)
            return
        }

        // Password length validation
        if (password.length < 6) {
            showToast("Password must be at least 6 characters.", "error")
            setLoading(false)
            return
        }

        // Password match validation
        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error")
            setLoading(false)
            return
        }

        try {
            // Register in Firebase Auth and Firestore users/{uid} via useAuth
            await signup(email, password, username, phoneDigits)
            showToast("Account registered successfully!", "success")

            // Redirect to dashboard since profile fields are already populated
            navigate("/app/chats")
        } catch (err) {
            console.error("Signup: error occurred during submit", err)
            let message = err.message
            if (err.code === "auth/email-already-in-use") {
                message = "This email address is already registered."
            } else if (err.code === "auth/invalid-email") {
                message = "The email address is badly formatted."
            } else if (err.code === "auth/weak-password") {
                message = "Password is too weak. Make it at least 6 characters."
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
            showToast("Google signup successful!", "success")

            // Redirect appropriately based on profile existence
            if (result.hasProfile) {
                navigate("/app/chats")
            } else {
                navigate("/setup-profile")
            }
        } catch (err) {
            console.error("Signup: error occurred during Google Auth", err)
            showToast(err.message || "Failed to sign up with Google.", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-card">
            <Link to="/" className="back-to-home">back to home</Link>
            <h2>Sign Up here</h2>
            <form onSubmit={handleSubmit} className="auth-form">

                {/* Username Row */}
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                        disabled={loading}
                    />
                </div>

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

                {/* Phone Row */}
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        className="input-field"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="Enter your phone number"
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

                {/* Confirm Password Row */}
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm:</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            className="input-field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your password"
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="toggle-password-button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            disabled={loading}
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>

                <button
                    className={`btn-primary ${loading ? 'loading' : ''}`}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <div className="spinner"></div> : "Sign Up"}
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
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#4dc0b5', textDecoration: 'none', fontWeight: '600' }}>
                    Login
                </Link>
            </div>
        </div>
    )
}

export default Signup