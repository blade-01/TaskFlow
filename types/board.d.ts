import { Timestamp } from "firebase/firestore";

interface BoardData {
  id?: string;
  name: string;
  columns: { name: string; color: string; id: string }[];
  createdAt: Timestamp;
  createdBy: string;
}
