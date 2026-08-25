import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  User,
  KeyRound,
  ArrowRight,
  Fingerprint,
  AlertTriangle,
  Shield,
  Loader2
} from 'lucide-react';
import { SoundEngine } from '../../../services/audioService';
import { authApi } from '../../../services/api/authApi';
import type { AuthenticatedAccessUser } from '../../../services/api/access';

interface AdminLoginViewProps {
  onLoginSuccess: (user: AuthenticatedAccessUser) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usePasskey, setUsePasskey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    SoundEngine.playKeyClick();

    try {
      // Try real backend authentication
      const result = await authApi.login({ username, password });
      const sessionUser = { ...result.user, role: result.user.role } as AuthenticatedAccessUser;
      if (!['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(sessionUser.role)) {
        setError('403 — Sua conta não possui permissão administrativa.');
        return;
      }
      SoundEngine.playSuccessSound();
      onLoginSuccess(sessionUser);
    } catch (err: any) {
      SoundEngine.playAlertSound();
      setError(err?.statusCode === 403 ? '403 — Sua conta não possui permissão administrativa.' : 'Credenciais inválidas ou serviço de autenticação indisponível.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyAuth = () => {
    setError('Passkey / FIDO2 ainda não está configurado pelo backend.');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0D0D0D] border border-[#262626] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 relative overflow-hidden">
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E00000] to-transparent"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#E00000]/10 border border-[#E00000]/30 flex items-center justify-center mx-auto text-[#E00000]">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-['Bebas_Neue'] tracking-wider text-white">
            Painel Administrativo E GUI 404
          </h1>
          <p className="text-xs font-mono text-[#777777]">
            Terminal de Comando e Triagem de Inteligência Cibernética
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[#888888] mb-1.5 font-bold uppercase text-[10px]">
              Identificador de Operador
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555555]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl pl-10 pr-3 py-3 text-white focus:border-[#E00000] focus:outline-none transition-colors"
                placeholder="Nome de usuário ou ID"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#888888] mb-1.5 font-bold uppercase text-[10px]">
              Chave Criptográfica / Senha
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555555]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl pl-10 pr-3 py-3 text-white focus:border-[#E00000] focus:outline-none transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(224,0,0,0.4)] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Acessar Centro de Comando</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#1C1C1C]"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono text-[#555555]">OU</span>
          <div className="flex-grow border-t border-[#1C1C1C]"></div>
        </div>

        <button
          type="button"
          onClick={handlePasskeyAuth}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] text-[#CCCCCC] hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Fingerprint className="w-4 h-4 text-cyan-400" />
          <span>Autenticar com Passkey / FIDO2</span>
        </button>

        <div className="text-center text-[10px] font-mono text-[#555555]">
          E GUI 404 SOC • Todos os acessos são auditados e gravados em conformidade com a LGPD
        </div>
      </div>
    </div>
  );
};
