import type { AuthSessionUser } from './types';

export type AccessPlan = 'FREE' | 'PREMIUM' | 'BUSINESS' | string;

export interface AccessEntitlements {
  plan?: AccessPlan;
  permissions?: string[];
  entitlements?: string[];
  subscription?: {
    status?: string;
    currentPeriodEnd?: string;
  } | null;
}

export type AuthenticatedAccessUser = AuthSessionUser & AccessEntitlements;

export function getAccessPlan(user?: AuthenticatedAccessUser | null): AccessPlan {
  return user?.plan || 'FREE';
}

export function hasEntitlement(user: AuthenticatedAccessUser | null | undefined, entitlement: string): boolean {
  return Boolean(user?.entitlements?.includes(entitlement) || user?.permissions?.includes(entitlement));
}

export function isPremiumAccount(user?: AuthenticatedAccessUser | null): boolean {
  return getAccessPlan(user) === 'PREMIUM' || getAccessPlan(user) === 'BUSINESS';
}

export function canUseCommunityCore(): true {
  return true;
}

export function getAccessLabel(user?: AuthenticatedAccessUser | null, language: 'pt' | 'en' = 'pt'): string | null {
  if (!user?.plan) return null;
  const plan = getAccessPlan(user).toUpperCase();
  if (plan === 'PREMIUM' || plan === 'BUSINESS') return language === 'pt' ? 'PREMIUM' : 'PREMIUM';
  return language === 'pt' ? 'GRATUITO' : 'FREE';
}
