import { ScamCategory, RiskLevel, ThreatStatus, VerificationStatus, ExternalThreatSource } from '../../types';

export interface RnpRawFraudRecord {
  id: string; // e.g. "16745"
  externalId: string; // e.g. "RNP_CAIS:16745"
  title: string;
  url: string;
  publishedDate?: string;
  lastUpdated?: string;
  sourceCategory?: string; // e.g. "receitafederal", "bancos", "correios", "pagamento", "recadastramento"
  tags: string[];
  rawExcerpt?: string; // short summary without payload
  sampleIndicators?: string[]; // safe defanged indicators
  observations?: string;
}

export interface RnpSyncStats {
  lastRun: string;
  totalDiscovered: number;
  newRecords: number;
  updatedRecords: number;
  unchangedRecords: number;
  duplicates: number;
  errorsCount: number;
  skippedCount: number;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

export interface RnpImportLog {
  id: string;
  source: 'RNP / CAIS' | string;
  startedAt: string;
  finishedAt: string;
  recordsDiscovered: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors: string[];
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  trigger: 'MANUAL_ADMIN' | 'SCHEDULED' | 'BOOTSTRAP';
}

export interface RnpTaxonomyMapping {
  rnpCategoryPattern: string; // regex or keyword
  eguiCategory: ScamCategory;
  defaultRisk: RiskLevel;
  tags: string[];
}

export interface RnpFetchOptions {
  page?: number;
  limit?: number;
  categoryFilter?: string;
  forceRefresh?: boolean;
}
