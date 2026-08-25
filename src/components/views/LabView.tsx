import React, { useState } from 'react';
import {
  Cpu,
  Globe,
  Mail,
  KeyRound,
  Users,
  CheckCircle,
  AlertTriangle,
  Search,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CyberCard } from '../ui/CyberCard';
import { SoundEngine } from '../../services/audioService';

interface LabViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const LabView: React.FC<LabViewProps> = ({ onNavigate, language }) => {
  const [activeTab, setActiveTab] = useState<'URL' | 'EMAIL' | 'PASSWORD' | 'ENGINEERING'>('URL');

  // Tool 1: URL Analyzer State
  const [urlInput, setUrlInput] = useState('https://bancodobrasil.com.br.login-seguro.xyz/recadastramento');
  const [urlAnalysis, setUrlAnalysis] = useState<{
    domain: string;
    subdomains: string[];
    tld: string;
    isSuspicious: boolean;
    flags: string[];
  } | null>(null);

  // Tool 2: Email Header Inspector State
  const [emailScenario, setEmailScenario] = useState<'BANK_SPOOF' | 'CEO_FRAUD' | 'LEGIT_RECEIPT'>('BANK_SPOOF');

  // Tool 3: Password Entropy Laboratory State
  const [passInput, setPassInput] = useState('MinhaSenhaSegura2026!');

