import {
  ForumCategory,
  ForumMember,
  ForumBadge,
  ForumThread,
  ForumPost,
  ForumTag,
  ForumNotification,
  ForumReport
} from '../types';

export const FORUM_BADGES: ForumBadge[] = [
  {
    id: 'badge-admin',
    code: 'ADMIN_SENTINEL',
    name: 'E GUI 404 Sentinel',
    description: 'Administrador oficial e pesquisador do núcleo de inteligência E GUI 404.',
    icon: 'ShieldCheck',
    color: '#E00000'
  },
  {
    id: 'badge-mod',
    code: 'CYBER_MODERATOR',
    name: 'Guardião da Comunidade',
    description: 'Moderador voluntário focado em qualidade, respeito e segurança de conteúdo.',
    icon: 'ShieldAlert',
    color: '#FF6B00'
  },
  {
    id: 'badge-verified',
    code: 'VERIFIED_RESEARCHER',
    name: 'Pesquisador Verificado',
    description: 'Profissional de cibersegurança ou direito digital com identidade técnica verificada.',
    icon: 'Award',
    color: '#00F0FF'
  },
  {
    id: 'badge-hunter',
    code: 'THREAT_HUNTER',
    name: 'Caçador de Ameaças',
    description: 'Membro com mais de 10 relatos documentados com evidências de alta qualidade.',
    icon: 'Zap',
    color: '#39FF14'
  },
  {
    id: 'badge-solver',
    code: 'SOLUTION_HERO',
    name: 'Solucionador Técnico',
    description: 'Membro que forneceu soluções comprovadas em dúvidas de segurança.',
    icon: 'CheckCircle2',
    color: '#A855F7'
  }
];

export const FORUM_MEMBERS: ForumMember[] = [
  {
    id: 'user-001',
    username: 'egui_core',
    displayName: 'E GUI 404 Ops',
    role: 'ADMIN',
    avatarUrl: '',
    bio: 'Núcleo editorial e de resposta a incidentes da plataforma E GUI 404. Expose. Educate. Protect.',
    joinedDate: '2025-11-01',
    reputation: 2450,
    threadsCount: 42,
    repliesCount: 310,
    solutionsCount: 88,
    badges: ['ADMIN_SENTINEL', 'VERIFIED_RESEARCHER'],
    isOnline: true,
    verifiedSource: true
  },
  {
    id: 'user-002',
    username: 'rafael_sec',
    displayName: 'Rafael Bittencourt',
    role: 'MODERATOR',
    avatarUrl: '',
    bio: 'Analista de Blue Team & DFIR. Apaixonado por desmistificar engenharia social e golpes bancários.',
    joinedDate: '2025-12-10',
    reputation: 1280,
    threadsCount: 15,
    repliesCount: 164,
    solutionsCount: 32,
    badges: ['CYBER_MODERATOR', 'VERIFIED_RESEARCHER', 'SOLUTION_HERO'],
    isOnline: true,
    verifiedSource: true
  },
  {
    id: 'user-003',
    username: 'camila_privacy',
    displayName: 'Dra. Camila Nogueira',
    role: 'VERIFIED_CONTRIBUTOR',
    avatarUrl: '',
    bio: 'Advogada especialista em Direito Digital, LGPD e Defesa do Consumidor em Fraudes Bancárias.',
    joinedDate: '2026-01-05',
    reputation: 940,
    threadsCount: 8,
    repliesCount: 92,
    solutionsCount: 26,
    badges: ['VERIFIED_RESEARCHER', 'SOLUTION_HERO'],
    isOnline: false,
    verifiedSource: true
  },
  {
    id: 'user-004',
    username: 'thiago_hunter',
    displayName: 'Thiago M.',
    role: 'MEMBER',
    avatarUrl: '',
    bio: 'Entusiasta de segurança da informação e desmascarador de falsos investimentos.',
    joinedDate: '2026-01-18',
    reputation: 520,
    threadsCount: 11,
    repliesCount: 47,
    solutionsCount: 9,
    badges: ['THREAT_HUNTER'],
    isOnline: true,
    verifiedSource: false
  },
  {
    id: 'user-005',
    username: 'mariana_user',
    displayName: 'Mariana Silva',
    role: 'MEMBER',
    avatarUrl: '',
    bio: 'Usuária consciente em busca de proteção digital no dia a dia.',
    joinedDate: '2026-02-01',
    reputation: 110,
    threadsCount: 3,
    repliesCount: 12,
    solutionsCount: 0,
    badges: [],
    isOnline: false,
    verifiedSource: false
  }
];

