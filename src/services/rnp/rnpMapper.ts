import { ScamItem, EguiThreat, ExternalThreatSource, ScamCategory, RiskLevel } from '../../types';
import { RnpRawFraudRecord } from './rnpTypes';
import { RnpNormalizer } from './rnpNormalizer';
import { RnpParser } from './rnpParser';

/**
 * E GUI 404 - RNP/CAIS Threat Mapper
 * Maps raw/normalized external catalog records into rich, defense-ready E GUI 404 Scam & Threat models.
 * Clearly demarcates:
 * - SOURCE DATA (Original title, original category, raw date, source link)
 * - E GUI 404 ANALYSIS (Defensive category, risk rating, warning signs, protection checklist, victim remediation)
 */

export const RnpMapper = {
  /**
   * Maps a raw RNP record to an E GUI 404 ScamItem
   */
  mapToScamItem: (raw: RnpRawFraudRecord): ScamItem => {
    const category = RnpNormalizer.normalizeCategory(raw.sourceCategory, raw.title, raw.tags);
    const riskLevel = RnpNormalizer.evaluateRiskLevel(category, raw.title, raw.rawExcerpt);
    const sanitizedSummary = raw.rawExcerpt
      ? RnpParser.sanitizeExcerpt(raw.rawExcerpt)
      : `Registro catalogado originalmente pelo CAIS/RNP sob a identificação ${raw.externalId}. Vetor de engenharia social explorando a temática "${raw.title}".`;
    const warningSigns = RnpParser.extractEducationalWarningSigns(raw.title, raw.tags, raw.rawExcerpt);

    // Format IDs
    const cleanIdNum = raw.id.replace(/\D/g, '') || '0000';
    const internalId = `egui-rnp-${cleanIdNum}`;
    const slug = `rnp-${cleanIdNum}-${raw.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48)}`;

    const externalSource: ExternalThreatSource = {
      id: `ext-rnp-${raw.id}`,
      provider: 'RNP_CAIS',
      externalId: raw.externalId || `RNP_CAIS:${raw.id}`,
      title: raw.title,
      originalUrl: raw.url,
      publishedAt: raw.publishedDate || '2026-01-01',
      accessedAt: new Date().toISOString().split('T')[0],
      tags: raw.tags,
      sourceCategory: raw.sourceCategory || 'catálogo de fraudes',
      organization: 'RNP / CAIS'
    };

    // Standardized defensive actions
    const howToProtect = [
      'Nunca clique em links recebidos por e-mail, SMS ou aplicativos de mensagem em comunicações alarmistas.',
      'Acesse o portal oficial do serviço ou órgão público digitando o endereço diretamente no navegador.',
      'Valide a autenticidade de notificações tributárias ou bancárias exclusivamente em aplicativos oficiais autenticados.',
      'Mantenha ativado o segundo fator de autenticação (MFA por aplicativo ou Passkey) em todas as suas contas.'
    ];

    const victimActions = [
      'Se forneceu senhas ou credenciais, altere-as imediatamente em um dispositivo seguro desconectado do link suspeito.',
      'Se realizou pagamento indevido via Pix, entre em contato imediatamente com seu banco solicitando abertura de contestação via MED (Mecanismo Especial de Devolução).',
      'Registre Boletim de Ocorrência na Delegacia Eletrônica de Crimes Cibernéticos do seu estado.',
      'Monitore seu CPF nos sistemas oficiais de proteção ao crédito e no Registrato do Banco Central.'
    ];

    const howItWorks = [
      'O fraudador envia mensagens em massa simulando comunicação oficial de instituição reconhecida.',
      'A mensagem utiliza gatilhos de urgência (bloqueio, penalidade ou prazo limite) para pressionar a vítima a clicar.',
      'O link direciona para uma página clonada projetada para capturar dados pessoais, senhas ou forçar pagamentos fraudulentos.'
    ];

    return {
      id: internalId,
      slug: slug,
      title: raw.title,
      category: category,
      riskLevel: riskLevel,
      status: 'MONITORED',
      date: raw.publishedDate || '2026-08-20',
      lastUpdated: raw.lastUpdated || '2026-08-25',
      firstObserved: raw.publishedDate || '2026-08-01',
      summary: sanitizedSummary,
      overview: `Este registro foi catalogado pelo Centro de Atendimento a Incidentes de Segurança (CAIS/RNP) com identificador de referência ${raw.externalId}. A análise defensiva do E GUI 404 sintetiza as táticas observadas para capacitar o reconhecimento precoce por cidadãos e organizações.`,
      howItWorks: howItWorks,
      threatFlow: ['CONTATO APÓCRIFO', 'ENGENHARIA SOCIAL / URGÊNCIA', 'PÁGINA FALSA / PHISHING', 'EXFILTRAÇÃO DE DADOS / COBRANÇA INDEVIDA'],
      warningSigns: warningSigns,
      commonTactics: [
        'Uso de subdomínios fraudulentos ou caracteres homógrafos',
        'Urgência psicológica com ameaça de cancelamento ou multa',
        'Ausência de canais oficiais para contraprova na própria mensagem'
      ],
      howToProtect: howToProtect,
      victimActions: victimActions,
      affectedPlatforms: ['E-mail', 'Navegadores Web', 'SMS / Mensageria', 'Mobile Banking'],
      geography: 'Brasil (BR)',
      country: 'Brasil',
      isVerified: true,
      verificationStatus: 'DOCUMENTED',
      sourceType: 'SECURITY_BULLETIN',
      sourceProvider: 'RNP_CAIS',
      originalRecordId: raw.externalId || `RNP_CAIS:${raw.id}`,
      originalUrl: raw.url,
      originalTitle: raw.title,
      originalCategory: raw.sourceCategory || 'catálogo de fraudes',
      originalTags: raw.tags,
      originalDate: raw.publishedDate || '2026-08-20',
      externalSources: [externalSource],
      relatedThreatIds: ['THREAT-BR-001', 'THREAT-BR-002'],
      relatedCaseIds: ['case-001', 'case-004'],
      relatedArticleSlugs: [
        'anatomia-do-phishing-como-identificar-links-e-remetentes-falsos',
        'engenharia-social-e-o-fator-humano-na-seguranca'
      ],
      relatedForumThreadSlugs: ['alerta-novo-phishing-receita-federal-irpf-2026'],
      sources: [
        {
          organization: 'RNP / CAIS',
          title: `Catálogo de Fraudes RNP/CAIS — Registro ${raw.externalId || raw.id}`,
          url: raw.url,
          sourceType: 'SECURITY_BULLETIN',
          isOfficial: true,
          publishedAt: raw.publishedDate
        }
      ]
    };
  },

  /**
   * Maps a raw RNP record to an EguiThreat interface
   */
  mapToEguiThreat: (raw: RnpRawFraudRecord): EguiThreat => {
    const scam = RnpMapper.mapToScamItem(raw);
    return {
      id: scam.id.toUpperCase(),
      slug: scam.slug,
      title: scam.title,
      category: scam.category,
      riskLevel: scam.riskLevel,
      status: 'MONITORED',
      verification: 'DOCUMENTED',
      summary: scam.summary,
      overview: scam.overview || scam.summary,
      warningSigns: scam.warningSigns,
      howToProtect: scam.howToProtect,
      victimActions: scam.victimActions,
      sources: scam.externalSources || [],
      tags: scam.originalTags || ['RNP/CAIS'],
      firstObserved: scam.firstObserved,
      lastUpdated: scam.lastUpdated,
      relatedThreatIds: scam.relatedThreatIds,
      relatedCaseIds: scam.relatedCaseIds,
      relatedArticleSlugs: scam.relatedArticleSlugs,
      relatedForumThreadSlugs: scam.relatedForumThreadSlugs
    };
  }
};
