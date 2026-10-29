// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { JSX } from 'react';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

export function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;