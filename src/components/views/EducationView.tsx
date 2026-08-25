import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Share2,
  ArrowLeft,
  Shield,
  ExternalLink,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { ArticleService } from '../../services/dataService';
import { EducationArticle } from '../../types';
import { CyberCard } from '../ui/CyberCard';
import { SoundEngine } from '../../services/audioService';

interface EducationViewProps {
  initialSlug?: string;
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const EducationView: React.FC<EducationViewProps> = ({ initialSlug, onNavigate, language }) => {
  const articles = ArticleService.getAllArticles();
  const [activeArticle, setActiveArticle] = useState<EducationArticle | null>(() => {
    if (initialSlug) {
      return ArticleService.getArticleBySlug(initialSlug) || null;
    }
    return null;
  });
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  const categories = [
    'ALL',
    'MFA',
    'Phishing',
    'Social Engineering',
    'Financial Security',
    'Passwords',
    'Privacy',
    'Wi-Fi Security'
  ];

  const filteredArticles = articles.filter((a) => (selectedCat === 'ALL' ? true : a.category === selectedCat));

  const handleOpenArticle = (art: EducationArticle) => {
    SoundEngine.playKeyClick();
    setActiveArticle(art);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2 font-tech">
        <div className="flex items-center gap-2 text-xs text-blue-400">
          <BookOpen className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">CYBER EDUCATION & DEFENSIVE HYGIENE</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          CYBER EDUCATION
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-2xl">
          Guias práticos, desmistificação de conceitos técnicos e metodologias para proteger suas contas, identidade digital e finanças.
        </p>
      </div>

      {activeArticle ? (
        /* Single Article View */
        <div className="space-y-6 max-w-4xl mx-auto">
          <button
            onClick={() => setActiveArticle(null)}
            className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white rounded text-xs font-tech flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VOLTAR PARA TODOS OS ARTIGOS</span>
          </button>

          <article className="hud-card bg-[#080808] border border-[#222222] rounded-lg p-6 sm:p-10 space-y-8">
            <header className="border-b border-[#1c1c1c] pb-6 space-y-4 font-tech">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-1 rounded bg-blue-950/40 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  {activeArticle.readingTimeMinutes} MIN LEITURA
                </span>
                <span className="text-xs text-neutral-500">PUBLICADO: {activeArticle.date}</span>
              </div>

              <h1 className="font-sans font-extrabold text-2xl sm:text-4xl text-white leading-tight">
                {activeArticle.title}
              </h1>

              <div className="text-xs text-neutral-400 flex items-center gap-2">
                <span>AUTOR:</span>
                <span className="text-white font-bold">{activeArticle.author}</span>
              </div>
            </header>

            {/* Key Takeaways Box */}
            <div className="p-5 bg-[#0f0c0c] border-l-4 border-[#E00000] rounded space-y-2 font-tech">
              <h3 className="text-xs font-bold text-[#FF5555] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> PRINCIPAIS CONCLUSÕES / KEY TAKEAWAYS
              </h3>
              <ul className="space-y-1.5 font-sans text-xs sm:text-sm text-neutral-300">
                {activeArticle.keyTakeaways.map((k, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#FF1A1A] font-bold">•</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Body */}
            <div className="text-sm sm:text-base text-neutral-300 leading-relaxed space-y-4 whitespace-pre-line font-sans">
              {activeArticle.contentMarkdown}
            </div>

            {/* Practical Defensive Checklist */}
            <div className="p-6 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-3 font-tech">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> CHECKLIST DE BLINDAGEM PRÁTICA
              </h3>
              <div className="space-y-2 font-sans text-xs sm:text-sm text-neutral-200">
                {activeArticle.checklist.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="mt-1 accent-emerald-500 rounded" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sources */}
            <footer className="pt-6 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-neutral-500 font-tech">
              <div>
                <span>FONTES OFICIAIS: </span>
                {activeArticle.sources.map((s, idx) => (
                  <span key={idx} className="text-neutral-400 font-sans">
                    {s.title}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  SoundEngine.playSuccessSound();
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copiado!');
                  }
                }}
                className="flex items-center gap-1 text-neutral-400 hover:text-white"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>COMPARTILHAR</span>
              </button>
            </footer>
          </article>
        </div>
      ) : (
        /* Articles Grid */
        <div className="space-y-6">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 font-tech text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  SoundEngine.playKeyClick();
                  setSelectedCat(cat);
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase shrink-0 transition-colors ${
                  selectedCat === cat
                    ? 'bg-[#E00000] text-white'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'TODOS OS GUIAS' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((art) => (
              <CyberCard
                key={art.id}
                onClick={() => handleOpenArticle(art)}
                className="flex flex-col justify-between group"
              >
                <div className="space-y-3 font-sans">
                  <div className="flex items-center justify-between gap-2 font-tech text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-950/40 border border-blue-500/30 text-blue-400 font-bold uppercase text-[10px]">
                      {art.category}
                    </span>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {art.readingTimeMinutes} min
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#181818] flex items-center justify-between text-xs font-tech text-neutral-500">
                  <span>{art.date}</span>
                  <span className="text-blue-400 group-hover:text-white flex items-center gap-1 font-bold">
                    <span>LER GUIA COMPLETO</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </CyberCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
