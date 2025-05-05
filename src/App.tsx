import "@theme-toggles/react/css/Classic.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { PrimeReactProvider } from "primereact/api";
import Auth from "./pages/Auth";
import DashboardLayout from "./layouts/DashboardLayout";
import { SidebarProvider } from "./context/SidebarContext";
import Board from "./pages/Board";
import ProtectedRoute from "./components/Navigation/ProtectedRoutes";

function App() {
  return (
    <PrimeReactProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/board/welcome" />} />
            <Route
              path="/board/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Board />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </SidebarProvider>
    </PrimeReactProvider>
  );
}

export default App;
