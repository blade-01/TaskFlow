import { useEffect } from "react";
import { useMainStore } from "../../store/main";
import { useNavigate, Navigate } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function DashboardRedirect() {
  const navigateTo = useNavigate();
  const { boards, getBoards } = useMainStore();
  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    if (userId) {
      getBoards(userId);
    } else {
      // If no user is logged in, redirect to the auth page
      navigateTo("/auth");
    }
  }, [userId]);

  if (!boards || boards.length === 0) {
    return <Navigate to={`/no-board`} />;
  }
}
