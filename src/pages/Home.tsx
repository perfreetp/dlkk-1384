import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  Bookmark,
  ChevronRight,
  Sparkles,
  UserPlus,
  FileText,
  BarChart3,
  Grid3X3,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import useStore from '@/store/useStore';
import ToolCard from '@/components/ToolCard';
import { cn } from '@/lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const {
    currentDepartment,
    setDepartment,
    popularTools,
    favoriteTools,
    categories,
    searchQuery,
    setSearchQuery,
    onboardingProgress,
    fetchPopularTools,
    fetchFavorites,
    fetchCategories,
    fetchUserProfile,
    fetchOnboarding,
    toggleFavorite,
  } = useStore();

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchPopularTools();
    fetchFavorites();
    fetchCategories();
    fetchUserProfile();
    fetchOnboarding();
  }, [fetchPopularTools, fetchFavorites, fetchCategories, fetchUserProfile, fetchOnboarding]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      navigate(`/tools?search=${encodeURIComponent(searchInput)}`);
    }
  };

  const deptTabs = [
    { id: 'marketing', label: '市场部', desc: '营销推广、内容运营、数据分析' },
    { id: 'customer-service', label: '客服部', desc: '客户服务、工单处理、关系维护' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/50 to-transparent">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span className="text-sm text-gray-600">团队工具统一入口 · 快速找到你需要的</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            团队工具
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
              收藏夹
            </span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            沉淀市场部与客服部常用 SaaS、内部后台和资料入口
            <br />
            让每位新同事都能快速上手，不再找不到正确链接
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工具名称、描述或标签..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-2xl text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary px-6 py-2.5 rounded-xl"
              >
                搜索
              </button>
            </div>
          </form>

          {/* Department Tabs */}
          <div className="flex justify-center gap-4">
            {deptTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDepartment(tab.id as 'marketing' | 'customer-service')}
                className={cn(
                  'px-6 py-3 rounded-xl font-medium transition-all',
                  currentDepartment === tab.id
                    ? 'bg-primary-700 text-white shadow-lg shadow-primary-700/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Access */}
            {favoriteTools.length > 0 && (
              <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-accent-500" />
                    <h2 className="text-xl font-bold text-gray-800">我的常用</h2>
                    <span className="text-sm text-gray-400">({favoriteTools.length})</span>
                  </div>
                  <Link
                    to="/profile/favorites"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    管理 <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {favoriteTools.slice(0, 6).map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      variant="compact"
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Categories */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-800">工具分类</h2>
                </div>
                <Link
                  to="/tools"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  全部工具 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.slice(0, 8).map((cat, index) => {
                  const IconComp = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon] || LucideIcons.Grid;
                  const gradients = [
                    'from-blue-400 to-blue-600',
                    'from-emerald-400 to-emerald-600',
                    'from-amber-400 to-orange-500',
                    'from-rose-400 to-rose-600',
                    'from-violet-400 to-violet-600',
                    'from-cyan-400 to-cyan-600',
                    'from-lime-400 to-green-500',
                    'from-pink-400 to-pink-600',
                  ];
                  return (
                    <Link
                      key={cat.id}
                      to={`/tools?category=${cat.id}`}
                      className="card card-hover p-4 flex flex-col items-center text-center group"
                    >
                      <div className={cn(
                        'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform',
                        gradients[index % gradients.length]
                      )}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div className="font-medium text-gray-800 text-sm">{cat.name}</div>
                      <div className="text-xs text-gray-400">{cat.count} 个工具</div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Onboarding */}
            {onboardingProgress.total > 0 && (
              <section className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center text-white">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">入职学习清单</h3>
                      <p className="text-sm text-gray-500">完成工具学习，快速融入团队</p>
                    </div>
                  </div>
                  <Link
                    to="/profile/onboarding"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    查看详情
                  </Link>
                </div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    已完成 {onboardingProgress.completed} / {onboardingProgress.total} 项
                  </span>
                  <span className="font-bold text-primary-600">{onboardingProgress.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                    style={{ width: `${onboardingProgress.progress}%` }}
                  />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Ranking */}
            <section className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-accent-500" />
                <h2 className="font-bold text-gray-800">热门排行</h2>
              </div>
              <div className="space-y-3">
                {popularTools.slice(0, 5).map((tool, index) => (
                  <Link
                    key={tool.id}
                    to={`/tools/${tool.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                      index === 0 && 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
                      index === 1 && 'bg-gradient-to-br from-gray-300 to-gray-400 text-white',
                      index === 2 && 'bg-gradient-to-br from-amber-600 to-amber-700 text-white',
                      index > 2 && 'bg-gray-100 text-gray-500'
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm truncate group-hover:text-primary-600">
                        {tool.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {tool.accessCount.toLocaleString()} 次访问
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
                  </Link>
                ))}
              </div>
              <Link
                to="/tools?sort=popular"
                className="mt-4 w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors block"
              >
                查看完整榜单
              </Link>
            </section>

            {/* Quick Links */}
            <section className="card p-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary-600" />
                <h2 className="font-bold text-gray-800">快速入口</h2>
              </div>
              <div className="space-y-2">
                <Link
                  to="/permission"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">权限申请</div>
                    <div className="text-xs text-gray-400">申请工具使用权限</div>
                  </div>
                </Link>
                <Link
                  to="/guides"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">使用说明</div>
                    <div className="text-xs text-gray-400">查看工具操作指南</div>
                  </div>
                </Link>
                <Link
                  to="/changelog"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">变更记录</div>
                    <div className="text-xs text-gray-400">了解工具更新动态</div>
                  </div>
                </Link>
              </div>
            </section>

            {/* Feedback */}
            <section className="card p-5 bg-gradient-to-br from-primary-600 to-primary-800 text-white animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h3 className="font-bold mb-2">发现问题？</h3>
              <p className="text-sm text-primary-100 mb-4">
                链接失效？想推荐新工具？欢迎告诉我们
              </p>
              <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 rounded-xl transition-colors">
                提交反馈
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
