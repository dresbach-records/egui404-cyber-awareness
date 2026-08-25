import React, { useState, useEffect } from 'react';
import { healthApi } from '../../services/api/healthApi';
import { Activity, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export const ApiHealthBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [status, setStatus] = useState<'CHECKING' | 'ONLINE' | 'UNAVAILABLE'>('CHECKING');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const checkHealth = async () => {
    setStatus('CHECKING');
    const start = performance.now();
    try {
      const res = await healthApi.getHealth();
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      if (res && (res.status === 'ok' || res.status === 'degraded')) {
        setStatus('ONLINE');
      } else {
        setStatus('ONLINE'); // response received from backend
      }
    } catch {
      setStatus('UNAVAILABLE');
      setLatencyMs(null);
    }
  };

  useEffect(() => {
    checkHealth();
    // Poll health every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <button
        onClick={checkHealth}
        title={`Status da API de Produção: ${status} ${latencyMs !== null ? `(${latencyMs}ms)` : ''}`}
        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer bg-[#0D0D0D] border-[#222222] hover:border-[#444]"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === 'ONLINE'
              ? 'bg-emerald-400 animate-pulse'
              : status === 'CHECKING'
              ? 'bg-amber-400 animate-spin'
              : 'bg-red-500'
          }`}
        />
        <span
          className={
            status === 'ONLINE'
              ? 'text-emerald-400 font-bold'
              : status === 'CHECKING'
              ? 'text-amber-400 font-bold'
              : 'text-red-400 font-bold'
          }
        >
          API: {status}
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={checkHealth}
      title="Clique para verificar integridade da API em tempo real"
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0C0C0C] border border-[#242424] text-[11px] font-mono cursor-pointer hover:border-[#3A3A3A] transition-colors"
    >
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'ONLINE'
            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
            : status === 'CHECKING'
            ? 'bg-amber-400 animate-pulse'
            : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
        }`}
      />
      <div className="flex items-center gap-1.5">
        <span className="text-[#888888]">BACKEND:</span>
        <span
          className={`font-bold ${
            status === 'ONLINE'
              ? 'text-emerald-400'
              : status === 'CHECKING'
              ? 'text-amber-400'
              : 'text-red-400'
          }`}
        >
          {status === 'ONLINE' ? 'ONLINE' : status === 'CHECKING' ? 'VERIFICANDO' : 'INDISPONÍVEL'}
        </span>
      </div>
      {latencyMs !== null && (
        <span className="text-[10px] text-[#666666]">({latencyMs}ms)</span>
      )}
    </div>
  );
};
