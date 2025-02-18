// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Layouts
import MainLayout from "./components/layouts/MainLayout";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Elections from './pages/Elections';
import HealthNotifications from './pages/HealthNotifications';
import FacilityBooking from './pages/FacilityBooking';
// import Applications from './pages/applications/Applications';
// import AcademicIntegrity from './pages/academic/AcademicIntegrity';
// import Complaints from './pages/complaints/Complaints';
// import Budget from './pages/finance/Budget';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/elections/*" element={<Elections />} />
                <Route path="/health/*" element={<HealthNotifications />} />
                <Route path="/facilities/*" element={<FacilityBooking />} />
                {/* <Route path="/applications/*" element={<Applications />} /> */}
                {/* <Route path="/academic/*" element={<AcademicIntegrity />} /> */}
                {/* <Route path="/complaints/*" element={<Complaints />} /> */}
                {/* <Route path="/budget/*" element={<Budget />} /> */}
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
