import { useEffect, useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
  FileText,
  PlayCircle,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import type { Guide, Tool } from '../../shared/types';
import { cn } from '@/lib/utils';

export default function Guides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchGuides = async () => {
      const res = await fetch('http://localhost:3001/api/guides');
      const data = await res.json();
      if (data.success) {
        setGuides(data.data);
      }
    };

    const fetchTools = async () => {
      const res = await fetch('http://localhost:3001/api/tools?pageSize=50');
      const data = await res.json();
      if (data.success) {
        setTools(data.data);
      }
    };

    fetchGuides();
    fetchTools();
  }, []);

  const filteredGuides = guides.filter((g) => {
    if (selectedTool && g.toolId !== selectedTool) return false;
    if (searchQuery && !g.title.toLowerCase().includes(searchQuery.toLowerCase()) && !g.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const categories = [
    { id: '入门', label: '入门指南', icon: Lightbulb },
    { id: '操作指南', label: '操作教程', icon: FileText },
    { id: '常见问题', label: '常见问题', icon: HelpCircle },
    { id: '视频教程', label: '视频教程', icon: PlayCircle },
  ];

  const getToolName = (toolId: string) => {
    return tools.find(t => t.id === toolId)?.name || toolId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">使用说明中心</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">工具使用指南</h1>
            <p className="text-white/70">详细的操作教程和常见问题解答，助你快速上手</p>
          </div>

          <div className="max-w-xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索教程、问题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Tools */}
              <div className="card p-5">
                <h3 className="font-bold text-gray-800 mb-3">按工具筛选</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedTool(null)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      !selectedTool
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    全部工具
                  </button>
                  {tools.slice(0, 10).map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedTool === tool.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="card p-5">
                <h3 className="font-bold text-gray-800 mb-3">教程分类</h3>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-left transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-700">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {selectedGuide ? (
              // Guide Detail
              <div className="animate-fade-in">
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-6 text-sm"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  返回列表
                </button>

                <article className="card p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full">
                      {selectedGuide.category}
                    </span>
                    <span className="text-sm text-gray-400">
                      {getToolName(selectedGuide.toolId)}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    {selectedGuide.title}
                  </h1>

                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    {selectedGuide.content.split('\n').map((line, i) => {
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-lg font-bold text-gray-800 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-base font-semibold text-gray-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4 my-1 list-disc">{line.replace('- ', '')}</li>;
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-semibold text-gray-800 mt-3">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.startsWith('Q:') || line.startsWith('**Q:')) {
                        return <p key={i} className="font-medium text-gray-800 mt-4">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.startsWith('A:') || line.startsWith('**A:')) {
                        return <p key={i} className="text-gray-600 ml-4">{line.replace(/\*\*/g, '')}</p>;
                      }
                      return line ? <p key={i} className="my-2">{line}</p> : <br key={i} />;
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-400">这篇指南对你有帮助吗？</p>
                    <div className="flex gap-2 mt-2">
                      <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                        有帮助
                      </button>
                      <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                        没帮助
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ) : (
              // Guide List
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    共 <span className="font-medium text-gray-800">{filteredGuides.length}</span> 篇教程
                  </p>
                </div>

                {filteredGuides.length > 0 ? (
                  <div className="space-y-4">
                    {filteredGuides.map((guide, index) => (
                      <div
                        key={guide.id}
                        onClick={() => setSelectedGuide(guide)}
                        className="card card-hover p-5 cursor-pointer animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                                {guide.category}
                              </span>
                              <span className="text-xs text-gray-400">
                                {getToolName(guide.toolId)}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2 hover:text-primary-600 transition-colors">
                              {guide.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {guide.content.replace(/[#*\-]/g, '').slice(0, 120)}...
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">暂无相关教程</h3>
                    <p className="text-gray-500">试试其他关键词或工具筛选</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
