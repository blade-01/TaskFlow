import { Timestamp } from "firebase/firestore";

interface TaskData {
  id: string;
  name: string;
  description?: string;
  subtasks: { name: string; isCompleted: boolean }[];
  boardId: string;
  status: string;
  createdAt: Timestamp;
  order: number;
}
