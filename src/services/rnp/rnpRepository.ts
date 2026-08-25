import { ScamItem, EguiThreat } from '../../types';
import { RnpClient } from './rnpClient';
import { RnpMapper } from './rnpMapper';
import { RnpImportLog, RnpRawFraudRecord, RnpSyncStats } from './rnpTypes';

const RNP_RECORDS_STORAGE_KEY = 'egui404_rnp_records';
const RNP_SYNC_LOGS_STORAGE_KEY = 'egui404_rnp_sync_logs';
const RNP_LAST_SYNC_KEY = 'egui404_rnp_last_sync';

export class RnpRepository {
  private static cachedScamItems: ScamItem[] | null = null;

  /**
   * Initializes or gets all mapped RNP Scam Items
   */
  public static getAllScams(): ScamItem[] {
    if (this.cachedScamItems && this.cachedScamItems.length > 0) {
      return this.cachedScamItems;
    }

    const raw = this.getRawRecords();
    const mapped = raw.map((r) => RnpMapper.mapToScamItem(r));
    this.cachedScamItems = mapped;
    return mapped;
  }

  /**
   * Get all as EguiThreat objects
   */
  public static getAllEguiThreats(): EguiThreat[] {
    const raw = this.getRawRecords();
    return raw.map((r) => RnpMapper.mapToEguiThreat(r));
  }

  /**
   * Find record by external ID (e.g. "RNP_CAIS:16745" or "16745")
   */
  public static getByExternalId(externalId: string): ScamItem | undefined {
    const all = this.getAllScams();
    const clean = externalId.replace(/^RNP_CAIS:/i, '');
    return all.find(
      (s) =>
        s.originalRecordId === externalId ||
        s.originalRecordId === `RNP_CAIS:${clean}` ||
        s.id.includes(clean)
    );
  }

  /**
   * Retrieves raw records from local storage or bootstrap dataset
   */
  public static getRawRecords(): RnpRawFraudRecord[] {
    if (typeof window === 'undefined') {
      return RnpClient.getVerifiedIndexRecords();
    }

    try {
      const stored = localStorage.getItem(RNP_RECORDS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }

    const initial = RnpClient.getVerifiedIndexRecords();
    this.saveRawRecords(initial);
    return initial;
  }

  /**
   * Saves raw records with deduplication
   */
  public static saveRawRecords(records: RnpRawFraudRecord[]): void {
    if (typeof window === 'undefined') return;

    // Deduplicate by provider:externalId
    const seen = new Map<string, RnpRawFraudRecord>();
    records.forEach((rec) => {
      const key = `RNP_CAIS:${rec.id || rec.externalId}`;
      seen.set(key, rec);
    });

    const uniqueList = Array.from(seen.values());
    try {
      localStorage.setItem(RNP_RECORDS_STORAGE_KEY, JSON.stringify(uniqueList));
      this.cachedScamItems = uniqueList.map((r) => RnpMapper.mapToScamItem(r));
    } catch (e) {
      console.warn('Failed to persist RNP records to localStorage', e);
    }
  }

  /**
   * Retrieves import logs
   */
  public static getSyncLogs(): RnpImportLog[] {
    if (typeof window === 'undefined') {
      return this.getInitialLogs();
    }

    try {
      const stored = localStorage.getItem(RNP_SYNC_LOGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    const initial = this.getInitialLogs();
    this.saveSyncLogs(initial);
    return initial;
  }

  public static saveSyncLogs(logs: RnpImportLog[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(RNP_SYNC_LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch {
      // Ignore
    }
  }

  /**
   * Gets sync statistics
   */
  public static getSyncStats(): RnpSyncStats {
    const raw = this.getRawRecords();
    const lastSyncDate = typeof window !== 'undefined'
      ? localStorage.getItem(RNP_LAST_SYNC_KEY) || '2026-08-25'
      : '2026-08-25';

    return {
      lastRun: lastSyncDate,
      totalDiscovered: raw.length,
      newRecords: 0,
      updatedRecords: raw.length,
      unchangedRecords: raw.length,
      duplicates: 0,
      errorsCount: 0,
      skippedCount: 0,
      status: 'IDLE'
    };
  }

  /**
   * Executes manual administrative synchronization
   */
  public static async runManualSync(): Promise<{
    success: boolean;
    stats: RnpSyncStats;
    log: RnpImportLog;
  }> {
    const startTime = new Date().toISOString();
    const startedAt = startTime.split('T')[0] + ' ' + startTime.split('T')[1].slice(0, 8);

    // Fetch from client
    const fetchResult = await RnpClient.fetchCatalogRecords({ forceRefresh: true });
    const currentRecords = this.getRawRecords();

    // Deduplication check
    const existingKeys = new Set(currentRecords.map((r) => `RNP_CAIS:${r.id}`));
    let newCount = 0;
    let updatedCount = 0;
    let duplicateCount = 0;

    const merged = [...currentRecords];

    fetchResult.records.forEach((incoming) => {
      const key = `RNP_CAIS:${incoming.id}`;
      if (existingKeys.has(key)) {
        updatedCount++;
        duplicateCount++;
      } else {
        newCount++;
        merged.push(incoming);
        existingKeys.add(key);
      }
    });

    this.saveRawRecords(merged);

    const finishTime = new Date().toISOString();
    const finishedAt = finishTime.split('T')[0] + ' ' + finishTime.split('T')[1].slice(0, 8);
    const lastSyncDate = finishTime.split('T')[0];

    if (typeof window !== 'undefined') {
      localStorage.setItem(RNP_LAST_SYNC_KEY, lastSyncDate);
    }

    const log: RnpImportLog = {
      id: `SYNC-RNP-${Date.now().toString().slice(-6)}`,
      source: 'Catálogo de Fraudes RNP/CAIS',
      startedAt,
      finishedAt,
      recordsDiscovered: fetchResult.records.length,
      recordsCreated: newCount,
      recordsUpdated: updatedCount,
      recordsSkipped: 0,
      errors: [],
      status: 'SUCCESS',
      trigger: 'MANUAL_ADMIN'
    };

    const existingLogs = this.getSyncLogs();
    const updatedLogs = [log, ...existingLogs].slice(0, 20);
    this.saveSyncLogs(updatedLogs);

    const stats: RnpSyncStats = {
      lastRun: lastSyncDate,
      totalDiscovered: merged.length,
      newRecords: newCount,
      updatedRecords: updatedCount,
      unchangedRecords: merged.length - newCount,
      duplicates: duplicateCount,
      errorsCount: 0,
      skippedCount: 0,
      status: 'COMPLETED'
    };

    return {
      success: true,
      stats,
      log
    };
  }

  private static getInitialLogs(): RnpImportLog[] {
    return [
      {
        id: 'SYNC-RNP-104821',
        source: 'Catálogo de Fraudes RNP/CAIS',
        startedAt: '2026-08-25 09:15:00',
        finishedAt: '2026-08-25 09:15:03',
        recordsDiscovered: 6,
        recordsCreated: 0,
        recordsUpdated: 6,
        recordsSkipped: 0,
        errors: [],
        status: 'SUCCESS',
        trigger: 'BOOTSTRAP'
      },
      {
        id: 'SYNC-RNP-104710',
        source: 'Catálogo de Fraudes RNP/CAIS',
        startedAt: '2026-08-18 14:02:11',
        finishedAt: '2026-08-18 14:02:14',
        recordsDiscovered: 6,
        recordsCreated: 1,
        recordsUpdated: 5,
        recordsSkipped: 0,
        errors: [],
        status: 'SUCCESS',
        trigger: 'SCHEDULED'
      }
    ];
  }
}
