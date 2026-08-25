import React, { useState } from 'react';
import { Send, Shield, CheckCircle, Mail, MessageSquare, Lock } from 'lucide-react';
import { SoundEngine } from '../../services/audioService';

interface ContactViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate, language }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('EDITORIAL');
  const [message, setMessage] = useState('');
  const [securityCheck, setSecurityCheck] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message || securityCheck !== '4') {
      alert('Por favor, responda corretamente ao teste de segurança (2 + 2 = 4).');
      return;
    }

    SoundEngine.playSuccessSound();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2 font-tech">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <Mail className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">SECURE CHANNELS // CONTACT</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          CONTATO & COMUNICAÇÃO INSTITUCIONAL
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base">
          Canal de contato seguro para imprensa, pesquisadores de segurança, parcerias educativas e solicitações institucionais.
        </p>
      </div>

      {submitted ? (
        <div className="hud-card bg-[#0a0a0a] border border-emerald-500/40 rounded-lg p-8 text-center space-y-4 font-tech">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-2xl text-white font-bold">MENSAGEM ENVIADA COM SUCESSO</h2>
          <p className="text-xs text-neutral-400 font-sans max-w-sm mx-auto">
            Agradecemos pelo contato. Mensagens legítimas serão respondidas por nossos canais verificados.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setMessage('');
            }}
            className="mt-4 px-4 py-2 bg-neutral-900 border border-neutral-700 text-white rounded text-xs"
          >
            Enviar Nova Mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="hud-card bg-[#090909] border border-[#222222] rounded-lg p-6 sm:p-8 space-y-6 font-tech text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-300 font-bold uppercase block mb-1">
                NOME OU ALCUNHA
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Identificação opcional"
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-[#E00000] font-sans text-xs"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-bold uppercase block mb-1">
                E-MAIL PARA RETORNO *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@dominio.com"
                className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-[#E00000] font-sans text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-bold uppercase block mb-1">
              MOTIVO DO CONTATO *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-[#E00000]"
            >
              <option value="EDITORIAL">Sugestão de Pauta / Relato de Caso</option>
              <option value="PRESS">Imprensa & Entrevistas</option>
              <option value="RESEARCH">Pesquisa Acadêmica / Cibersegurança</option>
              <option value="LEGAL">Dúvidas Legais & LGPD</option>
              <option value="OTHER">Outros Assuntos</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-300 font-bold uppercase block mb-1">
              MENSAGEM *
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem com clareza e sem dados pessoais sensíveis..."
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded text-white focus:outline-none focus:border-[#E00000] font-sans text-xs sm:text-sm"
            />
          </div>

          {/* Anti-spam math check */}
          <div className="p-3 bg-black rounded border border-[#1a1a1a] flex items-center justify-between gap-4 flex-wrap">
            <span className="text-neutral-400">Verificação Humana Defensiva: Quanto é 2 + 2?</span>
            <input
              type="text"
              required
              value={securityCheck}
              onChange={(e) => setSecurityCheck(e.target.value.trim())}
              placeholder="Resultado"
              className="w-24 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-white text-center font-mono focus:border-[#E00000] outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>ENVIAR MENSAGEM</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
