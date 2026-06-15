import { useState, useEffect } from 'react';
import {
  Settings,
  Wrench,
  MessageSquare,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  Search,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import useStore from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { Tool } from '../../shared/types';

interface ToolFormData {
  name: string;
  url: string;
  category: string;
  department: string;
  description: string;
  owner: string;
  ownerEmail: string;
  requiresPermission: boolean;
  notes: string;
  positions: string;
  tags: string;
}

const emptyForm: ToolFormData = {
  name: '',
  url: '',
  category: '沟通协作',
  department: 'all',
  description: '',
  owner: '',
  ownerEmail: '',
  requiresPermission: false,
  notes: '',
  positions: '',
  tags: '',
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('tools');
  const { tools, permissionRequests, feedbacks, fetchTools, fetchPermissionRequests, fetchFeedbacks, addTool, updateTool, deleteTool, approvePermission } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [showEditToolModal, setShowEditToolModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [form, setForm] = useState<ToolFormData>(emptyForm);
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [approveNote, setApproveNote] = useState('');

  useEffect(() => {
    fetchTools({ pageSize: '50' });
    fetchPermissionRequests();
    fetchFeedbacks();
  }, [fetchTools, fetchPermissionRequests, fetchFeedbacks]);

  const sidebarItems = [
    { id: 'tools', label: '工具管理', icon: Wrench, count: tools.length },
    { id: 'permissions', label: '权限审批', icon: CheckCircle, count: permissionRequests.filter(r => r.status === 'pending').length },
    { id: 'feedback', label: '反馈管理', icon: MessageSquare, count: feedbacks?.filter((f: any) => f.status === 'pending').length || 0 },
    { id: 'stats', label: '数据统计', icon: BarChart3 },
  ];

  const filteredTools = tools.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = permissionRequests.filter(r => r.status === 'pending');

  const handleAddTool = async () => {
    if (!form.name.trim() || !form.url.trim()) return;
    await addTool({
      name: form.name,
      url: form.url,
      category: form.category,
      department: form.department as Tool['department'],
      description: form.description,
      owner: form.owner,
      ownerEmail: form.ownerEmail,
      requiresPermission: form.requiresPermission,
      notes: form.notes,
      positions: form.positions.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(/[,，]/).map(s => s.trim()).filter(Boolean),
    });
    setShowAddToolModal(false);
    setForm(emptyForm);
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setForm({
      name: tool.name,
      url: tool.url,
      category: tool.category,
      department: tool.department,
      description: tool.description,
      owner: tool.owner,
      ownerEmail: tool.ownerEmail,
      requiresPermission: tool.requiresPermission,
      notes: tool.notes,
      positions: tool.positions.join('，'),
      tags: tool.tags.join('，'),
    });
    setShowEditToolModal(true);
  };

  const handleUpdateTool = async () => {
    if (!editingTool || !form.name.trim() || !form.url.trim()) return;
    await updateTool(editingTool.id, {
      name: form.name,
      url: form.url,
      category: form.category,
      department: form.department as Tool['department'],
      description: form.description,
      owner: form.owner,
      ownerEmail: form.ownerEmail,
      requiresPermission: form.requiresPermission,
      notes: form.notes,
      positions: form.positions.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(/[,，]/).map(s => s.trim()).filter(Boolean),
    });
    setShowEditToolModal(false);
    setEditingTool(null);
    setForm(emptyForm);
  };

  const handleDeleteTool = async (id: string) => {
    await deleteTool(id);
  };

  const handleApprove = async (id: string, action: 'approved' | 'rejected') => {
    await approvePermission(id, action, approveNote);
    setShowApproveModal(null);
    setApproveNote('');
  };

  const renderForm = (onSubmit: () => void, submitLabel: string) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">工具名称 *</label>
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="请输入工具名称" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">入口地址 *</label>
        <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://" className="input-field" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">工具分类</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
            <option>沟通协作</option>
            <option>文档协作</option>
            <option>数据分析</option>
            <option>营销推广</option>
            <option>客服工具</option>
            <option>内部系统</option>
            <option>设计工具</option>
            <option>其他</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">适用部门</label>
          <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input-field">
            <option value="all">全部部门</option>
            <option value="marketing">市场部</option>
            <option value="customer-service">客服部</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">工具描述</label>
        <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="简要描述工具用途..." className="input-field resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">负责人</label>
          <input type="text" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} placeholder="负责人姓名" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">联系邮箱</label>
          <input type="email" value={form.ownerEmail} onChange={e => setForm({ ...form, ownerEmail: e.target.value })} placeholder="邮箱地址" className="input-field" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">适用岗位</label>
        <input type="text" value={form.positions} onChange={e => setForm({ ...form, positions: e.target.value })} placeholder="多个岗位用逗号分隔，如：市场专员，运营经理" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">标签</label>
        <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="多个标签用逗号分隔，如：即时通讯，远程协作" className="input-field" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="requiresPermission" checked={form.requiresPermission} onChange={e => setForm({ ...form, requiresPermission: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
        <label htmlFor="requiresPermission" className="text-sm text-gray-700">需要申请权限才能使用</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">注意事项</label>
        <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="使用注意事项..." className="input-field resize-none" />
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => { setShowAddToolModal(false); setShowEditToolModal(false); setForm(emptyForm); }}
          className="flex-1 btn-secondary py-2.5"
        >
          取消
        </button>
        <button
          onClick={onSubmit}
          disabled={!form.name.trim() || !form.url.trim()}
          className="flex-1 btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">管理后台</h1>
              <p className="text-sm text-gray-500">工具管理、权限审批、数据统计</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="w-56 flex-shrink-0">
            <div className="card p-2 sticky top-20">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === 'tools' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">工具管理</h2>
                  <button
                    onClick={() => { setForm(emptyForm); setShowAddToolModal(true); }}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    新增工具
                  </button>
                </div>

                <div className="mb-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索工具..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    />
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">工具名称</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">分类</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">负责人</th>
                        <th className="text-left px-5 py-3 text-sm font-medium text-gray-500">访问量</th>
                        <th className="text-right px-5 py-3 text-sm font-medium text-gray-500">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredTools.map((tool) => (
                        <tr key={tool.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="font-medium text-gray-800">{tool.name}</div>
                            <div className="text-xs text-gray-400 truncate max-w-xs">{tool.description}</div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">
                            {tool.category}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600 hidden lg:table-cell">
                            {tool.owner}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            {tool.accessCount.toLocaleString()}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEditTool(tool)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteTool(tool.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">权限审批</h2>
                  <span className="text-sm text-gray-500">
                    {pendingRequests.length} 条待审批
                  </span>
                </div>

                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((req) => (
                      <div key={req.id} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-800">{req.toolName}</h3>
                            <p className="text-sm text-gray-500 mt-1">申请人：{req.applicant}</p>
                          </div>
                          <span className="badge bg-amber-100 text-amber-700">
                            <Clock className="w-3 h-3 mr-1" />
                            待审批
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <p className="text-sm text-gray-600">{req.reason}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            申请时间：{new Date(req.createdAt).toLocaleString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setShowApproveModal(req.id); setApproveNote(''); }}
                              className="px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              驳回
                            </button>
                            <button
                              onClick={() => handleApprove(req.id, 'approved')}
                              className="px-4 py-2 text-sm bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
                            >
                              通过
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">暂无待审批</h3>
                    <p className="text-gray-500">所有权限申请都已处理完毕</p>
                  </div>
                )}

                {permissionRequests.filter(r => r.status !== 'pending').length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">已处理</h3>
                    <div className="space-y-3">
                      {permissionRequests.filter(r => r.status !== 'pending').slice(0, 5).map(req => (
                        <div key={req.id} className="card p-4 opacity-75">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-800">{req.toolName}</h4>
                              <p className="text-sm text-gray-500">申请人：{req.applicant}</p>
                            </div>
                            <span className={cn(
                              'badge',
                              req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            )}>
                              {req.status === 'approved' ? '已通过' : '已驳回'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-4">反馈管理</h2>
                <div className="space-y-3">
                  {feedbacks && feedbacks.length > 0 ? (
                    feedbacks.map((fb: any) => {
                      const statusConfig = {
                        pending: { label: '待处理', className: 'bg-amber-100 text-amber-700' },
                        processing: { label: '处理中', className: 'bg-blue-100 text-blue-700' },
                        resolved: { label: '已解决', className: 'bg-green-100 text-green-700' },
                      }[fb.status] || { label: fb.status, className: 'bg-gray-100 text-gray-700' };

                      const typeConfig = {
                        'broken-link': { label: '链接失效', icon: AlertCircle, color: 'text-red-500' },
                        'recommend': { label: '工具推荐', icon: Plus, color: 'text-green-500' },
                        'other': { label: '其他反馈', icon: MessageSquare, color: 'text-blue-500' },
                      }[fb.type] || { label: fb.type, icon: MessageSquare, color: 'text-gray-500' };

                      return (
                        <div key={fb.id} className="card p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100', typeConfig.color)}>
                                <typeConfig.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">{fb.title}</h4>
                                <span className={cn('text-xs', typeConfig.color)}>{typeConfig.label}</span>
                                {fb.toolName && <span className="text-xs text-gray-400 ml-2">关联：{fb.toolName}</span>}
                              </div>
                            </div>
                            <span className={cn('badge', statusConfig.className)}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{fb.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">提交者：{fb.submitter} · {new Date(fb.createdAt).toLocaleString()}</span>
                            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                              处理
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="card p-12 text-center">
                      <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-800 mb-2">暂无反馈</h3>
                      <p className="text-gray-500">目前还没有用户反馈</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-4">数据统计</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: '工具总数', value: tools.length, icon: Wrench, color: 'from-blue-400 to-blue-600' },
                    { label: '总访问量', value: tools.reduce((sum, t) => sum + t.accessCount, 0).toLocaleString(), icon: BarChart3, color: 'from-green-400 to-green-600' },
                    { label: '待审批', value: pendingRequests.length, icon: Clock, color: 'from-amber-400 to-amber-600' },
                    { label: '待处理反馈', value: feedbacks?.filter((f: any) => f.status === 'pending').length || 0, icon: MessageSquare, color: 'from-purple-400 to-purple-600' },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="card p-5">
                        <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-3', stat.color)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="card p-5">
                  <h3 className="font-bold text-gray-800 mb-4">热门工具 TOP10</h3>
                  <div className="space-y-3">
                    {[...tools].sort((a, b) => b.accessCount - a.accessCount).slice(0, 10).map((tool, index) => (
                      <div key={tool.id} className="flex items-center gap-4">
                        <span className={cn(
                          'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                          index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                        )}>
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm text-gray-700">{tool.name}</span>
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                            style={{ width: `${(tool.accessCount / (tools[0]?.accessCount || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-16 text-right">
                          {tool.accessCount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showAddToolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">新增工具</h3>
              <button onClick={() => { setShowAddToolModal(false); setForm(emptyForm); }} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            {renderForm(handleAddTool, '确认添加')}
          </div>
        </div>
      )}

      {showEditToolModal && editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">编辑工具</h3>
              <button onClick={() => { setShowEditToolModal(false); setEditingTool(null); setForm(emptyForm); }} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            {renderForm(handleUpdateTool, '保存修改')}
          </div>
        </div>
      )}

      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-800 mb-4">审批意见</h3>
            <textarea
              value={approveNote}
              onChange={e => setApproveNote(e.target.value)}
              placeholder="请输入审批意见（可选）"
              rows={3}
              className="input-field resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(showApproveModal, 'rejected')}
                className="flex-1 px-4 py-2.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                驳回
              </button>
              <button
                onClick={() => handleApprove(showApproveModal, 'approved')}
                className="flex-1 px-4 py-2.5 text-sm bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
