import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import Loader from "../Ui/Loader/Triangle";

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const [userChecked, setUserChecked] = useState(false);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserExists(!!user);
      setUserChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!userChecked) {
    return <Loader />;
  }

  return userExists ? children : <Navigate to="/auth" />;
}
