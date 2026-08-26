import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { authApi } from '../../services/api/authApi';
import { CommunityAuthShell } from '../forum/CommunityAuthShell';
import type { AuthenticatedAccessUser } from '../../services/api/access';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

interface AuthViewProps { mode: AuthMode; onNavigate: (path: string) => void; onAuthenticated: (user: AuthenticatedAccessUser) => void; }

export const AuthView: React.FC<AuthViewProps> = ({ mode, onNavigate, onAuthenticated }) => {
  const isRegister = mode === 'register';
  const isRecovery = mode === 'forgot' || mode === 'reset';
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(null); setMessage(null);
    if (isRegister && password !== confirmation) { setError('As senhas não conferem.'); return; }
    setLoading(true);
    try {
      const result = isRegister ? await authApi.register({ name: name.trim(), email: email.trim(), password }) : await authApi.login({ email: email.trim(), password });
      if (isRegister) {
        setMessage('Conta criada com sucesso. Agora você pode participar da comunidade E GUI 404.');
        const session = await authApi.getSession();
        if (session) onAuthenticated(session as AuthenticatedAccessUser);
        else setMessage('Conta criada com sucesso. Verifique seu e-mail para continuar.');
      } else onAuthenticated(result.user as AuthenticatedAccessUser);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível concluir a autenticação.');
    } finally { setLoading(false); }
  };

  if (isRecovery) return <CommunityAuthShell title={mode === 'forgot' ? 'Esqueci minha senha' : 'Redefinir senha'} onNavigate={onNavigate}><section className="space-y-5 rounded-2xl border border-[#292929] bg-[#0d0d0d] p-6 sm:p-8" aria-labelledby="auth-title"><p className="text-sm leading-6 text-neutral-400">A recuperação depende do contrato de autenticação do backend. Nenhum e-mail será enviado nesta etapa.</p><label className="block text-xs text-neutral-400">E-mail<input required type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-[#292929] bg-[#141414] px-3 py-3 text-sm text-white outline-none focus:border-[#E00000]" /></label><button type="button" onClick={() => onNavigate('/auth/login')} className="w-full rounded-lg border border-[#292929] px-4 py-3 text-sm text-white hover:border-[#E00000]">Voltar para entrar</button></section></CommunityAuthShell>;

  return <CommunityAuthShell title={isRegister ? 'Criar sua conta' : 'Entre na comunidade'} onNavigate={onNavigate}><section className="w-full rounded-2xl border border-[#292929] bg-[#0d0d0d] p-6 sm:p-8 space-y-6" aria-labelledby="auth-title">
    <div className="text-center space-y-3"><ShieldCheck className="mx-auto h-9 w-9 text-[#E00000]" /><h1 id="auth-title" className="text-2xl font-mono text-white">{isRegister ? 'Criar conta' : 'Entrar'}</h1><p className="text-sm leading-relaxed text-neutral-400">{isRegister ? 'Crie sua conta gratuita para participar da comunidade defensiva.' : 'Acesse sua conta para entrar no Fórum privado.'}</p></div>
    {error && <div role="alert" className="flex gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div>}
    {message && <div role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs leading-relaxed text-emerald-300">{message}</div>}
    <form onSubmit={submit} className="space-y-4">
      {isRegister && <label className="block text-xs text-neutral-400">Nome público<input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="mt-1.5 w-full rounded-lg border border-[#292929] bg-[#141414] px-3 py-3 text-sm text-white outline-none focus:border-[#E00000]" /></label>}
      <label className="block text-xs text-neutral-400">E-mail<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="mt-1.5 w-full rounded-lg border border-[#292929] bg-[#141414] px-3 py-3 text-sm text-white outline-none focus:border-[#E00000]" /></label>
      <label className="block text-xs text-neutral-400">Senha<input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isRegister ? 'new-password' : 'current-password'} className="mt-1.5 w-full rounded-lg border border-[#292929] bg-[#141414] px-3 py-3 text-sm text-white outline-none focus:border-[#E00000]" /></label>
      {isRegister && <label className="block text-xs text-neutral-400">Confirmar senha<input required minLength={8} type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="new-password" className="mt-1.5 w-full rounded-lg border border-[#292929] bg-[#141414] px-3 py-3 text-sm text-white outline-none focus:border-[#E00000]" /></label>}
      <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E00000] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{isRegister ? 'Criar conta' : 'Entrar'}<ArrowRight className="h-4 w-4" /></>}</button>
    </form>
    {!isRegister && <button type="button" onClick={() => onNavigate('/auth/forgot-password')} className="block w-full text-center text-xs text-[#FF7777] underline">Esqueci minha senha</button>}
    <p className="text-center text-xs text-neutral-500">{isRegister ? 'Já possui uma conta?' : 'Não possui uma conta?'} <button type="button" onClick={() => onNavigate(isRegister ? '/auth/login' : '/auth/register')} className="text-[#E00000] underline">{isRegister ? 'Entrar' : 'Criar conta'}</button></p>
  </section></CommunityAuthShell>;
};
