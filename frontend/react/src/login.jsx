import React from 'react'
import { useState } from 'react'
import { signInWithEmailAndPassword , signInWithPopup } from "firebase/auth";
import { auth,provider } from "./firebase";
import './index.css'
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const Login = () => {
    const [Email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userinfo = await signInWithEmailAndPassword(
                auth,
                Email,
                password
            );
            console.log(userinfo.user);
            navigate("/profile");
            alert("Login successful");
        } catch (errr) {
            alert(errr.message);
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

            // await axios.post(
            //     "http://localhost:5000/api/users/register",
            //     {
            //         uid: user.uid,
            //         username: user.displayName,
            //         email: user.email,
            //         phone: user.phoneNumber || ""
            //     }
            // );
            console.log(user);
            alert("Google login successful");
            navigate("/profile");
        } catch (err) {
            console.log(err);
            alert(err.message);

        }
        finally {
            setLoading(false);
        }
    };
    return (
        <div className='auth-card'>
            <a href="\" className="back-to-home">back to home </a>
            <h1>Login here</h1>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="input-field"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
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
        </div>
    )
}

export default Login