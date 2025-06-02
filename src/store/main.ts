import { create } from "zustand";
import { useThemeStore, ThemeState } from "./theme";
import { useBoardStore, BoardState } from "./board";

type AppState = ThemeState & BoardState;

export const useMainStore = create<AppState>()((...a) => ({
  ...useThemeStore(...a),
  ...useBoardStore(...a)
}));
