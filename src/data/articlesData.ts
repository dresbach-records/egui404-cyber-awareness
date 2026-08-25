import { EducationArticle } from '../types';

export const ARTICLES_DATA: EducationArticle[] = [
  {
    id: 'art-001',
    slug: 'guia-definitivo-mfa-autenticacao-dois-fatores',
    title: 'Guia Definitivo de MFA: Por que o SMS Não é Suficiente e Como Migrar para Apps Autenticadores e Passkeys',
    category: 'MFA',
    author: 'E GUI 404 Research Group',
    date: '2026-08-15',
    readingTimeMinutes: 6,
    excerpt: 'A autenticação de dois fatores é a barreira mais importante contra invasão de contas, mas depender de SMS deixa você vulnerável a golpes de SIM Swap e interceptação.',
    contentMarkdown: `
### Por que o segundo fator é vital?
Mais de 80% das violações de contas ocorrem devido a senhas fracas, reutilizadas ou vazadas em bases de dados públicas da dark web. A Autenticação Multifator (MFA) adiciona uma camada de confirmação que não pode ser facilmente roubada apenas com a sua senha.

### A hierarquia de segurança do MFA:

1. **Passkeys & Chaves FIDO2 (Nível Máximo - Imune a Phishing):**
   Utilizam criptografia assimétrica baseada em hardware. A chave privada nunca sai do seu dispositivo e o navegador só autoriza o login se o domínio bater exatamente com o site real.
   
2. **Aplicativos Autenticadores TOTP (Nível Alto):**
   Geram códigos temporários a cada 30 segundos (ex: Google Authenticator, Microsoft Authenticator, 2FAS, Aegis). Não dependem de sinal telefônico nem de operadoras.
   
3. **SMS e E-mail (Nível Básico / Vulnerável):**
   Embora seja melhor do que não ter nada, os códigos via SMS podem ser interceptados em ataques de SIM Swap (clonagem de chip) ou espionados por trojans no celular.

### Checklist Prático de Migração
- [ ] Ative MFA em sua conta principal de e-mail (ela é a chave mestra de todas as suas redefinições de senha).
- [ ] Ative MFA em seus aplicativos de bancos e corretoras.
- [ ] Ative a Verificação em Duas Etapas no WhatsApp com PIN e e-mail de recuperação.
- [ ] Guarde os códigos de backup (backup codes) impressos em local seguro ou no cofre de senhas.
    `,
    keyTakeaways: [
      'Substitua a autenticação por SMS por aplicativos autenticadores (TOTP) ou Passkeys sempre que disponível.',
      'Sua conta de e-mail é o ativo mais crítico: proteja-a com a melhor autenticação possível.',
      'Sempre guarde os códigos de recuperação de emergência (backup codes) offline.'
    ],
    checklist: [
      'Configurar um app como Google Authenticator, 2FAS ou Bitwarden',
      'Desativar SMS como método primário de recuperação',
      'Fazer backup criptografado do cofre de chaves TOTP',
      'Cadastrar uma Passkey no Google, Apple ou Microsoft'
    ],
    sources: [
      { title: 'NIST Special Publication 800-63B: Digital Identity Guidelines', sourceType: 'SECURITY_BULLETIN' },
      { title: 'CISA - Multi-Factor Authentication Guidance', sourceType: 'OFFICIAL_ALERT' }
    ]
  },
  {
    id: 'art-002',
    slug: 'anatomia-do-phishing-como-identificar-links-e-remetentes-falsos',
    title: 'Anatomia do Phishing: Como Ler Cabeçalhos, URLs e Identificar Tentativas de Engenharia Social',
    category: 'Phishing',
    author: 'E GUI 404 Threat Lab',
    date: '2026-08-10',
    readingTimeMinutes: 8,
    excerpt: 'Aprenda a inspecionar links, domínios camuflados, caracteres homógrafos e táticas psicológicas de urgência antes de clicar.',
    contentMarkdown: `
### O que é Phishing?
Phishing é a arte do disfarce digital. O criminoso não invade seu sistema através de uma falha de software complexa; ele engana você para que você entregue as chaves da porta.

### Os 4 Indicadores Cruciais:

1. **A anatomia do Domínio (A regra do que vem antes da primeira barra):**
   - Legítimo: \`https://banco.com.br/login\` (O domínio real é **banco.com.br**)
   - Falso: \`https://banco.com.br.login-seguro.xyz/entrar\` (O domínio real aqui é **login-seguro.xyz**, que usa subdomínios para simular o nome do banco).

2. **Gatilhos Psicológicos de Urgência:**
   "Sua conta será cancelada em 2 horas", "Você tem um débito com ordem de penhora", "Ganhe 90% de desconto somente até as 18h". A urgência desliga o córtex pré-frontal e induz ações precipitadas.

3. **Inconsistência de Remetente:**
   O nome exibido pode ser "Suporte Oficial", mas ao passar o mouse ou inspecionar o endereço real de e-mail, o remetente é algo como \`contato@xys-freelance.online\`.

4. **Solicitação de Dados Incomuns:**
   Nenhum banco pede que você digite a sua senha de 4 ou 6 dígitos em um link recebido por e-mail ou SMS.
    `,
    keyTakeaways: [
      'Sempre leia o domínio da direita para a esquerda a partir da primeira barra solitária.',
      'Cuidado com links encurtados em mensagens não solicitadas.',
      'Sempre abra uma nova aba e digite o endereço oficial do serviço manualmente.'
    ],
    checklist: [
      'Inspecionar o domínio real antes de clicar',
      'Desconfiar de pedidos urgentes de ação imediata',
      'Nunca fornecer senhas completas por formulários recebidos em mensagens',
      'Denunciar e-mails de phishing para os filtros do provedor'
    ],
    sources: [
      { title: 'Anti-Phishing Working Group (APWG) Trends Report', sourceType: 'RESEARCH_REPORT' }
    ]
  },
  {
    id: 'art-003',
    slug: 'engenharia-social-e-o-fator-humano-na-seguranca',
    title: 'Engenharia Social: Os 6 Gatilhos Mentais Mais Explorados por Golpistas Digitais',
    category: 'Social Engineering',
    author: 'The Observer / E GUI 404',
    date: '2026-07-25',
    readingTimeMinutes: 7,
    excerpt: 'Compreenda como golpistas exploram o princípio da autoridade, reciprocidade, escassez e compaixão para driblar os melhores sistemas de segurança.',
    contentMarkdown: `
### Hackeando o Ser Humano
Kevin Mitnick celebremente afirmou que o elo mais fraco da segurança da informação é o fator humano. Por trás de todo golpe sofisticado, existe uma narrativa desenhada para acionar uma resposta emocional involuntária.

### Os 6 Princípios da Manipulação:
1. **Autoridade:** Fingir ser um policial, delegado, auditor da Receita Federal ou gerente do banco para impor subserviência imediata.
2. **Escassez & Urgência:** "Última vaga", "Expira em 5 minutos", impedindo a vítima de buscar uma segunda opinião.
3. **Medo / Intimidação:** Ameaças de processo criminal, negativação do nome ou perda irreversível de saldo financeiro.
4. **Reciprocidade:** O golpista oferece uma suposta ajuda gratuita ou bônus financeiro inicial para criar dívida moral.
5. **Afeição / Validação:** No caso de golpes românticos ou perfis falsos, elogios constantes criam uma conexão artificial de lealdade.
6. **Prova Social Forjada:** Exibição de prints de falsos clientes ou comentários comprados afirmando que o serviço funciona.

### A Regra de Ouro da Defesa:
> "Sempre que uma mensagem provocar uma emoção intensa (pânico, ganância excessiva ou pressa irresistível), PARE por 10 minutos. A pausa é o antivírus da mente humana."
    `,
    keyTakeaways: [
      'Emoções intensas e pressa são os sinais mais claros de que uma manipulação está em curso.',
      'Valide qualquer pedido de dinheiro por um canal alternativo e independente.',
      'Não tenha vergonha de dizer: "Preciso desligar e verificar essa informação antes de prosseguir".'
    ],
    checklist: [
      'Estabelecer o hábito da pausa preventiva de 10 minutos',
      'Desconfiar de figuras de autoridade que exigem sigilo absoluto',
      'Consultar pessoas de confiança antes de decisões financeiras atípicas'
    ],
    sources: [
      { title: 'Social Engineering: The Science of Human Hacking', sourceType: 'RESEARCH_REPORT' }
    ]
  },
  {
    id: 'art-004',
    slug: 'seguranca-financeira-no-celular-e-pix',
    title: 'Blindagem do Celular Bancário: Boas Práticas para Evitar Prejuízos em Caso de Roubo ou Furto',
    category: 'Financial Security',
    author: 'E GUI 404 Defensive Ops',
    date: '2026-07-12',
    readingTimeMinutes: 5,
    excerpt: 'Configurações essenciais no iOS e Android para proteger seus aplicativos financeiros, chaves Pix e e-mails de recuperação contra criminosos de rua.',
    contentMarkdown: `
### O Celular como Carteira Digital
Hoje, um smartphone desbloqueado dá acesso a anos de economias, histórico de crédito e linhas de empréstimo pré-aprovadas. Por isso, a segurança do aparelho deve ser tratada como a segurança do cofre da sua casa.

### 5 Medidas de Blindagem Imediata:
1. **Ativação de PIN no Chip SIM:** Impede que o criminoso retire o chip do seu celular furtado e coloque em outro aparelho para receber SMS com códigos de recuperação.
2. **Redução de Limites Noturnos do Pix:** Mantenha os limites diários e noturnos ajustados para o estritamente necessário (ex: R$ 500 para a noite).
3. **Ocultação e Bloqueio com Biometria:** Utilize pastas seguras (Samsung Secure Folder, Espaço Privado do Android 15, ou bloqueio por Face ID / Senha por app no iOS 18).
4. **Desvincular o e-mail de recuperação do próprio celular:** Se o celular onde está o banco for o mesmo que recebe o e-mail de redefinição de senha, o invasor tem o caminho livre.
5. **Configurar o Bloqueio Remoto:** Tenha em mãos o IMEI do aparelho e saiba utilizar o serviço oficial *Encontrar Meu Dispositivo* (Google) ou *Buscar* (Apple).
    `,
    keyTakeaways: [
      'Defina um PIN de 4 dígitos no seu chip SIM através das configurações de celular do aparelho.',
      'Reduza os limites diários de Pix para o mínimo operacional do seu dia a dia.',
      'Separe o e-mail de recuperação de senhas críticas em outro dispositivo seguro.'
    ],
    checklist: [
      'Cadastrar PIN do chip da operadora',
      'Ajustar limites de transferência Pix no app do banco',
      'Configurar tempo limite de bloqueio de tela para 30 segundos',
      'Anotar o número IMEI do aparelho em papel guardado em casa'
    ],
    sources: [
      { title: 'Cartilha de Segurança do Banco Central e FEBRABAN', sourceType: 'OFFICIAL_ALERT' }
    ]
  }
];
