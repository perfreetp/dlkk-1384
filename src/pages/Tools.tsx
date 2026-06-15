import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  GitCompare,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import useStore from '@/store/useStore';
import ToolCard from '@/components/ToolCard';
import { cn } from '@/lib/utils';

export default function Tools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tools, categories, fetchTools, fetchCategories, toggleFavorite } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchInput, setSearchInput] = useState('');
  const [compareList, setCompareList] = useState<string[]>([]);

  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchParam) params.search = searchParam;
    if (categoryParam) params.category = categoryParam;
    params.sort = sortBy;
    fetchTools(params);
    setSearchInput(searchParam || '');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [fetchTools, searchParam, categoryParam, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev => {
      const newSelected = prev.includes(catId)
        ? prev.filter(c => c !== catId)
        : [...prev, catId];
      const params = new URLSearchParams(searchParams);
      if (newSelected.length === 1) {
        params.set('category', newSelected[0]);
      } else {
        params.delete('category');
      }
      setSearchParams(params);
      return newSelected;
    });
  };

  const toggleCompare = (toolId: string) => {
    setCompareList(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : prev.length < 3 ? [...prev, toolId] : prev
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchInput('');
    setSearchParams({});
  };

  const hasFilters = selectedCategories.length > 0 || searchInput.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">工具目录</h1>
            <p className="text-gray-500 mt-1">浏览全部工具，找到你需要的</p>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              />
            </form>

            <button
              className="md:hidden p-2 bg-white border border-gray-200 rounded-xl"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </button>

            <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              <option value="popular">最热门</option>
              <option value="name">按名称</option>
              <option value="recent">最近更新</option>
            </select>
          </div>
        </div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-4 flex items-center gap-4 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-gray-800">
                已选择 {compareList.length} / 3 个工具对比
              </span>
            </div>
            <button
              className="btn-primary px-4 py-2 text-sm"
              disabled={compareList.length < 2}
            >
              开始对比
            </button>
            <button
              onClick={() => setCompareList([])}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <aside className={cn(
            'w-64 flex-shrink-0',
            'md:block',
            showMobileFilter ? 'fixed inset-0 z-50 bg-black/50 md:relative md:bg-transparent' : 'hidden'
          )}>
            <div className={cn(
              'bg-white rounded-2xl p-5 sticky top-20',
              showMobileFilter && 'absolute right-0 top-0 h-full w-72 rounded-none overflow-y-auto'
            )}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  筛选
                </h3>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    清空
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">工具分类</h4>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const IconComp = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon] || LucideIcons.Grid;
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors text-left',
                          isSelected
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="flex-1">{cat.name}</span>
                        <span className="text-xs text-gray-400">{cat.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Permission Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">权限状态</h4>
                <div className="space-y-1">
                  {[
                    { label: '全部', value: 'all' },
                    { label: '可直接访问', value: 'available' },
                    { label: '需要申请', value: 'request' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 text-left"
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">热门标签</h4>
                <div className="flex flex-wrap gap-2">
                  {['数据分析', '即时通讯', '客户服务', '营销推广', '文档协作', '设计工具'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-full cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                共 <span className="font-medium text-gray-800">{tools.length}</span> 个工具
              </p>
            </div>

            {/* Tools Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool, index) => (
                  <div key={tool.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <ToolCard tool={tool} onToggleFavorite={() => toggleFavorite(tool.id)} />
                    <button
                      onClick={() => toggleCompare(tool.id)}
                      className={cn(
                        'mt-2 w-full text-xs py-2 rounded-lg border transition-colors',
                        compareList.includes(tool.id)
                          ? 'border-primary-300 bg-primary-50 text-primary-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      )}
                    >
                      {compareList.includes(tool.id) ? '已加入对比' : '+ 加入对比'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {tools.map((tool, index) => (
                  <div
                    key={tool.id}
                    className="card card-hover p-4 flex items-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <ToolCard tool={tool} variant="horizontal" showRank={index + 1} onToggleFavorite={() => toggleFavorite(tool.id)} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {tools.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">没有找到相关工具</h3>
                <p className="text-gray-500 mb-4">试试其他关键词或清空筛选条件</p>
                <button onClick={clearFilters} className="btn-primary">
                  清除筛选
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
