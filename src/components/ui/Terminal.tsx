import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Trash2, ArrowRight } from 'lucide-react';
import { SoundEngine } from '../../services/audioService';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success' | 'alert';
  text: string | React.ReactNode;
}

interface TerminalProps {
  onNavigate?: (path: string) => void;
  className?: string;
  initialCollapsed?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ onNavigate, className = '' }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'SYSTEM INITIALIZED // E_GUI_404_OBSERVER_NODE v2.6.4'
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'DIGITAL THREAT ARCHIVE MOUNTED [READ-ONLY / DEFENSIVE MODE]'
    },
    {
      id: 'init-3',
      type: 'output',
      text: 'Digite "help" para ver a lista de comandos disponíveis ou clique nos atalhos abaixo.'
    }
  ]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    SoundEngine.playKeyClick();

    if (!trimmed) return;

    // Add to history
    setHistory((prev) => [trimmed, ...prev.slice(0, 29)]);
    setHistoryIndex(-1);

    const newLines: TerminalLine[] = [
      ...lines,
      { id: `cmd-${Date.now()}`, type: 'input', text: cmdStr }
    ];

    switch (trimmed) {
      case 'help':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-1 text-xs">
              <p className="text-[#FF1A1A] font-bold">COMANDOS DISPONÍVEIS:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pl-2 text-neutral-300">
                <span><b className="text-white">whoami</b> : Identidade do sistema</span>
                <span><b className="text-white">identity</b> : Arquétipo O Observador</span>
                <span><b className="text-white">trace</b> : Análise de rastreabilidade</span>
                <span><b className="text-white">status</b> : Status da rede e nós</span>
                <span><b className="text-white">mission</b> : Declaração de missão</span>
                <span><b className="text-white">threats</b> : Feed de ameaças ativas</span>
                <span><b className="text-white">archive</b> : Acessar arquivo de golpes</span>
                <span><b className="text-white">cases</b> : Dossiês investigativos</span>
                <span><b className="text-white">quiz</b> : Iniciar simulador de golpes</span>
                <span><b className="text-white">lab</b> : Abrir laboratório defensivo</span>
                <span><b className="text-white">report</b> : Denunciar padrão suspeito</span>
                <span><b className="text-white">clear</b> : Limpar tela</span>
              </div>
            </div>
          )
        });
        break;

      case 'whoami':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'E_GUI_404 (恶鬼) — The Observer. Plataforma de Cyber Crime Awareness & Scam Intelligence.'
        });
        break;

      case 'identity':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'IDENTITY: UNKNOWN. Arquétipo: O Observador. "Anonymity is not absence. Knowledge is defense."'
        });
        break;

      case 'trace':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'alert',
          text: 'TRACE: 404 NOT FOUND // SIGNAL: MONITORED // ORIGIN: DISTRIBUTED DEFENSIVE MESH'
        });
        break;

      case 'status':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: 'STATUS: ACTIVE // THREAT RADAR: 100% ONLINE // DEFENSIVE PROTOCOLS: ENGAGED'
        });
        break;

      case 'mission':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="border-l-2 border-[#E00000] pl-3 my-1">
              <p className="font-bold text-white tracking-widest">EXPOSE. EDUCATE. PROTECT.</p>
              <p className="text-neutral-400">"Conheça o golpe antes que ele conheça você."</p>
            </div>
          )
        });
        break;

      case 'threats':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Ameaças monitoradas: Phishing Restituição [CRÍTICO], Falsos Robôs Pix [CRÍTICO], Falsa Central Telefônica [CRÍTICO]. Redirecionando para /threats...'
        });
        if (onNavigate) onNavigate('/threats');
        break;

      case 'archive':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Carregando 14 categorias de golpes documentados. Redirecionando para /archive...'
        });
        if (onNavigate) onNavigate('/archive');
        break;

      case 'cases':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Abrindo dossiês investigativos [CASE #0042, CASE #0038, CASE #0027]. Redirecionando...'
        });
        if (onNavigate) onNavigate('/cases');
        break;

      case 'quiz':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'success',
          text: 'Iniciando simulador interativo: "Você reconheceria o golpe?". Redirecionando para /quiz...'
        });
        if (onNavigate) onNavigate('/quiz');
        break;

      case 'lab':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Carregando ferramentas de inspeção do Cyber Lab. Redirecionando para /lab...'
        });
        if (onNavigate) onNavigate('/lab');
        break;

      case 'report':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: 'Abrindo canal seguro de triagem de golpes. Redirecionando para /report...'
        });
        if (onNavigate) onNavigate('/report');
        break;

      case 'clear':
      case 'cls':
        setLines([]);
        setInputVal('');
        return;

      default:
        newLines.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `Comando não reconhecido: "${trimmed}". Digite "help" para ver os comandos válidos.`
        });
        break;
    }

    setLines(newLines);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  const quickCommands = ['whoami', 'identity', 'status', 'mission', 'threats', 'quiz', 'help'];

  return (
    <div
      id="terminal-interface"
      className={`hud-card rounded-md border border-[#222222] bg-[#070707] flex flex-col font-tech overflow-hidden shadow-2xl transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 z-50 p-4' : 'w-full'
      } ${className}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e0e0e] border-b border-[#1f1f1f] select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E00000] inline-block animate-pulse" />
          <TerminalIcon className="w-4 h-4 text-[#FF1A1A]" />
          <span className="text-xs font-bold text-neutral-300 tracking-wider">
            E_GUI_404 // INTERACTIVE_DEFENSIVE_SHELL
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLines([])}
            title="Limpar terminal"
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Reduzir' : 'Expandir'}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        className="p-4 space-y-2 overflow-y-auto text-xs text-neutral-300 max-h-72 sm:max-h-80 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((l) => {
          if (l.type === 'input') {
            return (
              <div key={l.id} className="flex items-center gap-2 text-neutral-100 font-bold">
                <span className="text-[#FF1A1A]">&gt;</span>
                <span>{l.text}</span>
              </div>
            );
          }
          if (l.type === 'system') {
            return (
              <div key={l.id} className="text-neutral-500 text-[11px] tracking-wide">
                [SYS] {l.text}
              </div>
            );
          }
          if (l.type === 'alert') {
            return (
              <div key={l.id} className="text-[#FF4D4D] bg-[#FF1A1A]/10 border-l-2 border-[#FF1A1A] pl-2 py-0.5">
                {l.text}
              </div>
            );
          }
          if (l.type === 'success') {
            return (
              <div key={l.id} className="text-emerald-400 bg-emerald-950/20 border-l-2 border-emerald-500 pl-2 py-0.5">
                {l.text}
              </div>
            );
          }
          if (l.type === 'error') {
            return (
              <div key={l.id} className="text-red-400">
                [ERROR] {l.text}
              </div>
            );
          }
          return (
            <div key={l.id} className="text-neutral-300 leading-relaxed">
              {l.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="px-4 py-1.5 bg-[#0a0a0a] border-t border-[#191919] flex items-center gap-1.5 overflow-x-auto text-[10px]">
        <span className="text-neutral-500 uppercase tracking-wider shrink-0 mr-1">Atalhos:</span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-[#E00000] hover:bg-[#E00000]/10 transition-colors shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Command Input Bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0e0e0e] border-t border-[#1f1f1f]">
        <span className="text-[#FF1A1A] font-bold text-sm select-none animate-pulse">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite um comando (ex: help, whoami, threats)..."
          className="flex-1 bg-transparent border-none text-white text-xs font-tech focus:outline-none placeholder:text-neutral-600"
        />
        <button
          onClick={() => handleCommand(inputVal)}
          disabled={!inputVal.trim()}
          className="p-1 rounded bg-[#E00000]/20 text-[#FF5555] hover:bg-[#E00000] hover:text-white disabled:opacity-30 transition-colors"
          title="Executar comando"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
