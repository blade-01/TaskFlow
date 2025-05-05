// src/context/SidebarContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  nav: boolean;
  toggleSidebar: () => void;
}

// Create context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Provider
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [nav, setNav] = useState(false);

  const toggleSidebar = () => {
    setNav((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ nav, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Hook to easily use sidebar anywhere
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }
  return context;
}