export const FORUM_CATEGORIES: ForumCategory[] = [
  {
    id: 'cat-01',
    slug: 'scams-report',
    title: 'Relatos de Golpes & Denúncias',
    icon: 'AlertTriangle',
    description: 'Compartilhe abordagens suspeitas recentes, mensagens forjadas e tentativas de fraude.',
    color: '#E00000',
    threadCount: 128,
    postCount: 642,
    moderators: ['egui_core', 'rafael_sec'],
    lastActivity: 'Há 12 minutos'
  },
  {
    id: 'cat-02',
    slug: 'banking-pix-security',
    title: 'Segurança Bancária & Pix',
    icon: 'Landmark',
    description: 'Mecanismo Especial de Devolução (MED), falsas centrais 0800, boletos e contas laranjas.',
    color: '#FF6B00',
    threadCount: 94,
    postCount: 480,
    moderators: ['rafael_sec', 'camila_privacy'],
    lastActivity: 'Há 35 minutos'
  },
  {
    id: 'cat-03',
    slug: 'phishing-social-engineering',
    title: 'Phishing & Engenharia Social',
    icon: 'MailWarning',
    description: 'Análise de e-mails, SMS (Smishing), chamadas (Vishing) e armadilhas psicológicas.',
    color: '#E00000',
    threadCount: 76,
    postCount: 390,
    moderators: ['egui_core'],
    lastActivity: 'Há 1 hora'
  },
  {
    id: 'cat-04',
    slug: 'tools-defense',
    title: 'Ferramentas & Defesa Digital',
    icon: 'ShieldCheck',
    description: 'Gerenciadores de senhas, chaves 2FA/FIDO, antivírus, navegadores seguros e DNS limpo.',
    color: '#00F0FF',
    threadCount: 52,
    postCount: 295,
    moderators: ['rafael_sec'],
    lastActivity: 'Há 2 horas'
  },
  {
    id: 'cat-05',
    slug: 'fraud-intelligence',
    title: 'Inteligência & Casos Reais',
    icon: 'Search',
    description: 'Dissecação técnica de operações cibernéticas, botnets, trojans e vetores avançados.',
    color: '#A855F7',
    threadCount: 41,
    postCount: 210,
    moderators: ['egui_core'],
    lastActivity: 'Há 4 horas'
  },
  {
    id: 'cat-06',
    slug: 'questions-help',
    title: 'Dúvidas & Ajuda Rápida',
    icon: 'HelpCircle',
    description: 'Espaço para quem foi vítima de golpe ou desconfia de uma mensagem receber orientação segura.',
    color: '#39FF14',
    threadCount: 165,
    postCount: 890,
    moderators: ['rafael_sec', 'camila_privacy', 'egui_core'],
    lastActivity: 'Há 8 minutos'
  },
  {
    id: 'cat-07',
    slug: 'legislation-rights',
    title: 'Direito Digital & LGPD',
    icon: 'Scale',
    description: 'Orientação jurídica, jurisprudência bancária, responsabilidade objetiva e notificações formais.',
    color: '#EAB308',
    threadCount: 38,
    postCount: 174,
    moderators: ['camila_privacy'],
    lastActivity: 'Há 5 horas'
  },
  {
    id: 'cat-08',
    slug: 'privacy-data-protection',
    title: 'Privacidade & Proteção de Dados',
    icon: 'EyeOff',
    description: 'Vazamentos de CPF, higienização de rastros digitais e bloqueio de telemarketing abusivo.',
    color: '#06B6D4',
    threadCount: 45,
    postCount: 220,
    moderators: ['camila_privacy', 'egui_core'],
    lastActivity: 'Há 3 horas'
  },
  {
    id: 'cat-09',
    slug: 'mobile-device-security',
    title: 'Segurança Mobile & Dispositivos',
    icon: 'Smartphone',
    description: 'Proteção contra furto de celular, bloqueio IMEI, Modo Rua bancário e segurança Android/iOS.',
    color: '#EC4899',
    threadCount: 63,
    postCount: 315,
    moderators: ['rafael_sec'],
    lastActivity: 'Há 45 minutos'
  },
  {
    id: 'cat-10',
    slug: 'security-discussions',
    title: 'Discussões Técnicas de Segurança',
    icon: 'Terminal',
    description: 'Debates sobre criptografia, arquitetura Zero Trust, passkeys e novos padrões de defesa.',
    color: '#6366F1',
    threadCount: 33,
    postCount: 180,
    moderators: ['egui_core', 'rafael_sec'],
    lastActivity: 'Há 6 horas'
  },
  {
    id: 'cat-11',
    slug: 'education-awareness',
    title: 'Educação & Conscientização',
    icon: 'GraduationCap',
    description: 'Materiais didáticos, cartilhas para idosos, projetos escolares e dinâmicas empresariais.',
    color: '#10B981',
    threadCount: 29,
    postCount: 145,
    moderators: ['egui_core'],
    lastActivity: 'Ontem'
  },
  {
    id: 'cat-12',
    slug: 'announcements-platform',
    title: 'Anúncios & Plataforma E GUI 404',
    icon: 'Radio',
    description: 'Atualizações editoriais, novas ferramentas públicas e diretrizes da comunidade.',
    color: '#E00000',
    threadCount: 14,
    postCount: 88,
    moderators: ['egui_core'],
    lastActivity: 'Há 1 dia'
  }
];

