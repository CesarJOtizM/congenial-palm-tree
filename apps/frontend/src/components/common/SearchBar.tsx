'use client';

import { cn } from '@lib/utils';
import { Filter, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  className?: string;
  showFilters?: boolean;
  filters?: React.ReactNode;
}

export function SearchBar({
  placeholder = 'Buscar...',
  onSearch,
  onClear,
  className,
  showFilters = false,
  filters,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onClear?.();
  };

  return (
    <div className={cn('relative', className)}>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
        <input
          type='text'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 transition-all duration-200',
            isFocused
              ? 'border-blue-500 shadow-sm focus:ring-blue-500 focus:border-blue-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
            'dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
          )}
        />

        {query && (
          <button
            onClick={handleClear}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='h-4 w-4' />
          </button>
        )}

        {showFilters && (
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={cn(
              'absolute right-10 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors',
              showFiltersPanel
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Filter className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && showFiltersPanel && filters && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 p-4'>
          {filters}
        </div>
      )}
    </div>
  );
}
