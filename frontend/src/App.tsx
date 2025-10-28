import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AdminRoute, PublicRoute } from './components/guards/RouteGuards';

// Pages
import Home from './pages/user/Home';
import Auth from './pages/user/Auth';
import EventDetailPage from './pages/user/Events/EventDetail';
import Dashboard from './pages/admin/Dashboard';
import UsersPage from './pages/admin/Users';
import ClubsPage from './pages/admin/Clubs';
import EventsPage from './pages/admin/Events';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              }
            />

            {/* Public homepage: ai cũng xem được */}
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<EventDetailPage />} />

            {/* Không dùng khu vực /user riêng nữa; người dùng thường sẽ ở trang chủ */}

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/clubs"
              element={
                <AdminRoute>
                  <ClubsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <AdminRoute>
                  <EventsPage />
                </AdminRoute>
              }
            />
            
            {/* Redirect unmatched routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
