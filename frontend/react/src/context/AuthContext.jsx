import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, provider, db } from "../firebase";

// 1. Create the Authentication Context
const AuthContext = createContext(null);

// 2. AuthProvider Component that wraps the application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Centralized Signup logic (creates auth user + saves profile details in Firestore)
  const signup = async (email, password, username, phone) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;

    const newProfile = {
      uid: currentUser.uid,
      displayName: username,
      email: email,
      phone: phone || "",
      photoURL: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOnline: false,
      lastSeen: new Date().toISOString(),
      provider: "password"
    };

    // Save to Firestore users/{uid}
    await setDoc(doc(db, "users", currentUser.uid), newProfile);
    setProfile(newProfile);
    return currentUser;
  };

  // Centralized Login logic (logs in + updates online presence)
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;

    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    const hasProfile = docSnap.exists();

    if (hasProfile) {
      const updatedPresence = {
        isOnline: true,
        lastSeen: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, updatedPresence, { merge: true });
      setProfile({ ...docSnap.data(), ...updatedPresence });
    } else {
      setProfile(null);
    }

    return { user: currentUser, hasProfile };
  };

  // Centralized Google OAuth Login (creates or merges profile + sets presence)
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const currentUser = result.user;

    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    const hasProfile = docSnap.exists();

    if (!hasProfile) {
      const newProfile = {
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email.split('@')[0],
        email: currentUser.email,
        phone: currentUser.phoneNumber || "",
        photoURL: currentUser.photoURL || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOnline: true,
        lastSeen: new Date().toISOString(),
        provider: "google"
      };
      await setDoc(docRef, newProfile);
      setProfile(newProfile);
      return { user: currentUser, hasProfile: false };
    } else {
      const updatedProfile = {
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email.split('@')[0],
        email: currentUser.email,
        photoURL: currentUser.photoURL || null,
        provider: "google",
        isOnline: true,
        lastSeen: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // Merge: true is used to preserve existing custom fields in document
      await setDoc(docRef, updatedProfile, { merge: true });
      setProfile({ ...docSnap.data(), ...updatedProfile });
      return { user: currentUser, hasProfile: true };
    }
  };

  // Centralized Logout logic (updates presence + signs out)
  const logout = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, {
          isOnline: false,
          lastSeen: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("AuthContext: Failed to update status on logout:", err);
      }
    }
    await signOut(auth);
    setProfile(null);
  };

  // Password reset wrapper
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Update profile data in Firestore and reflect changes in local cache state
  // Uses setDoc with merge to handle both new profiles (no existing document) and existing profiles
  const updateProfileData = async (data) => {
    if (!user) throw new Error("No authenticated user.");
    const docRef = doc(db, "users", user.uid);
    
    // Include base fields if creating for the first time
    const profileData = {
      ...data,
      uid: user.uid,
      email: user.email,
    };
    
    // setDoc with merge: true creates the doc if it doesn't exist, or merges into it if it does
    await setDoc(docRef, profileData, { merge: true });
    setProfile((prev) => (prev ? { ...prev, ...profileData } : profileData));
  };

  useEffect(() => {
    // Listen to Firebase Auth state transitions
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error("AuthContext: Error fetching user profile:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfileData
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
        <p>Loading Chattrix...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook to use the AuthContext easily in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};