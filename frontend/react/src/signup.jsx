import React, { useState } from 'react'
import './index.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from "./firebase";
import axios from "axios";

const Signup = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email.includes("@")) {
            alert("Enter a valid email");
            setLoading(false);
            return;
        }
        if (phone.length < 10) {
            alert("phone length must be 10 characters");
            setLoading(false);
            return;
        }

        if (password.length <= 5) {
            alert("password length should be at least 6 characters");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            alert("confirm password should be same as password");
            setLoading(false);
            return;
        }
        try {
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const uid = userCredential.user.uid;

            await axios.post(
                "http://localhost:5000/api/users/register",
                {
                    uid,
                    username,
                    email,
                    phone
                }
            );
            console.log("Firebase UID:", uid);
            alert("User Registered Successfully");

        }
        catch (err) {
            alert(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    // handlegooglelogin
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await axios.post(
                "http://localhost:5000/api/users/register",
                {
                    uid: user.uid,
                    username: user.displayName,
                    email: user.email,
                    phone: user.phoneNumber || ""
                }
            );
            alert("Google login successful");
        } catch (err) {
            console.log(err);
            alert(err.message);

        }
        finally {
            setLoading(false);
        }
    };
    return (

        <div className="auth-card">
            <a href="\" className="back-to-home">back to home </a>
            <h2>Sign Up here</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>
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
                    />
                </div>
                <div className="form-group phone-input">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        className="input-field"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="Enter your phone number"
                    />
                </div>
                <div className="form-group password-group">
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
                        />
                        <button
                            type="button"
                            className="toggle-password-button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>
                <div className="form-group password-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            className="input-field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your password"
                        />
                        <button
                            type="button"
                            className="toggle-password-button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                </div>
                <button className={`btn-primary ${loading ? 'loading' : ''}`} onClick={handleSubmit} type="button" disabled={loading}>
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
        </div>
    )
}

export default Signup