export const FORUM_TAGS: ForumTag[] = [
  { slug: 'pix-fraude', name: 'Pix Fraude', count: 98, description: 'Tópicos relacionados a fraudes via transferência Pix.' },
  { slug: 'med-estorno', name: 'MED / Estorno', count: 74, description: 'Acionamento do Mecanismo Especial de Devolução do Banco Central.' },
  { slug: 'falsa-central-0800', name: 'Falsa Central 0800', count: 62, description: 'Engenharia social por chamadas e SMS com 0800 fictício.' },
  { slug: 'whatsapp-clone', name: 'WhatsApp Falso', count: 58, description: 'Personificação e novos números pedindo dinheiro.' },
  { slug: 'juridico-bancario', name: 'Jurídico & CDC', count: 43, description: 'Ações judiciais e súmulas de responsabilidade das instituições.' },
  { slug: 'autenticacao-2fa', name: '2FA & Passkeys', count: 39, description: 'Métodos fortes de proteção e troca de senhas.' },
  { slug: 'falso-investimento', name: 'Falso Investimento', count: 51, description: 'Pirâmides, robôs de trading e falsas corretoras cripto.' },
  { slug: 'urgente-ajuda', name: 'Ajuda Urgente', count: 67, description: 'Casos recentes necessitando de orientação de triagem imediata.' }
];

