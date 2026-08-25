import { ThreatItem } from '../types';

export const THREATS_DATA: ThreatItem[] = [
  {
    id: 'threat-001',
    threatCode: 'THREAT-2026-0881',
    slug: 'campanha-phishing-imposto-renda-restituicao',
    title: 'Campanha de Phishing Massivo: Falsa Restituição e Malha Fina Gov.br',
    category: 'PHISHING',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    firstObserved: '2026-01-14',
    detectedDate: '2026-01-14',
    analyzedDate: '2026-01-18',
    monitoredDate: '2026-08-20',
    lastUpdated: '2026-08-25',
    summary: 'Disseminação massiva de e-mails fraudulentos simulando o sistema e-CAC da Receita Federal com formulários que capturam credenciais de login Gov.br nível Ouro/Prata e senhas bancárias.',
    severityScore: 92,
    targetVectors: ['E-mail com SPF Spoofing', 'Domínios Falsos com Typosquatting (.site, .online)', 'Engenharia Social de Ameaça Fiscal'],
    timelineStatus: {
      firstObserved: '2026-01-14',
      detected: '2026-01-14',
      analyzed: '2026-01-18',
      monitored: '2026-08-20'
    },
    safeIndicators: [
      {
        type: 'DOMAIN_PATTERN',
        value: '*.receita-ecac-regularizacao[.]online',
        note: 'Padrão de domínio malicioso registrado simulando portal governamental legítimo'
      },
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Urgência extrema com prazo fatal de 24h para evitar cancelamento de CPF',
        note: 'Gatilho de intimidação e medo de sanções tributárias inexistentes'
      },
      {
        type: 'SAFE_HASH_PATTERN',
        value: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (Hash didático)',
        note: 'Padrão de assinatura de script de coleta de credenciais em formulários web'
      }
    ],
    mitigationSummary: 'Bloqueio de domínios sem terminação .gov.br, uso exclusivo do portal e-CAC oficial (gov.br/receitafederal), e ativação de autenticação em duas etapas no aplicativo Meu Gov.br.',
    sources: [
      {
        organization: 'Receita Federal do Brasil',
        title: 'Alerta Oficial: Tentativas de Fraude com o Nome da Receita Federal via E-mail',
        url: 'https://www.gov.br/receitafederal',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'CERT.br / NIC.br',
        title: 'Boletim de Resposta a Incidentes de Phishing Governamental',
        url: 'https://cert.br/stats/',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      }
    ]
  },
  {
    id: 'threat-002',
    threatCode: 'THREAT-2026-0840',
    slug: 'fraude-qr-code-pix-adulterado-quishing',
    title: 'Adulteração de QR Codes Físicos e Digitais (Quishing em Parquímetros)',
    category: 'QR CODE SCAMS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    firstObserved: '2026-02-02',
    detectedDate: '2026-02-02',
    analyzedDate: '2026-02-06',
    monitoredDate: '2026-08-22',
    lastUpdated: '2026-08-25',
    summary: 'Substituição de adesivos de QR Codes Pix em estabelecimentos comerciais e totens públicos por códigos que redirecionam para gateways falsos de cobrança.',
    severityScore: 84,
    targetVectors: ['QR Codes Físicos sobrepostos com adesivos', 'Faturas PDF adulteradas', 'Totens de Autoatendimento'],
    timelineStatus: {
      firstObserved: '2026-02-02',
      detected: '2026-02-02',
      analyzed: '2026-02-06',
      monitored: '2026-08-22'
    },
    safeIndicators: [
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Divergência entre o nome da empresa prestadora e o titular recebedor no app bancário',
        note: 'Nome do titular recebedor no Pix pertence a pessoa física estranha ao estabelecimento'
      },
      {
        type: 'DOMAIN_PATTERN',
        value: 'https://pagamento-estapar-rapido[.]top',
        note: 'Padrão de encurtadores e domínios TLD baratos usados em campanhas de Qshing'
      }
    ],
    mitigationSummary: 'Inspeção tátil de adesivos sobrepostos, checagem prévia da URL de destino antes de abrir e verificação obrigatória do nome da empresa no resumo do Pix antes de digitar a senha.',
    sources: [
      {
        organization: 'Federal Trade Commission (FTC)',
        title: 'Consumer Alert: Scammers using QR Codes to Steal Payment Data',
        url: 'https://consumer.ftc.gov',
        type: 'OFFICIAL',
        isOfficial: true
      },
      {
        organization: 'FEBRABAN',
        title: 'Guia de Segurança para Pagamentos com QR Code e Pix',
        url: 'https://febraban.org.br',
        type: 'OFFICIAL',
        isOfficial: true
      }
    ]
  },
  {
    id: 'threat-003',
    threatCode: 'THREAT-2026-0792',
    slug: 'trojan-bancario-mobile-brasdex-overlay-accessibility',
    title: 'Trojan Bancário Android com Abuso de Acessibilidade (Brasdex / SharkBot)',
    category: 'MALWARE',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    firstObserved: '2026-01-10',
    detectedDate: '2026-01-10',
    analyzedDate: '2026-01-15',
    monitoredDate: '2026-08-24',
    lastUpdated: '2026-08-25',
    summary: 'Malware bancário para dispositivos Android que sequestra o serviço de acessibilidade do sistema para ler senhas e realizar transferências Pix automatizadas de fundo sem intervenção da vítima.',
    severityScore: 96,
    targetVectors: ['Downloads de APKs fora da Google Play Store', 'Páginas falsas de atualização de sistema', 'SMS Malicioso com links encurtados'],
    timelineStatus: {
      firstObserved: '2026-01-10',
      detected: '2026-01-10',
      analyzed: '2026-01-15',
      monitored: '2026-08-24'
    },
    safeIndicators: [
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Solicitação de ativação do Serviço de Acessibilidade por utilitários simples',
        note: 'Indicador primário de tentativa de abuso de permissões para overlay e injeção de toques'
      },
      {
        type: 'DOMAIN_PATTERN',
        value: 'http://atualizacao-modulo-seguranca[.]apk',
        note: 'Distribuição direta de arquivos APK disfarçados de módulos de segurança bancários'
      }
    ],
    mitigationSummary: 'Desativação de instalação de fontes desconhecidas no Android, manutenção do Google Play Protect ativo e nunca autorizar permissões de acessibilidade para aplicativos de origem não verificada.',
    sources: [
      {
        organization: 'ThreatFabric / CSIRT',
        title: 'Technical Investigation of Automated Transfer System (ATS) Android Trojans',
        url: 'https://www.threatfabric.com',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      },
      {
        organization: 'CERT.br',
        title: 'Estatísticas de Códigos Maliciosos para Dispositivos Móveis no Brasil',
        url: 'https://cert.br',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      }
    ]
  },
  {
    id: 'threat-004',
    threatCode: 'THREAT-2026-0715',
    slug: 'spoofing-central-telefonica-vishing-ura-0800',
    title: 'Caller ID Spoofing & Falsas Centrais Bancárias Telefônicas URA',
    category: 'VISHING',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    firstObserved: '2026-01-05',
    detectedDate: '2026-01-05',
    analyzedDate: '2026-01-10',
    monitoredDate: '2026-08-24',
    lastUpdated: '2026-08-25',
    summary: 'Utilização de servidores SIP piratas para mascarar o número do identificador de chamadas da vítima simulando o número real do banco e orientando transferências para contas seguras falsas.',
    severityScore: 90,
    targetVectors: ['Rede de Telefonia VoIP com Caller ID Spoofing', 'Disparo de SMS com número 0800 fictício', 'Engenharia Social de Pânico Bancário'],
    timelineStatus: {
      firstObserved: '2026-01-05',
      detected: '2026-01-05',
      analyzed: '2026-01-10',
      monitored: '2026-08-24'
    },
    safeIndicators: [
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Orientação para realizar transferência Pix a fim de "proteger" ou "estornar" saldo bancário',
        note: 'Bancos nunca solicitam transações como método de segurança ou cancelamento de fraudes'
      },
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Solicitação de instalação do software AnyDesk ou TeamViewer no celular durante ligação',
        note: 'Nenhum banco exige download de aplicativo de acesso remoto para suporte ao cliente'
      }
    ],
    mitigationSummary: 'Desligar imediatamente qualquer ligação suspeita, nunca ligar para o 0800 recebido por SMS e entrar em contato exclusivamente pelos canais impressos no verso do cartão físico.',
    sources: [
      {
        organization: 'FEBRABAN',
        title: 'Alerta Nacional: Engenharia Social Telefônica e Falso 0800',
        url: 'https://antifraudes.febraban.org.br',
        type: 'OFFICIAL',
        isOfficial: true
      },
      {
        organization: 'Anatel',
        title: 'Regulamentação contra Fraudes de Spoofing e Autenticação de Chamadas (Stir/Shaken)',
        url: 'https://gov.br/anatel',
        type: 'GOVERNMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'threat-005',
    threatCode: 'THREAT-2026-0650',
    slug: 'ransomware-dupla-extorsao-pme-fatura-anexa',
    title: 'Ransomware de Dupla Extorsão em PMEs via Faturas Compactadas Maliciosas',
    category: 'RANSOMWARE',
    riskLevel: 'CRITICAL',
    status: 'MONITORED',
    firstObserved: '2026-01-20',
    detectedDate: '2026-01-20',
    analyzedDate: '2026-01-25',
    monitoredDate: '2026-08-22',
    lastUpdated: '2026-08-24',
    summary: 'Grupos de cibercrime utilizam e-mails de cobrança falsa com anexos .ZIP/.ISO para infectar redes corporativas, exfiltrar bases de dados de clientes e exigir resgate sob chantagem LGPD.',
    severityScore: 94,
    targetVectors: ['E-mails de phishing de cobrança corporativa', 'Portas RDP 3389 expostas na internet sem MFA', 'Execução de scripts VBS/PowerShell'],
    timelineStatus: {
      firstObserved: '2026-01-20',
      detected: '2026-01-20',
      analyzed: '2026-01-25',
      monitored: '2026-08-22'
    },
    safeIndicators: [
      {
        type: 'DOMAIN_PATTERN',
        value: '*.faturas-cobranca-judicial[.]zip',
        note: 'Anexos compactados que ocultam arquivos com extensão dupla (ex: Fatura.pdf.exe)'
      },
      {
        type: 'BEHAVIORAL_TRIGGER',
        value: 'Ameaça de divulgação pública de dados confidenciais de clientes caso o resgate em cripto não seja pago',
        note: 'Tática clássica de dupla extorsão para forçar conformidade da vítima'
      }
    ],
    mitigationSummary: 'Implementação de backups 3-2-1 offline, bloqueio de anexos comprimidos com executáveis no firewall de e-mail e exigência de MFA para qualquer acesso remoto de colaboradores.',
    sources: [
      {
        organization: 'CISA / FBI',
        title: '#StopRansomware Executive Guide and Defense Strategy',
        url: 'https://cisa.gov/stopransomware',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'Europol / No More Ransom',
        title: 'Decryption Tools and Victim Support Against Ransomware Threats',
        url: 'https://nomoreransom.org',
        type: 'LAW_ENFORCEMENT',
        isOfficial: true
      }
    ]
  }
];
