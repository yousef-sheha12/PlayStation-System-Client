'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { debounce } from '@/utils';

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export default function Search({ placeholder = 'Search...', onSearch, debounceMs = 300 }: SearchProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const debouncedSearch = debounce((value: string) => {
      onSearch(value);
    }, debounceMs);
    debouncedSearch(query);
    return () => {};
  }, [query, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input input-bordered w-full pl-10 pr-10 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
