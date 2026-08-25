import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-01',
    title: 'SMS com Solicitação de Token',
    senderOrPlatform: 'SMS de Número Desconhecido (+55 11 98765-4321)',
    scenarioText: 'Você recebe um SMS afirmando ser do seu banco informando que uma transferência Pix atípica de R$ 3.500 foi iniciada em um novo dispositivo.',
    simulatedMessage: {
      sender: 'Banco Alerta',
      channel: 'SMS',
      body: 'BANCO: Tentativa de transferencia PIX R$ 3.500,00 identificada. Se NAO foi voce, envie o codigo de seguranca recebido por SMS para cancelar imediatamente.'
    },
    isSuspicious: true,
    threatType: 'PHISHING',
    redFlags: [
      'Bancos NUNCA pedem que você responda um SMS enviando códigos de segurança de volta.',
      'O código de segurança recebido por SMS serve para autorizar a operação, não para cancelá-la.',
      'O remetente é um número de celular comum de 11 dígitos em vez de um código curto oficial de 5 dígitos (shortcode).'
    ],
    safeResponseExplanation: 'Isso é uma tentativa de captura de segundo fator (MFA Bypass). O fraudador já possui sua senha e está tentando realizar a transação; ao enviar o código, você autoriza o roubo.',
    practicalDefensiveTip: 'Nunca informe códigos SMS ou tokens a ninguém. Acesse diretamente o aplicativo oficial do banco para verificar seu extrato.'
  },
  {
    id: 'quiz-02',
    title: 'Mensagem do Filho com Número Novo',
    senderOrPlatform: 'WhatsApp (+55 21 99123-8899)',
    scenarioText: 'Você recebe uma mensagem no WhatsApp com a foto do seu filho ou filha, dizendo que o celular caiu na água e está com um número temporário.',
    simulatedMessage: {
      sender: 'Lucas (Filho)',
      avatarLetter: 'L',
      channel: 'WHATSAPP',
      body: 'Oi pai, meu celular caiu na água e quebrou. Tô usando esse número provisório até amanhã. Salva aí!\n\nAliás, preciso pagar um fornecedor da faculdade agora de R$ 980 e o app do banco não autoriza no celular novo. Você consegue fazer esse Pix pra mim? Te devolvo logo cedo.'
    },
    isSuspicious: true,
    threatType: 'WHATSAPP FRAUD',
    redFlags: [
      'História clássica de celular quebrado ou número novo.',
      'Pedido imediato de transferência financeira sob pressão de urgência.',
      'A chave Pix de destino geralmente está em nome de um terceiro desconhecido.',
      'Recusa em atender chamadas de áudio ou vídeo para confirmar a identidade.'
    ],
    safeResponseExplanation: 'Este é o Golpe do Novo Número no WhatsApp. Os criminosos usam fotos públicas e dados vazados para se passar por familiares e pedir dinheiro.',
    practicalDefensiveTip: 'Antes de fazer qualquer transferência, ligue imediatamente para o NÚMERO ANTIGO da pessoa ou faça uma videochamada ao vivo.'
  },
  {
    id: 'quiz-03',
    title: 'Comprovante de Compra em Marketplace',
    senderOrPlatform: 'Chat da OLX / WhatsApp',
    scenarioText: 'Você anunciou um videogame por R$ 2.000. Um comprador fecha negócio rapidamente e manda um comprovante em PDF pedindo para você entregar o produto para o motoboy que já está a caminho.',
    simulatedMessage: {
      sender: 'Comprador Marketplace',
      channel: 'WHATSAPP',
      body: 'Amigo, tá pago! Segue o comprovante do Pix em anexo. Já pedi o motoboy do UberFlash e ele chega aí em 10 minutos. Pode embalar o videogame?',
      attachmentsOrLink: 'Comprovante_Pix_Agendado_2508.pdf (Agendamento para 28/08)'
    },
    isSuspicious: true,
    threatType: 'PIX SCAMS',
    redFlags: [
      'O documento é um Agendamento de Pix (que pode ser cancelado a qualquer momento antes da data).',
      'Pressão extrema para liberar o produto antes da conferência no extrato.',
      'Uso de serviço de transporte por aplicativo de terceiros para evitar contato presencial.'
    ],
    safeResponseExplanation: 'Comprovante não é dinheiro na conta. O golpista agenda o Pix ou falsifica a imagem e cancela o agendamento assim que o motoboy retira o produto.',
    practicalDefensiveTip: 'Regra absoluta: só entregue qualquer produto após abrir seu próprio aplicativo bancário e ver o saldo creditado e disponível.'
  },
  {
    id: 'quiz-04',
    title: 'Notificação Oficial de Compra no Cartão',
    senderOrPlatform: 'Notificação Push do App do Banco',
    scenarioText: 'Você acabou de passar o cartão no supermercado e recebe uma notificação instantânea do aplicativo oficial instalado no seu celular.',
    simulatedMessage: {
      sender: 'App Banco Oficial',
      channel: 'BANK_APP',
      body: 'Compra aprovada no seu cartão com final 8821: R$ 142,50 em Supermercados Extra às 14:32. Limite disponível: R$ 3.857,50.'
    },
    isSuspicious: false,
    threatType: 'SAFE_INTERACTION',
    redFlags: [],
    safeResponseExplanation: 'Esta é uma notificação legítima: veio via notificação push do próprio aplicativo instalado, detalha uma compra real que você acabou de realizar, e não solicita cliques em links nem dados confidenciais.',
    practicalDefensiveTip: 'Manter notificações push ativadas no app oficial do banco é uma excelente prática para detectar compras não autorizadas em tempo real.'
  },
  {
    id: 'quiz-05',
    title: 'Proposta de Trabalho para Curtir Vídeos',
    senderOrPlatform: 'Telegram (+62 812-990-2311)',
    scenarioText: 'Uma recrutadora chamada "Alice da Global HR" envia uma mensagem oferecendo trabalho remoto em meio período pagando até R$ 800 por dia.',
    simulatedMessage: {
      sender: 'Alice - Global Recruiter',
      channel: 'WHATSAPP',
      body: 'Olá! Sou recrutadora da Shopee/Amazon. Vimos seu perfil e oferecemos vaga de Avaliador de Mídias. Ganhe de R$ 200 a R$ 800/dia curtindo 10 vídeos no YouTube. Para começar o teste, envie seu nome e receba R$ 20 no Pix agora.'
    },
    isSuspicious: true,
    threatType: 'FAKE JOBS',
    redFlags: [
      'Remetente com DDI internacional desconhecido (+62 é Indonésia).',
      'Remuneração desproporcional para tarefas triviais sem exigência de capacitação.',
      'Tática da "isca inicial": pagam R$ 20 no começo para depois exigir depósitos de R$ 500 a R$ 2.000 para "desbloquear tarefas VIP".'
    ],
    safeResponseExplanation: 'Este é o Golpe das Tarefas Pagas. Nenhuma empresa séria contrata por WhatsApp com pagamentos diários para curtir vídeos.',
    practicalDefensiveTip: 'Nunca realize depósitos financeiros para poder trabalhar ou desbloquear salários. Bloqueie e denuncie o contato.'
  },
  {
    id: 'quiz-06',
    title: 'Taxa Alfandegária de Encomenda nos Correios',
    senderOrPlatform: 'SMS de Remetente Aleatório',
    scenarioText: 'Você fez uma compra pela internet e recebe uma mensagem informando que seu pedido foi retido e precisa de pagamento imediato para não ser incinerado.',
    simulatedMessage: {
      sender: 'CORREIOS AVISO',
      channel: 'SMS',
      body: 'CORREIOS: Sua encomenda NX8921820BR foi retida na alfandega de Curitiba por pendencia de taxa. Evite a devolucao pagando a guia em: https://correios-rastreio-taxa.xyz/guia'
    },
    isSuspicious: true,
    threatType: 'PHISHING',
    redFlags: [
      'O link termina em `.xyz`, enquanto o site oficial dos Correios é estritamente `correios.com.br`.',
      'Ameaça alarmista de devolução ou destruição imediata.',
      'Cobrança por link direto em SMS não solicitado.'
    ],
    safeResponseExplanation: 'Página falsa de phishing clonada para roubar pagamentos Pix. Os Correios nunca cobram taxas alfandegárias através de links em SMS terminados em `.xyz` ou `.online`.',
    practicalDefensiveTip: 'Consulte o código de rastreio exclusivamente no site oficial `correios.com.br` ou dentro da área "Minhas Importações".'
  }
];
