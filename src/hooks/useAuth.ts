import { getAuth } from "firebase/auth";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../utils/error";
import { useState, useRef, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const provider = new GoogleAuthProvider();
  const toast = useRef<Toast>(null);
  const navigateTo = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const isAuthenticated = () => {
    return !!user;
  };

  async function login() {
    try {
      setLoading(true);
      const { user } = await signInWithPopup(auth, provider);
      if (!user) {
        throw new Error("User not found");
      }
      const userDoc = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: Timestamp.now()
      };
      await setDoc(doc(db, "users", user.uid), userDoc);
      navigateTo("/board/welcome");
    } catch (error) {
      toast.current!.show({
        severity: "error",
        summary: "Error",
        detail: getErrorMessage(error)
      });
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      await auth.signOut();
      navigateTo("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigateTo("/auth");
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigateTo]);

  return { loading, toast, user, isAuthenticated, login, logout };
}
