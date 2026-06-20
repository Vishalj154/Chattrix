import React from 'react'
import { useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import './index.css'

const Login = () => {
    const [Email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const userinfo = await signInWithEmailAndPassword(
            auth,
            Email,
            password
        );
        console.log(userinfo.user);
        alert("Login successful");
        } catch(errr){
            alert(errr.message);
        }
    };
    
  return (
    <div className='signup-form'>
        <h1>Login here</h1>
        <label >
            Email: <input type="email" value={Email} onChange={(e)=> setEmail(e.target.value)  } required/>
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
            <button className="submit" onClick={handleSubmit} type="button">Submit</button>
    </div>
    
  )
}

export default Login