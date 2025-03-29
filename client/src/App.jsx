// client/src/App.jsx
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import PlaidConnect from "./components/PlaidConnect";
import Dashboard from "./components/Dashboard";
import NavBar from "./components/NavBar";
import "./App.css";
import Login from "./components/login";
import HomePage from "./components/HomePage";
import Signup from "./components/Signup";
import { UserProvider } from "./contexts/Context";
import Budget from "./components/Budget";
import Finance from "./components/Finance";
import Settings from "./components/Settings";
import { useUser } from "./contexts/Context";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { userId } = useUser();
  const location = useLocation();

  if (!userId) {
    // Redirect to homepage if not logged in, but save the attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route element={<NavBar />}>
            <Route 
              path="/setup" 
              element={
                <ProtectedRoute>
                  <PlaidConnect />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/budget" 
              element={
                <ProtectedRoute>
                  <Budget />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/finance" 
              element={
                <ProtectedRoute>
                  <Finance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;