import React from 'react'
import { useState } from 'react'
import './index.css'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
  return (
    <div className='signup-form'>
        <h1>Login here</h1>
        <label >
            Username: <input />
        </label>
        <label >
            Password: <input />
        </label>
        <button className='submit' type='submit' >submit</button>
    </div>
    
  )
}

export default Login