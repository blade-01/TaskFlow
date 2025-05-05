import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Triangle } from "react-loader-spinner";

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
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#fd5d03"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return userExists ? children : <Navigate to="/auth" />;
}
