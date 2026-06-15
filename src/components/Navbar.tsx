import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Bookmark,
  FileText,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import useStore from '@/store/useStore';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, currentUser, notifications } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { label: '首页', path: '/', icon: LayoutDashboard },
    { label: '工具目录', path: '/tools', icon: Bookmark },
    { label: '使用说明', path: '/guides', icon: FileText },
    { label: '变更记录', path: '/changelog', icon: Bell },
  ];

  return (
    <nav className="bg-white shadow-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">工具收藏夹</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工具、文档、教程..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm transition-all focus:outline-none',
                  searchFocused && 'bg-white border-primary-300 shadow-md'
                )}
              />
              {searchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 text-xs text-gray-400">热门搜索</div>
                  {['飞书', '智齿客服', '数据分析', '公众号'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        navigate(`/tools?search=${encodeURIComponent(term)}`);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {currentUser?.name?.charAt(0) || '用'}
                </div>
                <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', showUserMenu && 'rotate-180')} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="font-medium text-gray-800">{currentUser?.name || '张小明'}</div>
                    <div className="text-sm text-gray-500">{currentUser?.position || '市场专员'}</div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    个人中心
                  </Link>
                  <Link
                    to="/permission"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FileText className="w-4 h-4" />
                    我的申请
                  </Link>
                  {currentUser?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      管理后台
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 text-gray-500 hover:text-primary-600 rounded-lg"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg mb-1',
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
