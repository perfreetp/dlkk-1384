import { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  ChevronDown,
  Filter,
  Lock,
  Calendar,
  User,
} from 'lucide-react';
import useStore from '@/store/useStore';
import { cn } from '@/lib/utils';
import type { PermissionRequest } from '../../shared/types';

export default function Permission() {
  const { permissionRequests, fetchPermissionRequests, tools, fetchTools, submitPermissionRequest } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState('');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [showToolDropdown, setShowToolDropdown] = useState(false);

  useEffect(() => {
    fetchPermissionRequests();
    fetchTools({ pageSize: '50' });
  }, [fetchPermissionRequests, fetchTools]);

  const filteredRequests = permissionRequests.filter((req) => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const handleSubmit = () => {
    if (!selectedTool || !reason.trim()) return;
    const tool = tools.find(t => t.id === selectedTool);
    submitPermissionRequest({
      toolId: selectedTool,
      toolName: tool?.name || '',
      reason,
      urgency,
    });
    setShowApplyModal(false);
    setSelectedTool('');
    setReason('');
    setUrgency('medium');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: '待审批', icon: Clock, className: 'bg-amber-100 text-amber-700' };
      case 'approved':
        return { label: '已通过', icon: CheckCircle, className: 'bg-green-100 text-green-700' };
      case 'rejected':
        return { label: '已驳回', icon: XCircle, className: 'bg-red-100 text-red-700' };
      default:
        return { label: status, icon: AlertCircle, className: 'bg-gray-100 text-gray-700' };
    }
  };

  const getUrgencyConfig = (level: string) => {
    switch (level) {
      case 'high':
        return { label: '紧急', className: 'text-red-600 bg-red-50' };
      case 'medium':
        return { label: '较急', className: 'text-amber-600 bg-amber-50' };
      default:
        return { label: '一般', className: 'text-green-600 bg-green-50' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FileText className="w-7 h-7 text-primary-600" />
              权限申请
            </h1>
            <p className="text-gray-500 mt-1">申请工具使用权限，跟踪审批进度</p>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新建申请
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '全部申请', value: permissionRequests.length, icon: FileText, color: 'text-primary-600 bg-primary-50' },
            { label: '待审批', value: permissionRequests.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
            { label: '已通过', value: permissionRequests.filter(r => r.status === 'approved').length, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: '已驳回', value: permissionRequests.filter(r => r.status === 'rejected').length, icon: XCircle, color: 'text-red-600 bg-red-50' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-card mb-6">
          <div className="flex border-b border-gray-100 px-4">
            {[
              { id: 'all', label: '全部' },
              { id: 'pending', label: '待审批' },
              { id: 'approved', label: '已通过' },
              { id: 'rejected', label: '已驳回' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

        {/* Request List */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req, index) => {
              const statusConfig = getStatusConfig(req.status);
              const StatusIcon = statusConfig.icon;
              const urgencyConfig = getUrgencyConfig(req.urgency);
              return (
                <div
                  key={req.id}
                  className="card p-5 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{req.toolName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn('badge', statusConfig.className)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </span>
                          <span className={cn('text-xs px-2 py-0.5 rounded-full', urgencyConfig.className)}>
                            {urgencyConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    {req.status === 'pending' && (
                      <button className="text-sm text-primary-600 hover:text-primary-700">
                        撤销申请
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl">
                    {req.reason}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        申请人：{req.applicant}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {req.approver && (
                      <span>审批人：{req.approver}</span>
                    )}
                  </div>

                  {req.approveNote && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">审批意见：</span>
                        {req.approveNote}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="card p-12 text-center">
              <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">暂无申请记录</h3>
              <p className="text-gray-500 mb-4">点击右上角按钮提交你的第一个权限申请</p>
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                新建申请
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-800 mb-2">提交权限申请</h3>
            <p className="text-gray-500 text-sm mb-6">选择需要申请的工具并说明使用理由</p>

            <div className="space-y-4">
              {/* Tool Select */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">选择工具</label>
                <button
                  onClick={() => setShowToolDropdown(!showToolDropdown)}
                  className="w-full input-field text-left flex items-center justify-between"
                >
                  <span className={selectedTool ? 'text-gray-800' : 'text-gray-400'}>
                    {tools.find(t => t.id === selectedTool)?.name || '请选择工具'}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', showToolDropdown && 'rotate-180')} />
                </button>
                {showToolDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                    {tools.filter(t => t.requiresPermission && !t.hasPermission).map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setSelectedTool(tool.id);
                          setShowToolDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">申请理由</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="请描述使用场景和需求..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">紧急程度</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((level) => {
                    const config = getUrgencyConfig(level);
                    return (
                      <button
                        key={level}
                        onClick={() => setUrgency(level)}
                        className={cn(
                          'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
                          urgency === level
                            ? config.className + ' ring-2 ring-offset-1'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        )}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 btn-secondary py-2.5"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedTool || !reason.trim()}
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
