import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import MPINPage from './pages/MPINPage';
import HomePage from './pages/HomePage';
import ClassDetailPage from './pages/ClassDetailPage';
import AutoAttendancePage from './pages/AutoAttendancePage';
import ManualAttendancePage from './pages/ManualAttendancePage';
import TimeTablePage from './pages/TimeTablePage';
import ClassesPage from './pages/ClassesPage';
import SettingsPage from './pages/SettingsPage';
import LectureDetailPage from './pages/LectureDetailPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    // Check for authentication cookie
    const authCookie = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('authExpiry');

    if (authCookie && expiry && new Date().getTime() < parseInt(expiry)) {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle splash screen display
  useEffect(() => {
    // Set a timer to hide the splash screen after 1.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Function to set authentication state
  const handleAuthentication = (status) => {
    setIsAuthenticated(status);

    if (status) {
      // Set authentication for 1 hour
      const expiryTime = new Date().getTime() + (60 * 60 * 1000); // 1 hour from now
      localStorage.setItem('authToken', 'authenticated');
      localStorage.setItem('authExpiry', expiryTime.toString());
    } else {
      // Clear authentication
      localStorage.removeItem('authToken');
      localStorage.removeItem('authExpiry');
    }
  };

  // Show only splash screen during the initial time
  if (showSplash) {
    return <SplashScreen />;
  }

  // After splash screen, show the authentication flow
  return (
    <Router>
      <Routes>
        {/* Authentication route */}
        <Route
          path="/auth"
          element={
            isAuthenticated ?
              <Navigate to="/" replace /> :
              <MPINPage onAuthenticate={() => handleAuthentication(true)} />
          }
        />

        {/* Protected routes - redirect to auth if not authenticated */}
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/timetable"
          element={isAuthenticated ? <TimeTablePage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/classes"
          element={isAuthenticated ? <ClassesPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <SettingsPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/class/:id"
          element={isAuthenticated ? <ClassDetailPage /> : <Navigate to="/auth" replace />}
        />
        <Route path="/lecture/:id" element={
            <LectureDetailPage />
        } />
        <Route
          path="/class/:id/auto-attendance"
          element={isAuthenticated ? <AutoAttendancePage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/class/:id/manual-attendance"
          element={isAuthenticated ? <ManualAttendancePage /> : <Navigate to="/auth" replace />}
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;