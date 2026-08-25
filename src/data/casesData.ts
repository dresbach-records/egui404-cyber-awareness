import { CaseFile } from '../types';

export const CASES_DATA: CaseFile[] = [
  {
    id: 'case-0042',
    caseNumber: 'CASE #0042',
    title: 'Operação Falso Fundo: Desmantelamento de Esquema de Pirâmide com Robô de Investimento Fictício',
    date: '2026-07-28',
    country: 'Brasil / Internacional',
    category: 'FAKE INVESTMENTS',
    impactLevel: 'EXTREME',
    status: 'ANALYZED',
    summary: 'Análise detalhada de um esquema de pirâmide financeira que vitimou mais de 1.400 investidores por meio de uma plataforma falsa que simulava operações automatizadas de inteligência artificial com suposto rendimento garantido de 4% ao dia.',
    timeline: [
      {
        timestamp: 'Dia 01',
        event: 'Atração Inicial',
        details: 'Anúncios ultra-segmentados nas redes sociais ofereciam "acesso exclusivo antecipado a um algoritmo de trading institucional".'
      },
      {
        timestamp: 'Dia 07',
        event: 'Primeiro Teste & Falso Saque',
        details: 'Usuários depositaram R$ 100 e puderam sacar R$ 120 após 48 horas. A taxa de conversão para novos depósitos atingiu 84%.'
      },
      {
        timestamp: 'Dia 30',
        event: 'Injeção de Capital Pesado',
        details: 'Criação de ranking de "Investidores Diamante" com incentivo de bônus por indicação de amigos e familiares.'
      },
      {
        timestamp: 'Dia 45',
        event: 'Bloqueio Sistemático de Saques',
        details: 'A plataforma alegou "auditoria do órgão regulador internacional" e exigiu 20% do saldo total em taxa de liberação fiscal.'
      },
      {
        timestamp: 'Dia 52',
        event: 'Colapso e Evasão',
        details: 'Servidores desligados e exclusão dos canais de suporte no Telegram. Ativos convertidos rapidamente em criptomoedas anônimas.'
      }
    ],
    attackAnatomy: {
      initialContact: 'Tráfego pago patrocinado com deepfakes de celebridades do setor financeiro endossando o algoritmo.',
      manipulationTechnique: 'Reforço positivo imediato (saque pequeno liberado) somado ao medo de ficar de fora (FOMO - Fear of Missing Out).',
      exploitationStep: 'Dashboard customizado com números arbitrários sem qualquer integração real com bolsas ou corretoras autorizadas.',
      damageVector: 'Drenagem de economias de poupança e empréstimos pessoais tomados pelas vítimas acreditando em retorno certo.'
    },
    defensesLearned: [
      'Nenhuma instituição séria promete rentabilidade fixa diária garantida.',
      'A liberação de saques pequenos é a tática padrão de "isca" para encorajar depósitos de valor elevado.',
      'A exigência de novo depósito para sacar o próprio dinheiro é prova definitiva de fraude.'
    ],
    sources: [
      { title: 'Inquérito da Delegacia de Defraudações e Crimes Fazendários', sourceType: 'OFFICIAL_ALERT' },
      { title: 'Boletim da Comissão de Valores Mobiliários (CVM)', sourceType: 'SECURITY_BULLETIN' }
    ]
  },
  {
    id: 'case-0038',
    caseNumber: 'CASE #0038',
    title: 'Engenharia Social Corporativa via BEC (Business Email Compromise) com Spoofing de Diretoria',
    date: '2026-06-15',
    country: 'América Latina',
    category: 'SOCIAL ENGINEERING',
    impactLevel: 'HIGH',
    status: 'ANALYZED',
    summary: 'Ataque direcionado contra setor financeiro de média empresa onde criminosos utilizaram domínio similar (typosquatting) e dados coletados no LinkedIn para induzir transferência urgente a pretexto de aquisição confidencial.',
    timeline: [
      {
        timestamp: 'Semana 01',
        event: 'Reconhecimento Passivo',
        details: 'Mapeamento de organograma da diretoria e analistas de contas a pagar por meio de postagens públicas no LinkedIn.'
      },
      {
        timestamp: 'Semana 03',
        event: 'Registro de Domínio Espelho',
        details: 'Registro do domínio `empresa-corporativo[.]com` (com apenas uma letra duplicada).'
      },
      {
        timestamp: 'Dia D',
        event: 'Envio de E-mail de Urgência',
        details: 'E-mail enviado na sexta-feira às 16h45 simulando o CEO em viagem internacional solicitando TED urgente para fechamento de contrato.'
      },
      {
        timestamp: 'Pós-Ataque',
        event: 'Detecção na Segunda-feira',
        details: 'A fraude só foi notada no início da semana seguinte na conciliação bancária matinal.'
      }
    ],
    attackAnatomy: {
      initialContact: 'E-mail forjado com remetente aparentando ser a presidência da organização.',
      manipulationTechnique: 'Princípio da autoridade hierárquica e restrição temporal (urgência de fechamento no final do expediente).',
      exploitationStep: 'Quebra de processo de dupla aprovação devido ao clima de sigilo e pressão executiva.',
      damageVector: 'Transferência financeira direta para conta intermediária pulverizada em múltiplos saques.'
    },
    defensesLearned: [
      'Todo pedido financeiro excepcional ou de valor elevado deve passar por confirmação telefônica ou presencial por canal pré-estabelecido.',
      'Implementação rigorosa de políticas de e-mail (SPF, DKIM, DMARC com p=reject).',
      'Cultura corporativa de segurança onde colaboradores são encorajados a checar ordens de superiores sem medo de represália.'
    ],
    sources: [
      { title: 'Relatório Anual de Ameaças Corporativas e Fraudes BEC', sourceType: 'RESEARCH_REPORT' }
    ]
  },
  {
    id: 'case-0027',
    caseNumber: 'CASE #0027',
    title: 'Ataque de Phishing SMS (Smishing) Explorando Suposto Bloqueio de Cartão por Fraude',
    date: '2026-05-10',
    country: 'Brasil',
    category: 'PHISHING',
    impactLevel: 'MODERATE',
    status: 'ARCHIVED',
    summary: 'Disparo de 250.000 mensagens de SMS contendo link para página falsa idêntica ao internet banking de grande instituição financeira com captura em tempo real de senha de 6 e 8 dígitos e token.',
    timeline: [
      {
        timestamp: '18:00',
        event: 'Disparo Massivo via Rota Pirata',
        details: 'Mensagens enviadas com texto: "Seu cartão final 4012 foi bloqueado preventivamente por suspeita de fraude. Desbloqueie agora: [link]"'
      },
      {
        timestamp: '18:15',
        event: 'Captura em Tempo Real (Man-in-the-Middle)',
        details: 'A página espelho solicitava agência, conta, senha eletrônica e em seguida pedia o código do aplicativo token.'
      },
      {
        timestamp: '19:00',
        event: 'Takedown do Servidor',
        details: 'Notificação do time de resposta a incidentes (CSIRT) para o provedor de hospedagem derrubando o domínio malicioso em menos de 3 horas.'
      }
    ],
    attackAnatomy: {
      initialContact: 'SMS com tom emergencial de segurança bancária.',
      manipulationTechnique: 'Exploração do medo de ter a conta bloqueada ou de sofrer um prejuízo não autorizado.',
      exploitationStep: 'Servidor intermediário conectado via API reversa para consumir o token da vítima em segundos.',
      damageVector: 'Tentativas automatizadas de emissão de boletos e Pix antes do encerramento da sessão.'
    },
    defensesLearned: [
      'Bancos nunca enviam links diretos para desbloqueio ou digitação de senhas em SMS.',
      'O uso de autenticação resistente a phishing (Passkeys / FIDO2) impede o repasse de credenciais para páginas falsas.',
      'Sempre checar a URL na barra de endereços do navegador antes de digitar dados sensíveis.'
    ],
    sources: [
      { title: 'Relatório Técnico de Resposta a Incidentes Bancários', sourceType: 'SECURITY_BULLETIN' }
    ]
  }
];