  // Analyze URL function
  const handleAnalyzeUrl = () => {
    SoundEngine.playKeyClick();
    try {
      let raw = urlInput.trim();
      if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
        raw = 'https://' + raw;
      }
      const parsed = new URL(raw);
      const host = parsed.hostname;
      const parts = host.split('.');
      const tld = parts.length > 1 ? parts.slice(-1)[0] : '';
      const domain = parts.length >= 2 ? parts.slice(-2).join('.') : host;
      const subdomains = parts.length > 2 ? parts.slice(0, -2) : [];

      const flags: string[] = [];
      const suspiciousTlds = ['xyz', 'online', 'top', 'site', 'ru', 'cn', 'tk', 'vip', 'click', 'fun'];

      if (suspiciousTlds.includes(tld.toLowerCase())) {
        flags.push(`Extensão de domínio (${tld}) frequentemente associada a páginas temporárias de phishing.`);
      }

      if (subdomains.some((s) => ['banco', 'nubank', 'itau', 'bradesco', 'caixa', 'correios', 'gov', 'receita'].some((k) => s.includes(k)))) {
        flags.push('Nome de instituição conhecida posicionado em SUBDOMÍNIO para enganar o usuário visualmente.');
      }

      if (parsed.protocol === 'http:') {
        flags.push('Conexão não criptografada (HTTP sem SSL).');
      }

      if (host.includes('-') && (host.includes('login') || host.includes('seguro') || host.includes('atualizacao'))) {
        flags.push('Uso de hifens com palavras de segurança para induzir falsa credibilidade.');
      }

      setUrlAnalysis({
        domain,
        subdomains,
        tld,
        isSuspicious: flags.length > 0,
        flags: flags.length > 0 ? flags : ['Nenhum padrão óbvio de typosquatting detectado neste teste de amostragem.']
      });
    } catch {
      setUrlAnalysis({
        domain: 'Inválido',
        subdomains: [],
        tld: '',
        isSuspicious: true,
        flags: ['Formato de URL não pôde ser interpretado.']
      });
    }
  };

  // Calculate Password Entropy
  const calculateEntropy = (str: string) => {
    let poolSize = 0;
    if (/[a-z]/.test(str)) poolSize += 26;
    if (/[A-Z]/.test(str)) poolSize += 26;
    if (/[0-9]/.test(str)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(str)) poolSize += 33;

    if (str.length === 0 || poolSize === 0) return { entropy: 0, crackTime: 'Instantâneo', rating: 'MUITO FRACA' };

    const entropy = Math.round(str.length * Math.log2(poolSize));
    let crackTime = 'Alguns segundos';
    let rating = 'FRACA';

    if (entropy > 80) {
      crackTime = 'Centenas de séculos (com supercomputadores)';
      rating = 'EXCELENTE / BLINDADA';
    } else if (entropy > 60) {
      crackTime = 'Vários anos';
      rating = 'FORTE';
    } else if (entropy > 40) {
      crackTime = 'Alguns dias ou semanas';
      rating = 'MODERADA';
    }

    return { entropy, crackTime, rating };
  };

  const entropyData = calculateEntropy(passInput);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2 font-tech">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <Cpu className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">INTERACTIVE CYBER LAB (SAFE SANDBOX)</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          CYBER DEFENSE LAB
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-2xl">
          Ferramentas interativas e didáticas para praticar inspeção de URLs, análise de cabeçalhos de e-mail e cálculo de entropia criptográfica. Sem envio de dados para a internet.
        </p>
      </div>

      {/* Lab Module Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tech text-xs">
        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            setActiveTab('URL');
          }}
          className={`p-3 rounded border text-left flex items-center gap-2 transition-all ${
            activeTab === 'URL'
              ? 'bg-[#150a0a] border-[#E00000] text-white shadow-[0_0_15px_rgba(224,0,0,0.15)]'
              : 'bg-[#090909] border-[#1f1f1f] text-neutral-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-[#FF1A1A]" />
          <span className="font-bold">01. URL ANALYZER</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            setActiveTab('EMAIL');
          }}
          className={`p-3 rounded border text-left flex items-center gap-2 transition-all ${
            activeTab === 'EMAIL'
              ? 'bg-[#150a0a] border-[#E00000] text-white shadow-[0_0_15px_rgba(224,0,0,0.15)]'
              : 'bg-[#090909] border-[#1f1f1f] text-neutral-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4 text-blue-400" />
          <span className="font-bold">02. PHISHING HEADERS</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            setActiveTab('PASSWORD');
          }}
          className={`p-3 rounded border text-left flex items-center gap-2 transition-all ${
            activeTab === 'PASSWORD'
              ? 'bg-[#150a0a] border-[#E00000] text-white shadow-[0_0_15px_rgba(224,0,0,0.15)]'
              : 'bg-[#090909] border-[#1f1f1f] text-neutral-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">03. ENTROPY LAB</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            setActiveTab('ENGINEERING');
          }}
          className={`p-3 rounded border text-left flex items-center gap-2 transition-all ${
            activeTab === 'ENGINEERING'
              ? 'bg-[#150a0a] border-[#E00000] text-white shadow-[0_0_15px_rgba(224,0,0,0.15)]'
              : 'bg-[#090909] border-[#1f1f1f] text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span className="font-bold">04. SOCIAL TACTICS</span>
        </button>
      </div>

      {/* TAB 1: URL DECEPTIVE ANALYZER */}
      {activeTab === 'URL' && (
        <div className="hud-card bg-[#080808] border border-[#222222] rounded-lg p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#1c1c1c] pb-4 space-y-1 font-tech">
            <h2 className="text-xl font-bold text-white uppercase flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#FF1A1A]" />
              DESCONSTRUTOR DE URLS & TYPOSQUATTING
            </h2>
            <p className="text-xs text-neutral-400 font-sans">
              Cole uma URL suspeita para dissecar o domínio real versus subdomínios enganosos.
            </p>
          </div>

          <div className="space-y-3 font-tech">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://exemplo-banco.online/login"
                className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#E00000] font-mono"
              />
              <button
                onClick={handleAnalyzeUrl}
                className="px-6 py-2.5 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                ANALISAR URL
              </button>
            </div>

            {/* Quick preset test URLs */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 overflow-x-auto pb-1">
              <span>Testar Exemplos:</span>
              <button
                onClick={() => {
                  setUrlInput('https://correios.com.br.rastreio-taxas.online/pagamento');
                }}
                className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 hover:text-white rounded"
              >
                Falso Correios
              </button>
              <button
                onClick={() => {
                  setUrlInput('https://nubank.com.br/seguranca/dupla-autenticacao');
                }}
                className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 hover:text-white rounded"
              >
                Nubank Oficial
              </button>
              <button
                onClick={() => {
                  setUrlInput('https://gov.br/receitafederal/restituicao');
                }}
                className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 hover:text-white rounded"
              >
                Gov.br Oficial
              </button>
            </div>
          </div>

          {/* Analysis Results Box */}
          {urlAnalysis && (
            <div className="p-5 bg-[#0d0d0d] border border-[#222222] rounded space-y-4 font-tech text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase tracking-wider">RESULTADO DA DISSECAÇÃO:</span>
                <span
                  className={`px-2.5 py-0.5 rounded font-bold uppercase ${
                    urlAnalysis.isSuspicious
                      ? 'bg-red-950/60 border border-red-500 text-red-400'
                      : 'bg-emerald-950/60 border border-emerald-500 text-emerald-400'
                  }`}
                >
                  {urlAnalysis.isSuspicious ? 'PADRÃO SUSPEITO DETECTADO' : 'ESTRUTURA APARENTE REGULAR'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-black rounded border border-[#1a1a1a]">
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">DOMÍNIO REAL (QUEM CONTROLA):</span>
                  <span className="text-white font-bold text-sm font-mono">{urlAnalysis.domain}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">SUBDOMÍNIOS (DISFARCE):</span>
                  <span className="text-amber-400 font-mono text-xs">
                    {urlAnalysis.subdomains.join('.') || '(Nenhum)'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] uppercase block">EXTENSÃO (TLD):</span>
                  <span className="text-blue-400 font-mono text-xs">.{urlAnalysis.tld}</span>
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <span className="font-tech text-xs text-neutral-400 font-bold uppercase">OBSERVAÇÕES DEFENSIVAS:</span>
                <ul className="space-y-1">
                  {urlAnalysis.flags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-300 text-xs">
                      <span className="text-[#FF1A1A] font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EMAIL PHISHING HEADERS INSPECTOR */}
      {activeTab === 'EMAIL' && (
        <div className="hud-card bg-[#080808] border border-[#222222] rounded-lg p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#1c1c1c] pb-4 space-y-1 font-tech">
            <h2 className="text-xl font-bold text-white uppercase flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              INSPETOR DE CABEÇALHOS & SPOOFING DE E-MAIL
            </h2>
            <p className="text-xs text-neutral-400 font-sans">
              Veja a diferença entre o nome exibido ("From Name") e o remetente técnico real ("Return-Path" / "DKIM").
            </p>
          </div>

          <div className="flex items-center gap-2 font-tech text-xs">
            <span className="text-neutral-500">Escolha o Cenário:</span>
            <button
              onClick={() => setEmailScenario('BANK_SPOOF')}
              className={`px-3 py-1 rounded ${
                emailScenario === 'BANK_SPOOF' ? 'bg-[#E00000] text-white font-bold' : 'bg-neutral-900 text-neutral-400'
              }`}
            >
              Falso Banco (Phishing)
            </button>
            <button
              onClick={() => setEmailScenario('CEO_FRAUD')}
              className={`px-3 py-1 rounded ${
                emailScenario === 'CEO_FRAUD' ? 'bg-[#E00000] text-white font-bold' : 'bg-neutral-900 text-neutral-400'
              }`}
            >
              Golpe do CEO (BEC)
            </button>
          </div>

          {/* Simulated Email Raw Header */}
          <div className="p-4 bg-[#050505] border border-[#202020] rounded font-mono text-xs space-y-2">
            <div className="text-neutral-400 border-b border-[#181818] pb-2">
              <p>
                <b className="text-white">From (Exibido):</b>{' '}
                {emailScenario === 'BANK_SPOOF'
                  ? '"Central de Seguranca Bancaria" <notificacoes@banco.com.br>'
                  : '"Diretoria Financeira" <ceo@empresa.com.br>'}
              </p>
              <p>
                <b className="text-amber-400">Return-Path (Real):</b>{' '}
                <span className="bg-amber-950/40 text-amber-300 px-1 rounded">
                  {emailScenario === 'BANK_SPOOF' ? 'spammer@smtp-relay-free.ru' : 'director-urgent@empresa-corpp.com'}
                </span>
              </p>
              <p>
                <b className="text-[#FF5555]">DKIM-Signature / SPF:</b>{' '}
                <span className="text-red-400 font-bold">FAIL (Domain Mismatch)</span>
              </p>
            </div>

            <div className="pt-2 text-neutral-300 font-sans text-xs sm:text-sm">
              <p className="font-bold text-white mb-1">
                {emailScenario === 'BANK_SPOOF'
                  ? 'Assunto: [URGENTE] Bloqueio de Cartao por Transacao Atipica'
                  : 'Assunto: Operacao Confidencial - TED Imediato'}
              </p>
              <p className="text-neutral-400 leading-relaxed">
                {emailScenario === 'BANK_SPOOF'
                  ? 'Prezado cliente, identificamos uma transferencia no valor de R$ 4.290,00. Clique no botao abaixo para cancelar imediatamente.'
                  : 'Prezado financeiro, estou em reuniao com investidores internacionais. Preciso que liquide o pagamento da fatura em anexo ate as 17h impreterivelmente.'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded font-sans text-xs sm:text-sm text-neutral-200">
            <b className="font-tech text-emerald-400 uppercase block mb-1">O QUE OBSERVAR AQUI?</b>
            <p>
              O remetente visual no campo <b>From</b> é facilmente falsificado. Provedores modernos utilizam os registros <b>SPF, DKIM e DMARC</b> para confirmar se o servidor de envio realmente tem autorização para emitir e-mails naquele domínio.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: PASSWORD ENTROPY & PASSPHRASE LABORATORY */}
      {activeTab === 'PASSWORD' && (
        <div className="hud-card bg-[#080808] border border-[#222222] rounded-lg p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#1c1c1c] pb-4 space-y-1 font-tech">
            <h2 className="text-xl font-bold text-white uppercase flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              LABORATÓRIO DE ENTROPIA DE SENHAS & PASSPHRASES
            </h2>
            <p className="text-xs text-neutral-400 font-sans">
              Entenda como o comprimento exponencial supera a complexidade arbitrária. Processamento 100% no navegador (nada é enviado para a internet).
            </p>
          </div>

          <div className="space-y-4 font-tech">
            <div>
              <label className="text-xs text-neutral-400 uppercase block mb-1 font-bold">
                TESTE UMA SENHA OU FRASE SECRETA:
              </label>
              <input
                type="text"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                placeholder="Digite para calcular a entropia em tempo real..."
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded">
                <span className="text-[10px] text-neutral-500 uppercase block">ENTROPIA ESTIMADA:</span>
                <span className="font-display text-3xl text-emerald-400">{entropyData.entropy} BITS</span>
              </div>

              <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded">
                <span className="text-[10px] text-neutral-500 uppercase block">CLASSIFICAÇÃO:</span>
                <span className="font-display text-2xl text-white">{entropyData.rating}</span>
              </div>

              <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded">
                <span className="text-[10px] text-neutral-500 uppercase block">TEMPO DE FORÇA BRUTA:</span>
                <span className="font-sans text-xs font-bold text-neutral-300 block mt-1">{entropyData.crackTime}</span>
              </div>
            </div>

            <div className="p-4 bg-[#101010] border border-[#222] rounded text-xs font-sans text-neutral-300 leading-relaxed">
              <b className="font-tech text-white uppercase block mb-1">DICA DEFENSIVA:</b>
              Senhas longas formadas por 4 ou 5 palavras aleatórias (ex: <code className="text-emerald-400 font-mono">cavalo-abacaxi-nuvem-guitarra</code>) possuem entropia superior a senhas curtas cheias de símbolos (ex: <code className="text-[#FF7777] font-mono">P@$$12</code>) e são muito mais fáceis de memorizar.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOCIAL ENGINEERING TACTICS */}
      {activeTab === 'ENGINEERING' && (
        <div className="hud-card bg-[#080808] border border-[#222222] rounded-lg p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#1c1c1c] pb-4 space-y-1 font-tech">
            <h2 className="text-xl font-bold text-white uppercase flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              DECONSTRUTOR DE ENGENHARIA SOCIAL
            </h2>
            <p className="text-xs text-neutral-400 font-sans">
              Os 4 vetores psicológicos explorados em quase 99% dos golpes digitais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
            <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-2">
              <span className="font-tech font-bold text-amber-400 uppercase text-xs">01. PRINCÍPIO DA AUTORIDADE</span>
              <p className="text-neutral-300">
                O golpista assume a identidade de policial, gerente de segurança bancária ou auditor da Receita para inibir o questionamento crítico da vítima.
              </p>
            </div>

            <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-2">
              <span className="font-tech font-bold text-[#FF5555] uppercase text-xs">02. RESTRIÇÃO TEMPORAL (URGÊNCIA)</span>
              <p className="text-neutral-300">
                "Você tem 15 minutos para transferir antes que sua conta seja bloqueada". A pressa impede a consulta a amigos, familiares ou canais oficiais.
              </p>
            </div>

            <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-2">
              <span className="font-tech font-bold text-blue-400 uppercase text-xs">03. ISOLAMENTO DO CONTATO</span>
              <p className="text-neutral-300">
                "Não desligue a chamada", "Este é um procedimento sigiloso". O objetivo é evitar que uma segunda pessoa alerte a vítima durante o golpe.
              </p>
            </div>

            <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-2">
              <span className="font-tech font-bold text-emerald-400 uppercase text-xs">04. RECIPROCIDADE FORJADA</span>
              <p className="text-neutral-300">
                Pagar um saque pequeno de R$ 20 no início para que a vítima sinta a obrigação ou a confiança de depositar quantias maiores posteriormente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