export const FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-001',
    slug: 'como-funciona-o-med-do-pix-passo-a-passo-para-recuperar-fundos',
    title: 'Como funciona o MED do Pix: Passo a passo prático para solicitar bloqueio e estorno após um golpe',
    categoryId: 'cat-02',
    categorySlug: 'banking-pix-security',
    categoryName: 'Segurança Bancária & Pix',
    authorId: 'user-002',
    author: FORUM_MEMBERS[1],
    content: `O **Mecanismo Especial de Devolução (MED)** foi criado pelo Banco Central (Resolução BCB nº 103/2021) especificamente para casos de **fraude comprovada** ou **falha operacional** no Pix.

Infelizmente, muitas pessoas não sabem como acioná-lo a tempo ou recebem respostas evasivas do atendimento inicial do banco.

### ⏱️ O Fator Tempo é Crítico (Janela de 72 horas)
Os criminosos costumam pulverizar o valor em contas de passagem minutos após o envio. Porém, ao acionar o MED:
1. O seu banco (emissor) envia um alerta direto via sistema SPI para o banco que recebeu o dinheiro (receptor).
2. O banco receptor tem a obrigação regulatória de **bloquear cautelarmente** qualquer saldo remanescente na conta de destino.
3. Se houver saldo, o banco receptor tem até 7 dias para analisar o mérito e efetuar a devolução total ou parcial.

### 📋 Checklist Obrigatório para Acionar o MED:
- ✅ **Ligue no SAC/Ouvidoria do seu banco** imediatamente e exija o protocolo informando claramente o termo *"Registro de Infração Pix / Mecanismo Especial de Devolução"*.
- ✅ **Registre o B.O. (Boletim de Ocorrência)** na Delegacia Eletrônica da Polícia Civil anexando comprovante com ID da transação Pix (E2E ID).
- ✅ **Envie o B.O. ao banco** dentro do chamado aberto.
- ✅ Caso o banco negue atendimento, abra reclamação imediata no portal do **Banco Central do Brasil (bcb.gov.br)** e no **Consumidor.gov.br**.

Quem aqui já precisou acionar o MED? Vamos compartilhar os prazos e retornos obtidos para calibrar as estatísticas da comunidade.`,
    tags: ['med-estorno', 'pix-fraude', 'juridico-bancario'],
    status: 'OPEN',
    isPinned: true,
    isHot: true,
    isVerified: true,
    viewsCount: 1420,
    repliesCount: 18,
    likesCount: 142,
    isLikedByMe: false,
    isBookmarkedByMe: true,
    hasSolution: true,
    solutionPostId: 'post-002',
    createdAt: '2026-02-18T14:30:00Z',
    updatedAt: '2026-08-25T09:15:00Z',
    lastActivityAt: '2026-08-25T09:15:00Z',
    lastReplyAuthor: 'Dra. Camila Nogueira'
  },
  {
    id: 'thread-002',
    slug: 'cai-no-golpe-da-falsa-central-0800-fiz-pix-de-4k-o-que-fazer-agora',
    title: 'URGENTE: Caí no golpe da falsa central 0800 e transferi R$ 4.200. Qual o primeiro passo?',
    categoryId: 'cat-06',
    categorySlug: 'questions-help',
    categoryName: 'Dúvidas & Ajuda Rápida',
    authorId: 'user-005',
    author: FORUM_MEMBERS[4],
    content: `Pessoal, recebi um SMS dizendo que tinha uma compra aprovada no meu cartão de R$ 4.890 na Magazine Luiza. Como não comprei nada, liguei desesperada no 0800 que veio na mensagem.

A atendente parecia super profissional, colocou música do meu banco, sabia meu CPF e disse que minha conta estava sendo invadida de Curitiba. Ela me orientou a transferir meu saldo de R$ 4.200 para uma "chave de contingência segura" para cancelar a transação. Fiz o Pix pelo app. Assim que confirmei, ela desligou na minha cara.

Estou em choque. O que eu faço exatamente agora nos próximos minutos? Já liguei no banco e a fila está demorando.`,
    tags: ['urgente-ajuda', 'falsa-central-0800', 'pix-fraude', 'med-estorno'],
    status: 'SOLVED',
    isPinned: false,
    isHot: true,
    isVerified: false,
    viewsCount: 980,
    repliesCount: 12,
    likesCount: 38,
    isLikedByMe: false,
    isBookmarkedByMe: false,
    hasSolution: true,
    solutionPostId: 'post-004',
    createdAt: '2026-08-24T19:00:00Z',
    updatedAt: '2026-08-25T08:30:00Z',
    lastActivityAt: '2026-08-25T08:30:00Z',
    lastReplyAuthor: 'Rafael Bittencourt'
  },
  {
    id: 'thread-003',
    slug: 'alerta-falsos-anuncios-no-google-para-2a-via-de-boleto-enel-e-sabesp',
    title: 'ALERTA TÉCNICO: Links patrocinados no Google sequestrando buscas de 2ª via de faturas (Enel/Sabesp/Bancos)',
    categoryId: 'cat-01',
    categorySlug: 'scams-report',
    categoryName: 'Relatos de Golpes & Denúncias',
    authorId: 'user-004',
    author: FORUM_MEMBERS[3],
    content: `Identifiquei uma campanha ativa hoje no Google Ads onde criminosos compram as primeiras posições para palavras como *"segunda via enel"* e *"fatura sabesp 2 via"*.

Os links levam para páginas hospedadas em domínios como \`enel-segunda-via-atendimento[.]online\`.
Ao entrar, abre um robô de WhatsApp que pede a instalação de um aplicativo ou gera um boleto com código de barras adulterado cujo beneficiário final é um banco digital desconhecido.

### Recomendações de Defesa:
1. Instale um bloqueador de anúncios (uBlock Origin) para esconder links patrocinados fraudulentos.
2. Acesse sempre digitando a URL oficial diretamente na barra do navegador.
3. Ative o **DDA (Débito Direto Autorizado)** no seu banco para pagar contas sem depender de boletos avulsos.`,
    tags: ['pix-fraude', 'falsa-central-0800'],
    status: 'OPEN',
    isPinned: false,
    isHot: false,
    isVerified: true,
    viewsCount: 650,
    repliesCount: 7,
    likesCount: 64,
    isLikedByMe: true,
    isBookmarkedByMe: true,
    hasSolution: false,
    createdAt: '2026-08-23T11:20:00Z',
    updatedAt: '2026-08-24T16:00:00Z',
    lastActivityAt: '2026-08-24T16:00:00Z',
    lastReplyAuthor: 'E GUI 404 Ops'
  },
  {
    id: 'thread-004',
    slug: 'jurisprudencia-sumula-479-stj-responsabilidade-dos-bancos-em-fraudes',
    title: 'Guia Jurídico: Súmula 479 do STJ e a responsabilidade objetiva dos bancos em golpes de engenharia social',
    categoryId: 'cat-07',
    categorySlug: 'legislation-rights',
    categoryName: 'Direito Digital & LGPD',
    authorId: 'user-003',
    author: FORUM_MEMBERS[2],
    content: `A **Súmula 479 do Superior Tribunal de Justiça (STJ)** estabelece:
> *"As instituições financeiras respondem objetivamente pelos danos gerados por fortuito interno relativo a fraudes e delitos praticados por terceiros no âmbito de operações bancárias."*

### O que os tribunais estão decidindo em 2025/2026:
1. **Transações fora do perfil do correntista:** Se a vítima nunca faz Pix de R$ 5.000 de madrugada e o banco autorizou sem acionar travas comportamentais, há falha no dever de segurança do algoritmo bancário.
2. **Contas laranjas receptoras:** O banco onde a conta fraudadora foi aberta tem responsabilidade civil por falha no KYC (Know Your Customer) ao permitir a abertura de conta com documentos falsos ou uso abusivo por laranjas.
3. **Falsa Central 0800:** Há decisões favoráveis determinando o ressarcimento quando os criminosos tinham em mãos dados sigilosos que deveriam estar resguardados pelo sigilo bancário.

Se o seu banco negou o estorno no MED, não desista: o caminho do Juizado Especial Cível (JEC) é gratuito para causas de até 20 salários mínimos.`,
    tags: ['juridico-bancario', 'med-estorno', 'pix-fraude'],
    status: 'OPEN',
    isPinned: true,
    isHot: true,
    isVerified: true,
    viewsCount: 1890,
    repliesCount: 24,
    likesCount: 215,
    isLikedByMe: false,
    isBookmarkedByMe: true,
    hasSolution: false,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-08-25T07:45:00Z',
    lastActivityAt: '2026-08-25T07:45:00Z',
    lastReplyAuthor: 'Thiago M.'
  }
];

