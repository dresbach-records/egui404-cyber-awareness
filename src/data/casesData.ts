import { CaseFile } from '../types';

export const CASES_DATA: CaseFile[] = [
  {
    id: 'case-0042',
    caseNumber: 'CASE #0042',
    title: 'Operação Falso Algoritmo: Esquema de Pirâmide com Robô de Investimento Fictício',
    date: '2026-02-15',
    country: 'Brasil / Internacional',
    category: 'FAKE INVESTMENTS',
    impactLevel: 'EXTREME',
    status: 'ANALYZED',
    summary: 'Análise detalhada de um esquema de pirâmide financeira com plataforma falsa que simulava operações automatizadas de criptoativos com rentabilidade prometida de 4% ao dia, lesando centenas de investidores.',
    timeline: [
      {
        timestamp: 'Mês 01',
        event: 'Atração Inicial',
        details: 'Anúncios ultra-segmentados nas redes sociais ofereciam "acesso exclusivo antecipado a um algoritmo de trading institucional".'
      },
      {
        timestamp: 'Mês 02',
        event: 'Primeiro Teste & Falso Saque',
        details: 'Usuários depositaram R$ 100 e puderam sacar R$ 120 após 48 horas. A taxa de conversão para novos depósitos atingiu 84%.'
      },
      {
        timestamp: 'Mês 03',
        event: 'Injeção de Capital Pesado',
        details: 'Criação de ranking de "Investidores Diamante" com incentivo de bônus por indicação de amigos e familiares.'
      },
      {
        timestamp: 'Mês 04',
        event: 'Bloqueio Sistemático de Saques',
        details: 'A plataforma alegou "auditoria do órgão regulador internacional" e exigiu 20% do saldo total em taxa de liberação fiscal.'
      },
      {
        timestamp: 'Mês 05',
        event: 'Colapso e Evasão',
        details: 'Servidores desligados e exclusão dos canais de suporte no Telegram. Ativos convertidos rapidamente em criptomoedas anônimas.'
      }
    ],
    attackAnatomy: {
      initialContact: 'Tráfego pago patrocinado com vídeos manipulados e depoimentos forjados de falsos investidores de sucesso.',
      manipulationTechnique: 'Reforço positivo imediato (saque pequeno liberado) somado ao medo de ficar de fora (FOMO - Fear of Missing Out).',
      exploitationStep: 'Dashboard customizado com números arbitrários sem qualquer integração real com bolsas ou corretoras autorizadas.',
      damageVector: 'Drenagem de economias de poupança e empréstimos pessoais tomados pelas vítimas acreditando em retorno certo.'
    },
    defensesLearned: [
      'Nenhuma instituição autorizada pela CVM promete rentabilidade fixa diária garantida em renda variável.',
      'A liberação de saques pequenos iniciais é a tática clássica de "isca" para encorajar depósitos de valor elevado.',
      'A exigência de novo depósito para sacar o próprio dinheiro é prova definitiva de fraude.'
    ],
    sources: [
      {
        organization: 'Comissão de Valores Mobiliários (CVM)',
        title: 'Alerta sobre Esquemas de Investimentos Não Autorizados em Moedas Digitais',
        url: 'https://gov.br/cvm',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'Polícia Federal',
        title: 'Operações de Repressão a Pirâmides Financeiras e Crimes contra o Sistema Financeiro Nacional',
        url: 'https://gov.br/pf',
        type: 'LAW_ENFORCEMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'case-0038',
    caseNumber: 'CASE #0038',
    title: 'Engenharia Social Corporativa via BEC (Business Email Compromise) com Spoofing de Diretoria',
    date: '2026-01-20',
    country: 'Brasil',
    category: 'SOCIAL ENGINEERING',
    impactLevel: 'HIGH',
    status: 'ANALYZED',
    summary: 'Ataque de Business Email Compromise (BEC) que resultou no desvio de pagamento de fornecedor em uma média empresa de logística por meio de domínio clonado e e-mail falso do diretor financeiro.',
    timeline: [
      {
        timestamp: 'Semana 1',
        event: 'Reconhecimento e Pesquisa',
        details: 'Atacantes mapearam no LinkedIn a estrutura societária da empresa, o nome do CFO e a rotina da equipe contábil.'
      },
      {
        timestamp: 'Semana 2',
        event: 'Registro de Domínio Espelho',
        details: 'Registro de domínio idêntico com variação de apenas uma letra (ex: empresa-logistica.com vs empresa-Iogistica.com).'
      },
      {
        timestamp: 'Semana 3',
        event: 'Envio de Instrução de Pagamento Urgente',
        details: 'E-mail enviado à analista financeira solicitando a liquidação prioritária de fatura de fornecedor em nova conta bancária.'
      },
      {
        timestamp: 'Semana 3 (+2h)',
        event: 'Transferência e Descoberta',
        details: 'O pagamento foi efetuado. A fraude só foi notada 10 dias depois, quando o fornecedor real cobrou a fatura original em atraso.'
      }
    ],
    attackAnatomy: {
      initialContact: 'E-mail forjado utilizando domínio homógrafo e tom de voz idêntico ao do executivo sênior.',
      manipulationTechnique: 'Hierarquia corporativa somada a pretexto de "acordo confidencial estratégico" que impedia perguntas na equipe.',
      exploitationStep: 'Substituição dos dados bancários legítimos por conta de passagem em banco digital em nome de terceiro.',
      damageVector: 'Prejuízo financeiro direto e perda de relacionamento comercial com fornecedor crítico.'
    },
    defensesLearned: [
      'Estabelecer protocolo obrigatório de dupla aprovação telefônica via canal conhecido para qualquer alteração de dados bancários.',
      'Implementar autenticação rigorosa de e-mail (SPF, DKIM e DMARC com política de rejeição "p=reject").',
      'Treinar equipes financeiras para desconfiar de pedidos de pagamento com pretexto de urgência ou sigilo fora do processo padrão.'
    ],
    sources: [
      {
        organization: 'FBI / Internet Crime Complaint Center (IC3)',
        title: 'Business Email Compromise (BEC) Annual Threat Report',
        url: 'https://ic3.gov',
        type: 'LAW_ENFORCEMENT',
        isOfficial: true
      },
      {
        organization: 'CERT.br',
        title: 'Recomendações para Prevenção de Fraudes de Substituição de Contas e BEC',
        url: 'https://cartilha.cert.br',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      }
    ]
  },
  {
    id: 'case-0029',
    caseNumber: 'CASE #0029',
    title: 'Sequestro de WhatsApp em Massa por Engenharia Social de Falso Anúncio de Venda',
    date: '2026-01-08',
    country: 'Brasil',
    category: 'ACCOUNT TAKEOVER',
    impactLevel: 'MODERATE',
    status: 'ANALYZED',
    summary: 'Quadrilha utilizava falsas verificações de segurança em portais de anúncios classificados para induzir vendedores a fornecer o código SMS de ativação de 6 dígitos do WhatsApp, clonando a conta em segundos.',
    timeline: [
      {
        timestamp: 'Etapa 1',
        event: 'Publicação do Anúncio',
        details: 'A vítima anuncia um produto (sofá/veículo) em um portal de compras e vendas.'
      },
      {
        timestamp: 'Etapa 2',
        event: 'Contato do Falso Suporte',
        details: 'Criminoso liga afirmando ser do "setor de segurança do portal" e diz que precisa validar o anúncio para evitar fraudes.'
      },
      {
        timestamp: 'Etapa 3',
        event: 'Captura do Código SMS',
        details: 'O golpista dispara o pedido de ativação do WhatsApp do número da vítima e pede que ela leia o código de 6 dígitos recebido.'
      },
      {
        timestamp: 'Etapa 4',
        event: 'Extorsão da Rede de Contatos',
        details: 'Conta ativada no aparelho do fraudador, que envia mensagens para toda a agenda pedindo empréstimos Pix urgentes.'
      }
    ],
    attackAnatomy: {
      initialContact: 'Chamada telefônica fingindo ser suporte técnico oficial de marketplace conhecido.',
      manipulationTechnique: 'Ameaça de suspensão do anúncio caso o código de verificação não fosse confirmado imediatamente.',
      exploitationStep: 'Uso do código de 6 dígitos oficial do WhatsApp para transferir a sessão para o celular do criminoso.',
      damageVector: 'Prejuízo financeiro a amigos e familiares da vítima e quebra de privacidade de conversas íntimas.'
    },
    defensesLearned: [
      'NUNCA compartilhe códigos numéricos recebidos por SMS com ninguém, em hipótese alguma.',
      'Ative obrigatoriamente a "Confirmação em Duas Etapas" com PIN secreto e e-mail no aplicativo do WhatsApp.',
      'Plataformas de anúncios nunca ligam solicitando códigos SMS para validar publicações.'
    ],
    sources: [
      {
        organization: 'CERT.br / NIC.br',
        title: 'Fascículo: Como Proteger suas Contas em Mensageiros Instantâneos',
        url: 'https://cartilha.cert.br',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      },
      {
        organization: 'Polícia Civil / DIRD',
        title: 'Alerta sobre Golpes de Clonagem e Sequestro de Sessão do WhatsApp',
        url: 'https://policiacivil.sp.gov.br',
        type: 'LAW_ENFORCEMENT',
        isOfficial: true
      }
    ]
  }
];
