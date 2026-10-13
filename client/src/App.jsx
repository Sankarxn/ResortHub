import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Rooms } from './pages/Rooms';
import { Profile } from './pages/Profile';
import { useAuth } from './context/AuthContext';

export function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-primary)',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            border: '4px solid var(--color-surface-soft)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontWeight: '600', fontSize: '1rem' }}>Loading ResortHub...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* Show Navbar only when authenticated */}
      {isAuthenticated && <Navbar />}

      <main>
        <Routes>
          {/* Root route redirects to /rooms if logged in, otherwise to /login */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/rooms' : '/login'} replace />}
          />

          {/* Authentication Routes: inaccessible if already logged in */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/rooms" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/rooms" replace /> : <Register />}
          />

          {/* Protected Rooms Discovery Page */}
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <Rooms />
              </ProtectedRoute>
            }
          />

          {/* Protected Profile Page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Legacy redirect from /resorts to /rooms */}
          <Route path="/resorts" element={<Navigate to="/rooms" replace />} />
          <Route path="/resorts/:id" element={<Navigate to="/rooms" replace />} />

          {/* Catch-all route */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/rooms' : '/login'} replace />}
          />
        </Routes>
      </main>

      {/* Show Footer when authenticated */}
      {isAuthenticated && <Footer />}
    </div>
  );
}

export default App;
