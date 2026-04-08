import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './components/layout/BaseLayout';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import History from './pages/History.jsx';
import JobMatches from './pages/JobMatches.jsx';
import Recommendations from './pages/Recommendations.jsx';
import SkillInsights from './pages/SkillInsights.jsx';
import Support from './pages/Support.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<BaseLayout><Landing /></BaseLayout>} />
        <Route path="/auth" element={<BaseLayout><Auth /></BaseLayout>} />
        
        {/* Private App Routes */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/history" element={<AppLayout><History /></AppLayout>} />
        <Route path="/matches" element={<AppLayout><JobMatches /></AppLayout>} />
        <Route path="/recommendations" element={<AppLayout><Recommendations /></AppLayout>} />
        <Route path="/insights" element={<AppLayout><SkillInsights /></AppLayout>} />
        <Route path="/support" element={<AppLayout><Support /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
