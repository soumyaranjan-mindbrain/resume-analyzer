import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BaseLayout from './components/layout/BaseLayout';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/landing/Landing.jsx';
import Auth from './pages/auth/Auth.jsx';
import Dashboard from './pages/user/Dashboard.jsx';
import History from './pages/user/History.jsx';
import ResumeMaker from './pages/user/ResumeMaker.jsx';
import JobMatches from './pages/user/JobMatches.jsx';
import Recommendations from './pages/user/Recommendations.jsx';
import SkillInsights from './pages/user/SkillInsights.jsx';
import Support from './pages/user/Support.jsx';
import Profile from './pages/user/Profile.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Students from './pages/admin/Students.jsx';
import Reports from './pages/admin/Reports.jsx';
import SettingsAdmin from './pages/admin/Settings.jsx';
import JobDescriptions from './pages/admin/JobDescriptions.jsx';
import AddJobRole from './pages/admin/AddJobRole.jsx';
import SupportManagement from './pages/admin/SupportManagement.jsx';
import AdminConfig from './pages/admin/AdminConfig.jsx';

import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import PublicRoute from './components/layout/PublicRoute.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import { ConfigProvider } from './context/ConfigContext.jsx';
import { AnalysisProvider } from './context/AnalysisContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import Maintenance from './pages/Maintenance.jsx';
import Onboarding from './pages/user/Onboarding.jsx';

import PrivacyPolicy from './pages/legal/PrivacyPolicy.jsx';
import Terms from './pages/legal/Terms.jsx';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <ConfigProvider>
        <SocketProvider>
          <AdminProvider>
            <AnalysisProvider>
              <Routes>
                <Route path="/" element={<PublicRoute><BaseLayout><Landing /></BaseLayout></PublicRoute>} />
                <Route path="/auth" element={<PublicRoute><BaseLayout><Auth /></BaseLayout></PublicRoute>} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/privacy" element={<PublicRoute><BaseLayout><PrivacyPolicy /></BaseLayout></PublicRoute>} />
                <Route path="/terms" element={<PublicRoute><BaseLayout><Terms /></BaseLayout></PublicRoute>} />

                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />

                <Route path="/history" element={<ProtectedRoute allowedRoles={['student']}><AppLayout><History /></AppLayout></ProtectedRoute>} />
                <Route path="/resume-maker" element={<ProtectedRoute allowedRoles={['student']}><AppLayout><ResumeMaker /></AppLayout></ProtectedRoute>} />
                <Route path="/matches" element={<ProtectedRoute allowedRoles={['student']}><AppLayout><JobMatches /></AppLayout></ProtectedRoute>} />
                <Route path="/recommendations" element={<ProtectedRoute allowedRoles={['student']}><AppLayout><Recommendations /></AppLayout></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute allowedRoles={['student']}><AppLayout><SkillInsights /></AppLayout></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute allowedRoles={['student']}><AppLayout><Support /></AppLayout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute allowedRoles={['student', 'admin']}><AppLayout><Profile /></AppLayout></ProtectedRoute>} />

                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
                <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><Students /></AppLayout></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
                <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><JobDescriptions /></AppLayout></ProtectedRoute>} />
                <Route path="/admin/jobs/new" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AddJobRole /></AppLayout></ProtectedRoute>} />
                <Route path="/admin/jobs/edit/:id" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AddJobRole /></AppLayout></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><SettingsAdmin /></AppLayout></ProtectedRoute>} />
                <Route path="/admin/support" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><SupportManagement /></AppLayout></ProtectedRoute>} />
                <Route path="/admin/config" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout><AdminConfig /></AppLayout></ProtectedRoute>} />

              </Routes>
            </AnalysisProvider>
          </AdminProvider>
        </SocketProvider>
      </ConfigProvider>
    </Router>
  );
}

export default App;
