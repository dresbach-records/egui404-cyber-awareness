import { ScamAlert } from '../types';

export const ALERTS_DATA: ScamAlert[] = [
  {
    id: 'alert-0042',
    alertNumber: 'ALERT #0042',
    type: 'FAKE INVESTMENT',
    risk: 'CRITICAL',
    status: 'ACTIVE',
    headline: 'Onda Massiva de Robôs Falsos de Investimento Cripto com Falso Depósito Inicial',
    warning: 'Golpistas estão utilizando anúncios com deepfakes e permitindo pequenos saques iniciais para roubar aportes volumosos.',
    recommendedAction: 'Nunca transfira dinheiro para corretoras sem registro na CVM e desconfie de retornos diários fixos.',
    date: '2026-08-25',
    urgent: true,
    victimHotlineNote: 'Se já transferiu fundos via Pix, contate seu banco imediatamente para acionar o Mecanismo Especial de Devolução (MED).'
  },
  {
    id: 'alert-0041',
    alertNumber: 'ALERT #0041',
    type: 'FAKE SUPPORT / VISHING',
    risk: 'HIGH',
    status: 'ACTIVE',
    headline: 'SMS de Compra Falsa Direcionando para Números 0800 Falsificados',
    warning: 'Criminosos criam centrais de atendimento telefônicas falsas para induzir vítimas a instalar softwares de acesso remoto no celular.',
    recommendedAction: 'Bancos nunca solicitam instalação de aplicativos de suporte remoto nem transferências para "proteger a conta".',
    date: '2026-08-23',
    urgent: true,
    victimHotlineNote: 'Desligue a chamada e entre em contato apenas pelo número do verso do seu cartão físico.'
  },
  {
    id: 'alert-0040',
    alertNumber: 'ALERT #0040',
    type: 'PHISHING',
    risk: 'HIGH',
    status: 'MONITORED',
    headline: 'Falsas Mensagens de Encomendas Retidas nos Correios com Taxa Pix',
    warning: 'Campanhas de SMS contendo links com domínios `.online` e `.xyz` forjando páginas oficiais de rastreamento postal.',
    recommendedAction: 'Consulte o status de encomendas apenas no site oficial `correios.com.br` ou pelo aplicativo oficial.',
    date: '2026-08-20',
    urgent: false
  }
];
