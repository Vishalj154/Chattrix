import React from 'react'
import { auth } from '../src/firebase'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';


const ProfileHeader = () => {
    const user = auth.currentUser;
    if (!user) {
        return <h2>loading....</h2>
    }
    const navigate = useNavigate();
    const handlelogout = async() => {
        await signOut(auth);
        navigate('/login');
    };
    return (
        <div className='profile-header'>

            <h1>My Profile</h1>
            <img src={user.photoURL} alt="" />
            <h3>Name : {user.displayName}</h3>
            <p>Email : {user.email} </p>
            <p>phone : {user.phoneNumber}</p>
            <button type='button' onClick={handlelogout}>Logout</button>
        </div>
    )
}

export default ProfileHeader