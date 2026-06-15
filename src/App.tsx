import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Tools from '@/pages/Tools';
import ToolDetail from '@/pages/ToolDetail';
import Permission from '@/pages/Permission';
import Guides from '@/pages/Guides';
import Changelog from '@/pages/Changelog';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/:id" element={<ToolDetail />} />
            <Route path="/permission" element={<Permission />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:section" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<div className="text-center py-20 text-gray-500">页面不存在</div>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-gray-400">
            <p>© 2024 团队工具收藏夹 · 让每位同事都能快速找到需要的工具</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
