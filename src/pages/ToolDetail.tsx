import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  ExternalLink,
  Lock,
  Unlock,
  User,
  Users,
  Mail,
  AlertTriangle,
  FileText,
  Tag,
  Clock,
  BarChart3,
  ChevronRight,
  BookOpen,
  MessageSquarePlus,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Tool, Guide } from '../../shared/types';
import { cn } from '@/lib/utils';

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionReason, setPermissionReason] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchTool = async () => {
      const res = await fetch(`http://localhost:3001/api/tools/${id}`);
      const data = await res.json();
      if (data.success) {
        setTool(data.data);
        setIsFavorited(data.data.isFavorite);
      }
    };

    const fetchGuides = async () => {
      const res = await fetch(`http://localhost:3001/api/guides?toolId=${id}`);
      const data = await res.json();
      if (data.success) {
        setGuides(data.data);
      }
    };

    const fetchRelated = async () => {
      const res = await fetch(`http://localhost:3001/api/tools?pageSize=4`);
      const data = await res.json();
      if (data.success) {
        setRelatedTools(data.data.filter((t: Tool) => t.id !== id).slice(0, 3));
      }
    };

    if (id) {
      fetchTool();
      fetchGuides();
      fetchRelated();
    }
  }, [id]);

  const toggleFavorite = async () => {
    if (!id) return;
    setIsFavorited(!isFavorited);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    await fetch(`http://localhost:3001/api/tools/${id}/toggle-favorite`, {
      method: 'POST',
    });
  };

  const submitPermission = async () => {
    if (!tool || !permissionReason.trim()) return;
    await fetch('http://localhost:3001/api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolId: tool.id,
        toolName: tool.name,
        reason: permissionReason,
        urgency,
        applicant: '张小明',
      }),
    });
    setShowPermissionModal(false);
    setPermissionReason('');
    navigate('/permission');
  };

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tool.icon] || LucideIcons.Globe;

  const tabs = [
    { id: 'overview', label: '概览' },
    { id: 'guides', label: '使用指南' },
    { id: 'notes', label: '注意事项' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回工具列表
          </button>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-10 h-10 text-white" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{tool.name}</h1>
                {tool.requiresPermission ? (
                  tool.hasPermission ? (
                    <span className="badge bg-green-400/20 text-green-200">
                      <Unlock className="w-3 h-3 mr-1" />
                      已授权
                    </span>
                  ) : (
                    <span className="badge bg-amber-400/20 text-amber-200">
                      <Lock className="w-3 h-3 mr-1" />
                      需申请权限
                    </span>
                  )
                ) : (
                  <span className="badge bg-green-400/20 text-green-200">
                    <Unlock className="w-3 h-3 mr-1" />
                    全员可用
                  </span>
                )}
              </div>
              <p className="text-white/70 mb-4">{tool.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  {tool.accessCount.toLocaleString()} 次访问
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  更新于 {new Date(tool.updatedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  负责人：{tool.owner}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={toggleFavorite}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                  isFavorited
                    ? 'bg-accent-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                )}
              >
                <Heart
                  className={cn(
                    'w-5 h-5',
                    isFavorited && 'fill-white',
                    isAnimating && 'animate-bounce-subtle'
                  )}
                />
              </button>

              {tool.hasPermission || !tool.requiresPermission ? (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  立即访问
                </a>
              ) : (
                <button
                  onClick={() => setShowPermissionModal(true)}
                  className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                  <Lock className="w-4 h-4" />
                  申请权限
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-card mb-6">
              <div className="flex border-b border-gray-100 px-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-4 py-4 font-medium text-sm border-b-2 transition-colors -mb-px',
                      activeTab === tab.id
                        ? 'text-primary-600 border-primary-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Basic Info */}
                <div className="card p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    工具信息
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">工具名称</span>
                      <p className="font-medium text-gray-800 mt-1">{tool.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">入口地址</span>
                      <p className="font-medium text-primary-600 mt-1 break-all">{tool.url}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">负责人</span>
                      <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {tool.owner}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">联系邮箱</span>
                      <p className="font-medium text-gray-800 mt-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {tool.ownerEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="card p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary-600" />
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suitable Positions */}
                <div className="card p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    适用岗位
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.positions.map((pos) => (
                      <span
                        key={pos}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg"
                      >
                        {pos}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Guides Preview */}
                {guides.length > 0 && (
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary-600" />
                        使用指南
                      </h3>
                      <button
                        onClick={() => setActiveTab('guides')}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        查看全部
                      </button>
                    </div>
                    <div className="space-y-3">
                      {guides.slice(0, 3).map((guide) => (
                        <div
                          key={guide.id}
                          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <h4 className="font-medium text-gray-800">{guide.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {guide.category} · 第 {guide.order} 篇
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'guides' && (
              <div className="space-y-4 animate-fade-in">
                {guides.length > 0 ? (
                  guides.map((guide, index) => (
                    <div key={guide.id} className="card p-6" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-full">
                            {guide.category}
                          </span>
                          <h3 className="font-bold text-gray-800 mt-2 text-lg">{guide.title}</h3>
                        </div>
                        <span className="text-sm text-gray-400">第 {guide.order} 篇</span>
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-600">
                        {guide.content.split('\n').map((line, i) => {
                          if (line.startsWith('## ')) {
                            return <h4 key={i} className="font-bold text-gray-800 mt-4 mb-2">{line.replace('## ', '')}</h4>;
                          }
                          if (line.startsWith('- ')) {
                            return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                          }
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={i} className="font-medium mt-2">{line.replace(/\*\*/g, '')}</p>;
                          }
                          return line ? <p key={i} className="my-2">{line}</p> : <br key={i} />;
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="card p-12 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">暂无使用指南</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="card p-6 animate-fade-in">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  注意事项
                </h3>
                {tool.notes ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
                    {tool.notes}
                  </div>
                ) : (
                  <p className="text-gray-500">暂无特别注意事项</p>
                )}

                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-3">使用规范</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      请妥善保管账号密码，切勿转借他人
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      涉及客户数据的工具，严禁私自导出
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      发现链接失效或功能异常，请及时反馈
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Quick Actions */}
              <div className="card p-5">
                <h3 className="font-bold text-gray-800 mb-4">快捷操作</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3">
                    <MessageSquarePlus className="w-4 h-4 text-gray-400" />
                    提交反馈
                  </button>
                  <button className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    举报失效
                  </button>
                </div>
              </div>

              {/* Related Tools */}
              <div className="card p-5">
                <h3 className="font-bold text-gray-800 mb-4">相关工具</h3>
                <div className="space-y-3">
                  {relatedTools.map((relTool) => {
                    const RelIcon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[relTool.icon] || LucideIcons.Globe;
                    return (
                      <Link
                        key={relTool.id}
                        to={`/tools/${relTool.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                          <RelIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 text-sm truncate group-hover:text-primary-600">
                            {relTool.name}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{relTool.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-800 mb-2">申请 {tool.name} 权限</h3>
            <p className="text-gray-500 text-sm mb-6">请填写申请理由，管理员将尽快审核</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">申请理由</label>
                <textarea
                  value={permissionReason}
                  onChange={(e) => setPermissionReason(e.target.value)}
                  placeholder="请描述使用场景和需求..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">紧急程度</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setUrgency(level)}
                      className={cn(
                        'flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors',
                        urgency === level
                          ? level === 'low'
                            ? 'bg-green-100 text-green-700'
                            : level === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      )}
                    >
                      {level === 'low' ? '一般' : level === 'medium' ? '较急' : '紧急'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="flex-1 btn-secondary py-2.5"
              >
                取消
              </button>
              <button
                onClick={submitPermission}
                disabled={!permissionReason.trim()}
                className="flex-1 btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
