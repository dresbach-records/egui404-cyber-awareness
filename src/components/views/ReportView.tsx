import React, { useState } from 'react';
import {
  Flag,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  Send,
  HelpCircle,
  FileCheck,
  Copy,
  Calendar,
  Globe,
  Radio,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react';
import { ContentSafetyService } from '../../services/dataService';
import { reportsApi } from '../../services/api/reportsApi';
import { ScamCategory } from '../../types';
import { SoundEngine } from '../../services/audioService';

interface ReportViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const ReportView: React.FC<ReportViewProps> = ({ onNavigate, language }) => {
  const [reportType, setReportType] = useState<'SCAM_INCIDENT' | 'ACTIVE_THREAT' | 'EDITORIAL_CORRECTION'>('SCAM_INCIDENT');
  const [category, setCategory] = useState<ScamCategory>('PHISHING');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [platform, setPlatform] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [description, setDescription] = useState('');
  const [indicators, setIndicators] = useState('');
  const [contactMethod, setContactMethod] = useState<'SMS' | 'WHATSAPP' | 'EMAIL' | 'LIGACAO' | 'REDES' | 'OUTRO'>('WHATSAPP');
  const [contactEmail, setContactEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [confirmedNoPersonalData, setConfirmedNoPersonalData] = useState(false);
  const [acceptedEducationalReview, setAcceptedEducationalReview] = useState(false);

  // Validation & Submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  const categories: { key: ScamCategory; label: string }[] = [
    { key: 'PHISHING', label: 'Phishing (E-mail, Falsas Notificações Gov/Bancos)' },
    { key: 'PIX SCAMS', label: 'Golpes do Pix (Falso Agendamento / Falso Estorno)' },
    { key: 'WHATSAPP FRAUD', label: 'Golpes no WhatsApp (Novo Número / Foto Clonada)' },
    { key: 'VISHING', label: 'Vishing / Falsa Central Telefônica 0800' },
    { key: 'SMISHING', label: 'Smishing (SMS com Falsos Pontos / Compras)' },
    { key: 'FAKE INVESTMENTS', label: 'Falsos Investimentos (Criptoativos / Robôs de Pix)' },
    { key: 'FAKE LOANS', label: 'Falso Empréstimo com Taxa Antecipada' },
    { key: 'FAKE SUPPORT', label: 'Falso Suporte Técnico & Acesso Remoto' },
    { key: 'FAKE JOBS', label: 'Falsas Vagas de Emprego & Tarefas Remotas' },
    { key: 'MARKETPLACE SCAMS', label: 'Marketplaces (Falso Pagamento OLX/Mercado Livre)' },
    { key: 'ROMANCE SCAMS', label: 'Estelionato Sentimental / Romance Scam' },
    { key: 'ACCOUNT TAKEOVER', label: 'Sequestro de Contas / SIM Swap' },
    { key: 'IDENTITY FRAUD', label: 'Fraude de Identidade / Abertura de Contas' },
    { key: 'MALWARE', label: 'Malware / Trojans Bancários Android/PC' },
    { key: 'RANSOMWARE', label: 'Ransomware / Extorsão de Dados Corporativos' },
    { key: 'QR CODE SCAMS', label: 'QR Code Adulterado / Quishing' },
    { key: 'FAKE WEBSITES', label: 'Sites Falsos / Falsos Leilões' },
    { key: 'SOCIAL ENGINEERING', label: 'Outras Formas de Engenharia Social' }
  ];

  const handleValidate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = 'A descrição do incidente é obrigatória.';
    } else if (description.trim().length < 25) {
      newErrors.description = 'Por favor, forneça mais detalhes sobre o ocorrido (mínimo de 25 caracteres).';
    }

    if (!platform.trim()) {
      newErrors.platform = 'Indique o canal ou plataforma onde ocorreu a abordagem.';
    }

    if (!isAnonymous && (!contactEmail.trim() || !contactEmail.includes('@'))) {
      newErrors.contactEmail = 'Forneça um e-mail válido para contato ou marque o envio como anônimo.';
    }

    if (!confirmedNoPersonalData) {
      newErrors.confirmedNoPersonalData = 'Você deve confirmar que não incluiu senhas pessoais, dados de cartão ou CPFs de vítimas.';
    }

    if (!acceptedEducationalReview) {
      newErrors.acceptedEducationalReview = 'Você deve concordar com a análise defensiva e fins educativos.';
    }

    // Run Content Safety Engine on Description & Indicators
    const safetyCheck = ContentSafetyService.analyzeText(description + ' ' + indicators);
    if (safetyCheck.status === 'BLOCK') {
      newErrors.safety = safetyCheck.flaggedReasons.join(' ');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidate()) return;

    setSubmitting(true);
    setSubmitError(null);

    const reportData = {
      category,
      description: `[Tipo: ${reportType}] [Canal: ${contactMethod}] ${description}`,
      platform,
      url: targetUrl,
      incidentDate,
      contactMethod,
      contactEmail: isAnonymous ? undefined : contactEmail,
      indicators: indicators ? indicators.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : [],
      isAnonymous,
      confirmedNoPersonalData,
      acceptedEducationalReview
    };

    try {
      const res = await reportsApi.submitReport(reportData);
      if (!res.ticketId) {
        throw new Error('A API não retornou um identificador de protocolo.');
      }
      SoundEngine.playSuccessSound();
      setSubmittedTicket(res.ticketId);
    } catch (error) {
      const statusCode = error instanceof Error && 'statusCode' in error
        ? (error as Error & { statusCode?: number }).statusCode
        : undefined;
      const messages: Record<number, string> = {
        401: 'Sua sessão expirou. Atualize a página e tente novamente.',
        403: 'Você não tem permissão para enviar este relato.',
        404: 'O serviço de denúncias não foi encontrado.',
        409: 'Este relato já foi registrado.',
        422: 'Revise os dados informados e tente novamente.',
        429: 'Muitos envios foram realizados. Aguarde e tente novamente.',
        500: 'O serviço de denúncias está temporariamente indisponível.'
      };
      setSubmitError(statusCode ? messages[statusCode] || 'Não foi possível registrar o relato.' : 'Não foi possível conectar ao serviço de denúncias. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket);
      setCopiedTicket(true);
      setTimeout(() => setCopiedTicket(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2 font-tech">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <Flag className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">INTAKE & INTELLIGENCE REPORTING · CANAL DEFENSIVO</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl text-white tracking-wider uppercase">
          DENUNCIAR GOLPE OU CORREÇÃO EDITORIAL
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-2xl">
          Envie evidências de abordagens fraudulentas, números suspeitos ou solicite correções em casos documentados. Seus relatos alimentam o repositório público de inteligência contra o cibercrime.
        </p>
        <p className="text-xs text-neutral-400">
          Para comunicações institucionais sobre denúncias, utilize <a href="mailto:denuncias@egui404.fun" className="text-white hover:text-[#FF1A1A]">denuncias@egui404.fun</a>.
        </p>
      </div>

      {submittedTicket ? (
        /* Confirmation Screen */
        <div className="hud-card bg-[#0a0a0a] border border-emerald-500/40 rounded-lg p-8 sm:p-12 text-center space-y-6 font-tech">
          <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-4xl text-white tracking-wider uppercase">
              RELATO REGISTRADO COM SUCESSO
            </h2>
            <p className="font-sans text-neutral-400 text-sm max-w-md mx-auto">
              Nossos analistas defensivos irão verificar os dados para catalogação segura e emissão de alertas comunitários no E GUI 404.
            </p>
          </div>

          <div className="p-4 bg-[#0d0d0d] border border-[#222222] rounded max-w-md mx-auto space-y-3">
            <span className="text-[11px] text-neutral-400 uppercase block tracking-wider">CÓDIGO DE PROTOCOLO DEFENSIVO:</span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono font-bold text-xl text-emerald-400">{submittedTicket}</span>
              <button
                type="button"
                onClick={handleCopyTicket}
                className="px-3 py-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-neutral-300 rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedTicket ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 font-sans">
              Guarde este código caso deseje acompanhar atualizações editoriais ou complementar dados.
            </p>
          </div>

          {/* Action guidance if user was a victim */}
          <div className="bg-[#111] border border-neutral-800 rounded-lg p-6 max-w-2xl mx-auto text-left font-sans space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Você sofreu prejuízo financeiro direto neste golpe?</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              O E GUI 404 é uma plataforma independente educativa e de inteligência pública (não substitui as autoridades policiais nem cancela transações bancárias). Siga estas etapas imediatas:
            </p>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-5">
              <li>Ligue imediatamente para o SAC oficial do seu banco no número do verso do cartão físico.</li>
              <li>Exija a abertura formal do <strong>Mecanismo Especial de Devolução (MED)</strong> do Pix.</li>
              <li>Registre o <strong>Boletim de Ocorrência (B.O.)</strong> na Delegacia Eletrônica da Polícia Civil.</li>
            </ul>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setDescription('');
                setIndicators('');
                setErrors({});
              }}
              className="px-6 py-2.5 bg-[#141414] hover:bg-[#222] border border-[#333] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              ENVIAR OUTRO RELATO
            </button>
            <button
              onClick={() => onNavigate('/forum')}
              className="px-6 py-2.5 bg-[#E00000] hover:bg-[#b00000] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              VER DISCUSSÕES NA COMUNIDADE
            </button>
          </div>
        </div>
      ) : (
        /* The Interactive Intake Form */
        <form onSubmit={handleSubmit} className="hud-card bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-6 sm:p-8 space-y-8">
          
          {/* Objective / Type Selector */}
          <div className="space-y-3 font-tech">
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-bold">
              1. TIPO DE RELATO / FINALIDADE:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
              <button
                type="button"
                onClick={() => setReportType('SCAM_INCIDENT')}
                className={`p-3.5 rounded border text-left text-xs transition-all ${
                  reportType === 'SCAM_INCIDENT'
                    ? 'border-[#E00000] bg-[#E00000]/10 text-white font-bold'
                    : 'border-[#222] bg-[#111] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-[#E00000]" />
                  <span>Novo Golpe / Tentativa</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-normal">
                  Abordagens fraudulentas recebidas recentemente.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setReportType('ACTIVE_THREAT')}
                className={`p-3.5 rounded border text-left text-xs transition-all ${
                  reportType === 'ACTIVE_THREAT'
                    ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-white font-bold'
                    : 'border-[#222] bg-[#111] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Radio className="w-4 h-4 text-[#00F0FF]" />
                  <span>Ameaça Ativa (Malware/URL)</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-normal">
                  Domínios clonados, APKs ou campanhas ativas.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setReportType('EDITORIAL_CORRECTION')}
                className={`p-3.5 rounded border text-left text-xs transition-all ${
                  reportType === 'EDITORIAL_CORRECTION'
                    ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                    : 'border-[#222] bg-[#111] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>Correção Editorial</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-normal">
                  Atualização de caso existente ou retificação.
                </p>
              </button>
            </div>
          </div>

          {/* Category & Channel Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-tech font-bold">
                2. CATEGORIA PRINCIPAL:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ScamCategory)}
                className="w-full bg-[#111111] border border-[#262626] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1A1A] transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-tech font-bold">
                3. MEIO DE CONTATO / VETOR INICIAL:
              </label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value as any)}
                className="w-full bg-[#111111] border border-[#262626] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1A1A] transition-colors"
              >
                <option value="WHATSAPP">WhatsApp / Mensageiro</option>
                <option value="SMS">SMS / Torpedos</option>
                <option value="LIGACAO">Ligação Telefônica / Falso 0800</option>
                <option value="EMAIL">E-mail / Phishing</option>
                <option value="REDES">Redes Sociais (Instagram, TikTok, Telegram)</option>
                <option value="OUTRO">Marketplace / Site Clonado / Outro</option>
              </select>
            </div>
          </div>

          {/* Platform & Incident Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-tech font-bold">
                4. PLATAFORMA / EMPRESA ENVOLVIDA: *
              </label>
              <input
                type="text"
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value);
                  if (errors.platform) setErrors((prev) => ({ ...prev, platform: '' }));
                }}
                placeholder="Ex: Nubank falso, Falsa Receita Federal, Shopee, Telegram"
                className={`w-full bg-[#111111] border rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                  errors.platform ? 'border-[#E00000]' : 'border-[#262626] focus:border-[#FF1A1A]'
                }`}
              />
              {errors.platform && <p className="text-xs text-[#E00000]">{errors.platform}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-tech font-bold">
                5. DATA DO INCIDENTE / OBSERVAÇÃO:
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full bg-[#111111] border border-[#262626] rounded px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF1A1A] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Link / URL Suspeita */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-tech font-bold">
              6. LINK / DOMÍNIO SUSPEITO (OPCIONAL):
            </label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Ex: https://receita-regularizacao-falsa[.]online"
              className="w-full bg-[#111111] border border-[#262626] rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF1A1A] transition-colors"
            />
            <p className="text-[11px] text-neutral-500 font-sans">
              Dica: você pode desativar o link usando colchetes (ex: site[.]com) para evitar cliques acidentais.
            </p>
          </div>

          {/* Narrative / Incident Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-tech font-bold">
                7. DESCRIÇÃO DETALHADA DOS FATOS: *
              </label>
              <span className="text-[11px] text-neutral-500">{description.length} caracteres</span>
            </div>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Explique como foi a abordagem inicial, argumentos utilizados pelo golpista, valores solicitados e que tipo de pressão psicológica foi aplicada..."
              className={`w-full bg-[#111111] border rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                errors.description ? 'border-[#E00000]' : 'border-[#262626] focus:border-[#FF1A1A]'
              }`}
            />
            {errors.description && <p className="text-xs text-[#E00000]">{errors.description}</p>}
          </div>

          {/* Technical Indicators */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-tech font-bold">
              8. INDICADORES TÉCNICOS / CHAVES (OPCIONAL):
            </label>
            <textarea
              rows={2}
              value={indicators}
              onChange={(e) => setIndicators(e.target.value)}
              placeholder="Ex: Números de telefone (+55 11 9xxxx-xxxx), Chaves Pix aleatórias usadas pelos golpistas, IDs de transação..."
              className="w-full bg-[#111111] border border-[#262626] rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF1A1A] transition-colors font-mono text-xs"
            />
          </div>

          {/* Content Safety Error Banner */}
          {errors.safety && (
            <div className="p-4 bg-red-950/40 border border-[#E00000] rounded-lg text-xs text-red-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#E00000] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-bold mb-1">Aviso de Segurança de Dados:</strong>
                <p>{errors.safety}</p>
              </div>
            </div>
          )}

          {/* Privacy and Identity Toggles */}
          <div className="space-y-4 pt-4 border-t border-[#1f1f1f]">
            <div className="flex items-center justify-between p-4 bg-[#111] border border-[#222] rounded-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">Relato 100% Anônimo</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Nenhum e-mail ou dado de identificação pessoal será armazenado.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E00000]"></div>
              </label>
            </div>

            {!isAnonymous && (
              <div className="space-y-2 pl-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-tech font-bold">
                  E-mail para Retorno do Protocolo:
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value);
                    if (errors.contactEmail) setErrors((prev) => ({ ...prev, contactEmail: '' }));
                  }}
                  placeholder="seu-email@exemplo.com"
                  className={`w-full bg-[#111111] border rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors ${
                    errors.contactEmail ? 'border-[#E00000]' : 'border-[#262626] focus:border-[#FF1A1A]'
                  }`}
                />
                {errors.contactEmail && <p className="text-xs text-[#E00000]">{errors.contactEmail}</p>}
              </div>
            )}

            {/* Mandatory Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={confirmedNoPersonalData}
                  onChange={(e) => {
                    setConfirmedNoPersonalData(e.target.checked);
                    if (errors.confirmedNoPersonalData) setErrors((prev) => ({ ...prev, confirmedNoPersonalData: '' }));
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-neutral-700 bg-[#111] text-[#E00000] focus:ring-0 focus:ring-offset-0"
                />
                <span>
                  <strong>Confirmo que não incluí dados confidenciais de terceiros</strong> (como senhas, números de cartão de crédito, códigos de segurança ou documentos pessoais sem autorização).
                </span>
              </label>
              {errors.confirmedNoPersonalData && <p className="text-xs text-[#E00000] pl-7">{errors.confirmedNoPersonalData}</p>}

              <label className="flex items-start gap-3 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={acceptedEducationalReview}
                  onChange={(e) => {
                    setAcceptedEducationalReview(e.target.checked);
                    if (errors.acceptedEducationalReview) setErrors((prev) => ({ ...prev, acceptedEducationalReview: '' }));
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-neutral-700 bg-[#111] text-[#E00000] focus:ring-0 focus:ring-offset-0"
                />
                <span>
                  Concordo com a triagem defensiva deste relato para fins de pesquisa, conscientização pública e prevenção a novas vítimas no <strong>E GUI 404</strong>.
                </span>
              </label>
              {errors.acceptedEducationalReview && <p className="text-xs text-[#E00000] pl-7">{errors.acceptedEducationalReview}</p>}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Canal com criptografia em trânsito e anonimização ativa.</span>
            </div>

  {submitError && (
    <div role="alert" className="w-full text-xs text-[#FF6B6B] border border-[#7F1D1D] bg-[#2A0D0D] rounded px-3 py-2">
      {submitError}
    </div>
  )}
  <button
  type="submit"
  disabled={submitting}
  className="w-full sm:w-auto px-8 py-3 bg-[#E00000] hover:bg-[#b00000] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-tech font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 cursor-pointer"
  >
  <Send className="w-4 h-4" />
  {submitting ? 'ENVIANDO...' : 'ENVIAR RELATO DEFENSIVO'}
  </button>
          </div>
        </form>
      )}
    </div>
  );
};
