import React, { useState } from 'react'
import './index.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from "./firebase";
import axios from "axios";

const Signup = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            alert("Enter a valid email");
            return;
        }
        if (phone.length < 10) {
            alert("phone length must be 10 characters");
            return;
        }

        if (password.length <= 5) {
            alert("password length should be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            alert("confirm password should be same as password");
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
    };
    // handlegooglelogin
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user();

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
    };
    return (

        <div className="signup-form">
            <h2>Sign Up here</h2>
            <label>
                Username:
                <input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                Phone:
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </label>
            <label>
                Password:
                <div className="password-field">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>
            </label>
            <label>
                Confirm Password:
                <div className="password-field">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                        {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                </div>
            </label>
            <button className="submit" onClick={handleSubmit} type="button">Submit</button>
            <div>
                <button className='google'
                    type="button"
                    onClick={handleGoogleLogin}>🌐 Continue with Google</button>
            </div>

        </div>
    )
}

export default Signup