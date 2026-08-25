import { ThreatItem } from '../types';

export const THREATS_DATA: ThreatItem[] = [
  {
    id: 'threat-001',
    threatCode: 'THREAT-2026-0881',
    slug: 'campanha-phishing-imposto-renda-restituicao',
    title: 'Campanha de Phishing Massivo: Falsa Restituição e Malha Fina',
    category: 'PHISHING',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    firstObserved: '2026-08-14',
    lastUpdated: '2026-08-25',
    summary: 'Disseminação em larga escala de e-mails fraudulentos simulando o sistema e-CAC da Receita Federal com anexos maliciosos disfarçados de comprovante fiscal.',
    severityScore: 92,
    targetVectors: ['E-mail', 'Domínios Falsos com Typosquatting', 'Engenharia Social Governamental'],
    safeIndicators: [
      {
        type: 'DOMAIN_PATTERN',
        value: '*.receita-ecac-regularizacao[.]online',
        note: 'Padrão de domínio malicioso registrado recentemente simulando portal governamental'
      },
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Urgência com prazo fatal de 24h para evitar cancelamento de CPF',
        note: 'Gatilho de intimidação e medo de sanções tributárias'
      },
      {
        type: 'SAFE_HASH_PATTERN',
        value: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (Exemplo didático)',
        note: 'Assinatura típica de dropper de trojan bancário'
      }
    ],
    mitigationSummary: 'Bloqueio de domínios não governamentais (.gov.br é o único domínio oficial), verificação direta no portal e-CAC oficial sem clicar em links recebidos por e-mail.',
    sources: [
      { title: 'Alerta da Receita Federal do Brasil sobre Falsas Mensagens de Restituição', sourceType: 'OFFICIAL_ALERT' },
      { title: 'Boletim de Resposta a Incidentes - CERT.br', sourceType: 'SECURITY_BULLETIN' }
    ]
  },
  {
    id: 'threat-002',
    threatCode: 'THREAT-2026-0840',
    slug: 'fraude-qr-code-pix-adulterado-quishing',
    title: 'Adulteração de QR Codes Físicos e Digitais (Quishing)',
    category: 'PIX SCAMS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    firstObserved: '2026-08-02',
    lastUpdated: '2026-08-24',
    summary: 'Substituição de adesivos de QR Codes Pix em estabelecimentos comerciais ou envio de faturas digitais em PDF com QR Codes direcionados para contas de laranjas.',
    severityScore: 84,
    targetVectors: ['QR Codes Físicos adulterados', 'Faturas PDF adulteradas', 'Totens de Estacionamento'],
    safeIndicators: [
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Divergência entre o nome da empresa e o recebedor do Pix na tela de confirmação',
        note: 'Nome do titular no app bancário difere da razão social do estabelecimento'
      },
      {
        type: 'SAFE_HASH_PATTERN',
        value: 'Padrão visual de sobreposição de adesivo plástico sobre QR Code original',
        note: 'Indício físico de adulteração no ponto de venda'
      }
    ],
    mitigationSummary: 'Sempre conferir o nome do beneficiário e o valor na tela de confirmação do aplicativo antes de digitar a senha de autorização do Pix.',
    sources: [
      { title: 'Recomendações do Banco Central sobre Cuidados com QR Code Pix', sourceType: 'OFFICIAL_ALERT' }
    ]
  },
  {
    id: 'threat-003',
    threatCode: 'THREAT-2026-0792',
    slug: 'deepfake-audio-clonagem-de-voz-familiar',
    title: 'Engenharia Social com Clonagem de Voz por Inteligência Artificial (Vishing de IA)',
    category: 'SOCIAL ENGINEERING',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    firstObserved: '2026-07-22',
    lastUpdated: '2026-08-23',
    summary: 'Uso de amostras de áudio coletadas de redes sociais para clonar vozes de filhos, netos ou executivos de empresas e realizar ligações de emergência exigindo resgates ou transferências financeiras.',
    severityScore: 95,
    targetVectors: ['Chamadas Telefônicas de Voz', 'Mensagens de Áudio no WhatsApp', 'Áudios Curtos Sintetizados'],
    safeIndicators: [
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Tom de extrema aflição com ruído de fundo simulando trânsito ou choro para ocultar artefatos de IA',
        note: 'Técnica deliberada para mascarar pequenas imperfeições de sintetizadores de voz'
      },
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Proibição de desligar a chamada ou contatar terceiros',
        note: 'Isolamento psicológico em tempo real'
      }
    ],
    mitigationSummary: 'Instituir palavra-chave de emergência em família. Se receber chamada de emergência, manter a calma, desligar e ligar de volta no número habitual do familiar.',
    sources: [
      { title: 'Relatório Global de Inteligência contra Crimes Cibernéticos com IA', sourceType: 'RESEARCH_REPORT' }
    ]
  },
  {
    id: 'threat-004',
    threatCode: 'THREAT-2026-0721',
    slug: 'aplicativos-falsos-de-limpeza-com-trojan-bancario',
    title: 'Trojan Bancário Oculto em Utilitários Falsos para Celular',
    category: 'MALWARE',
    riskLevel: 'HIGH',
    status: 'MONITORED',
    firstObserved: '2026-07-05',
    lastUpdated: '2026-08-20',
    summary: 'Aplicativos que se apresentam como limpadores de memória, lanternas ou leitores de PDF que solicitam permissões de Acessibilidade no Android para capturar toques de tela e transferir fundos bancários em segundo plano.',
    severityScore: 88,
    targetVectors: ['Lojas não oficiais de APK', 'Anúncios abusivos em navegadores móveis'],
    safeIndicators: [
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Solicitação abusiva de permissão do Serviço de Acessibilidade (Accessibility Services)',
        note: 'Utilizada para ler a tela de outros apps e clicar de forma automatizada'
      },
      {
        type: 'SAFE_HASH_PATTERN',
        value: 'Assinatura de Overlay Malicioso Android.Banker',
        note: 'Janela falsa sobreposta sobre a tela legítima do banco'
      }
    ],
    mitigationSummary: 'Nunca conceder permissão de Acessibilidade para aplicativos comuns de utilitários ou jogos. Instalar apps apenas por lojas oficiais e verificar o histórico do desenvolvedor.',
    sources: [
      { title: 'Análise Técnica de Malware Bancário Mobile', sourceType: 'RESEARCH_REPORT' }
    ]
  },
  {
    id: 'threat-005',
    threatCode: 'THREAT-2026-0618',
    slug: 'falsos-canais-de-atendimento-e-sac-no-x-reclameaqui',
    title: 'Perfis Falsos de Atendimento ao Cliente em Redes Sociais',
    category: 'ACCOUNT TAKEOVER',
    riskLevel: 'MEDIUM',
    status: 'MONITORED',
    firstObserved: '2026-06-18',
    lastUpdated: '2026-08-15',
    summary: 'Bots e contas falsas monitoram reclamações públicas de clientes contra companhias aéreas, bancos ou lojas no X (Twitter) e Instagram para enviar mensagens privadas solicitando números de telefone para golpe de autenticação.',
    severityScore: 68,
    targetVectors: ['Respostas em redes sociais', 'Mensagens Diretas (DMs) automáticas'],
    safeIndicators: [
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Conta recém-criada sem selo de verificação oficial entrando em contato minutos após reclamação',
        note: 'Solicitação imediata de WhatsApp ou envio de link de suposto "atendimento prioritário"'
      }
    ],
    mitigationSummary: 'Sempre conferir o selo de verificação da conta e o canal de contato oficial informado no site da própria empresa.',
    sources: [
      { title: 'Guia de Proteção ao Consumidor em Redes Sociais', sourceType: 'OFFICIAL_ALERT' }
    ]
  }
];
