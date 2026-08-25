import React, { useState } from 'react';
import {
  Flag,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { ScamReportService } from '../../services/dataService';
import { ScamCategory } from '../../types';
import { SoundEngine } from '../../services/audioService';

interface ReportViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const ReportView: React.FC<ReportViewProps> = ({ onNavigate, language }) => {
  const [category, setCategory] = useState<ScamCategory>('PHISHING');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState('');
  const [indicators, setIndicators] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const categories: ScamCategory[] = [
    'PHISHING',
    'PIX SCAMS',
    'WHATSAPP FRAUD',
    'FAKE INVESTMENTS',
    'FAKE LOANS',
    'IDENTITY FRAUD',
    'ACCOUNT TAKEOVER',
    'MARKETPLACE SCAMS',
    'ROMANCE SCAMS',
    'FAKE SUPPORT',
    'FAKE JOBS',
    'MALWARE',
    'RANSOMWARE',
    'SOCIAL ENGINEERING'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !lgpdConsent) return;

    SoundEngine.playSuccessSound();
    const result = ScamReportService.submitReport({
      category,
      description,
      platform,
      indicators: indicators ? indicators.split(',').map((s) => s.trim()) : [],
      contactEmail: isAnonymous ? undefined : contactEmail,
      isAnonymous
    });

    setSubmittedTicket(result.ticketId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2 font-tech">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <Flag className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">INTAKE & INTELLIGENCE REPORTING</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          DENUNCIAR GOLPE OU AMEAÇA
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-2xl">
          Compartilhe evidências de novos golpes ou mensagens fraudulentas. Seus dados ajudam a alimentar o Scam Archive e proteger milhares de outras pessoas.
        </p>
      </div>

      {submittedTicket ? (
        /* Confirmation Screen */
        <div className="hud-card bg-[#0a0a0a] border border-emerald-500/40 rounded-lg p-8 sm:p-12 text-center space-y-6 font-tech">
          <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl text-white tracking-wider uppercase">
              RELATO REGISTRADO COM SUCESSO
            </h2>
            <p className="font-sans text-neutral-400 text-sm max-w-md mx-auto">
              Nossos analistas defensivos irão verificar os dados para catalogação segura e emissão de alertas comunitários.
            </p>
          </div>

          <div className="p-4 bg-[#0d0d0d] border border-[#222222] rounded max-w-xs mx-auto">
            <span className="text-[10px] text-neutral-500 uppercase block">CÓDIGO DE PROTOCOLO DEFENSIVO:</span>
            <span className="font-mono font-bold text-lg text-emerald-400">{submittedTicket}</span>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setDescription('');
                setIndicators('');
                setPlatform('');
              }}
              className="px-5 py-2.5 bg-neutral-900 border border-neutral-700 text-white rounded text-xs hover:border-[#E00000]"
            >
              ENVIAR OUTRO RELATO
            </button>
            <button
              onClick={() => onNavigate('/archive')}
              className="px-5 py-2.5 bg-[#E00000] text-white rounded text-xs hover:bg-[#FF1A1A]"
            >
              IR PARA O ACERVO
            </button>
          </div>
        </div>
      ) : (
        /* Submission Form */
        <form onSubmit={handleSubmit} className="hud-card bg-[#090909] border border-[#222222] rounded-lg p-6 sm:p-8 space-y-6 font-sans">
          <div className="p-4 bg-[#140a0a] border border-[#2a1010] rounded text-xs text-[#ffaaaa] flex items-start gap-3">
            <Shield className="w-4 h-4 text-[#FF1A1A] shrink-0 mt-0.5" />
            <div>
              <b className="font-tech text-white uppercase block mb-0.5">AVISO DE PRIVACIDADE E DEFESA:</b>
              Não inclua seus dados bancários, senhas pessoais ou documentos de terceiros neste formulário. Todos os relatos são anonimizados.
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-tech text-xs">
            <div>
              <label className="text-neutral-300 font-bold uppercase block mb-1">
                CATEGORIA DO GOLPE *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ScamCategory)}
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-[#E00000]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-neutral-300 font-bold uppercase block mb-1">
                PLATAFORMA UTILIZADA PELO GOLPISTA
              </label>
              <input
                type="text"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="Ex: WhatsApp, Instagram, SMS, E-mail, Mercado Livre..."
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-[#E00000] font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-tech text-neutral-300 font-bold uppercase block mb-1">
              COMO O GOLPE ACONTECEU / DESCRIÇÃO DETALHADA *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a abordagem inicial, a história contada, quais valores foram solicitados e que sinais de alerta chamaram atenção..."
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#E00000] font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-tech text-neutral-300 font-bold uppercase block mb-1">
              INDICADORES (LINKS SUSPEITOS, NOMES OU CHAVES PIX USADAS)
            </label>
            <input
              type="text"
              value={indicators}
              onChange={(e) => setIndicators(e.target.value)}
              placeholder="Ex: https://falso-banco.online, CNPJ falso..."
              className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-[#E00000] font-sans"
            />
          </div>

          {/* Anonymity Option */}
          <div className="pt-2 border-t border-[#181818] space-y-3 font-tech text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="accent-[#E00000] w-4 h-4 rounded"
              />
              <span>ENVIAR DE FORMA 100% ANÔNIMA (Recomendado)</span>
            </label>

            {!isAnonymous && (
              <div>
                <label className="text-neutral-400 block mb-1 font-sans">
                  Seu e-mail de contato (opcional, para esclarecimento de dúvidas):
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="seu.email@dominio.com"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white"
                />
              </div>
            )}

            <label className="flex items-start gap-2 cursor-pointer select-none text-neutral-300 pt-2">
              <input
                type="checkbox"
                required
                checked={lgpdConsent}
                onChange={(e) => setLgpdConsent(e.target.checked)}
                className="accent-[#E00000] w-4 h-4 mt-0.5 rounded"
              />
              <span className="font-sans text-[11px] text-neutral-400">
                Concordo com os Termos de Uso e autorizo a utilização estritamente educativa e desidentificada das informações para alimentar a inteligência coletiva contra golpes da plataforma E GUI 404 (Conforme LGPD).
              </span>
            </label>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={!lgpdConsent}
              className={`px-8 py-3 rounded font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                lgpdConsent
                  ? 'bg-[#E00000] hover:bg-[#FF1A1A] text-white shadow-[0_0_20px_rgba(224,0,0,0.3)]'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>TRANSMITIR RELATO SEGURO</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
