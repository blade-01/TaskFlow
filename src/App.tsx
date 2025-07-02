import "@theme-toggles/react/css/Classic.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { PrimeReactProvider } from "primereact/api";
import Auth from "./pages/Auth";
import { SidebarProvider } from "./context/SidebarContext";
import Dashboard from "./components/Navigation/Dashboard";
import Board from "./pages/Board";
import Empty from "./pages/Empty";
import Error from "./pages/Error";
import ProtectedRoute from "./components/Navigation/ProtectedRoutes";

function App() {
  return (
    <PrimeReactProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/board/:id"
              element={
                <ProtectedRoute>
                  <Board />
                </ProtectedRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/no-board" element={<Empty />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </SidebarProvider>
    </PrimeReactProvider>
  );
}

export default App;
