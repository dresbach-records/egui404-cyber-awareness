/**
 * E GUI 404 - RNP/CAIS Data Parser & Content Sanitizer
 * 
 * Implements strict defensive scrubbing:
 * 1. Defangs suspicious URLs and IP addresses.
 * 2. Strips malicious payload patterns, executables, or exploit snippets.
 * 3. Anonymizes any accidental PII (CPF, credit card numbers, personal emails).
 * 4. Extracts educational warning signs rather than full phishing letter reproductions.
 */

export const RnpParser = {
  /**
   * Defang URLs and domains (e.g. http://malicious.com -> hxxp://malicious[.]com)
   */
  defangUrl: (url: string): string => {
    if (!url) return '';
    return url
      .replace(/^https?:\/\//i, (match) => (match.toLowerCase().startsWith('https') ? 'hxxps://' : 'hxxp://'))
      .replace(/\./g, '[.]');
  },

  /**
   * Refangs safely for display only when authorized as clean official domain
   */
  isOfficialDomain: (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.endsWith('rnp.br') || parsed.hostname.endsWith('gov.br') || parsed.hostname.endsWith('cert.br');
    } catch {
      return false;
    }
  },

  /**
   * Sanitize text snippets, stripping dangerous payload artifacts or sensitive info
   */
  sanitizeExcerpt: (rawText: string, maxLength: number = 320): string => {
    if (!rawText) return '';

    let cleaned = rawText
      // Mask possible CPF patterns: 000.000.000-00 or 11 digits
      .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[CPF_MASCARADO]')
      // Mask credit cards
      .replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[CARTAO_MASCARADO]')
      // Mask personal emails except official domains
      .replace(/\b[A-Za-z0-9._%+-]+@(?!rnp\.br|gov\.br|cais\.rnp\.br)[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_OCULTO]')
      // Defang links inside text
      .replace(/https?:\/\/[^\s]+/g, (match) => {
        if (RnpParser.isOfficialDomain(match)) return match;
        return RnpParser.defangUrl(match);
      })
      // Strip executable extensions
      .replace(/\.(exe|scr|vbs|bat|cmd|ps1|apk|jar|msi)\b/gi, '.[BLOCKED_EXT]');

    if (cleaned.length > maxLength) {
      cleaned = cleaned.slice(0, maxLength).trim() + '...';
    }

    return cleaned;
  },

  /**
   * Extract educational red flags from raw descriptions or titles
   */
  extractEducationalWarningSigns: (title: string, tags: string[], excerpt?: string): string[] => {
    const signs: string[] = [];
    const lower = `${title} ${tags.join(' ')} ${excerpt || ''}`.toLowerCase();

    if (lower.includes('receita') || lower.includes('irpf') || lower.includes('malha') || lower.includes('restituicao')) {
      signs.push('Comunicação apócrifa alegando pendências no CPF ou divergências fiscais na Receita Federal.');
      signs.push('Links falsos direcionando para formulários de regularização que exigem taxas via Pix.');
    }
    if (lower.includes('correios') || lower.includes('rastreio') || lower.includes('encomenda') || lower.includes('taxa')) {
      signs.push('SMS ou e-mail urgente alegando encomenda retida com prazo curto para pagamento de taxa alfandegária.');
      signs.push('Uso de domínios com subdomínios fraudulentos simulando o portal oficial dos Correios.');
    }
    if (lower.includes('banco') || lower.includes('bradesco') || lower.includes('itau') || lower.includes('caixa') || lower.includes('bb') || lower.includes('santander') || lower.includes('nubank')) {
      signs.push('Notificação alarmista sobre bloqueio imediato de conta, dispositivo ou cartão de segurança.');
      signs.push('Solicitação indevida de dados de segurança, senhas alfanuméricas ou token por página clonada.');
    }
    if (lower.includes('recadastramento') || lower.includes('atualizacao') || lower.includes('mfa') || lower.includes('token')) {
      signs.push('Exigência urgente de "recadastramento biométrico" ou "atualização de módulo de segurança".');
    }
    if (lower.includes('pix') || lower.includes('pagamento') || lower.includes('comprovante')) {
      signs.push('Falsos comprovantes de transferência ou páginas de checkout clonadas.');
    }
    if (lower.includes('fgts') || lower.includes('inss') || lower.includes('beneficio') || lower.includes('pis')) {
      signs.push('Promessa de saque extraordinário de benefício social com link para confirmação de dados pessoais.');
    }

    // Generic fallback if specific triggers not met
    if (signs.length === 0) {
      signs.push('Mensagem não solicitada contendo link externo ou solicitação de dados sensíveis.');
      signs.push('Urgência forçada induzindo a vítima a agir sem conferir os canais oficiais.');
    }

    return Array.from(new Set(signs));
  }
};
