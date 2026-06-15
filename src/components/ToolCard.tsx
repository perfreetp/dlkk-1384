import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ExternalLink,
  Lock,
  Unlock,
  User,
  BarChart3,
  Star,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Tool } from '../../shared/types';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'compact' | 'horizontal';
  showRank?: number;
  onToggleFavorite?: () => void;
}

export default function ToolCard({ tool, variant = 'default', showRank, onToggleFavorite }: ToolCardProps) {
  const [isFavorited, setIsFavorited] = useState(tool.isFavorite);
  const [isAnimating, setIsAnimating] = useState(false);

  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tool.icon] || LucideIcons.Globe;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    onToggleFavorite?.();
  };

  if (variant === 'compact') {
    return (
      <Link
        to={tool.hasPermission || !tool.requiresPermission ? tool.url : `/tools/${tool.id}`}
        target={tool.hasPermission || !tool.requiresPermission ? '_blank' : '_self'}
        className="card card-hover p-4 flex items-center gap-4 group"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-800 truncate">{tool.name}</div>
          <div className="text-xs text-gray-500 truncate">{tool.description}</div>
        </div>
        <button
          onClick={handleFavorite}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-all',
              isFavorited ? 'fill-accent-500 text-accent-500' : 'text-gray-300',
              isAnimating && 'animate-bounce-subtle'
            )}
          />
        </button>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="card card-hover p-4 flex items-center gap-4">
        {showRank && (
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
            showRank === 1 && 'bg-gradient-to-br from-amber-400 to-orange-500 text-white',
            showRank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-400 text-white',
            showRank === 3 && 'bg-gradient-to-br from-amber-600 to-amber-700 text-white',
            showRank > 3 && 'bg-gray-100 text-gray-500'
          )}>
            {showRank}
          </div>
        )}
        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-primary-600">
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-800 flex items-center gap-2">
            {tool.name}
            {tool.requiresPermission && !tool.hasPermission && (
              <Lock className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <BarChart3 className="w-3 h-3" />
            {tool.accessCount.toLocaleString()} 次访问
          </div>
        </div>
        <Link
          to={`/tools/${tool.id}`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          查看
        </Link>
      </div>
    );
  }

  return (
    <Link
      to={tool.hasPermission || !tool.requiresPermission ? tool.url : `/tools/${tool.id}`}
      target={tool.hasPermission || !tool.requiresPermission ? '_blank' : '_self'}
      className="card card-hover p-5 flex flex-col h-full group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
          <IconComponent className="w-6 h-6" />
        </div>
        <button
          onClick={handleFavorite}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Heart
            className={cn(
              'w-5 h-5 transition-all',
              isFavorited ? 'fill-accent-500 text-accent-500' : 'text-gray-300 group-hover:text-gray-400',
              isAnimating && 'animate-bounce-subtle'
            )}
          />
        </button>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-800">{tool.name}</h3>
          {tool.requiresPermission && (
              tool.hasPermission ? (
                <Unlock className="w-4 h-4 text-green-500" />
              ) : (
                <Lock className="w-4 h-4 text-amber-500" />
              )
            )}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{tool.description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <User className="w-3.5 h-3.5" />
          <span>{tool.owner}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{tool.accessCount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {tool.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-primary-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        {tool.hasPermission || !tool.requiresPermission ? (
          <>
            <ExternalLink className="w-4 h-4" />
            立即访问
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            申请权限
          </>
        )}
      </div>
    </Link>
  );
}