export const FORUM_POSTS: Record<string, ForumPost[]> = {
  'thread-001': [
    {
      id: 'post-001',
      threadId: 'thread-001',
      authorId: 'user-002',
      author: FORUM_MEMBERS[1],
      content: `Lembrando que o Banco Central atualizou as regras do MED 2.0 (em implantação gradual) para permitir o rastreio e bloqueio de contas em **múltiplas camadas de transferência**, ou seja, mesmo que o dinheiro passe da conta A para a conta B e C, o bloqueio alcança as camadas subsequentes!`,
      createdAt: '2026-02-18T15:00:00Z',
      likesCount: 45,
      isLikedByMe: false,
      isSolution: false,
      postNumber: 1
    },
    {
      id: 'post-002',
      threadId: 'thread-001',
      authorId: 'user-003',
      author: FORUM_MEMBERS[2],
      content: `Complementando perfeitamente a exposição do Rafael:
**DICA DE OURO:** Guarde o protocolo da ligação e o nome do atendente. Se o atendente disser *"não fazemos devolução de Pix porque você digitou a senha"*, responda imediatamente:
*"Estou solicitando formalmente o acionamento do MED conforme a Resolução BCB nº 103/2021. Por favor, registre o protocolo de contestação por fraude sob pena de descumprimento regulatório do BACEN."*
Geralmente o atendimento muda de tom e abre a ocorrência correta no sistema.`,
      createdAt: '2026-02-18T16:15:00Z',
      likesCount: 112,
      isLikedByMe: true,
      isSolution: true,
      postNumber: 2
    },
    {
      id: 'post-003',
      threadId: 'thread-001',
      authorId: 'user-004',
      author: FORUM_MEMBERS[3],
      content: `Excelente guia! No meu caso ano passado consegui recuperar R$ 1.800 de um golpe de marketplace porque acionei o MED em menos de 15 minutos pelo chat do Nubank. O tempo é o diferencial total.`,
      createdAt: '2026-02-19T09:20:00Z',
      likesCount: 19,
      isLikedByMe: false,
      isSolution: false,
      postNumber: 3
    }
  ],
  'thread-002': [
    {
      id: 'post-004',
      threadId: 'thread-002',
      authorId: 'user-002',
      author: FORUM_MEMBERS[1],
      content: `Mariana, respire fundo. Siga esta ordem exata AGORA:

1. **Ligue no número oficial no verso do seu cartão bancário físico** (ou pelo chat oficial autenticado dentro do app).
2. Diga: *"Fui vítima de golpe de engenharia social (falsa central telefônica). Quero solicitar o bloqueio cautelar imediato e a abertura do MED (Mecanismo Especial de Devolução) contra o Pix realizado há poucos minutos."*
3. Peça o número de protocolo do chamado e anote data/hora.
4. Abra a Delegacia Eletrônica da Polícia Civil do seu estado no computador e registre o **Boletim de Ocorrência** por Estelionato (Art. 171 do CP). Anexe o print do comprovante do Pix com o ID da transação (código E2E).
5. Envie o PDF do B.O. para o canal de e-mail de segurança do seu banco.
6. Altere imediatamente sua senha de login do banco, senha de transação e senha do seu e-mail principal.

Não perca tempo tentando ligar de volta para o número 0800 do golpe. Foque no canal oficial do seu banco!`,
      createdAt: '2026-08-24T19:10:00Z',
      likesCount: 88,
      isLikedByMe: true,
      isSolution: true,
      postNumber: 1
    },
    {
      id: 'post-005',
      threadId: 'thread-002',
      authorId: 'user-001',
      author: FORUM_MEMBERS[0],
      content: `A equipe do E GUI 404 reforça a orientação do Rafael. Além do MED, se o seu banco não resolver em até 7 dias úteis, cadastre sua reclamação no site oficial do Banco Central (bcb.gov.br) anexando os protocolos. O banco é obrigado a prestar esclarecimentos formais.`,
      createdAt: '2026-08-24T19:40:00Z',
      likesCount: 34,
      isLikedByMe: false,
      isSolution: false,
      postNumber: 2
    }
  ]
};

