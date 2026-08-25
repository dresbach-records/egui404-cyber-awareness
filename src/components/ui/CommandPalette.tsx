import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShieldAlert, FileText, AlertTriangle, BookOpen, ExternalLink, Flame, Loader2 } from 'lucide-react';
import { searchApi } from '../../services/api/searchApi';
import { SearchResultItem } from '../../types';
import { RiskBadge } from './RiskBadge';
import { SoundEngine } from '../../services/audioService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (!query.trim()) {
      setResults([]);
      setError(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(false);

    const timer = setTimeout(async () => {
      try {
        const res = await searchApi.search(query, { limit: 12 }, controller.signal);
        setResults(res.data || []);
        setSelectedIndex(0);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setResults([]);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        SoundEngine.playKeyClick();
        onNavigate(results[selectedIndex].url);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onNavigate]);

  if (!isOpen) return null;

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'SCAM':
        return <ShieldAlert className="w-4 h-4 text-[#FF1A1A]" />;
      case 'THREAT':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'CASE':
        return <FileText className="w-4 h-4 text-neutral-300" />;
      case 'ARTICLE':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'ALERT':
        return <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />;
      default:
        return <Search className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl bg-[#0a0a0a] border border-[#262626] rounded-lg shadow-2xl overflow-hidden font-tech relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1c1c1c] bg-[#0e0e0e]">
          {loading ? (
            <Loader2 className="w-5 h-5 text-[#FF1A1A] animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-[#FF1A1A]" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar golpes, ameaças, artigos, casos, alertas..."
            className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-neutral-500 font-sans"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] bg-neutral-900 border border-neutral-700 text-neutral-400 rounded">
            ESC
          </kbd>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Category Chips */}
        <div className="px-4 py-2 bg-[#080808] border-b border-[#181818] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-neutral-500 text-[11px] shrink-0">Populares:</span>
          {['RNP/CAIS', 'Pix', 'WhatsApp', 'Investimento', 'Phishing', 'MFA', 'Correios'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-[#E00000] text-[11px] shrink-0 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {error ? (
            <div className="py-12 text-center text-neutral-500">
              <p role="alert" className="text-sm font-medium text-[#FF6B6B]">Não foi possível realizar a busca.</p>
              <button type="button" onClick={() => {
                const currentQuery = query;
                setQuery('');
                window.setTimeout(() => setQuery(currentQuery), 0);
              }} className="text-xs text-neutral-300 hover:text-white mt-3 underline">Tentar novamente</button>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#E00000]" />
              <p className="text-sm font-medium">{query ? `Nenhum resultado encontrado.` : 'Digite para pesquisar.'}</p>
              {query && <p className="text-xs text-neutral-600 mt-1">Tente pesquisar termos como "Pix", "WhatsApp" ou "Phishing".</p>}
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    onNavigate(item.url);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-md cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected ? 'bg-[#181818] border-l-2 border-[#E00000]' : 'hover:bg-[#111111]'
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded bg-neutral-900 border border-neutral-800 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate">{item.title}</span>
                      {item.risk && <RiskBadge level={item.risk} className="text-[9px] py-0 px-1.5" />}
                    </div>
                    <p className="text-xs text-neutral-400 font-tech mt-0.5">{item.subtitle}</p>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-1">{item.snippet}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 mt-1 shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#0e0e0e] border-t border-[#1a1a1a] flex items-center justify-between text-[11px] text-neutral-500 font-tech">
          <span>
            Pressione <kbd className="text-white">↑</kbd> <kbd className="text-white">↓</kbd> para navegar
          </span>
          <span>
            Pressione <kbd className="text-white">ENTER</kbd> para abrir
          </span>
        </div>
      </div>
    </div>
  );
};
