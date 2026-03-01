import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth.store";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Placeholder Dashboard
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Dashboard (Protected)</h1>
    <p>Welcome to your AI-powered assessment dashboard!</p>
    <button 
      onClick={() => useAuthStore.getState().logout()}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  </div>
);

function App() {
  const { checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} 
      />

      {/* Onboarding - Protected but accessible if !isOnboarded */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            {user?.isOnboarded ? <Navigate to="/dashboard" replace /> : <OnboardingPage />}
          </ProtectedRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Root redirect logic */}
      <Route 
        path="/" 
        element={
          !isAuthenticated 
            ? <Navigate to="/login" replace /> 
            : !user?.isOnboarded 
              ? <Navigate to="/onboarding" replace /> 
              : <Navigate to="/dashboard" replace />
        } 
      />
      
      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
