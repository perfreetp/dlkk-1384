import { useEffect, useState } from 'react';
import {
  Bell,
  Plus,
  Edit3,
  Trash2,
  Wrench,
  ChevronDown,
  Calendar,
  Tag,
  Settings,
} from 'lucide-react';
import type { ChangeLog } from '../../shared/types';
import { cn } from '@/lib/utils';

export default function Changelog() {
  const [logs, setLogs] = useState<ChangeLog[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('http://localhost:3001/api/changelog');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = filterType
    ? logs.filter(log => log.type === filterType)
    : logs;

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'add':
        return { label: '新增', icon: Plus, color: 'text-green-600 bg-green-100', dot: 'bg-green-500' };
      case 'update':
        return { label: '更新', icon: Edit3, color: 'text-blue-600 bg-blue-100', dot: 'bg-blue-500' };
      case 'fix':
        return { label: '修复', icon: Wrench, color: 'text-amber-600 bg-amber-100', dot: 'bg-amber-500' };
      case 'delete':
        return { label: '下线', icon: Trash2, color: 'text-red-600 bg-red-100', dot: 'bg-red-500' };
      default:
        return { label: type, icon: Tag, color: 'text-gray-600 bg-gray-100', dot: 'bg-gray-500' };
    }
  };

  // Group logs by month
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const date = new Date(log.createdAt);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(log);
    return acc;
  }, {} as Record<string, ChangeLog[]>);

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    return `${year}年${month}月`;
  };

  const types = [
    { id: null, label: '全部' },
    { id: 'add', label: '新增' },
    { id: 'update', label: '更新' },
    { id: 'fix', label: '修复' },
    { id: 'delete', label: '下线' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Bell className="w-7 h-7 text-primary-600" />
                变更记录
              </h1>
              <p className="text-gray-500 mt-1">了解工具更新动态，第一时间掌握新功能</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Subscribe Toggle */}
              <button
                onClick={() => setSubscribed(!subscribed)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors',
                  subscribed
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                <Settings className="w-4 h-4" />
                {subscribed ? '已订阅通知' : '订阅通知'}
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {types.map((type) => (
              <button
                key={type.id || 'all'}
                onClick={() => setFilterType(type.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  filterType === type.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {Object.entries(groupedLogs).map(([month, monthLogs]) => (
            <div key={month} className="mb-8">
              {/* Month Header */}
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-bold text-gray-800">{formatMonth(month)}</h2>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Log Items */}
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                  {(monthLogs as ChangeLog[]).map((log, index) => {
                    const typeConfig = getTypeConfig(log.type);
                    const TypeIcon = typeConfig.icon;
                    return (
                      <div
                        key={log.id}
                        className="relative pl-14 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Dot */}
                        <div className={cn(
                          'absolute left-3 top-2 w-4 h-4 rounded-full ring-4 ring-white',
                          typeConfig.dot
                        )} />

                        {/* Card */}
                        <div className="card card-hover p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', typeConfig.color)}>
                                <TypeIcon className="w-4.5 h-4.5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-800">{log.title}</h3>
                                  <span className={cn('badge', typeConfig.color)}>
                                    {typeConfig.label}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {new Date(log.createdAt).toLocaleDateString('zh-CN', {
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                  {' · '}
                                  版本 {log.version}
                                </p>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600">{log.description}</p>

                          {log.toolName && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <span className="text-xs text-gray-400">
                                关联工具：<span className="text-primary-600 font-medium">{log.toolName}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="card p-12 text-center">
              <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">暂无变更记录</h3>
              <p className="text-gray-500">该分类下暂无变更记录</p>
            </div>
          )}

          {/* Subscribe Card */}
          <div className="card bg-gradient-to-r from-primary-50 to-accent-50 p-6 mt-8 border-none">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Bell className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">订阅变更通知</h3>
                <p className="text-sm text-gray-600 mb-3">
                  开启订阅后，有新的工具变更会第一时间通知你，不错过任何重要更新
                </p>
                <button
                  onClick={() => setSubscribed(!subscribed)}
                  className={cn(
                    'px-5 py-2 rounded-lg text-sm font-medium transition-colors',
                    subscribed
                      ? 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  )}
                >
                  {subscribed ? '取消订阅' : '立即订阅'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
