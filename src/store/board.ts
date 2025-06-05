import { StateCreator } from "zustand";
import {
  where,
  query,
  collection,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  onSnapshot,
  deleteDoc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { getErrorMessage } from "../utils/error";
import { v4 as uuidv4 } from "uuid";
import { BoardData } from "../../types/board";

interface TaskData {
  id?: string;
  name: string;
  description?: string;
  subtasks: { name: string; isCompleted: boolean }[];
  boardId: string;
  status: string;
  createdAt: Timestamp;
  order?: number;
}

export interface BoardState {
  // ###### BOARDS
  boards: BoardData[];
  board: BoardData | null;
  getBoards: (userId: string) => void;
  getBoardById: (id: string) => void;
  createBoard: (payload: BoardData) => void;
  updateBoard: (id: string, payload: BoardData) => void;
  deleteBoard: (id: string) => void;

  // ###### TASKS
  tasks: TaskData[];
  task: TaskData | null;
  getTasks: (boardId: string) => void;
  getTaskById: (id: string) => void;
  createTask: (payload: TaskData) => void;
  updateTask: (id: string, payload: TaskData) => void;
  deleteTask: (id: string) => void;
}

export const useBoardStore: StateCreator<BoardState> = (set, get) => ({
  // ###### BOARDS
  boards: [],
  board: null,
  getBoards: async (userId: string) => {
    try {
      const q = query(
        collection(db, "boards"),
        where("createdBy", "in", ["welcome", userId]),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const boardsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return data as BoardData;
        });
        set({ boards: boardsData });
      });

      return unsubscribe;
    } catch (error) {
      getErrorMessage(error);
    }
  },
  getBoardById: async (id: string) => {
    const docRef = doc(db, "boards", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const board: BoardData = data as BoardData;
      set({ board });
    }
  },
  createBoard: async (payload: BoardData) => {
    const boardId = uuidv4(); // generate a stable ID
    const boardPayload = { ...payload, id: boardId };
    await setDoc(doc(db, "boards", boardId), boardPayload);
    return true;
  },
  updateBoard: async (id: string, payload: BoardData) => {
    await updateDoc(doc(db, "boards", id), { ...payload, id });
    get().getBoardById(id);
  },
  deleteBoard: async (id: string) => {
    await deleteDoc(doc(db, "boards", id));
    return true;
  },

  // ###### TASKS
  tasks: [],
  task: null,
  getTasks: async (boardId: string) => {
    try {
      const q = query(
        collection(db, "tasks"),
        where("boardId", "==", boardId),
        orderBy("status"),
        orderBy("order", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id } as TaskData;
        });
        set({ tasks: tasksData });
      });

      return unsubscribe;
    } catch (error) {
      getErrorMessage(error);
    }
  },
  getTaskById: async (id: string) => {
    const docRef = doc(db, "tasks", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const task: TaskData = { ...data, id: docSnap.id } as TaskData;
      set({ task });
    }
  },
  createTask: async (payload: TaskData) => {
    const taskId = uuidv4(); // generate a stable ID
    const taskPayload = { ...payload, id: taskId };
    await setDoc(doc(db, "tasks", taskId), taskPayload);
    return true;
  },
  updateTask: async (id: string, payload: TaskData) => {
    await updateDoc(doc(db, "tasks", id), { ...payload, id });
    // get().getTaskById(id);
  },
  deleteTask: async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    return true;
  }
});
