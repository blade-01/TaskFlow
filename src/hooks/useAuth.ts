import { getAuth } from "firebase/auth";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router";
import { getErrorMessage } from "../utils/error";
import { useState, useRef, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  setDoc,
  doc,
  Timestamp,
  getDoc,
  query,
  collection,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import { BoardData } from "../../types/board";

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

  async function getBoards(userId: string) {
    try {
      const q = query(
        collection(db, "boards"),
        where("createdBy", "==", userId),
        orderBy("createdAt", "asc")
      );
      const snapshot = await getDocs(q);
      const boardsData = snapshot.docs.map((doc) => doc.data() as BoardData);
      return boardsData;
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }

  async function login() {
    try {
      setLoading(true);
      const { user } = await signInWithPopup(auth, provider);
      if (!user) throw new Error("User not found");

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const isNewUser = !userSnap.exists();

      if (isNewUser) {
        // 1. Create user document
        const userDoc = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: Timestamp.now()
        };
        await setDoc(userRef, userDoc);

        // 2. Create welcome board
        const boardId = uuidv4();
        const colTodoId = uuidv4();
        const colInProgressId = uuidv4();
        const colDoneId = uuidv4();

        const columns = [
          { id: colTodoId, name: "Todo", color: "#ffe5e7" },
          { id: colInProgressId, name: "In Progress", color: "#ffd505" },
          { id: colDoneId, name: "Done", color: "#00fa04" }
        ];

        await setDoc(doc(db, "boards", boardId), {
          id: boardId,
          name: "🧠 Welcome to TaskFlow!",
          description: "A starting point for your productivity ✨",
          createdAt: Timestamp.now(),
          createdBy: user.uid,
          columns
        });

        // 3. Create welcome tasks
        const tasks = [
          {
            id: uuidv4(),
            name: "👋 Explore TaskFlow",
            description: "Try dragging this task to a different column!",
            subtasks: [
              { name: "Open this task", isCompleted: false },
              { name: "Try editing it", isCompleted: false },
              { name: "Move it to 'In Progress'", isCompleted: false }
            ],
            boardId,
            status: colTodoId,
            createdAt: Timestamp.now(),
            order: 0
          },
          {
            id: uuidv4(),
            name: "🎨 Customize your boards",
            description: "Click on 'Edit Board' to rename or add columns.",
            subtasks: [],
            boardId,
            status: colInProgressId,
            createdAt: Timestamp.now(),
            order: 0
          },
          {
            id: uuidv4(),
            name: "✅ You made it!",
            description:
              "Now you're ready to create your own boards and tasks.",
            subtasks: [
              { name: "Create a new board", isCompleted: false },
              { name: "Add your own tasks", isCompleted: false }
            ],
            boardId,
            status: colDoneId,
            createdAt: Timestamp.now(),
            order: 0
          }
        ];

        for (const task of tasks) {
          await setDoc(doc(db, "tasks", task.id), task);
        }

        // 4. Redirect to welcome board
        navigateTo(`/board/${boardId}`);
      } else {
        const boards = await getBoards(user.uid);
        if (!boards || boards.length === 0) {
          navigateTo("/no-board");
        } else {
          navigateTo(`/board/${boards[0].id}`);
        }
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Login Error",
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
