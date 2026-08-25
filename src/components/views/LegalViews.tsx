import React from 'react';
import { Shield, Lock, FileText, Scale, Eye, AlertTriangle } from 'lucide-react';

interface LegalViewProps {
  type: 'privacy' | 'terms' | 'cookies' | 'editorial-policy' | 'disclaimer';
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const LegalView: React.FC<LegalViewProps> = ({ type, onNavigate, language }) => {
  const titles = {
    privacy: 'POLÍTICA DE PRIVACIDADE & LGPD',
    terms: 'TERMOS DE USO E CONDUTA',
    cookies: 'POLÍTICA DE COOKIES & ARMAZENAMENTO LOCAL',
    'editorial-policy': 'POLÍTICA EDITORIAL & RIGOR DE VERIFICAÇÃO',
    disclaimer: 'ISENÇÃO DE RESPONSABILIDADE & FINALIDADE DEFENSIVA'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2 font-tech">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <Scale className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">LEGAL COMPLIANCE // GOVERNANCE</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          {titles[type] || 'DOCUMENTO LEGAL'}
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Última revisão: Fevereiro de 2026 · Plataforma E GUI 404 (恶鬼)
        </p>
      </div>

      <div className="hud-card bg-[#080808] border border-[#222222] rounded-lg p-6 sm:p-10 space-y-6 text-sm text-neutral-300 leading-relaxed">
        {type === 'privacy' && (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded font-tech text-xs text-neutral-200">
              <b className="text-emerald-400 uppercase block mb-1">COMPROMISSO DE MINIMIZAÇÃO DE DADOS (LGPD):</b>
              O E GUI 404 opera sob o princípio da privacidade por padrão (Privacy by Design). Não exigimos cadastro obrigatório para navegação, não vendemos dados para terceiros e não utilizamos rastreadores invasivos de comportamento.
            </div>

            <section className="space-y-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                1. DADOS COLETADOS
              </h3>
              <p>
                Coletamos apenas dados estritamente necessários quando você submete voluntariamente formulários de denúncia de golpes ou assina nosso boletim informativo (Signal Report). Nenhum dado bancário real, senha ou documento pessoal deve ser enviado.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                2. ANONIMIZAÇÃO DE RELATOS
              </h3>
              <p>
                Qualquer relato de golpe enviado através da plataforma passa por filtros de desidentificação antes de ser utilizado em pesquisas de segurança ou incorporado ao Scam Archive.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                3. DIREITOS DO TITULAR (LGPD - LEI Nº 13.709/2018)
              </h3>
              <p>
                Você possui o direito de confirmar a existência de tratamento, solicitar a exclusão de seu e-mail do boletim ou revogar seu consentimento a qualquer momento através do nosso formulário de contato seguro.
              </p>
            </section>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-6">
            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded font-tech text-xs text-neutral-200">
              <b className="text-red-400 uppercase block mb-1">CLÁUSULA DE USO EXCLUSIVAMENTE DEFENSIVO:</b>
              O usuário declara expressamente que utilizará as informações contidas no E GUI 404 unicamente para finalidades preventivas, educacionais e defensivas.
            </div>

            <section className="space-y-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                1. PROIBIÇÃO DE CONDUTAS ILÍCITAS
              </h3>
              <p>
                É expressamente vedada a reprodução de dados com a finalidade de cometer crimes cibernéticos, realizar engenharia social contra terceiros, criar páginas falsas ou tentar invadir sistemas públicos ou privados.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                2. PROPRIEDADE INTELECTUAL E CITAÇÃO
              </h3>
              <p>
                Os relatórios, análises de casos e materiais educativos do E GUI 404 podem ser compartilhados livremente para fins educacionais e de conscientização pública, desde que atribuída a devida fonte.
              </p>
            </section>
          </div>
        )}

        {type === 'cookies' && (
          <div className="space-y-6">
            <section className="space-y-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                1. O QUE SÃO COOKIES E COMO UTILIZAMOS
              </h3>
              <p>
                Utilizamos armazenamento local básico (localStorage) exclusivamente para guardar preferências estéticas da sua sessão, tais como o modo de som (ativado/desativado), animações reduzidas e confirmação do aviso de privacidade. Não utilizamos cookies de rastreamento para anúncios ou redes de terceiros.
              </p>
            </section>
          </div>
        )}

        {type === 'editorial-policy' && (
          <div className="space-y-6">
            <section className="space-y-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                1. INDEPENDÊNCIA E ISENÇÃO EDITORIAL
              </h3>
              <p>
                O E GUI 404 é um observatório independente de crimes digitais. Não recebemos patrocínio de organizações criminosas e mantemos autonomia completa em nossas análises de ameaças.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                2. MÉTODO DE VERIFICAÇÃO DE FATOS
              </h3>
              <p>
                Todos os alertas emitidos no Scam Archive passam por triagem técnica: validação com fontes oficiais (Bancos Centrais, Polícias Especializadas, CERTs) e desconstrução em ambiente de laboratório seguro.
              </p>
            </section>
          </div>
        )}

        {type === 'disclaimer' && (
          <div className="space-y-6">
            <section className="space-y-2">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                ISENÇÃO DE RESPONSABILIDADE JURÍDICA E DEFESA
              </h3>
              <p>
                As informações fornecidas nesta plataforma têm caráter estritamente informativo e educativo. O E GUI 404 não presta consultoria jurídica, representação policial ou suporte financeiro individual a vítimas. Vítimas de crimes cibernéticos devem procurar imediatamente sua agência bancária e registrar boletim de ocorrência na Delegacia de Polícia Civil mais próxima.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
