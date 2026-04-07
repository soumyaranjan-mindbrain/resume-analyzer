import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/user/Dashboard.jsx';
import Upload from './pages/user/Upload.jsx';
import Profile from './pages/user/Profile.jsx';
import Admin from './pages/admin/Admin.jsx';
import Matcher from './pages/user/Matcher.jsx';
import Saved from './pages/user/Saved.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/matcher" element={<Matcher />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
