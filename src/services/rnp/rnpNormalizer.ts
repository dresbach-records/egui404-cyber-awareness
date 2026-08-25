import { ScamCategory, RiskLevel, ThreatStatus } from '../../types';
import { RnpTaxonomyMapping } from './rnpTypes';

/**
 * RNP / CAIS Taxonomy Normalization Layer
 * Converts RNP external categories and tags into E GUI 404 defensive schema,
 * while retaining the exact source labels for transparent attribution.
 */

export const RNP_TAXONOMY_RULES: RnpTaxonomyMapping[] = [
  {
    rnpCategoryPattern: 'receitafederal|receita|irpf|tributario|malha fina|darf|simples',
    eguiCategory: 'PHISHING',
    defaultRisk: 'HIGH',
    tags: ['Governo', 'Receita Federal', 'Imposto de Renda', 'Falsa Intimação']
  },
  {
    rnpCategoryPattern: 'correios|encomenda|rastreio|sedex|taxa alfandegaria|remessa',
    eguiCategory: 'DELIVERY_SCAM' as ScamCategory, // mapped to delivery/marketplace/phishing
    defaultRisk: 'HIGH',
    tags: ['Correios', 'Taxa Falsa', 'SMS Phishing', 'Smishing']
  },
  {
    rnpCategoryPattern: 'bancos|banco|bradesco|itau|caixa|bb|santander|inter|nubank|sicredi|sicoob',
    eguiCategory: 'BANKING FRAUD',
    defaultRisk: 'CRITICAL',
    tags: ['Engenharia Social', 'Clonagem Bancária', 'Módulo de Segurança']
  },
  {
    rnpCategoryPattern: 'pix|chave pix|comprovante|agendamento|transferencia',
    eguiCategory: 'PIX SCAMS',
    defaultRisk: 'CRITICAL',
    tags: ['Pix', 'Falso Comprovante', 'Engenharia Social Financeira']
  },
  {
    rnpCategoryPattern: 'pagamento|fatura|boleto|cobranca|protesto|serasa|spc',
    eguiCategory: 'BANKING FRAUD',
    defaultRisk: 'HIGH',
    tags: ['Boleto Falso', 'Cobrança Fraudulenta', 'Protesto Indevido']
  },
  {
    rnpCategoryPattern: 'recadastramento|atualizacao|token|dispositivo|senha|expirada',
    eguiCategory: 'ACCOUNT TAKEOVER',
    defaultRisk: 'HIGH',
    tags: ['Roubo de Credenciais', 'Falso Recadastramento', 'MFA Bypass']
  },
  {
    rnpCategoryPattern: 'malware|trojan|executavel|downloader|stealer|ransomware|keylogger',
    eguiCategory: 'MALWARE',
    defaultRisk: 'CRITICAL',
    tags: ['Malware', 'Trojan Bancário', 'Payload Malicioso']
  },
  {
    rnpCategoryPattern: 'whatsapp|telegram|mensageria|clonagem|codigo|6 digitos',
    eguiCategory: 'WHATSAPP FRAUD',
    defaultRisk: 'HIGH',
    tags: ['WhatsApp', 'Clonagem de Conta', 'SIM Swap']
  },
  {
    rnpCategoryPattern: 'fgts|inss|beneficio|governo|gov|auxilio|pis|pasep',
    eguiCategory: 'IDENTITY FRAUD',
    defaultRisk: 'HIGH',
    tags: ['Benefício Social', 'Golpe Gov.br', 'Roubo de Identidade']
  },
  {
    rnpCategoryPattern: 'emprego|vaga|trabalho|tarefas|home office|avaliador',
    eguiCategory: 'FAKE JOBS',
    defaultRisk: 'MEDIUM',
    tags: ['Falso Emprego', 'Golpe das Tarefas', 'Comissões Falsas']
  },
  {
    rnpCategoryPattern: 'investimento|cripto|bitcoin|rendimento|lucro diario',
    eguiCategory: 'FAKE INVESTMENTS',
    defaultRisk: 'CRITICAL',
    tags: ['Pirâmide Financeira', 'Falsa Criptomoeda', 'Falso Trade']
  }
];

export const RnpNormalizer = {
  /**
   * Normalizes raw RNP category and title into E GUI 404 ScamCategory
   */
  normalizeCategory: (sourceCategory: string = '', title: string = '', tags: string[] = []): ScamCategory => {
    const combined = `${sourceCategory} ${title} ${tags.join(' ')}`.toLowerCase();

    for (const rule of RNP_TAXONOMY_RULES) {
      const regex = new RegExp(rule.rnpCategoryPattern, 'i');
      if (regex.test(combined)) {
        // Special case fallback for category type safety
        if (rule.eguiCategory === 'DELIVERY_SCAM' as any) {
          return 'PHISHING';
        }
        return rule.eguiCategory;
      }
    }

    // Default category fallback
    return 'PHISHING';
  },

  /**
   * Evaluates defensive risk level
   */
  evaluateRiskLevel: (category: ScamCategory, title: string = '', rawExcerpt: string = ''): RiskLevel => {
    const combined = `${title} ${rawExcerpt}`.toLowerCase();
    if (combined.includes('trojan') || combined.includes('ransomware') || combined.includes('senha bancaria') || combined.includes('limpeza de conta')) {
      return 'CRITICAL';
    }
    if (category === 'BANKING FRAUD' || category === 'PIX SCAMS' || category === 'ACCOUNT TAKEOVER' || category === 'MALWARE') {
      return 'CRITICAL';
    }
    if (category === 'PHISHING' || category === 'IDENTITY FRAUD' || category === 'WHATSAPP FRAUD') {
      return 'HIGH';
    }
    return 'MEDIUM';
  },

  /**
   * Generates standardized E GUI 404 Tags
   */
  normalizeTags: (sourceCategory: string = '', originalTags: string[] = []): string[] => {
    const set = new Set<string>();
    set.add('RNP/CAIS Source');

    if (sourceCategory) {
      set.add(`RNP:${sourceCategory.toLowerCase().trim()}`);
    }

    originalTags.forEach((t) => {
      if (t && t.trim().length > 1) {
        set.add(t.trim());
      }
    });

    return Array.from(set).slice(0, 8);
  }
};
