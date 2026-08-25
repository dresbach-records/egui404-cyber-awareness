import { ScamItem } from '../types';

export const SCAMS_DATA: ScamItem[] = [
  {
    id: 'scam-001',
    slug: 'falso-investimento-cripto-renda-fixa',
    title: 'Falso Investimento com Retorno Garantido (Cripto & Robôs de Pix)',
    category: 'FAKE INVESTMENTS',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-08-20',
    lastUpdated: '2026-08-24',
    summary: 'Plataformas falsas que prometem lucros diários astronômicos de 5% a 30% via supostos robôs de investimento, arbitragem de criptomoedas ou operações automatizadas com Pix.',
    howItWorks: [
      'Vítima é atraída por anúncios patrocinados em redes sociais ou convidada para grupos no Telegram/WhatsApp exibindo capturas de tela com falsos lucros.',
      'A plataforma exibe um painel visual (dashboard falso) que simula saldos crescendo rapidamente para gerar confiança.',
      'No primeiro teste de valor baixo (R$ 50 - R$ 100), os golpistas permitem um saque inicial com sucesso para consolidar a credibilidade.',
      'Quando a vítima deposita valores maiores (R$ 2.000 a R$ 50.000), o saque é bloqueado e novas taxas fictícias (IOF, taxa de liberação, imposto de resgate) são exigidas até o contato ser cortado.'
    ],
    warningSigns: [
      'Promessas de "lucro garantido" e rentabilidade fixa exorbitante sem risco de mercado.',
      'Pressão por urgência ("Vagas limitadas para o robô VIP encerram hoje").',
      'Conta de destino do Pix em nome de pessoa física (laranja) ou intermediadora de pagamento desconhecida.',
      'Cobrança de novas taxas antecipadas para desbloquear ou sacar o próprio saldo.'
    ],
    commonTactics: [
      'Uso de depoimentos falsos e vídeos gerados por IA de supostos investidores de sucesso.',
      'Grupos de mensagens fechados onde apenas administradores publicam comprovantes forjados.',
      'Aparência visual clonada de corretoras famosas ou bancos com pequenas variações de URL.'
    ],
    howToProtect: [
      'Desconfie imediatamente de qualquer promessa de rendimento acima da taxa básica de juros (Selic) sem oscilação de risco.',
      'Consulte sempre o CNPJ da corretora no site oficial da CVM (Comissão de Valores Mobiliários) e Banco Central.',
      'Nunca realize transferências para contas bancárias de pessoas físicas ao operar com corretoras de investimento.',
      'Não pague taxas extras para sacar o seu próprio dinheiro: corretoras legítimas debitam taxas operacionais diretamente do saldo.'
    ],
    victimActions: [
      'Interrompa imediatamente qualquer novo envio de dinheiro, independentemente de ameaças de perda da conta.',
      'Faça capturas de tela de todas as conversas, números de telefone, endereços de sites e chaves Pix.',
      'Registre um Boletim de Ocorrência (B.O.) na Delegacia de Crimes Cibernéticos ou delegacia virtual da Polícia Civil.',
      'Contate imediatamente o seu banco solicitando o Mecanismo Especial de Devolução (MED) do Pix dentro do prazo regulamentar.'
    ],
    affectedPlatforms: ['Telegram', 'Instagram', 'WhatsApp', 'YouTube Ads', 'TikTok'],
    sources: [
      { title: 'Alerta da CVM sobre Golpes de Criptoativos', sourceType: 'OFFICIAL_ALERT' },
      { title: 'Boletim FEBRABAN sobre Fraudes de Falsos Investimentos', sourceType: 'SECURITY_BULLETIN' }
    ]
  },
  {
    id: 'scam-002',
    slug: 'golpe-do-whatsapp-clone-e-falso-perfil',
    title: 'Falso Perfil de WhatsApp (Foto e Número Novo)',
    category: 'WHATSAPP FRAUD',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-08-18',
    lastUpdated: '2026-08-25',
    summary: 'Criminosos obtêm foto e dados públicos de uma pessoa e contatam amigos e familiares usando um número novo, alegando que o celular quebrou e solicitando dinheiro urgente via Pix.',
    howItWorks: [
      'Os fraudadores coletam a foto de perfil e nomes de parentes por meio de vazamentos de dados ou redes sociais abertas.',
      'Cadastram uma conta no WhatsApp com um chip descartável, aplicando a foto da vítima.',
      'Enviam mensagens a familiares (especialmente pais ou avós) com frases típicas: "Oi mãe, troquei de número, anota o novo aí".',
      'Minutos depois, criam uma emergência ("O app do banco está travado no celular novo, você pode pagar esse boleto ou fazer esse Pix pra mim que te devolvo amanhã?").'
    ],
    warningSigns: [
      'Mensagem vinda de número desconhecido afirmando ser familiar próximo usando foto real.',
      'História de urgência financeira repentina envolvendo pagamento de conta ou fornecedor.',
      'Recusa em receber chamadas de áudio ou vídeo ("o microfone/câmera quebrou").',
      'Conta de destino do Pix em nome de terceiro completamente desconhecido.'
    ],
    commonTactics: [
      'Engenharia social emocional explorando a preocupação com entes queridos.',
      'Pesquisa prévia de laços de parentesco em perfis públicos do Instagram/Facebook.',
      'Mensagens com tom carinhoso e vocabulário convincente para imitar a vítima.'
    ],
    howToProtect: [
      'Nunca transfira valores antes de ligar diretamente para o NÚMERO ANTIGO da pessoa ou fazer uma chamada de vídeo.',
      'Combine uma "palavra de segurança" em família para autenticar pedidos emergenciais.',
      'Oculte a visualização da foto do WhatsApp para pessoas que não estão na sua lista de contatos.',
      'Ative a Confirmação em Duas Etapas com PIN de 6 dígitos no WhatsApp e cadastre um e-mail de recuperação.'
    ],
    victimActions: [
      'Se realizou o Pix, acione o MED (Mecanismo Especial de Devolução) no app do seu banco nos primeiros minutos.',
      'Avise a pessoa real imediatamente para que ela publique alertas em suas redes sociais.',
      'Denuncie a conta no próprio aplicativo do WhatsApp (Menu > Mais > Denunciar).',
      'Registre Boletim de Ocorrência anexando as chaves Pix e comprovantes de transação.'
    ],
    affectedPlatforms: ['WhatsApp', 'Instagram', 'SMS'],
    sources: [
      { title: 'Guia de Segurança WhatsApp & FEBRABAN', sourceType: 'OFFICIAL_ALERT' },
      { title: 'Delegacia Especializada de Investigações Criminais (DEIC)', sourceType: 'SECURITY_BULLETIN' }
    ]
  },
  {
    id: 'scam-003',
    slug: 'falsa-central-de-atendimento-bancaria',
    title: 'Falsa Central Telefônica e Suposta Fraude na Conta',
    category: 'FAKE SUPPORT',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-08-15',
    lastUpdated: '2026-08-23',
    summary: 'A vítima recebe SMS ou ligação afirmando que uma compra de alto valor foi aprovada no cartão ou Pix e solicita cancelamento urgente discando para um número 0800 falso ou falando com um atendente falso.',
    howItWorks: [
      'SMS fraudulento avisa: "Compra aprovada nas Casas Bahia R$ 4.890,00. Se não reconhece, ligue 0800-XXX-XXXX".',
      'A vítima liga assustada e cai em uma URA (Unidade de Resposta Audível) profissional com música do banco e menu interativo.',
      'O falso atendente confirma dados básicos já vazados da vítima e diz que a conta foi invadida.',
      'Para "proteger o saldo" ou "cancelar a invasão", o golpista orienta a vítima a transferir o dinheiro para uma "conta cofre/segura do Banco Central" ou instalar um app de acesso remoto (AnyDesk, TeamViewer).'
    ],
    warningSigns: [
      'SMS de banco contendo número 0800 com finalidade de contato para cancelamento de compra.',
      'Atendente solicitando que você digite senhas bancárias, envie código SMS/token ou faça transferências para "estornar".',
      'Solicitação para baixar qualquer aplicativo de "suporte", "segurança" ou "módulo de proteção".',
      'Urgência agressiva afirmando que se você desligar a ligação o dinheiro será perdido para sempre.'
    ],
    commonTactics: [
      'Spoofing de identificador de chamadas (Caller ID Spoofing) fazendo parecer que a ligação parte do número real do banco.',
      'Gravações e vozes profissionais com trilha sonora idêntica à do atendimento bancário.',
      'Manipulação psicológica para induzir estado de pânico e reduzir o raciocínio crítico.'
    ],
    howToProtect: [
      'Bancos NUNCA pedem transferências de segurança ou Pix para "cancelar transações" ou estornar valores.',
      'Bancos NUNCA ligam pedindo para instalar aplicativos auxiliares ou módulos de acesso remoto.',
      'Se receber alerta de compra suspeita, DESLIGUE A LIGAÇÃO e abra o app oficial do seu banco ou use o número do verso do seu cartão físico.'
    ],
    victimActions: [
      'Desligue imediatamente a chamada.',
      'Abra o aplicativo oficial do banco por dispositivo seguro e bloqueie temporariamente seus cartões e limites de Pix.',
      'Contate a central oficial do banco (número do cartão) informando a tentativa de fraude.',
      'Se instalou algum software de acesso remoto no celular ou PC, desinstale-o imediatamente e desconecte o aparelho da internet.'
    ],
    affectedPlatforms: ['Voz (Telefonia)', 'SMS', 'AnyDesk', 'TeamViewer'],
    sources: [
      { title: 'Alerta Oficial FEBRABAN: Golpe da Falsa Central', sourceType: 'OFFICIAL_ALERT' },
      { title: 'Portal de Segurança do Banco Central do Brasil', sourceType: 'SECURITY_BULLETIN' }
    ]
  },
  {
    id: 'scam-004',
    slug: 'golpe-do-pix-agendado-e-comprovante-falso',
    title: 'Comprovante Pix Falso e Golpe do Pix Agendado',
    category: 'PIX SCAMS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-08-10',
    lastUpdated: '2026-08-22',
    summary: 'Comprador fraudulento envia comprovante de Pix manipulado graficamente ou realiza um Pix Agendado, cancelando a operação logo após receber o produto de vendedores em marketplaces.',
    howItWorks: [
      'Criminoso demonstra interesse urgente em comprar um item anunciado (eletrônico, videogame, veículo).',
      'Agenda uma transferência Pix para data futura ou edita um comprovante digital alterando nomes, valores e horários.',
      'Envia o PDF ou print do comprovante para o vendedor e solicita envio imediato via motoboy ou retirada urgente.',
      'Assim que o produto é entregue, o golpista cancela o agendamento no banco ou some, deixando o vendedor sem o valor e sem o bem.'
    ],
    warningSigns: [
      'Comprovante com termo "Agendamento de Pix" ao invés de "Comprovante de Transferência Pix Concluída".',
      'Variações de fontes, espaçamento desalinhado ou artefatos visuais no PDF/imagem do comprovante.',
      'Pressão extrema para liberar o produto antes da conferência no extrato da conta bancária.',
      'Comprador que se recusa a esperar o dinheiro constar no saldo disponível do vendedor.'
    ],
    commonTactics: [
      'Envio de motoristas de aplicativo ou terceiros para retirar a mercadoria, dificultando a identificação.',
      'Alegação de que "o Pix demora alguns minutos por instabilidade do Banco Central".'
    ],
    howToProtect: [
      'REGRA DE OURO: Só entregue qualquer mercadoria após abrir o seu próprio app bancário e confirmar o saldo creditado.',
      'Nunca confie em fotos, prints ou PDFs de comprovantes enviados por terceiros.',
      'Verifique se a transação aparece no extrato como concluída e não como agendamento pendente.'
    ],
    victimActions: [
      'Comunique o marketplace e a plataforma de transporte/entrega para tentar bloquear o frete em andamento.',
      'Guarde todas as mensagens e dados do falso comprador para lavratura de Boletim de Ocorrência.',
      'Informe o seu banco e a instituição emissora do comprovante fraudado.'
    ],
    affectedPlatforms: ['OLX', 'Mercado Livre', 'Facebook Marketplace', 'WhatsApp'],
    sources: [
      { title: 'Recomendações do Banco Central sobre Validação de Pix', sourceType: 'OFFICIAL_ALERT' }
    ]
  },
  {
    id: 'scam-005',
    slug: 'phishing-de-falsas-encomendas-e-taxas-alfandegarias',
    title: 'Phishing de Encomendas Retidas e Falsa Taxa Postal',
    category: 'PHISHING',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-08-05',
    lastUpdated: '2026-08-24',
    summary: 'Disparos massivos de SMS e e-mails simulando Correios ou Receita Federal alertando sobre encomenda com "taxação pendente de liberação", direcionando para páginas falsas com pagamento Pix imediato.',
    howItWorks: [
      'Mensagem de SMS automatizada alega: "Sua encomenda possui pendência na alfândega. Pague a taxa de R$ 37,90 para evitar a devolução".',
      'O link encaminha para uma página clonada dos Correios ou portal governamental com layout quase perfeito.',
      'A página gera um QR Code Pix dinâmico para uma empresa intermediadora de pagamento fictícia.',
      'O pagamento é desviado para os criminosos e o site sequer possui registro da encomenda real.'
    ],
    warningSigns: [
      'Links encurtados ou domínios estranhos (ex: `correios-rastreio-taxa.xyz`, `gov-taxas.online`).',
      'Ameaça de devolução ou destruição da encomenda em 24/48 horas.',
      'Cobrança de taxa com geração exclusiva de Pix para CNPJs desconhecidos.',
      'Você não fez compras recentes ou o código de rastreamento não existe no app oficial.'
    ],
    commonTactics: [
      'Uso dos logotipos oficiais e certificados HTTPS válidos para induzir falsa sensação de segurança.',
      'Aproveitamento de datas de grande volume de compras (Black Friday, Natal, promoções de importação).'
    ],
    howToProtect: [
      'Acesse SEMPRE o site oficial digitando manualmente no navegador (`correios.com.br` ou `gov.br/receitafederal`).',
      'Utilize o aplicativo oficial dos Correios e consulte o ambiente oficial "Minhas Importações".',
      'Nunca clique em links recebidos via SMS contendo supostas cobranças postais.'
    ],
    victimActions: [
      'Acione o MED no seu banco para o Pix realizado.',
      'Denuncie o link falso ao CERT.br (`mail-abuse@cert.br`) e aos serviços de proteção de navegadores (Google Safe Browsing).',
      'Monitore seus dados caso tenha digitado CPF ou endereço na página fraudulenta.'
    ],
    affectedPlatforms: ['SMS', 'WhatsApp', 'Email', 'Correios (Impersonation)'],
    sources: [
      { title: 'Alerta dos Correios sobre Mensagens Falsas e Phishing', sourceType: 'OFFICIAL_ALERT' },
      { title: 'CERT.br / NIC.br - Alertas de Phishing', sourceType: 'RESEARCH_REPORT' }
    ]
  },
  {
    id: 'scam-006',
    slug: 'golpe-da-vaga-de-emprego-falsa-avaliador-de-midias',
    title: 'Falsas Vagas de Emprego (Avaliador de Produtos e Tarefas Pagas)',
    category: 'FAKE JOBS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-07-28',
    lastUpdated: '2026-08-21',
    summary: 'Propostas de trabalho remoto fácil prometendo salários de R$ 300 a R$ 2.000 por dia para curtir vídeos no YouTube, avaliar produtos em e-commerce ou seguir contas no Instagram.',
    howItWorks: [
      'Recrutadores falsos entram em contato pelo WhatsApp/Telegram fingindo representar grandes empresas (Amazon, Shopee, Mercado Livre).',
      'Dão tarefas simples e pagam R$ 10 a R$ 30 no início para provar que o trabalho é real.',
      'Para desbloquear tarefas de "nível VIP" com remuneração maior, a vítima precisa fazer um "depósito de garantia".',
      'Os valores exigidos aumentam progressivamente até a vítima não conseguir pagar e ser bloqueada sem reembolso.'
    ],
    warningSigns: [
      'Ofertas de renda altíssima para tarefas triviais sem qualquer exigência de qualificação ou entrevista.',
      'Exigência de pagamento ou investimento financeiro para começar a trabalhar ou subir de nível.',
      'Comunicação realizada exclusivamente por Telegram/WhatsApp por números internacionais (+62, +234, +1).',
      'Falta de contrato formal, CNPJ e processo seletivo estruturado.'
    ],
    commonTactics: [
      'Gatilho da reciprocidade (pagam um valor simbólico primeiro para ganhar a confiança).',
      'Estrutura em pirâmide de tarefas gamificadas para manter a vítima engajada.'
    ],
    howToProtect: [
      'Empresas sérias JAMAIS cobram taxas, depósitos ou garantias financeiras de candidatos a vagas de emprego.',
      'Desconfie de remunerações fora da realidade do mercado para trabalhos simplificados.',
      'Verifique a página oficial de carreiras da empresa mencionada no LinkedIn ou site institucional.'
    ],
    victimActions: [
      'Pare imediatamente de transferir qualquer valor adicional para "desbloqueio de comissões".',
      'Reúna capturas de tela das conversas, carteiras/chaves de pagamento e contatos.',
      'Registre ocorrência policial e solicite estorno ao banco via mecanismo MED.'
    ],
    affectedPlatforms: ['Telegram', 'WhatsApp', 'Instagram', 'TikTok'],
    sources: [
      { title: 'Ministério do Trabalho e Emprego - Alertas de Falsas Vagas', sourceType: 'OFFICIAL_ALERT' }
    ]
  },
  {
    id: 'scam-007',
    slug: 'golpe-do-amor-romance-scam-e-catfishing',
    title: 'Golpe do Amor / Romance Scam (Catfishing e Falsa Herança)',
    category: 'ROMANCE SCAMS',
    riskLevel: 'CRITICAL',
    status: 'MONITORED',
    date: '2026-07-15',
    lastUpdated: '2026-08-19',
    summary: 'Manipulação emocional continuada em aplicativos de namoro e redes sociais, onde o criminoso constrói um relacionamento amoroso virtual para extrair vultosas quantias financeiras sob falsos pretextos.',
    howItWorks: [
      'Criminoso adota personagem atraente e respeitável (militar no exterior, médico voluntário, engenheiro offshore).',
      'Dedica semanas ou meses trocando mensagens diárias carinhosas, conquistando a confiança e vulnerabilidade da vítima.',
      'Planeja um encontro presencial ou envio de uma caixa de presentes de alto valor com joias/dinheiro.',
      'Cria uma crise súbita: o pacote ficou retido na alfândega, ou houve um acidente grave e precisa de dinheiro urgente para taxas ou despesas hospitalares.'
    ],
    warningSigns: [
      'Declarações de amor intensas muito rápidas ("Love Bombing").',
      'A pessoa nunca pode fazer videochamada ao vivo ou sempre há problemas técnicos e desculpas.',
      'Situações de emergência constante envolvendo pedidos de transferência internacional ou criptomoedas.',
      'Histórias dramáticas sobre herança bloqueada, passagens aéreas retidas ou prisão no exterior.'
    ],
    commonTactics: [
      'Isolamento da vítima de familiares e amigos ("nosso amor precisa ser segredo").',
      'Uso de fotos e identidades roubadas de influenciadores ou militares estrangeiros.'
    ],
    howToProtect: [
      'Faça busca reversa de imagem no Google Lens das fotos do pretendente.',
      'Exija uma chamada de vídeo em tempo real com movimento antes de qualquer envolvimento financeiro.',
      'NUNCA envie dinheiro, presentes caros ou dados bancários para alguém que você nunca conheceu pessoalmente.'
    ],
    victimActions: [
      'Corte todo e qualquer contato com o estelionatário imediatamente.',
      'Converse com familiares de confiança ou psicólogo para suporte emocional sem sentimento de culpa.',
      'Formalize queixa-crime na Polícia Civil munido do histórico de conversas e transações.'
    ],
    affectedPlatforms: ['Tinder', 'Bumble', 'Instagram', 'Facebook', 'Inner Circle'],
    sources: [
      { title: 'Interpol & FBI IC3: Romance Scams Intelligence Report', sourceType: 'RESEARCH_REPORT' }
    ]
  },
  {
    id: 'scam-008',
    slug: 'golpe-do-falso-emprestimo-com-taxa-antecipada',
    title: 'Falso Empréstimo com Exigência de Taxa Antecipada',
    category: 'FAKE LOANS',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-07-02',
    lastUpdated: '2026-08-20',
    summary: 'Criminosos atraem pessoas negativadas ou em vulnerabilidade financeira oferecendo crédito fácil sem consulta ao SPC/Serasa, mas exigindo pagamento prévio de taxas de avalista, cartório ou seguro.',
    howItWorks: [
      'Vítima pesquisa por empréstimo para negativados e encontra anúncios ou recebe mensagens no WhatsApp.',
      'O empréstimo de R$ 5.000 a R$ 50.000 é "aprovado imediatamente" com parcelas baixas.',
      'Antes de liberar o montante, o golpista diz que é obrigatório pagar "IOF antecipado", "Taxa de fiador" ou "Desbloqueio de score".',
      'Após o primeiro pagamento, surgem novas exigências inventadas e o empréstimo nunca é creditado.'
    ],
    warningSigns: [
      'Crédito com juros baixíssimos para pessoas com restrição no nome sem qualquer garantia real.',
      'Exigência de depósito ou Pix prévio para liberação do dinheiro emprestado.',
      'Uso de CNPJs de financeiras conhecidas porém com chave Pix de titular pessoa física.'
    ],
    commonTactics: [
      'Envio de contratos falsos com brasões oficiais da República e carimbos fictícios de cartório.',
      'Ameaça de processo judicial ou bloqueio de CPF se a vítima desistir após a suposta "aprovação".'
    ],
    howToProtect: [
      'REGRA INEGOCIÁVEL: Nenhuma instituição financeira regulamentada pelo Banco Central cobra taxa antecipada para conceder empréstimo.',
      'Custos operacionais e IOF são sempre embutidos no valor financiado e diluídos nas parcelas futuras.',
      'Verifique a lista oficial de instituições autorizadas no portal do Banco Central do Brasil.'
    ],
    victimActions: [
      'Não pague qualquer valor adicional.',
      'Abra reclamação no Banco Central do Brasil caso tenham utilizado dados de correspondente bancário real.',
      'Registre B.O. por estelionato e solicite devolução via MED no banco de origem.'
    ],
    affectedPlatforms: ['Google Search Ads', 'WhatsApp', 'Sites Falsos de Crédito'],
    sources: [
      { title: 'Banco Central do Brasil: Alerta de Fraudes em Operações de Crédito', sourceType: 'OFFICIAL_ALERT' }
    ]
  },
  {
    id: 'scam-009',
    slug: 'infostealers-e-malware-de-resgate-financeiro',
    title: 'Infostealers (Malwares Ladrões de Senhas e Sessões de Navegador)',
    category: 'MALWARE',
    riskLevel: 'CRITICAL',
    status: 'ACTIVE',
    date: '2026-06-20',
    lastUpdated: '2026-08-25',
    summary: 'Softwares maliciosos (RedLine, Lumma, Vidar) distribuídos através de cracks de jogos, ativadores piratas de programas ou arquivos anexos falsos que extraem senhas salvas, cookies de sessão e carteiras cripto.',
    howItWorks: [
      'Usuário faz download de suposto software pirata, cheat de jogo, mod ou PDF enviado em e-mail de falsa cobrança.',
      'O arquivo executável roda em segundo plano sem disparar alertas visuais óbvios.',
      'O malware extrai senhas salvas no Google Chrome/Firefox/Edge, cookies de sessão ativa (Session Hijacking) e tokens de autenticação.',
      'Os dados são compactados e enviados para servidores de comando e controle (C2) dos cibercriminosos.'
    ],
    warningSigns: [
      'Notificações de logins desconhecidos em contas do Google, Steam, Discord ou redes sociais sem você ter feito login.',
      'Downloads com extensões duplas (ex: `fatura_agosto.pdf.exe` ou arquivos `.zip` protegidos por senha em fóruns).',
      'Desativação súbita do antivírus ou do Windows Defender por instaladores de jogos.',
      'Canais do YouTube ou perfis de redes sociais começam a postar transmissões de criptomoedas automaticamente.'
    ],
    commonTactics: [
      'Técnicas de evasão de antivírus empacotando código malicioso em arquivos polimórficos.',
      'Compra de anúncios no Google Ads para colocar sites com malwares nos primeiros resultados de busca por termos como "Download Photoshop", "Baixar Driver".'
    ],
    howToProtect: [
      'NUNCA baixe ativadores de programas, geradores de seriais ou softwares crackeados.',
      'Utilize gerenciador de senhas dedicado (ex: Bitwarden, 1Password) com cofre criptografado em vez de salvar senhas no navegador.',
      'Mantenha o sistema operacional e antivírus atualizados com proteção em tempo real ativada.',
      'Adote chaves de segurança FIDO2 / Passkeys ou autenticadores TOTP para neutralizar roubo de senha.'
    ],
    victimActions: [
      'Desconecte o computador infectado da internet imediatamente.',
      'Por outro dispositivo sabidamente limpo (celular seguro), acesse suas contas e encerre todas as sessões ativas ("Sair de todos os dispositivos").',
      'Troque as senhas de todas as contas prioritárias (e-mail principal, bancos, gerenciador de senhas) e ative MFA.',
      'Execute uma varredura completa com antivírus atualizado ou formate o sistema operacional.'
    ],
    affectedPlatforms: ['Windows', 'macOS', 'Google Chrome', 'Firefox', 'Discord', 'Steam'],
    sources: [
      { title: 'Boletim Técnico sobre Infostealers - MITRE ATT&CK Framework', sourceType: 'RESEARCH_REPORT' }
    ]
  },
  {
    id: 'scam-010',
    slug: 'account-takeover-sim-swap-e-sequestro-de-redes',
    title: 'SIM Swap (Clonagem de Chip) e Sequestro de Contas (ATO)',
    category: 'ACCOUNT TAKEOVER',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    date: '2026-06-10',
    lastUpdated: '2026-08-18',
    summary: 'Criminosos transferem o número de telefone da vítima para um chip sob controle deles junto à operadora, interceptando códigos SMS de autenticação e tomando posse de e-mails, bancos e redes sociais.',
    howItWorks: [
      'Fraude na operadora telefônica (via funcionário cúmplice ou engenharia social) transfere a linha da vítima para um novo cartão SIM.',
      'O celular da vítima perde o sinal telefônico repentinamente ("Sem serviço" ou "Apenas chamadas de emergência").',
      'O criminoso usa o número para redefinir senhas esquecidas de contas digitais usando o código SMS como segundo fator.',
      'Com o acesso ao e-mail ou Instagram, o criminoso altera o e-mail de recuperação e passa a aplicar golpes nos contatos da vítima.'
    ],
    warningSigns: [
      'Perda súbita de sinal do celular em local com cobertura normal de operadora.',
      'Recebimento de e-mails de alerta informando "Senha alterada" ou "Código de recuperação solicitado".',
      'Amigos avisando que seu perfil está postando promoções de Pix ou venda fictícia de eletrodomésticos.'
    ],
    commonTactics: [
      'Suborno de terceirizados em operadoras ou uso de documentos falsificados.',
      'Ataque concentrado de madrugada para atrasar a percepção da vítima.'
    ],
    howToProtect: [
      'NUNCA utilize SMS como segundo fator de autenticação (MFA). Prefira aplicativos autenticadores (Google Authenticator, Microsoft Authenticator) ou Passkeys.',
      'Cadastre senha de atendimento ou PIN de segurança na sua operadora de telefonia para bloquear transferências não autorizadas de chip.',
      'Utilize e-mails dedicados e blindados para recuperação de contas críticas.'
    ],
    victimActions: [
      'Ligue imediatamente para a operadora de outro telefone e solicite o bloqueio preventivo da linha telefônica por SIM Swap.',
      'Acesse seu e-mail principal e redes sociais por computador seguro para revogar acessos e atualizar opções de recuperação.',
      'Avise amigos e familiares por canais alternativos para que não façam transferências solicitadas em seu nome.'
    ],
    affectedPlatforms: ['Operadoras Telefônicas', 'Instagram', 'WhatsApp', 'Gmail', 'Outlook'],
    sources: [
      { title: 'Anatel - Guia de Proteção contra Fraudes de Linha Móvel', sourceType: 'OFFICIAL_ALERT' }
    ]
  }
];
