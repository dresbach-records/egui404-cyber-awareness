import React, { useState } from 'react';
import {
  RefreshCw,
  Database,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Shield,
  Layers,
  ArrowDownCircle,
  FileCheck,
  Zap,
  Clock,
  Radio
} from 'lucide-react';
import { RnpSyncService, AuditLogService } from '../../../services/adminService';
import { SoundEngine } from '../../../services/audioService';

export const AdminRnpSyncView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ count: number; date: string } | null>(null);

  const handleTriggerSync = () => {
    SoundEngine.playKeyClick();
    setIsSyncing(true);
    setTimeout(() => {
      const result = RnpSyncService.triggerSync();
      setIsSyncing(false);
      setSyncResult(result);
      SoundEngine.playSuccessSound();

      AuditLogService.log({
        user: 'admin_sync_job',
        action: 'INTEGRATION_SYNC',
        entity: 'RNP_CATALOGO_FRAUDES',
        entityId: 'RNP_SYNC_JOB',
        ip: '127.0.0.1',
        result: 'SUCCESS',
        details: `Sincronização manual RNP/CAIS concluída. ${result.count} registros reindexados.`
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
          Cockpit de Sincronização — Catálogo de Fraudes RNP/CAIS
        </h1>
        <p className="text-xs font-mono text-[#888888]">
          Integração institucional com o Centro de Atendimento a Incidentes de Segurança da Rede Nacional de Ensino e Pesquisa.
        </p>
      </div>

      {/* Sync Status Banner */}
      <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-mono font-bold text-white uppercase">Conector RNP/CAIS Ativo</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  ONLINE
                </span>
              </div>
              <p className="text-xs font-mono text-[#888888] mt-0.5">
                Fonte: catalogodefraudes.rnp.br · Formato de Ingestão: Metadados Estruturados E GUI 404
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-5 py-2.5 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)] disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando Registros...' : 'Executar Sincronização Agora'}</span>
          </button>
        </div>

        {syncResult && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>
              Sincronização bem-sucedida! {syncResult.count} registros do catálogo RNP/CAIS indexados e atualizados às {syncResult.date}.
            </span>
          </div>
        )}
      </div>

      {/* Attribution & Compliance Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Shield className="w-4 h-4" />
            <h4 className="text-xs font-mono font-bold uppercase">Atribuição Obrigatória</h4>
          </div>
          <p className="text-[11px] font-mono text-[#888888] leading-relaxed">
            Todos os itens espelhados do Catálogo de Fraudes RNP/CAIS mantêm badge visível de proveniência e link direto para o registro público original.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Layers className="w-4 h-4" />
            <h4 className="text-xs font-mono font-bold uppercase">Camada Heurística</h4>
          </div>
          <p className="text-[11px] font-mono text-[#888888] leading-relaxed">
            O E GUI 404 enriquece os dados brutos com níveis de severidade tática, medidas de proteção defensiva imediatas e mapeamento de vetores de engenharia social.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <FileCheck className="w-4 h-4" />
            <h4 className="text-xs font-mono font-bold uppercase">LGPD & Segurança</h4>
          </div>
          <p className="text-[11px] font-mono text-[#888888] leading-relaxed">
            Sanitização automática de endereços IP maliciosos e strings ofensivas. Nenhum dado pessoal identificável de vítimas é persistido.
          </p>
        </div>
      </div>

      {/* Integration Technical Specs */}
      <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-3 font-mono text-xs">
        <h3 className="text-sm font-bold text-white uppercase pb-2 border-b border-[#1C1C1C]">
          Parâmetros do Pipeline de Ingestão
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#AAAAAA]">
          <div className="p-3 bg-[#141414] rounded-lg border border-[#222222]">
            <span className="text-[#666666] block text-[10px]">INTERVALO PROGRAMADO</span>
            <span className="text-white font-bold">A cada 6 horas (Cron Job)</span>
          </div>
          <div className="p-3 bg-[#141414] rounded-lg border border-[#222222]">
            <span className="text-[#666666] block text-[10px]">ESTATUTO DA FONTE</span>
            <span className="text-white font-bold">Informativo e Educativo (CAIS/RNP)</span>
          </div>
          <div className="p-3 bg-[#141414] rounded-lg border border-[#222222]">
            <span className="text-[#666666] block text-[10px]">TAXONOMIA DE CATEGORIAS</span>
            <span className="text-white font-bold">Mapeamento dinâmico para 15 categorias E GUI 404</span>
          </div>
          <div className="p-3 bg-[#141414] rounded-lg border border-[#222222]">
            <span className="text-[#666666] block text-[10px]">PRESERVAÇÃO DE IDENTIFICADOR</span>
            <span className="text-white font-bold">originalRecordId (ex: RNP_CAIS_001)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminImportsView: React.FC = () => {
  return <AdminRnpSyncView />;
};
