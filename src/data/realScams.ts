import { ScamItem } from '../types';

export const REAL_SCAMS: ScamItem[] = [
  {
    id: 'scam-001',
    slug: 'golpe-da-falsa-central-telefonica-e-0800',
    title: 'Falsa Central Telefônica 0800 & Engenharia Social Bancária',
    category: 'VISHING',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-02-15',
    lastUpdated: '2026-08-25',
    geography: 'Brasil (Nacional)',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-20',
    verificationStatus: 'VERIFIED',
    sourceType: 'OFFICIAL',
    summary: 'Vítima recebe SMS ou ligação alertando sobre compras suspeitas de alto valor e é induzida a ligar para um número 0800 falso que simula a central do banco para roubar senhas e Pix.',
    overview: 'Golpe altamente estruturado que utiliza centrais falsas URA (Unidade de Resposta Audível) idênticas às instituições financeiras. Os fraudadores utilizam Spoofing de ID de chamadas e músicas de espera oficiais para induzir a vítima a realizar transferências de "segurança" ou fornecer senhas.',
    threatFlow: [
      'CONTATO INICIAL: SMS/Chamada alegando transação de R$ 3.800 no cartão',
      'ENGENHARIA SOCIAL: Vítima liga para o 0800 falso ou atende suposto setor de segurança',
      'SIMULAÇÃO TÉCNICA: Falso atendente confirma dados parciais da vítima para gerar confiança',
      'AÇÃO INDUZIDA: Vítima é orientada a fazer Pix "de teste" para estorno ou digitar senha na URA',
      'PERDA FINANCEIRA: Valor transferido cai em conta de laranja e é pulverizado imediatamente'
    ],
    howItWorks: [
      'A vítima recebe um SMS informando que uma compra de alto valor (ex: R$ 4.290,00) foi aprovada na Magazine Luiza ou Casas Bahia e fornece um 0800 para cancelamento.',
      'Ao ligar, a URA reproduz a gravação idêntica do banco real com opções de menu.',
      'O atendente falso confirma o nome e CPF da vítima (obtidos em vazamentos públicos de dados).',
      'Alegando que a conta está sob invasão, o golpista orienta a vítima a transferir o saldo para um "cofre seguro temporário" via Pix ou a digitar a senha eletrônica.',
      'Após a transferência, a ligação é desligada e o dinheiro transferido é imediatamente distribuído entre contas de passagem.'
    ],
    warningSigns: [
      'Mensagens SMS com tom alarmista exigindo ligação imediata para um número 0800.',
      'Atendente que solicita realização de transferências Pix como procedimento de segurança ou estorno.',
      'Solicitação de senhas de 4, 6 ou 8 dígitos pelo telefone.',
      'Instrução para instalar aplicativos de suporte remoto (AnyDesk, TeamViewer, QuickSupport).'
    ],
    commonTactics: [
      'Contratação de números 0800 piratas e mascaramento de número (Caller ID Spoofing).',
      'Uso de gravações de som ambiente de call center para simular credibilidade.',
      'Pressão psicológica alegando bloqueio de conta ou perda irreversível de saldo.'
    ],
    howToProtect: [
      'Bancos NUNCA pedem transferências Pix para cancelar transações ou proteger saldo.',
      'Bancos NUNCA solicitam a instalação de aplicativos de acesso remoto no seu celular.',
      'Se receber SMS suspeito, não ligue para o 0800 informado: abra o aplicativo oficial do banco ou ligue para o número impresso no verso do seu cartão físico.'
    ],
    victimActions: [
      'Ligue imediatamente para o SAC do seu banco através do número oficial no verso do cartão.',
      'Solicite o acionamento do Mecanismo Especial de Devolução (MED) do Pix por fraude.',
      'Faça o registro de Boletim de Ocorrência (B.O.) na Delegacia de Polícia Civil informando a chave Pix de destino.',
      'Troque as senhas de acesso aos aplicativos bancários e do seu e-mail principal.'
    ],
    affectedPlatforms: ['SMS', 'Telefonia Móvel / Falsa URA', 'WhatsApp', 'Pix'],
    sources: [
      {
        organization: 'Federação Brasileira de Bancos (FEBRABAN)',
        title: 'Alerta Oficial: Golpe da Falsa Central de Atendimento e Falso 0800',
        url: 'https://antifraudes.febraban.org.br',
        publishedAt: '2025-11-10',
        accessedAt: '2026-08-20',
        type: 'OFFICIAL',
        isOfficial: true
      },
      {
        organization: 'Banco Central do Brasil',
        title: 'Orientações sobre Fraudes e o Mecanismo Especial de Devolução (MED)',
        url: 'https://www.bcb.gov.br/estabilidadefinanceira/med',
        publishedAt: '2025-09-01',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-002',
    slug: 'golpe-do-falso-perfil-whatsapp-novo-numero',
    title: 'Falso Perfil de WhatsApp (Foto Clonada & Novo Número)',
    category: 'WHATSAPP FRAUD',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-01-10',
    lastUpdated: '2026-08-22',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-15',
    verificationStatus: 'VERIFIED',
    sourceType: 'OFFICIAL',
    summary: 'Criminosos criam uma conta de WhatsApp com a foto e o nome de uma pessoa e contatam pais, filhos ou parentes alegando troca de número e solicitando pagamento urgente de contas.',
    overview: 'Golpe clássico de personificação baseado em engenharia social e exploração de laços afetivos. Diferente do roubo de conta com PIN, aqui o golpista utiliza um chip pré-pago qualquer e simplesmente baixa a foto pública de perfil da vítima.',
    threatFlow: [
      'COLETA DE DADOS: Criminosos pesquisam fotos públicas e relações de parentesco em redes sociais',
      'CRIAÇÃO DE CONTA: Chip novo ativado com foto e nome do familiar',
      'MENSAGEM: "Oi mãe, troquei de número, salva este novo"',
      'PRETEXTO: "Estou no banco e meu app bloqueou, pode pagar este boleto/Pix para mim?"',
      'PREJUÍZO: Familiar transfere acreditando estar ajudando o parente'
    ],
    howItWorks: [
      'O fraudador obtém a foto de perfil do alvo em redes sociais abertas (Instagram, Facebook ou WhatsApp sem restrição de privacidade).',
      'Envia mensagem para contatos próximos dizendo que mudou de número temporariamente.',
      'Pouco tempo depois, alega que precisa pagar um fornecedor ou conta com urgência e que o limite diário atingiu o teto.',
      'Passa a chave Pix de um terceiro (laranja) e promete devolver o dinheiro no mesmo dia.'
    ],
    warningSigns: [
      'Mensagens de número desconhecido afirmando ser parente próximo que "trocou de celular".',
      'Pedido urgente de dinheiro ou pagamento de boletos nas primeiras mensagens.',
      'Recusa em atender chamadas de voz ou vídeo ("minha câmera está quebrada").',
      'Chave Pix em nome de pessoa física totalmente desconhecida da família.'
    ],
    commonTactics: [
      'Senso extremo de urgência afetiva ("É urgente, vence agora às 16h").',
      'Desculpas convincentes para a troca repentina de aparelho ("O antigo caiu na água").'
    ],
    howToProtect: [
      'Ligue para o NÚMERO ANTIGO do parente antes de fazer qualquer transferência.',
      'Faça uma chamada de vídeo para confirmar visualmente a identidade.',
      'Restrinja a visibilidade da sua foto de perfil do WhatsApp para "Apenas Meus Contatos".'
    ],
    victimActions: [
      'Avise imediatamente o parente cuja identidade foi utilizada.',
      'Denuncie a conta diretamente no WhatsApp (Três pontinhos > Mais > Denunciar).',
      'Contate o seu banco para solicitar o MED do Pix.',
      'Registre Boletim de Ocorrência com os prints completos da conversa e dados do Pix.'
    ],
    affectedPlatforms: ['WhatsApp', 'Redes Sociais', 'Pix'],
    sources: [
      {
        organization: 'CERT.br / NIC.br',
        title: 'Fascículo de Engenharia Social e Golpes em Aplicativos de Mensagens',
        url: 'https://cartilha.cert.br/fasciculos/',
        publishedAt: '2025-06-12',
        accessedAt: '2026-08-20',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      },
      {
        organization: 'Polícia Civil do Estado de São Paulo',
        title: 'Orientações da Divisão de Crimes Cibernéticos sobre Golpe do WhatsApp',
        url: 'https://www.policiacivil.sp.gov.br',
        publishedAt: '2025-04-18',
        accessedAt: '2026-08-20',
        type: 'LAW_ENFORCEMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-003',
    slug: 'golpe-da-falsa-tarefa-e-renda-extra-telegram',
    title: 'Falsa Renda Extra por Tarefas (Curtidas no YouTube & Avaliações)',
    category: 'FAKE JOBS',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-01-20',
    lastUpdated: '2026-08-24',
    geography: 'Global / Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-18',
    verificationStatus: 'VERIFIED',
    sourceType: 'OFFICIAL',
    summary: 'Convite via WhatsApp/Telegram para ganhar de R$ 200 a R$ 1.500 por dia curtindo vídeos, avaliando hotéis ou seguindo lojas no Instagram, exigindo aportes crescentes para liberar saques.',
    overview: 'Esquema de pirâmide financeira disfarçado de trabalho remoto. A vítima ganha R$ 10 a R$ 20 nas primeiras tarefas simples. Em seguida, é inserida em grupos no Telegram com falsos participantes comemorando altos ganhos e induzida a "comprar tarefas pré-pagas de alto valor" que nunca são devolvidas.',
    threatFlow: [
      'RECRUTAMENTO: Mensagem de "Recrutadora da Amazon/Shopee" oferecendo trabalho em meio período',
      'RECOMPENSA INICIAL: Vítima ganha R$ 15 no Pix por 3 curtidas no YouTube',
      'UPGRADE PARA TELEGRAM: Direcionada para grupo de "Tarefas VIP"',
      'DEPÓSITO EXIGIDO: Para cumprir a tarefa de R$ 500, precisa depositar R$ 300 primeiro',
      'GOLPE CONCLUÍDO: Plataforma trava o saldo exigindo pagamentos sucessivos de R$ 1.000 a R$ 10.000'
    ],
    howItWorks: [
      'O golpista contata via WhatsApp com números internacionais (+62, +1, +44, +234).',
      'Pede prints de vídeos curtidos no YouTube ou produtos favoritados.',
      'Paga de verdade R$ 10 a R$ 30 via Pix para provar que "o sistema é real".',
      'Adiciona a vítima a um canal no Telegram gerenciado por bots e cúmplices.',
      'Apresenta "missões financeiras" onde a vítima precisa depositar dinheiro em carteiras de cripto ou contas Pix para receber 30% a 50% de retorno.',
      'Após o depósito maior, o sistema alega "erro no código de execução" e bloqueia o dinheiro.'
    ],
    warningSigns: [
      'Ofertas de trabalho não solicitadas com ganhos exorbitantes para tarefas banais (curtidas).',
      'Necessidade de pagar para trabalhar ou para liberar pagamento de salário.',
      'Gerentes de atendimento que só conversam por Telegram sem contrato de trabalho formal.',
      'Comprovantes de ganhos mirabolantes postados por outros membros do grupo.'
    ],
    commonTactics: [
      'Gatilho da reciprocidade e recompensa instantânea inicial para desarmar desconfiança.',
      'Uso de dezenas de perfis falsos simulando comunidade satisfeita (efeito manada).'
    ],
    howToProtect: [
      'Nenhuma empresa séria paga R$ 50 por curtida em rede social.',
      'NUNCA pague dinheiro antecipado para ter direito a receber remuneração de trabalho.',
      'Bloqueie números desconhecidos que oferecem trabalho remoto espontaneamente.'
    ],
    victimActions: [
      'Saia dos grupos de Telegram e salve todos os comprovantes de Pix e chaves bancárias.',
      'Contate imediatamente seu banco para acionar o MED contra as contas receptoras.',
      'Registre ocorrência policial detalhando os números de telefone e links dos canais.'
    ],
    affectedPlatforms: ['WhatsApp', 'Telegram', 'YouTube', 'TikTok', 'Instagram'],
    sources: [
      {
        organization: 'Ministério da Justiça e Segurança Pública (MJSP)',
        title: 'Alerta Nacional: Golpe das Falsas Tarefas e Avaliações de Produtos',
        url: 'https://www.gov.br/mj/pt-br',
        publishedAt: '2025-08-14',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'Federal Trade Commission (FTC - EUA)',
        title: 'Job Scams and Fake Task Assignment Fraud Patterns',
        url: 'https://consumer.ftc.gov/articles/job-scams',
        publishedAt: '2025-07-22',
        accessedAt: '2026-08-20',
        type: 'OFFICIAL',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-004',
    slug: 'golpe-do-falso-investimento-em-criptoativos-e-plataforma-fantasma',
    title: 'Falso Investimento em Criptoativos & Plataforma de Arbitragem Fantasma',
    category: 'FAKE INVESTMENTS',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-02-01',
    lastUpdated: '2026-08-25',
    geography: 'América Latina & Europa',
    country: 'Brasil / Global',
    isVerified: true,
    verificationDate: '2026-08-19',
    verificationStatus: 'VERIFIED',
    sourceType: 'OFFICIAL',
    summary: 'Corretoras falsas de criptomoedas com dashboards simulados que exibem lucros fictícios mas exigem pagamento de taxas ilegais de "IOF" e "desbloqueio" na hora do saque.',
    overview: 'Esquema de engenharia financeira sofisticada (Pig Butchering / Falso Day Trading). O investidor é seduzido por falsos mentores em redes sociais ou aplicativos de namoro, realiza transferências e acompanha gráficos manipulados onde parece estar ganhando milhares de dólares.',
    threatFlow: [
      'APROXIMAÇÃO: Contato amigável ou anúncio patrocinado com celebridade falsa gerada por IA',
      'CADASTRO: Vítima cria conta em corretora falsa (ex: bit-global-pro.online)',
      'LUCRO SIMULADO: Gráficos mostram saldo subindo de US$ 500 para US$ 12.000',
      'TENTATIVA DE RESGATE: Corretora exige 20% em impostos antes de liberar o dinheiro',
      'DESAPARECIMENTO: Após pagamento da taxa, o site sai do ar e o suporte cessa.'
    ],
    howItWorks: [
      'Anúncios em redes sociais utilizam vídeos Deepfake de empresários e apresentadores de TV recomendando uma nova ferramenta de IA de investimentos.',
      'A vítima faz um aporte inicial (ex: R$ 1.500) guiada por um suposto "gerente de conta".',
      'No site forjado, os números sobem diariamente de forma fictícia.',
      'Ao solicitar o saque, a vítima é informada de que precisa pagar taxa de corretagem ou imposto de renda antecipado via Pix ou USDT.',
      'O dinheiro nunca é liberado.'
    ],
    warningSigns: [
      'Garantia de rentabilidade líquida fixa acima de 3% ao mês em renda variável.',
      'Cobrança de taxas antecipadas para liberação de saques de capital próprio.',
      'Site sem registro ou autorização na Comissão de Valores Mobiliários (CVM).'
    ],
    commonTactics: [
      'Uso de Deepfakes de autoridades financeiras e celebridades.',
      'Domínios registrados recentemente com nomes parecidos com corretoras globais (Binance, Bybit).'
    ],
    howToProtect: [
      'Consulte o cadastro de emissores e corretoras autorizadas no portal da CVM (cvm.gov.br).',
      'Corretoras legítimas debitam custos operacionais direto do saldo existente, sem depósitos extras.',
      'Desconfie de gerentes de investimento desconhecidos que te procuram por Instagram ou WhatsApp.'
    ],
    victimActions: [
      'Não realize nenhum pagamento adicional sob pretexto de liberar fundos.',
      'Documente todos os comprovantes de blockchain, hashes de transação e endereços de carteiras.',
      'Registre denúncia formal na CVM e Boletim de Ocorrência na Delegacia especializada em fraudes.'
    ],
    affectedPlatforms: ['Instagram', 'Meta Ads', 'Telegram', 'Websites Falsos'],
    sources: [
      {
        organization: 'Comissão de Valores Mobiliários (CVM)',
        title: 'Alertas de Atuação Irregular no Mercado de Capitais',
        url: 'https://www.gov.br/cvm/pt-br/assuntos/protecao-ao-investidor/alertas',
        publishedAt: '2025-10-05',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'Federal Bureau of Investigation (FBI - IC3)',
        title: 'Public Service Announcement: Cryptocurrency Investment Schemes (Pig Butchering)',
        url: 'https://www.ic3.gov/Media/Y2023/PSA230314',
        publishedAt: '2025-05-10',
        accessedAt: '2026-08-20',
        type: 'LAW_ENFORCEMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-005',
    slug: 'phishing-de-falsa-intimacao-e-restituicao-receita-federal',
    title: 'Phishing de Falsa Notificação / Restituição da Receita Federal',
    category: 'PHISHING',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-02-10',
    lastUpdated: '2026-08-21',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-16',
    verificationStatus: 'VERIFIED',
    sourceType: 'GOVERNMENT',
    summary: 'E-mails e mensagens falsas informando supostas pendências no CPF ou lotes residuais de restituição do IRPF com links que capturam logins do Gov.br e dados bancários.',
    overview: 'Campanhas massivas de e-mail e SMS que imitam o layout oficial da Receita Federal e do portal Gov.br. Os links levam a páginas idênticas com formulários para roubo de credenciais de login, senhas de bancos e cópias de documentos.',
    threatFlow: [
      'DISPARO MASSIVO: E-mail com remetente forjado (notificacao@receita-gov.online)',
      'AMEAÇA JURÍDICA: "Seu CPF possui irregularidades no IRPF e será cancelado em 24 horas"',
      'CLONE DO GOV.BR: Vítima clica no link e acessa página idêntica à do governo',
      'CAPTURA DE CREDENCIAIS: Formulário solicita CPF, senha Gov.br e dados bancários',
      'EXPLOIT: Golpistas utilizam a conta Gov.br para solicitar empréstimos ou abrir contas fraudulentas'
    ],
    howItWorks: [
      'O e-mail traz logotipos do Governo Federal e números de protocolo falsos.',
      'Alega que há valores a receber de restituição ou pendências cadastrais urgentes.',
      'O link redireciona para um domínio que simula o portal e-CAC da Receita Federal.',
      'Após o login falso, o site solicita dados de cartão de crédito para pagar uma "taxa de regularização".'
    ],
    warningSigns: [
      'Remetentes de e-mail com domínios não governamentais (diferentes de @gov.br ou @receita.fazenda.gov.br).',
      'Ameaças de bloqueio de CPF imediato ou penhora de bens via e-mail.',
      'Cobrança de taxas de regularização via Pix de pessoa física.'
    ],
    commonTactics: [
      'Uso de termos jurídicos formais e brasões oficiais do Brasil.',
      'Disparos temporais alinhados com o calendário oficial do Imposto de Renda.'
    ],
    howToProtect: [
      'A Receita Federal NUNCA envia e-mails contendo links diretos para pagamento ou com anexos executáveis.',
      'Acesse sempre digitando diretamente o endereço oficial no navegador: receita.fazenda.gov.br ou pelo app Meu Gov.br.',
      'Ative a verificação em duas etapas no aplicativo Gov.br.'
    ],
    victimActions: [
      'Se inseriu sua senha do Gov.br, altere-a imediatamente pelo aplicativo oficial.',
      'Verifique se houve emissão de procurações digitais não autorizadas no portal e-CAC.',
      'Bloqueie o cartão bancário informado e registre Boletim de Ocorrência.'
    ],
    affectedPlatforms: ['E-mail', 'SMS', 'Navegadores Web'],
    sources: [
      {
        organization: 'Receita Federal do Brasil',
        title: 'Alerta sobre Golpes envolvendo Notificações Falsas e Restituição do IRPF',
        url: 'https://www.gov.br/receitafederal/pt-br/assuntos/noticias',
        publishedAt: '2025-05-30',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'CERT.br',
        title: 'Cartilha de Segurança para Internet - Fascículo sobre Phishing',
        url: 'https://cartilha.cert.br/phishing/',
        publishedAt: '2025-02-11',
        accessedAt: '2026-08-20',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-006',
    slug: 'golpe-do-falso-boleto-bancario-e-adulteracao-de-codigo-de-barras',
    title: 'Adulteração de Boleto Bancário & Interceptação de Faturas',
    category: 'BANKING FRAUD',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-01-28',
    lastUpdated: '2026-08-23',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-14',
    verificationStatus: 'VERIFIED',
    sourceType: 'OFFICIAL',
    summary: 'Faturas de financiamento, faculdade, condomínio ou compras são interceptadas ou forjadas com códigos de barras adulterados que direcionam o dinheiro para fraudadores.',
    overview: 'Golpe que ocorre por meio de vírus no computador (trojan bolware) que altera a linha digitável na hora da impressão ou por golpistas que entram em contato por WhatsApp oferecendo "desconto para quitação de parcelas".',
    threatFlow: [
      'INTERCEPTAÇÃO: Vítima busca 2ª via de boleto no Google ou recebe mensagem de suporte falso',
      'EMISSÃO FORJADA: PDF do boleto é gerado com dados da empresa mas código de barras de conta laranja',
      'PAGAMENTO: Vítima efetua o pagamento pelo aplicativo do banco',
      'DESVIO: O dinheiro vai para um banco digital em nome de terceiro',
      'COBRANÇA REAL: A dívida original permanece aberta e o credor cobra a vítima'
    ],
    howItWorks: [
      'Vítimas pesquisam "segunda via fatura banco X" no Google e clicam em links patrocinados falsos.',
      'O falso canal de atendimento emite um boleto em PDF visualmente perfeito.',
      'No momento do pagamento, a linha digitável e o beneficiário final pertencem a um terceiro.',
      'A vítima só descobre semanas depois quando recebe ligação do credor real cobrando a inadimplência.'
    ],
    warningSigns: [
      'Nome do beneficiário final na tela de confirmação do banco diferente da empresa credora.',
      'Ofertas milagrosas de desconto ("quite sua dívida de R$ 5.000 por R$ 900 hoje").',
      'Boletos recebidos por números de WhatsApp não verificados.'
    ],
    commonTactics: [
      'Compra de anúncios no Google Ads para palavras-chave de segunda via de concessionárias.',
      'Manipulação dos três primeiros dígitos da linha digitável (que identificam o banco emissor).'
    ],
    howToProtect: [
      'Confira SEMPRE o nome e CNPJ do beneficiário na tela final de pagamento antes de confirmar.',
      'Baixe 2ª via de boletos exclusivamente de dentro da área logada do site oficial ou aplicativo.',
      'Utilize o DDA (Débito Direto Autorizado) do seu banco para pagar boletos registrados no seu CPF.'
    ],
    victimActions: [
      'Guarde o comprovante de pagamento onde consta o banco e conta beneficiária receptora.',
      'Contate o banco onde o pagamento foi feito e o banco destinatário relatando fraude.',
      'Registre Boletim de Ocorrência contra o titular da conta beneficiária.'
    ],
    affectedPlatforms: ['Boleto Bancário', 'Google Ads', 'WhatsApp', 'E-mail'],
    sources: [
      {
        organization: 'FEBRABAN',
        title: 'Guia de Segurança contra Fraudes em Boletos Bancários',
        url: 'https://febraban.org.br/seguranca',
        publishedAt: '2025-07-19',
        accessedAt: '2026-08-20',
        type: 'OFFICIAL',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-007',
    slug: 'golpe-do-falso-emprestimo-com-deposito-antecipado',
    title: 'Falso Empréstimo com Exigência de Taxa / Fiador Antecipado',
    category: 'FAKE LOANS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-01-15',
    lastUpdated: '2026-08-22',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-17',
    verificationStatus: 'VERIFIED',
    sourceType: 'GOVERNMENT',
    summary: 'Ofertas de crédito facilitado para negativados condicionadas ao pagamento prévio de taxas de avalista, IOF, seguro fiança ou despesas de cartório que resultam em prejuízo sem liberação do empréstimo.',
    overview: 'Golpe que explora a vulnerabilidade de pessoas negativadas e endividadas. Empresas fictícias ou que usam indevidamente nomes de financeiras conhecidas prometem liberação imediata de R$ 5.000 a R$ 50.000 sem consulta ao SPC/Serasa.',
    threatFlow: [
      'ANÚNCIO: Crédito rápido e sem burocracia anunciado em redes sociais e sites de busca',
      'SIMULAÇÃO: Vítima envia dados e é informada de que o crédito de R$ 20.000 foi aprovado',
      'EXIGÊNCIA DE TAXA: "Para liberar o contrato, é necessário pagar R$ 450 de taxa de avalista"',
      'SEGUNDA EXIGÊNCIA: Após o pagamento, surge nova exigência de R$ 800 de "liberação de score"',
      'CORTE DE CONTATO: Vítima percebe o golpe e os contatos são bloqueados.'
    ],
    howItWorks: [
      'O atendente envia um contrato com aparência oficial contendo CNPJ real de instituições financeiras.',
      'Após a assinatura, surge uma suposta pendência no sistema do Banco Central ou exigência de cartório.',
      'A vítima faz o Pix da taxa antecipada na esperança de receber o montante total.',
      'O dinheiro nunca é depositado na conta da vítima.'
    ],
    warningSigns: [
      'Exigência de qualquer valor antecipado para liberação de empréstimo (prática proibida por lei).',
      'Depósito de taxas em conta de pessoa física ou chave Pix aleatória.',
      'Promessa de crédito de alto valor para pessoas com restrição no nome sem garantia real.'
    ],
    commonTactics: [
      'Uso de nomes e logotipos de financeiras famosas.',
      'Apresentação de certidões e termos forjados com carimbos fictícios de cartório.'
    ],
    howToProtect: [
      'NENHUMA instituição financeira legal pode exigir pagamento antecipado para conceder empréstimo (Resolução nº 3.954 do Banco Central).',
      'Custos de contratação e IOF são sempre embutidos nas parcelas futuras, nunca cobrados antes.',
      'Consulte a relação de instituições autorizadas no site do Banco Central (bcb.gov.br).'
    ],
    victimActions: [
      'Não faça novos depósitos sob nenhuma circunstância.',
      'Guarde as conversas, o contrato forjado e os comprovantes de transferência bancária.',
      'Registre Boletim de Ocorrência e denúncia no Procon e no Banco Central.'
    ],
    affectedPlatforms: ['WhatsApp', 'Sites de Busca', 'Facebook / Instagram'],
    sources: [
      {
        organization: 'Banco Central do Brasil',
        title: 'Cobrança de taxa antecipada para empréstimo é golpe: entenda as regras',
        url: 'https://www.bcb.gov.br',
        publishedAt: '2025-06-25',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'Procon-SP',
        title: 'Alerta sobre golpes de empréstimos pela internet',
        url: 'https://www.procon.sp.gov.br',
        publishedAt: '2025-03-12',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-008',
    slug: 'golpe-do-falso-suporte-tecnico-e-acesso-remoto',
    title: 'Falso Suporte Técnico & Invasão por Aplicativo de Acesso Remoto',
    category: 'FAKE SUPPORT',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-02-05',
    lastUpdated: '2026-08-24',
    geography: 'Global & Brasil',
    country: 'Brasil / Global',
    isVerified: true,
    verificationDate: '2026-08-18',
    verificationStatus: 'VERIFIED',
    sourceType: 'LAW_ENFORCEMENT',
    summary: 'Avisos falsos em tela de navegador travada ou ligações alegando vírus grave no computador ou celular, instruindo a vítima a instalar softwares como AnyDesk para roubo bancário ao vivo.',
    overview: 'Golpe que combina técnicas de pop-ups de engenharia social (browser lockers) com vishing. Ao instalar o programa de acesso remoto solicitado pelo "técnico da Microsoft/Banco", o criminoso assume o controle do teclado e mouse da vítima e transfere fundos enquanto escurece a tela da vítima.',
    threatFlow: [
      'POPOUP ALARME: Tela do navegador emite som de sirene e alerta "Seu computador foi infectado pelo vírus Zeus"',
      'CHAMADA DE SUPORTE: Vítima assustada liga para o 0800 do suporte na tela',
      'INSTALAÇÃO REMOTA: Golpista orienta a instalação do AnyDesk / TeamViewer',
      'ACESSO AO BANCO: O falso técnico pede para a vítima abrir o internet banking para "verificar transações"',
      'ROUBO: O golpista usa a tela preta (black screen) para transferir o dinheiro sem que a vítima veja os números'
    ],
    howItWorks: [
      'Scripts em páginas maliciosas travam o navegador em tela cheia com mensagens alarmantes.',
      'O falso atendente com sotaque formal usa termos técnicos complexos para assustar a vítima.',
      'Pede acesso remoto ao computador ou smartphone.',
      'Abre o prompt de comando, executa comandos inofensivos e diz que são "hackers roubando dados".',
      'Induz a vítima a fazer login no banco e autorizar transferências sob pretexto de teste de segurança.'
    ],
    warningSigns: [
      'Mensagens em tela inteira afirmando que o computador foi bloqueado pela Microsoft ou Apple com número de telefone.',
      'Solicitação para instalar programas de controle remoto durante ligações de suporte que você não solicitou.',
      'Técnico que pede para você acessar o aplicativo do banco durante uma manutenção do computador.'
    ],
    commonTactics: [
      'Sons estridentes e bloqueio de teclas normais do navegador para gerar pânico.',
      'Manipulação do código HTML do internet banking para simular depósito falso antes de pedir devolução.'
    ],
    howToProtect: [
      'A Microsoft, Apple e Google NUNCA colocam números de telefone em pop-ups de erro de sistema.',
      'Se a tela travar, encerre o navegador pelo Gerenciador de Tarefas (Ctrl+Shift+Esc ou Alt+F4).',
      'NUNCA instale programas de acesso remoto solicitados por pessoas desconhecidas.'
    ],
    victimActions: [
      'Desligue imediatamente o computador da internet (remova o cabo de rede ou desligue o Wi-Fi).',
      'Entre em contato urgente com o banco por outro dispositivo para bloquear senhas e cartões.',
      'Leve o computador a um técnico de confiança para formatação e remoção do software de controle.'
    ],
    affectedPlatforms: ['Windows', 'macOS', 'Android', 'Navegadores Web'],
    sources: [
      {
        organization: 'CISA (Cybersecurity and Infrastructure Security Agency)',
        title: 'Technical Support Scams: Tactics and Mitigation Guidance',
        url: 'https://www.cisa.gov',
        publishedAt: '2025-09-18',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'CERT.br',
        title: 'Ameaças Cibernéticas: Alerta sobre Suporte Técnico Falso e Softwares Remotos',
        url: 'https://cert.br/alertas/',
        publishedAt: '2025-04-02',
        accessedAt: '2026-08-20',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-009',
    slug: 'golpe-do-falso-pagamento-em-marketplaces-olx-enjoei',
    title: 'Falso Comprovante & Interceptação de Vendas em Marketplaces',
    category: 'MARKETPLACE SCAMS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-01-22',
    lastUpdated: '2026-08-23',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-15',
    verificationStatus: 'VERIFIED',
    sourceType: 'JOURNALISM',
    summary: 'Vendedor de produtos usados recebe e-mails clonados da OLX, Mercado Livre ou Enjoei confirmando pagamento e envia o produto por aplicativo de entrega para o golpista sem receber o dinheiro.',
    overview: 'Golpe que atinge pessoas que anunciam celulares, videogames e eletrônicos. O fraudador finge ser comprador, solicita o e-mail do vendedor alegando necessidade de emissão de etiqueta e envia um e-mail falso idêntico ao da plataforma garantindo que o dinheiro foi creditado.',
    threatFlow: [
      'ANÚNCIO: Vítima anuncia iPhone por R$ 3.500 na OLX',
      'CONTATO: "Comprador" demonstra urgência e pede para negociar fora do chat ou pede o e-mail do vendedor',
      'E-MAIL FALSO: Vítima recebe e-mail de "pagamento@mercadopago-liberacoes.com" com carimbo de pago',
      'ENTREGA POR MOTOBOY: Golpista manda motorista de aplicativo buscar o aparelho no endereço do vendedor',
      'PREJUÍZO: O produto é entregue e a vítima nunca recebe o dinheiro.'
    ],
    howItWorks: [
      'O golpista insiste em pegar o número de telefone ou e-mail pessoal do vendedor.',
      'Dispara um e-mail forjado com cores, logos e texto idênticos à plataforma oficial.',
      'O e-mail diz: "Pagamento aprovado. Libere o produto com segurança pelo aplicativo de entrega".',
      'Pressiona o vendedor para entregar o produto em minutos.',
      'Após a entrega, envia outro e-mail falso exigindo taxa para desbloquear o saldo na conta.'
    ],
    warningSigns: [
      'Comprador que pede para continuar a conversa fora do chat oficial da plataforma.',
      'Exigência de e-mail pessoal do vendedor para "realizar o pagamento".',
      'E-mails de confirmação com endereços de remetente estranhos (@gmail.com, @pagamento-seguro.com).',
      'O saldo não aparece disponível no aplicativo oficial da plataforma onde o anúncio foi feito.'
    ],
    commonTactics: [
      'Uso de fotos de famílias com crianças para parecer comprador confiável.',
      'Envio rápido de motoristas de aplicativo (Uber Flash, 99 Entrega) para recolher o produto.'
    ],
    howToProtect: [
      'NUNCA passe seu e-mail ou telefone pessoal no chat da OLX, Enjoei ou Mercado Livre.',
      'Confira o status da venda e do saldo EXCLUSIVAMENTE dentro do aplicativo oficial da plataforma.',
      'Nunca confie apenas em notificações por e-mail ou mensagens de WhatsApp.'
    ],
    victimActions: [
      'Tente cancelar a corrida de entrega no aplicativo antes da entrega final ao destinatário.',
      'Guarde a placa do carro/moto da entrega e o endereço onde o produto foi solicitado.',
      'Registre Boletim de Ocorrência por estelionato e reporte a conta do comprador na plataforma.'
    ],
    affectedPlatforms: ['OLX', 'Mercado Livre', 'Enjoei', 'Uber Flash / 99 Entrega', 'E-mail'],
    sources: [
      {
        organization: 'PROCON Brasil / Guia do Consumidor',
        title: 'Alerta sobre Golpes da Falsa Confirmação de Pagamento em Plataformas de Compra e Venda',
        url: 'https://procon.sp.gov.br',
        publishedAt: '2025-08-01',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-010',
    slug: 'golpe-do-falso-leilao-de-veiculos-e-imoveis',
    title: 'Falsos Sites de Leilão de Veículos & Eletrônicos Apreendidos',
    category: 'FAKE WEBSITES',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-02-12',
    lastUpdated: '2026-08-24',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-19',
    verificationStatus: 'VERIFIED',
    sourceType: 'LAW_ENFORCEMENT',
    summary: 'Portais falsos com visual idêntico a leilões judiciais ou da Receita Federal que realizam falsos lances e emitem cartas de arrematação forjadas exigindo transferência de dezenas de milhares de reais.',
    overview: 'Quadrilhas especializadas criam cópias exatas de pátios de leiloeiros oficiais registrados em Juntas Comerciais. Veículos com fotos reais são oferecidos por 40% da tabela FIPE. Após o "arremate", a vítima paga e descobre que o pátio de retirada não existe ou nunca teve o veículo.',
    threatFlow: [
      'DIVULGAÇÃO: Anúncios patrocinados no Google com termos "leilão detran sp" ou "leilão receita"',
      'CADASTRO: Vítima envia cópia de CNH e comprovante de residência em site falso',
      'SALA DE LANCES: Robôs simulam disputa e a vítima vence o lote',
      'CARTA DE ARREMATAÇÃO: PDF com brasões falsos e nome de leiloeiro real exige pagamento via TED/Pix',
      'PREJUÍZO: Vítima vai ao endereço do pátio e descobre terreno baldio ou empresa de fachada.'
    ],
    howItWorks: [
      'Os golpistas registram domínios semelhantes como leiloes-sp-oficial.org ou detran-leilao-2026.com.',
      'Clonam fotos e dados de leilões reais em andamento.',
      'Permitem que a vítima dê lances em tempo real.',
      'Emitam termo de arrematação formal com exigência de pagamento em conta bancária de pessoa física em 24h.'
    ],
    warningSigns: [
      'Preços de carros em excelente estado 60% a 70% abaixo do valor de mercado.',
      'Dados de pagamento em nome de pessoa física ou MEI que não corresponde ao leiloeiro oficial.',
      'Impossibilidade de visitar o pátio presencialmente antes do pagamento do lote.',
      'Domínios registrados com extensões genéricas (.org, .net, .site, .vip) em vez de sites .com.br vinculados a leiloeiros da Junta Comercial.'
    ],
    commonTactics: [
      'Uso indevido do nome e número de matrícula de leiloeiros públicos oficiais reais.',
      'Pressão por pagamento sob ameaça de multa judicial de 20% sobre o valor do lance.'
    ],
    howToProtect: [
      'Consulte a lista de leiloeiros credenciados diretamente no site da Junta Comercial do seu estado (ex: JUCESP, JUCERJA).',
      'Visite o pátio presencialmente antes de dar qualquer lance financeiro.',
      'Verifique no portal leilaoseguro.org.br se o site está na lista de fraudes catalogadas.'
    ],
    victimActions: [
      'Comunique o banco imediatamente para tentar bloquear os valores enviados por TED ou Pix.',
      'Registre ocorrência na Delegacia de Defraudações e Crimes Eletrônicos da Polícia Civil.',
      'Informe o leiloeiro oficial cujo nome foi indevidamente utilizado.'
    ],
    affectedPlatforms: ['Websites Clonados', 'Google Ads', 'WhatsApp', 'TED / Pix'],
    sources: [
      {
        organization: 'Associação dos Leiloeiros Oficiais do Estado de São Paulo (AESP)',
        title: 'Guia de Prevenção a Falsos Leilões na Internet',
        url: 'https://leilaoseguro.org.br',
        publishedAt: '2025-11-20',
        accessedAt: '2026-08-20',
        type: 'OFFICIAL',
        isOfficial: true
      },
      {
        organization: 'Polícia Federal',
        title: 'Operações contra sites fraudulentos de leilão de veículos',
        url: 'https://www.gov.br/pf/pt-br',
        publishedAt: '2025-06-15',
        accessedAt: '2026-08-20',
        type: 'LAW_ENFORCEMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-011',
    slug: 'golpe-do-romance-scam-e-falso-militar-carga-alfandega',
    title: 'Estelionato Sentimental / Romance Scam & Falsa Encomenda Retida',
    category: 'ROMANCE SCAMS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-01-05',
    lastUpdated: '2026-08-20',
    geography: 'Internacional & Brasil',
    country: 'Brasil / Internacional',
    isVerified: true,
    verificationDate: '2026-08-10',
    verificationStatus: 'VERIFIED',
    sourceType: 'OFFICIAL',
    summary: 'Golpistas criam perfis atraentes em aplicativos de namoro, simulam relacionamentos afetivos de meses e alegam envio de presentes valiosos retidos na alfândega com exigência de taxas alfandegárias.',
    overview: 'Golpe baseado em manipulação psicológica e isolamento da vítima (Love Bombing). Perfis falsos usam fotos de militares estrangeiros, médicos ou engenheiros em plataformas de petróleo. Após juras de amor, alegam que despacharam uma caixa com dólares e joias e pedem que a vítima pague a liberação aduaneira.',
    threatFlow: [
      'CONTATO: Perfil atraente aborda vítima no Tinder, Instagram ou Facebook',
      'VÍNCULO AFETIVO: Semanas de conversas diárias românticas para conquistar confiança',
      'ENVIO DE PRESENTE: "Enviei uma mala com US$ 500.000 e presentes de casamento para você"',
      'FALSA TRANSPORTADORA: Falso fiscal ou empresa aérea contata exigindo taxas de R$ 3.000 a R$ 25.000',
      'EXTORSÃO CONTINUADA: Novas multas inventadas até que a vítima esgote seus recursos.'
    ],
    howItWorks: [
      'O golpista alega estar em missão de paz no exterior ou em alto mar para justificar não encontrar a vítima pessoalmente.',
      'Simula o envio de uma remessa internacional fornecendo código de rastreio de um site de frete falso.',
      'Um cúmplice se passa por despachante aduaneiro ou agente da Polícia Federal exigindo pagamento de taxas via Pix em conta de pessoa física.',
      'Se a vítima recusa, o golpista ameaça que ela será presa por crime de lavagem de dinheiro.'
    ],
    warningSigns: [
      'Declarações de amor intensas muito rápidas com pessoa que você nunca viu em chamada de vídeo.',
      'Sempre há desculpas técnicas para não ligar a câmera em tempo real.',
      'Pedido para receber pacotes misteriosos vindos do exterior com pagamento de taxas alfandegárias em contas bancárias de pessoas físicas.'
    ],
    commonTactics: [
      'Exploração de vulnerabilidades emocionais e solidão.',
      'Uso de documentos forjados com carimbos da Interpol e Nações Unidas.'
    ],
    howToProtect: [
      'NUNCA envie dinheiro para alguém que você conheceu pela internet e nunca esteve pessoalmente.',
      'A Alfândega e a Receita Federal NUNCA cobram tributos aduaneiros via Pix para contas de pessoas físicas (o pagamento oficial é feito exclusivamente via DARF gerado no portal oficial).',
      'Faça busca reversa das fotos de perfil no Google Imagens para checar se pertencem a figuras públicas.'
    ],
    victimActions: [
      'Cesse todo o contato imediatamente e bloqueie o perfil.',
      'Não se envergonhe: registre ocorrência detalhada na Delegacia de Polícia Civil com todo o histórico de conversas.',
      'Comunique o banco receptor para tentativas de bloqueio dos valores.'
    ],
    affectedPlatforms: ['Tinder', 'Bumble', 'Instagram', 'Facebook', 'WhatsApp'],
    sources: [
      {
        organization: 'Federal Bureau of Investigation (FBI)',
        title: 'Romance Scams: How to Protect Yourself from Online Dating Fraud',
        url: 'https://www.fbi.gov/how-we-can-help-you/safety-resources/scams-and-safety/common-scams-and-crimes/romance-scams',
        publishedAt: '2025-02-14',
        accessedAt: '2026-08-20',
        type: 'LAW_ENFORCEMENT',
        isOfficial: true
      },
      {
        organization: 'Ministério da Justiça e Segurança Pública (MJSP)',
        title: 'Campanha Nacional de Alerta contra o Estelionato Sentimental',
        url: 'https://www.gov.br/mj/pt-br',
        publishedAt: '2025-06-10',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-012',
    slug: 'golpe-do-sim-swap-e-troca-indevida-de-chip',
    title: 'SIM Swap (Sequestro de Linha Telefônica & Bypass de SMS 2FA)',
    category: 'ACCOUNT TAKEOVER',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-01-18',
    lastUpdated: '2026-08-21',
    geography: 'Global / Brasil',
    country: 'Brasil / Global',
    isVerified: true,
    verificationDate: '2026-08-12',
    verificationStatus: 'VERIFIED',
    sourceType: 'SECURITY_RESEARCH',
    summary: 'Criminosos transferem o número de telefone da vítima para um chip em branco com a conivência de funcionários de operadoras ou engenharia social, interceptando códigos SMS de autenticação bancária e WhatsApp.',
    overview: 'Ataque de infraestrutura de telecomunicações que neutraliza a autenticação de dois fatores baseada em SMS. Ao assumir o controle do número móvel, os invasores redefinem senhas de e-mails, acessam carteiras de cripto e instalam o WhatsApp da vítima em outro aparelho.',
    threatFlow: [
      'COLETA DE CPF: Dados obtidos em vazamentos públicos',
      'PORTABILIDADE FRAUDULENTA: Golpista solicita ativação do número em chip virgem na operadora',
      'PERDA DE SINAL: O celular da vítima fica repentinamente "Sem Serviço" ou "Apenas Chamadas de Emergência"',
      'RECUPERAÇÃO DE SENHA: O invasor solicita reset de senhas de e-mail e bancos via código SMS',
      'DANO: Contas bancárias e perfis sociais são esvaziados e sequestrados.'
    ],
    howItWorks: [
      'O atacante se passa pela vítima em lojas físicas de operadoras ou compra ativações de funcionários corrompidos.',
      'O sinal do chip real da vítima é desativado.',
      'O novo chip recebe todas as mensagens e ligações direcionadas à vítima.',
      'O golpista clica em "Esqueci minha senha" em portais bancários e recebe o código por SMS.'
    ],
    warningSigns: [
      'Seu celular fica repentinamente sem sinal de rede móvel em locais onde sempre funcionou normalmente.',
      'Recebimento de e-mail da operadora confirmando troca de chip que você não solicitou.',
      'Desconexão automática do seu WhatsApp com mensagem "Seu número foi registrado em outro aparelho".'
    ],
    commonTactics: [
      'Corrupção de funcionários internos de lojas de telefonia.',
      'Ataques rápidos na madrugada para atrasar a reação da vítima.'
    ],
    howToProtect: [
      'NUNCA utilize autenticação de dois fatores (2FA) por SMS para contas sensíveis: prefira aplicativos autenticadores (Google Authenticator, Microsoft Authenticator) ou chaves físicas (FIDO2/YubiKey).',
      'Defina um PIN de segurança no chip SIM junto à sua operadora móvel.',
      'Ative a confirmação em duas etapas no WhatsApp com PIN numérico e e-mail de recuperação.'
    ],
    victimActions: [
      'Ligue IMEDIATAMENTE para sua operadora de outro telefone para bloquear a linha por fraude.',
      'Acesse seus bancos e e-mails de um computador confiável e deslogue todas as sessões ativas.',
      'Registre Boletim de Ocorrência contra a operadora e o responsável pelo swap.'
    ],
    affectedPlatforms: ['Operadoras de Telefonia (Vivo, Claro, Tim)', 'SMS', 'WhatsApp', 'Bancos'],
    sources: [
      {
        organization: 'CISA / FBI',
        title: 'SIM Swapping Scams That Trick Mobile Carriers to Gain Access to Victim Accounts',
        url: 'https://www.cisa.gov',
        publishedAt: '2025-03-10',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'Anatel (Agência Nacional de Telecomunicações)',
        title: 'Medidas de Segurança para Prevenção ao Golpe da Troca Indevida de Chip (SIM Swap)',
        url: 'https://www.gov.br/anatel/pt-br',
        publishedAt: '2025-05-22',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-013',
    slug: 'trojans-bancarios-mobile-brasdex-e-sharkbot-android',
    title: 'Trojans Bancários Android (Brasdex, SharkBot & Falsos APKs)',
    category: 'MALWARE',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-02-08',
    lastUpdated: '2026-08-24',
    geography: 'Brasil & América Latina',
    country: 'Brasil / Global',
    isVerified: true,
    verificationDate: '2026-08-20',
    verificationStatus: 'VERIFIED',
    sourceType: 'SECURITY_RESEARCH',
    summary: 'Aplicativos maliciosos distribuídos fora da Google Play (ou disfarçados de limpadores de memória/leitores de PDF) que abusam do Serviço de Acessibilidade do Android para realizar transferências Pix invisíveis.',
    overview: 'Malwares bancários mobile avançados que utilizam sobreposição de tela (overlay attack) e automação de cliques (Accessibility Service). Quando o usuário abre o app do banco, o malware cobre a tela com uma imagem de carregamento falso enquanto transfere o saldo em segundo plano.',
    threatFlow: [
      'DOWNLOAD MALICIOSO: Vítima instala aplicativo fora da loja ("Atualização de Segurança do Banco.apk")',
      'PERMISSÃO DE ACESSIBILIDADE: O app insiste para que a vítima ative a "Acessibilidade" nas configurações',
      'MONITORAMENTO: O trojan aguarda em silêncio até a vítima abrir o app do banco real',
      'SOBREPOSIÇÃO: Uma tela preta ou de carregamento tampa a visão do usuário',
      'TRANSFERÊNCIA AUTOMATIZADA: O malware preenche a chave Pix do laranja e confirma o envio com a biometria/senha já logada'
    ],
    howItWorks: [
      'A vítima recebe SMS ou anúncio com link para baixar um suposto app de segurança ou visualizador de nota fiscal.',
      'O app solicita permissão especial de acessibilidade fingindo ser para "melhorar o desempenho da bateria".',
      'Com essa permissão, o malware lê tudo o que é digitado na tela (keylogger) e consegue simular toques automáticos.',
      'Ao identificar a abertura de um app bancário, executa transferências Pix de forma autônoma.'
    ],
    warningSigns: [
      'Aplicativo que exige ativação do "Serviço de Acessibilidade" sem motivo justificável.',
      'Links para download de arquivos terminados em ".apk" recebidos por WhatsApp ou SMS.',
      'Celular esquentando excessivamente ou travando repentinamente ao abrir o internet banking.'
    ],
    commonTactics: [
      'Disfarce de utilitários populares (calculadoras, antivírus falsos, visualizadores de PDF).',
      'Detecção de ambiente de emulador para driblar análises de segurança.'
    ],
    howToProtect: [
      'NUNCA instale aplicativos fora da Google Play Store (mantenha a opção "Fontes Desconhecidas" desativada).',
      'NUNCA conceda permissão de Acessibilidade a aplicativos utilitários simples.',
      'Mantenha o Google Play Protect ativado no seu dispositivo Android.'
    ],
    victimActions: [
      'Coloque o celular imediatamente no Modo Avião.',
      'Desinstale o aplicativo suspeito através das Configurações do Android (em Modo de Segurança se necessário).',
      'Acesse seu banco por outro computador e altere todas as senhas de acesso e transação.',
      'Se o malware persistir, restaure o smartphone para os padrões de fábrica.'
    ],
    affectedPlatforms: ['Android OS', 'Aplicativos Bancários', 'Pix'],
    sources: [
      {
        organization: 'CERT.br / NIC.br',
        title: 'Relatório Técnico: Análise de Famílias de Trojans Bancários Mobile no Brasil',
        url: 'https://cert.br/documentos/',
        publishedAt: '2025-10-14',
        accessedAt: '2026-08-20',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      },
      {
        organization: 'ThreatFabric / CSIRT',
        title: 'Mobile Banking Trojans Technical Dissection: Brasdex and Automated Transfer Systems',
        url: 'https://www.threatfabric.com',
        publishedAt: '2025-07-30',
        accessedAt: '2026-08-20',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-014',
    slug: 'golpe-do-pix-errado-e-falso-estorno-com-dupla-cobranca',
    title: 'Golpe do Pix Errado & Extorsão de Falso Estorno',
    category: 'PIX SCAMS',
    riskLevel: 'MEDIUM',
    status: 'ACTIVE',
    date: '2026-01-25',
    lastUpdated: '2026-08-20',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-16',
    verificationStatus: 'VERIFIED',
    sourceType: 'OFFICIAL',
    summary: 'Criminoso faz um Pix real de R$ 1.000 para a vítima, entra em contato desesperado pedindo devolução para outra chave Pix e em seguida aciona o MED no banco dele, ficando com o dinheiro duas vezes.',
    overview: 'Exploração de brecha no fluxo de devolução do Pix. Se a vítima fizer um Pix manual comum para devolver o dinheiro para uma chave indicada pelo golpista, o golpista aciona a devolução oficial (MED) no banco dele, estornando o valor original direto da conta da vítima.',
    threatFlow: [
      'TRANSFERÊNCIA: Vítima recebe R$ 800 de um remetente desconhecido na conta',
      'CONTATO CHOROSO: O remetente liga ou manda mensagem: "Errei o número, era o dinheiro do remédio do meu filho"',
      'CHAVE DIFERENTE: "Por favor, devolva para esta outra chave Pix da minha esposa"',
      'DEVOLUÇÃO MANUAL: A vítima, de boa-fé, faz um Pix avulso para a nova chave',
      'GOLPE DO MED: O golpista abre reclamação de fraude no banco dele contra a vítima e o banco estorna o primeiro valor também'
    ],
    howItWorks: [
      'O golpista utiliza dinheiro de origem fraudulenta para enviar à vítima.',
      'Pede a devolução para uma terceira conta para lavar o dinheiro.',
      'Ao mesmo tempo, registra contestação de fraude junto à instituição emissora.',
      'A vítima perde o valor que transferiu voluntariamente e ainda tem o saldo bloqueado pelo MED.'
    ],
    warningSigns: [
      'Pessoa desconhecida entrando em contato exigindo devolução urgente de Pix para uma chave DIFERENTE daquela que fez o envio.',
      'Pressão emocional excessiva logo após o recebimento inesperado de saldo.'
    ],
    commonTactics: [
      'Uso da boa-fé e compaixão da vítima.',
      'Utilização de contas de laranjas para intermediar as transferências.'
    ],
    howToProtect: [
      'NUNCA faça uma nova transferência manual para devolver dinheiro recebido por engano.',
      'Utilize SEMPRE a funcionalidade oficial "DEVOLVER ESTE PIX" diretamente dentro do comprovante da transação no extrato do seu aplicativo bancário (o estorno oficial devolve diretamente para a conta de origem sem risco de MED duplo).'
    ],
    victimActions: [
      'Se já devolveu por Pix manual e teve a conta bloqueada pelo MED, apresente o extrato ao seu banco provando a devolução.',
      'Abra contestação formal de contestação indevida de MED no SAC e na Ouvidoria do banco.',
      'Registre Boletim de Ocorrência por estelionato tentado/consumado.'
    ],
    affectedPlatforms: ['Pix', 'WhatsApp', 'Aplicativos Bancários'],
    sources: [
      {
        organization: 'Banco Central do Brasil',
        title: 'Como funciona a devolução correta de um Pix recebido por engano',
        url: 'https://www.bcb.gov.br/estabilidadefinanceira/perguntaserespostaspix',
        publishedAt: '2025-08-10',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-015',
    slug: 'smishing-de-falsos-pontos-expirando-livelo-e-esfera',
    title: 'Smishing de Pontos e Milhas Expirando (Livelo, Esfera & Latam)',
    category: 'SMISHING',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-02-14',
    lastUpdated: '2026-08-23',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-17',
    verificationStatus: 'VERIFIED',
    sourceType: 'OFFICIAL',
    summary: 'Disparos massivos de SMS alertando que milhares de pontos de fidelidade expiram hoje e oferecendo resgate de produtos ou dinheiro com links que roubam senhas bancárias e cartões.',
    overview: 'Uma das modalidades de phishing via SMS (Smishing) com maior volume no Brasil. Utiliza domínios registrados com nomes similares aos programas de fidelidade e telas clonadas para capturar cartões com código de segurança (CVV).',
    threatFlow: [
      'SMS ENVIADO: "AVISO: Seus 87.420 pontos Livelo expiram em 2 horas. Resgate em dinheiro: link-falso.com"',
      'ACESSO AO LINK: Página com visual exato do programa de recompensas',
      'SIMULAÇÃO DE RESGATE: O site mostra que a vítima tem R$ 2.450 a resgatar',
      'COLETA DE CARTÃO: Pede dados do cartão e senha para "creditar o valor"',
      'FRAUDE: O golpista realiza compras e assinaturas com o cartão capturado'
    ],
    howItWorks: [
      'Os golpistas compram rotas clandestinas de disparo de SMS em massa (Shortcodes piratas).',
      'O link encaminha para páginas hospedadas em servidores no exterior.',
      'O formulário pede CPF, senha de 6 dígitos, número do cartão de crédito, validade e CVV.',
      'Ao clicar em finalizar, o cartão é clonado imediatamente.'
    ],
    warningSigns: [
      'SMS informando saldo de pontos que você nem sabia que possuía.',
      'Links encurtados ou com domínios suspeitos (ex: livelo-resgate-2026.shop).',
      'Exigência de código CVV ou senha do cartão para "receber" dinheiro de recompensa.'
    ],
    commonTactics: [
      'Gatilho de perda iminente ("Expira hoje às 23:59").',
      'Campos de digitação idênticos aos de portais financeiros conhecidos.'
    ],
    howToProtect: [
      'Programas de pontos NUNCA pedem a senha do seu cartão ou o código CVV para efetuar resgate de produtos.',
      'Acesse seus pontos digitando diretamente o endereço do aplicativo oficial no celular.',
      'Nunca clique em links recebidos por SMS.'
    ],
    victimActions: [
      'Bloqueie imediatamente o cartão informado pelo aplicativo do banco.',
      'Contate a operadora do cartão para contestar transações não reconhecidas.',
      'Altere a senha do seu programa de pontos e da sua conta bancária.'
    ],
    affectedPlatforms: ['SMS', 'Navegadores Mobile', 'Cartões de Crédito'],
    sources: [
      {
        organization: 'CERT.br',
        title: 'Estatísticas e Alertas sobre Campanhas de Smishing no Brasil',
        url: 'https://cert.br/stats/',
        publishedAt: '2025-11-01',
        accessedAt: '2026-08-20',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-016',
    slug: 'qshing-golpe-do-falso-qr-code-estacionamento-e-restaurantes',
    title: 'QR Code Scams (Qshing) em Parquímetros & Contas de Mesa',
    category: 'QR CODE SCAMS',
    riskLevel: 'MEDIUM',
    status: 'ACTIVE',
    date: '2026-01-29',
    lastUpdated: '2026-08-22',
    geography: 'Brasil & Global',
    country: 'Brasil / Global',
    isVerified: true,
    verificationDate: '2026-08-15',
    verificationStatus: 'VERIFIED',
    sourceType: 'SECURITY_RESEARCH',
    summary: 'Adesivos com QR Codes maliciosos colados por cima dos códigos legítimos em totens de estacionamento, contas de restaurantes e patinetes elétricos, direcionando o pagamento para golpistas.',
    overview: 'Ataque físico-digital onde fraudadores colam etiquetas adesivas sobre QR Codes de pagamento públicos. Ao escanear para pagar o estacionamento ou a conta, a vítima é levada a um gateway de pagamento falso que rouba o dinheiro e os dados do cartão.',
    threatFlow: [
      'ADESIVAGEM: Golpistas colam adesivo milimétrico sobre o QR Code oficial de um totem',
      'LEITURA: Motorista escaneia a câmera para pagar a tarifa de R$ 15',
      'SITE FALSO: Página idêntica à concessionária do estacionamento processa o Pix para terceiro',
      'CANCELO FECHADA: O totem não reconhece o pagamento e a vítima paga novamente sem entender'
    ],
    howItWorks: [
      'A vítima aponta a câmera para um totem ou cardápio digital.',
      'O link escaneado direciona para uma URL maliciosa parecida com a original.',
      'A cobrança é realizada via Pix com beneficiário desconhecido ou página de captura de cartão.',
      'A vítima tem o valor subtraído e os dados de pagamento expostos.'
    ],
    warningSigns: [
      'Adesivo colado visivelmente sobreposto a uma placa de metal ou totem.',
      'Ao ler o QR Code, a URL exibida é encurtada ou desconhecida.',
      'Nome do beneficiário no Pix é pessoa física em vez da empresa prestadora do serviço.'
    ],
    commonTactics: [
      'Aproveitamento de locais com pouca iluminação ou grande pressa das pessoas (parquímetros).'
    ],
    howToProtect: [
      'Passe o dedo sobre o QR Code para verificar se não há adesivo colado por cima.',
      'Verifique SEMPRE a prévia da URL antes de abrir no navegador.',
      'Confira o nome da empresa antes de confirmar qualquer Pix lido por QR Code.'
    ],
    victimActions: [
      'Avise imediatamente a administração do estabelecimento para remover o adesivo fraudulento.',
      'Contate o seu banco para tentar reaver o valor via MED.',
      'Bloqueie o cartão caso tenha digitado os dados na página falsa.'
    ],
    affectedPlatforms: ['QR Codes Físicos', 'Câmeras de Celular', 'Pix'],
    sources: [
      {
        organization: 'Federal Trade Commission (FTC)',
        title: 'Scammers are using QR codes to steal your personal information: Qshing guidance',
        url: 'https://consumer.ftc.gov/consumer-alerts/2023/12/scammers-are-using-qr-codes-steal-your-personal-information',
        publishedAt: '2025-01-15',
        accessedAt: '2026-08-20',
        type: 'OFFICIAL',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-017',
    slug: 'ransomware-e-extorsao-de-dados-em-pequenas-empresas',
    title: 'Ransomware de Dupla Extorsão & Falsas Faturas em PDF/ZIP',
    category: 'RANSOMWARE',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-02-16',
    lastUpdated: '2026-08-25',
    geography: 'Global & Brasil',
    country: 'Brasil / Global',
    isVerified: true,
    verificationDate: '2026-08-21',
    verificationStatus: 'VERIFIED',
    sourceType: 'LAW_ENFORCEMENT',
    summary: 'Arquivos anexos em e-mails fingindo ser notas fiscais, faturas ou intimações judiciais que criptografam todos os arquivos da empresa e exigem resgate milionário em criptomoedas sob ameaça de vazamento LGPD.',
    overview: 'Ataque que paralisa clínicas médicas, escritórios de contabilidade e pequenas empresas. O invasor rouba os dados antes de criptografar (Dupla Extorsão) e ameaça divulgar informações confidenciais de clientes caso o resgate não seja pago em Bitcoin ou Monero.',
    threatFlow: [
      'VETOR DE ENTRADA: E-mail com anexo malicioso "Fatura_Vencida_Cobrança.zip" ou link de phishing',
      'EXECUÇÃO: Funcionário descompacta e executa o arquivo pensando ser cobrança real',
      'MOVIMENTAÇÃO LATERAL: O ransomware infecta servidores locais e discos de backup na rede',
      'EXFILTRAÇÃO & CIFRAGEM: Os arquivos são copiados para servidores no exterior e travados com senha forte',
      'NOTA DE RESGATE: Arquivo "LEIA_ME.txt" surge na área de trabalho exigindo pagamento em cripto.'
    ],
    howItWorks: [
      'O malware desativa cópias de sombra do Windows (VSS) e criptografa bancos de dados e documentos.',
      'Altera o papel de parede com instruções de contato na dark web.',
      'Os criminosos ameaçam denunciar a empresa à ANPD por vazamento de dados caso não paguem.'
    ],
    warningSigns: [
      'E-mails com anexos comprimidos (.zip, .rar, .iso) de remetentes desconhecidos.',
      'Arquivos com extensões alteradas (.locked, .enc) que não abrem nos programas normais.',
      'Lentidão extrema e atividade anormal de disco na rede da empresa.'
    ],
    commonTactics: [
      'Infiltração prévia por portas de acesso remoto desprotegidas (RDP exposto na porta 3389 sem MFA).',
      'Criptografia de backups online conectados diretamente ao servidor.'
    ],
    howToProtect: [
      'Mantenha BACKUPS OFFLINE e imutáveis (regra 3-2-1: 3 cópias, 2 mídias diferentes, 1 cópia fora da rede).',
      'Nunca abra anexos executáveis ou ative macros em documentos do Office.',
      'Implemente MFA obrigatório em todos os acessos remotos e VPNs da empresa.'
    ],
    victimActions: [
      'Isole imediatamente todos os computadores afetados da rede física e Wi-Fi.',
      'NÃO PAGUE O RESGATE (o pagamento financia o crime e não garante a chave de decifração).',
      'Consulte a iniciativa No More Ransom (nomoreransom.org) para verificar se existe decifrador gratuito para a variante.',
      'Contate empresa especializada em resposta a incidentes e notifique as autoridades competentes.'
    ],
    affectedPlatforms: ['Windows Server', 'Linux', 'Redes Corporativas', 'NAS de Backup'],
    sources: [
      {
        organization: 'CISA / FBI / NSA',
        title: '#StopRansomware Guide and Multi-Agency Mitigation Recommendations',
        url: 'https://www.cisa.gov/stopransomware',
        publishedAt: '2025-04-10',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'Europol / No More Ransom Project',
        title: 'Prevention and Decryption Tools for Victims of Ransomware Attacks',
        url: 'https://www.nomoreransom.org',
        publishedAt: '2025-06-20',
        accessedAt: '2026-08-20',
        type: 'LAW_ENFORCEMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-018',
    slug: 'golpe-da-venda-de-veiculos-financiados-com-falsa-quitacao',
    title: 'Fraude de Falso Consórcio Contemplado & Venda com Falsa Quitação',
    category: 'MARKETPLACE SCAMS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-01-30',
    lastUpdated: '2026-08-22',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-14',
    verificationStatus: 'VERIFIED',
    sourceType: 'GOVERNMENT',
    summary: 'Anúncios de cartas de consórcio contempladas ou venda de carros de repasse com entrada de R$ 5.000 e parcelas baixas onde a carta de crédito não existe e o dinheiro da entrada é retido.',
    overview: 'Golpistas alugam salas comerciais temporárias para simular escritórios de consórcios autorizados. Fazem a vítima assinar um contrato de consórcio comum enquanto prometem verbalmente que o crédito já foi contemplado e liberará o carro em 7 dias.',
    threatFlow: [
      'ANÚNCIO: Carro seminovo anunciado por preço atrativo com entrada reduzida',
      'ATENDIMENTO PRESENCIAL: Vendedor promete em gravação informal que a carta está sorteada',
      'PAGAMENTO DA ENTRADA: Vítima paga R$ 6.000 no Pix da assessoria',
      'CONTRATO REAL: O contrato assinado possui cláusula que desmente a contemplação prévia',
      'PREJUÍZO: A vítima entra em um consórcio comum sem contemplação e perde a taxa de adesão.'
    ],
    howItWorks: [
      'A empresa atrai interessados com promessa explícita de "entrega imediata do bem".',
      'No momento de assinar, dizem que é apenas uma formalidade padrão.',
      'Após o pagamento da taxa, o vendedor para de responder e a administradora real nega qualquer garantia de contemplação.'
    ],
    warningSigns: [
      'Promessa de "consórcio já contemplado" com garantia de liberação em prazo fixo.',
      'Vendedor que orienta a vítima a mentir durante a ligação de checagem da administradora.',
      'Desconto exagerado para pagamento da entrada em dinheiro ou Pix no mesmo dia.'
    ],
    commonTactics: [
      'Pressão emocional para assinar o contrato na hora ("tem outro comprador aguardando na recepção").'
    ],
    howToProtect: [
      'NÃO EXISTE consórcio com garantia prévia de contemplação por lei (Lei nº 11.795/2008).',
      'Antes de comprar uma cota contemplada de terceiros, confirme a existência e a transferência diretamente na sede da administradora autorizada pelo Banco Central.',
      'Leia todas as cláusulas do contrato com calma antes de transferir qualquer valor.'
    ],
    victimActions: [
      'Exerça o direito de arrependimento em até 7 dias se a contratação ocorreu fora do estabelecimento comercial (Art. 49 do CDC).',
      'Junte áudios, prints e anúncios para abrir queixa-crime na Delegacia do Consumidor.',
      'Acione o Procon e o Juizado Especial Cível (JEC).'
    ],
    affectedPlatforms: ['OLX', 'Facebook Marketplace', 'Escritórios Físicos Temporários'],
    sources: [
      {
        organization: 'Banco Central do Brasil',
        title: 'Alertas e Cuidados ao Adquirir Cotas de Consórcio',
        url: 'https://www.bcb.gov.br/estabilidadefinanceira/consorcios',
        publishedAt: '2025-05-18',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'Associação Brasileira de Administradoras de Consórcios (ABAC)',
        title: 'Dicas de Segurança: Golpe do Falso Consórcio Contemplado',
        url: 'https://abac.org.br',
        publishedAt: '2025-09-02',
        accessedAt: '2026-08-20',
        type: 'OFFICIAL',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-019',
    slug: 'golpe-da-venda-de-passagens-aereas-e-pacotes-fakes-em-redes-sociais',
    title: 'Falsas Agências de Turismo & Passagens Aéreas com Milhas Clonadas',
    category: 'MARKETPLACE SCAMS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-02-03',
    lastUpdated: '2026-08-21',
    geography: 'Brasil',
    country: 'Brasil',
    isVerified: true,
    verificationDate: '2026-08-16',
    verificationStatus: 'VERIFIED',
    sourceType: 'JOURNALISM',
    summary: 'Perfis no Instagram com milhares de seguidores e avaliações compradas vendem passagens aéreas e pacotes turísticos com 50% de desconto e desaparecem dias antes do embarque.',
    overview: 'Criminosos compram passagens utilizando cartões de crédito clonados ou milhas roubadas. A vítima recebe o localizador real no início, mas a companhia aérea cancela o bilhete por fraude dias depois, deixando a vítima desamparada no aeroporto.',
    threatFlow: [
      'PERFIL FALSO: Página no Instagram com fotos de viagens paradisíacas e influenciadores patrocinados',
      'ORÇAMENTO RÁPIDO: Atendimento cortês por WhatsApp enviando cotação de passagens por metade do preço',
      'PAGAMENTO: Pagamento via Pix com CNPJ de empresa recém-aberta',
      'EMISSÃO FRAUDULENTA: Golpista emite bilhete com cartão de terceiro clonado',
      'CANCELAMENTO: A companhia aérea identifica a fraude e cancela a reserva antes do voo.'
    ],
    howItWorks: [
      'A vítima faz o Pix acreditando estar comprando com uma agência de milhas com desconto.',
      'O golpista embolsa o dinheiro limpo do Pix.',
      'Gera a passagem usando cartões fraudados.',
      'O titular real do cartão contesta a compra e o bilhete é sumariamente cancelado.'
    ],
    warningSigns: [
      'Passagens aéreas internacionais com mais de 50% de desconto em relação aos sites oficiais das companhias.',
      'Agência que exige pagamento exclusivamente via Pix ou transferência bancária.',
      'Perfis de turismo com comentários bloqueados ou com postagens feitas todas no mesmo mês.'
    ],
    commonTactics: [
      'Compra de seguidores falsos e postagens com influenciadores sem ciência da fraude.',
      'Ofertas em períodos de alta temporada (Férias, Carnaval, Réveillon).'
    ],
    howToProtect: [
      'Consulte o cadastro da agência de viagens no CADASTUR (Ministério do Turismo).',
      'Verifique o tempo de existência do CNPJ da empresa no portal da Receita Federal.',
      'Desconfie de valores excessivamente abaixo do padrão de mercado das próprias companhias aéreas.'
    ],
    victimActions: [
      'Consulte a companhia aérea para checar o status e motivo do cancelamento do bilhete.',
      'Registre Boletim de Ocorrência na Delegacia de Crimes Cibernéticos.',
      'Acione o Procon e reporte a conta e o CNPJ fraudulento nas redes sociais.'
    ],
    affectedPlatforms: ['Instagram', 'WhatsApp', 'Companhias Aéreas (Gol, Latam, Azul)'],
    sources: [
      {
        organization: 'Ministério do Turismo (CADASTUR)',
        title: 'Como verificar se uma agência de viagens é regular e segura',
        url: 'https://cadastur.turismo.gov.br',
        publishedAt: '2025-07-15',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      },
      {
        organization: 'Procon-SP',
        title: 'Alerta sobre compra de pacotes de viagens e passagens pela internet',
        url: 'https://www.procon.sp.gov.br',
        publishedAt: '2025-12-05',
        accessedAt: '2026-08-20',
        type: 'GOVERNMENT',
        isOfficial: true
      }
    ]
  },
  {
    id: 'scam-020',
    slug: 'golpe-da-vulnerabilidade-de-dados-vazados-e-extorsao-por-doxxing',
    title: 'Extorsão Baseada em Dados Vazados (Doxxing & Sextortion Fictícia)',
    category: 'SOCIAL ENGINEERING',
    riskLevel: 'MEDIUM',
    status: 'ACTIVE',
    date: '2026-02-11',
    lastUpdated: '2026-08-24',
    geography: 'Global & Brasil',
    country: 'Brasil / Global',
    isVerified: true,
    verificationDate: '2026-08-19',
    verificationStatus: 'VERIFIED',
    sourceType: 'OFFICIAL',
    summary: 'E-mails contendo uma senha real antiga da vítima (obtida em vazamentos históricos) afirmando que a webcam do computador foi hackeada e gravou vídeos íntimos, exigindo Bitcoin para não divulgar aos contatos.',
    overview: 'Golpe massivo de engenharia social conhecido como Fake Sextortion. Os fraudadores não possuem nenhum vídeo ou acesso à câmera da vítima: eles apenas cruzam listas públicas de credenciais vazadas na Dark Web e inserem uma senha real antiga no assunto do e-mail para causar choque e terror psicológico.',
    threatFlow: [
      'EMAIL INTIMIDATÓRIO: Assunto: "Eu sei sua senha: [SuaSenhaAntiga2021]"',
      'HISTÓRIA FORJADA: "Instalei um malware Pegasus no seu computador e gravei você em sites adultos"',
      'EXIGÊNCIA DE RESGATE: "Transfira US$ 1.000 em Bitcoin para a carteira X em 48 horas ou envio o vídeo para todos seus contatos"',
      'CONTAGEM REGRESSIVA: Uso de ameaças psicológicas para que a vítima pague sem consultar ninguém'
    ],
    howItWorks: [
      'Disparos automatizados de milhões de e-mails usando bancos de dados de vazamentos antigos de grandes empresas.',
      'O sistema insere o nome, CPF ou senha vazada no texto.',
      'Não há nenhum vírus ou imagem gravada no dispositivo da vítima.',
      'Muitas pessoas pagam por medo ou vergonha sem checar a veracidade.'
    ],
    warningSigns: [
      'E-mail genérico afirmando possuir gravações de câmera sem fornecer nenhuma prova visual real.',
      'Exigência de pagamento exclusivamente em carteira anônima de Bitcoin.',
      'A senha citada é antiga e já foi trocada há anos.'
    ],
    commonTactics: [
      'Uso de spoofing para fazer parecer que o e-mail foi enviado da própria conta da vítima.'
    ],
    howToProtect: [
      'NÃO ENTRE EM PÂNICO: O golpista NÃO tem vídeos nem acesso à sua câmera.',
      'Consulte se seu e-mail esteve em vazamentos no site oficial HaveIBeenPwned (haveibeenpwned.com).',
      'Troque as senhas de contas que ainda utilizavam aquela combinação antiga e ative a autenticação em duas etapas (2FA).'
    ],
    victimActions: [
      'NUNCA transfira criptomoedas ou responda ao e-mail do criminoso.',
      'Marque o e-mail como Spam/Tentativa de Phishing no seu provedor.',
      'Caso utilize câmera externa, utilize uma tampa física de privacidade (webcam cover) para tranquilidade psicológica.'
    ],
    affectedPlatforms: ['E-mail (Outlook, Gmail, Yahoo)', 'Bitcoin', 'Vazamentos de Credenciais'],
    sources: [
      {
        organization: 'CERT.br / NIC.br',
        title: 'Alerta sobre E-mails de Extorsão Sexual Falsa (Sextortion Phishing)',
        url: 'https://cert.br/docs/seg-internet/',
        publishedAt: '2025-03-22',
        accessedAt: '2026-08-20',
        type: 'SECURITY_RESEARCH',
        isOfficial: true
      },
      {
        organization: 'Federal Trade Commission (FTC)',
        title: 'How to handle blackmail and sextortion email scams',
        url: 'https://consumer.ftc.gov/articles/how-handle-blackmail-scams',
        publishedAt: '2025-08-12',
        accessedAt: '2026-08-20',
        type: 'OFFICIAL',
        isOfficial: true
      }
    ]
  }
];
