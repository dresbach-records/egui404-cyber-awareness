import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Scale, Lock, HeartHandshake } from 'lucide-react';

interface ForumGuidelinesModalProps {
  onClose: () => void;
}

export const ForumGuidelinesModal: React.FC<ForumGuidelinesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0c0c0c] border border-[#262626] rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl font-sans my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 font-tech">
          <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-bold tracking-widest uppercase">DIRETRIZES DA COMUNIDADE DEFENSIVA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-wider">
            CÓDIGO DE CONDUTA & REGRAS DE SEGURANÇA
          </h2>
          <p className="text-xs text-neutral-400">
            A comunidade E GUI 404 é um espaço rigorosamente defensivo, voltado para conscientização, apoio a vítimas e educação em cibersegurança.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          
          {/* Rule 1 */}
          <div className="p-4 bg-[#111] border border-[#222] rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-tech text-xs uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. FINALIDADE EXCLUSIVAMENTE DEFENSIVA</span>
            </div>
            <p className="text-neutral-400 text-xs">
              É estritamente proibido publicar instruções de invasão, ferramentas de ataque (exploits, geradores de payload), tutoriais de quebra de senhas ou qualquer conteúdo que facilite a prática de cibercrimes.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-4 bg-[#111] border border-[#222] rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-tech text-xs uppercase">
              <Lock className="w-4 h-4" />
              <span>2. PROTEÇÃO RIGOROSA DE DADOS PESSOAIS (LGPD)</span>
            </div>
            <p className="text-neutral-400 text-xs">
              Nunca publique dados pessoais de terceiros ou de vítimas (como nomes completos, CPFs, endereços residenciais, extratos bancários com saldo ou números de telefone particulares). Ao postar capturas de tela, oculte sempre os dados privados.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-4 bg-[#111] border border-[#222] rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-[#00F0FF] font-bold font-tech text-xs uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>3. DESATIVE LINKS MALICIOSOS (DEFANG)</span>
            </div>
            <p className="text-neutral-400 text-xs">
              Para evitar que outros membros cliquem acidentalmente em links de phishing ou malware, desative as URLs antes de postar usando colchetes (ex: <code>hxxps://site-falso[.]com</code> em vez de um link clicável direto).
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-4 bg-[#111] border border-[#222] rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-bold font-tech text-xs uppercase">
              <HeartHandshake className="w-4 h-4" />
              <span>4. EMPATIA E RESPEITO COM VÍTIMAS</span>
            </div>
            <p className="text-neutral-400 text-xs">
              Vítimas de engenharia social frequentemente chegam fragilizadas emocionalmente. Comentários de julgamento moral, culpabilização da vítima ("como você caiu nisso?") ou desrespeito resultarão em banimento sumário.
            </p>
          </div>

          {/* Rule 5 */}
          <div className="p-4 bg-[#111] border border-[#222] rounded-lg space-y-1.5">
            <div className="flex items-center gap-2 text-[#E00000] font-bold font-tech text-xs uppercase">
              <Scale className="w-4 h-4" />
              <span>5. PROIBIÇÃO DE JUSTIÇA COM AS PRÓPRIAS MÃOS (DOXXING)</span>
            </div>
            <p className="text-neutral-400 text-xs">
              Não organize linchamentos virtuais nem campanhas de retaliação. Nomes de pessoas que aparecem em chaves Pix de golpes costumam pertencer a laranjas ou a outras vítimas com dados usurpados. Encaminhe as evidências sempre para as autoridades policiais.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#E00000] hover:bg-[#b00000] text-white rounded text-xs font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            ENTENDIDO & CONCORDO
          </button>
        </div>
      </div>
    </div>
  );
};