export const INITIAL_NOTIFICATIONS: ForumNotification[] = [
  {
    id: 'notif-001',
    userId: 'current-user',
    type: 'SOLUTION',
    title: 'Resposta marcada como Solução',
    message: 'Sua resposta no tópico sobre o MED do Pix foi destacada pela moderação.',
    linkUrl: '/forum/topic/como-funciona-o-med-do-pix-passo-a-passo-para-recuperar-fundos',
    createdAt: '2026-08-25T08:00:00Z',
    read: false
  },
  {
    id: 'notif-002',
    userId: 'current-user',
    type: 'REPLY',
    title: 'Nova resposta em seu tópico',
    message: 'Rafael Bittencourt respondeu à discussão sobre falsos 0800.',
    linkUrl: '/forum/topic/cai-no-golpe-da-falsa-central-0800-fiz-pix-de-4k-o-que-fazer-agora',
    createdAt: '2026-08-24T19:15:00Z',
    read: true
  },
  {
    id: 'notif-003',
    userId: 'current-user',
    type: 'SYSTEM',
    title: 'Bem-vindo ao Fórum E GUI 404',
    message: 'Leia as diretrizes de convivência e segurança antes de publicar dados ou relatórios.',
    linkUrl: '/forum/guidelines',
    createdAt: '2026-08-20T10:00:00Z',
    read: true
  }
];

export const INITIAL_REPORTS: ForumReport[] = [
  {
    id: 'rep-001',
    targetType: 'POST',
    targetId: 'post-999',
    targetTitle: 'Mensagem com link suspeito não desativado',
    reporterUsername: 'thiago_hunter',
    reason: 'MALICIOUS_CONTENT',
    details: 'O usuário colou um link ativo de phishing sem mascarar com colchetes tipo [.]com',
    status: 'PENDING',
    createdAt: '2026-08-25T09:00:00Z'
  }
];
