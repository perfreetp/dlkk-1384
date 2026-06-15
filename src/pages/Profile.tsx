import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Bookmark,
  FileText,
  Settings,
  UserPlus,
  Check,
  ChevronRight,
  Heart,
  Bell,
  Mail,
  Briefcase,
  Building,
} from 'lucide-react';
import useStore from '@/store/useStore';
import ToolCard from '@/components/ToolCard';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { section = 'favorites' } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const {
    currentUser,
    favoriteTools,
    permissionRequests,
    onboardingTasks,
    onboardingProgress,
    fetchUserProfile,
    fetchFavorites,
    fetchPermissionRequests,
    fetchOnboarding,
    toggleFavorite,
    completeOnboardingTask,
  } = useStore();

  const [activeSection, setActiveSection] = useState(section || 'favorites');

  useEffect(() => {
    fetchUserProfile();
    fetchFavorites();
    fetchPermissionRequests();
    fetchOnboarding();
  }, [fetchUserProfile, fetchFavorites, fetchPermissionRequests, fetchOnboarding]);

  const sidebarItems = [
    { id: 'favorites', label: '我的收藏', icon: Heart },
    { id: 'onboarding', label: '入职清单', icon: UserPlus },
    { id: 'permissions', label: '我的申请', icon: FileText },
    { id: 'subscriptions', label: '订阅设置', icon: Bell },
    { id: 'profile', label: '个人资料', icon: User },
  ];

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    navigate(`/profile/${id}`);
  };

  const pendingCount = permissionRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden md:block">
            {/* User Card */}
            <div className="card p-6 mb-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {currentUser?.name?.charAt(0) || '用'}
              </div>
              <h3 className="font-bold text-gray-800">{currentUser?.name || '张小明'}</h3>
              <p className="text-sm text-gray-500 mt-1">{currentUser?.position || '市场专员'}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-2">
                <Building className="w-3.5 h-3.5" />
                {currentUser?.department === 'marketing' ? '市场部' : '客服部'}
              </div>
            </div>

            {/* Menu */}
            <div className="card p-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.id === 'permissions' && pendingCount > 0 && (
                      <span className="bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {pendingCount}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Favorites Section */}
            {activeSection === 'favorites' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent-500" />
                  我的收藏
                  <span className="text-sm font-normal text-gray-400">({favoriteTools.length})</span>
                </h2>

                {favoriteTools.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteTools.map((tool, index) => (
                      <div key={tool.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-fade-in-up">
                        <ToolCard tool={tool} onToggleFavorite={() => toggleFavorite(tool.id)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <Bookmark className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">还没有收藏</h3>
                    <p className="text-gray-500 mb-4">收藏常用工具，快速访问</p>
                    <Link to="/tools" className="btn-primary inline-flex">
                      去发现工具
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Onboarding Section */}
            {activeSection === 'onboarding' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary-600" />
                  入职学习清单
                </h2>

                {/* Progress Card */}
                <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">学习进度</h3>
                      <p className="text-sm text-white/70">完成所有任务，快速融入团队</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{onboardingProgress.progress}%</div>
                      <div className="text-sm text-white/70">
                        {onboardingProgress.completed}/{onboardingProgress.total} 已完成
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${onboardingProgress.progress}%` }}
                    />
                  </div>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                  {onboardingTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={cn(
                        'card p-4 flex items-start gap-4 transition-all',
                        task.isCompleted && 'bg-green-50/50 border-green-200'
                      )}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <button
                        onClick={() => !task.isCompleted && completeOnboardingTask(task.id)}
                        className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
                          task.isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-primary-500'
                        )}
                      >
                        {task.isCompleted && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={cn('font-medium', task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800')}>
                            {task.description}
                          </h4>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          相关工具：{task.toolName}
                        </p>
                        {task.isCompleted && task.completedAt && (
                          <p className="text-xs text-green-600 mt-2">
                            已完成 · {new Date(task.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/tools/${task.toolId}`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex-shrink-0"
                      >
                        查看
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Permissions Section */}
            {activeSection === 'permissions' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  我的申请
                </h2>

                <Link to="/permission" className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center gap-1">
                  查看全部申请 <ChevronRight className="w-4 h-4" />
                </Link>

                <div className="space-y-3">
                  {permissionRequests.slice(0, 5).map((req, index) => {
                    const statusConfig = {
                      pending: { label: '待审批', className: 'bg-amber-100 text-amber-700' },
                      approved: { label: '已通过', className: 'bg-green-100 text-green-700' },
                      rejected: { label: '已驳回', className: 'bg-red-100 text-red-700' },
                    }[req.status] || { label: req.status, className: 'bg-gray-100 text-gray-700' };

                    return (
                      <div
                        key={req.id}
                        className="card p-4 flex items-center justify-between"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">{req.toolName}</h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{req.reason}</p>
                        </div>
                        <span className={cn('badge', statusConfig.className)}>
                          {statusConfig.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Subscriptions Section */}
            {activeSection === 'subscriptions' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary-600" />
                  订阅设置
                </h2>

                <div className="card divide-y divide-gray-100">
                  {[
                    { id: 'changelog', title: '变更记录通知', desc: '工具新增、更新、下线时通知', enabled: true },
                    { id: 'toolUpdates', title: '工具更新提醒', desc: '关注的工具有重大更新时提醒', enabled: true },
                    { id: 'permissionStatus', title: '权限审批结果', desc: '申请的权限有结果时通知', enabled: true },
                    { id: 'weekly', title: '每周使用报告', desc: '每周一推送工具使用统计', enabled: false },
                  ].map((item) => (
                    <div key={item.id} className="p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        className={cn(
                          'w-12 h-7 rounded-full transition-colors relative',
                          item.enabled ? 'bg-primary-500' : 'bg-gray-200'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform',
                            item.enabled ? 'left-6' : 'left-1'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-600" />
                  个人资料
                </h2>

                <div className="card p-6">
                  <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {currentUser?.name?.charAt(0) || '用'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{currentUser?.name || '张小明'}</h3>
                      <p className="text-gray-500">{currentUser?.email || 'zhangxiaoming@company.com'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <User className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-sm text-gray-500">姓名</label>
                        <p className="font-medium text-gray-800">{currentUser?.name || '张小明'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-sm text-gray-500">邮箱</label>
                        <p className="font-medium text-gray-800">{currentUser?.email || 'zhangxiaoming@company.com'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-sm text-gray-500">部门</label>
                        <p className="font-medium text-gray-800">
                          {currentUser?.department === 'marketing' ? '市场部' : '客服部'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-sm text-gray-500">岗位</label>
                        <p className="font-medium text-gray-800">{currentUser?.position || '市场专员'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
