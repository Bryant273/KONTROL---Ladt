import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Initialize connectivity study
testConnection();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initial connectivity probe in background
    testConnection();

    // Safety timeout: Auth must resolve within 5 seconds for UI lock
    const authTimeout = setTimeout(() => {
      setLoading(current => {
        if (current) {
          console.warn("[Quantum Engine] Auth safety trigger: Releasing UI lock after 5s.");
          return false;
        }
        return false;
      });
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[Quantum Engine] Auth Event Received:", user?.uid ? "User Identified" : "Guest Mode");
      try {
        setUser(user);
        if (user) {
          // Sync user profile
          const userRef = doc(db, 'users', user.uid);
          let userDoc;
          try {
            userDoc = await getDoc(userRef);
          } catch (error) {
            console.warn("[Quantum Engine] Profile fetch rejected (permissions likely):", error);
          }
          
          let userRole = 'COMPANY_MANAGER'; // Default role

          // Special test accounts logic
          if (user.email === 'admin-test@unikorp-erp.com' || user.email === 'silueahmed273@gmail.com') {
            userRole = 'SYSTEM_ADMIN';
          } else if (user.email === 'entreprise-test@unikorp-erp.com') {
            userRole = 'COMPANY_ADMIN';
          }

          try {
            if (!userDoc || !userDoc.exists()) {
              const profile = {
                email: user.email,
                displayName: user.displayName || user.email?.split('@')[0],
                photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.email?.split('@')[0]}`,
                createdAt: new Date().toISOString(),
                role: userRole
              };
              await setDoc(userRef, profile);
              setRole(userRole);
              setIsAdmin(userRole === 'SYSTEM_ADMIN');
            } else {
              const data = userDoc.data();
              // If it's a test email, ensure it has the right role even if already exists
              if ((userRole === 'SYSTEM_ADMIN' && data?.role !== 'SYSTEM_ADMIN') || 
                  (userRole === 'COMPANY_ADMIN' && data?.role !== 'COMPANY_ADMIN')) {
                await setDoc(userRef, { ...data, role: userRole }, { merge: true });
                setRole(userRole);
                setIsAdmin(userRole === 'SYSTEM_ADMIN');
              } else {
                setRole(data?.role || 'COMPANY_MANAGER');
                setIsAdmin(data?.role === 'SYSTEM_ADMIN' || data?.role === 'admin');
              }
            }
          } catch (syncErr) {
             console.error("[Quantum Engine] Profile sync failed:", syncErr);
             // We still want to let the user in with default role based on email if possible
             setRole(userRole);
          }
        } else {
          setRole(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("[Quantum Engine] Global Auth Sync Error:", error);
      } finally {
        clearTimeout(authTimeout);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(authTimeout);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, initialRole?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      // Logic for initial role assignment if needed (handled in useEffect anyway)
      if (initialRole) {
         await setDoc(doc(db, 'users', res.user.uid), {
           email,
           role: initialRole,
           createdAt: new Date().toISOString()
         });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, isAdmin, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
