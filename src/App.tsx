import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreateVideo } from './pages/CreateVideo';
import { VideoDetail } from './pages/VideoDetail';
import { Settings } from './pages/Settings';
import { Drafts } from './pages/Drafts';
import { ManageUsers } from './pages/ManageUsers';
import { Avatars } from './pages/Avatars';
import { CreateAvatar } from './pages/CreateAvatar';
import { ModulePlaceholder } from './pages/ModulePlaceholder';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="create" element={<CreateVideo />} />
              <Route path="video/:id" element={<VideoDetail />} />
              <Route path="settings" element={<Settings />} />
              <Route path="avatars" element={<Avatars />} />
              <Route path="create-avatar" element={<CreateAvatar />} />
              <Route path="drafts" element={<Drafts />} />
              <Route path="manage-users" element={<ManageUsers />} />
              
              {/* Module Placeholders */}
              <Route path="analytics" element={<ModulePlaceholder title="Analytics Engine" />} />
              <Route path="subjects" element={<ModulePlaceholder title="Subject Management" />} />
              <Route path="videos" element={<ModulePlaceholder title="Media Repository" />} />
              <Route path="sync" element={<ModulePlaceholder title="HeyGen Synchronization" />} />
              <Route path="roles" element={<ModulePlaceholder title="RBAC Configurations" />} />
              <Route path="departments" element={<ModulePlaceholder title="Departmental Routing" />} />
              <Route path="profile" element={<ModulePlaceholder title="Institutional Identity" />} />
              <Route path="billing" element={<ModulePlaceholder title="Cloud Resource Quota" />} />
              <Route path="sso" element={<ModulePlaceholder title="Identity Provider Sync" />} />
              <Route path="lms" element={<ModulePlaceholder title="Educational Integration" />} />
              <Route path="chapters" element={<ModulePlaceholder title="Curriculum Segments" />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

