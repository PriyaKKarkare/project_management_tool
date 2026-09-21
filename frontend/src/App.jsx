import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectBoard from "./pages/ProjectBoard";

function App() {
  return (
    <Routes>

      {/* Public Route */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Protected Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectBoard />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={<Login />}
      />

    </Routes>
  );
}

export default App;