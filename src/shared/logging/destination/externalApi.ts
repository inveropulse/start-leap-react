import { IDestinationService, LogEntry } from "../types";
import axios from "axios";
import { APP_CONFIG } from "@/shared/AppConfig";

interface RetryConfig {
  readonly maxRetries: number;
  readonly baseDelayMs: number;
  readonly backoffMultiplier: number;
}

export class ExternalApiLogDestination implements IDestinationService {
  private readonly retryConfig: RetryConfig = {
    maxRetries: 2,
    baseDelayMs: 1500, // 1.5 seconds
    backoffMultiplier: 2,
  };

  private readonly apiEndpoint = "/api/Log/AddLog";
  private readonly deduplicationWindowMs = 10000; // 10 seconds
  private readonly maxCacheSize = 25; // Maximum cache entries
  private readonly logCache = new Map<string, number>(); // hash -> timestamp

  public async sendAsync(entryOrEntries: LogEntry | LogEntry[]): Promise<void> {
    const logs = Array.isArray(entryOrEntries)
      ? entryOrEntries
      : [entryOrEntries];
    const uniqueLogs = this.filterDuplicateLogs(logs);

    if (uniqueLogs.length === 0) {
      return; // All logs were duplicates
    }

    await this.sendWithRetry(uniqueLogs);
  }

  public isReady(): boolean {
    return Boolean(APP_CONFIG?.apiBaseUrl);
  }

  private filterDuplicateLogs(logs: LogEntry[]): LogEntry[] {
    const now = Date.now();
    this.cleanExpiredCache(now);

    return logs.filter((log) => {
      const logHash = this.generateLogHash(log);
      const lastSeen = this.logCache.get(logHash);

      if (lastSeen && now - lastSeen < this.deduplicationWindowMs) {
        return false; // Duplicate within time window
      }

      // Enforce max cache size by removing oldest entries
      if (this.logCache.size >= this.maxCacheSize) {
        const oldestHash = this.logCache.keys().next().value;
        this.logCache.delete(oldestHash);
      }

      this.logCache.set(logHash, now);
      return true;
    });
  }

  private generateLogHash(log: LogEntry): string {
    // Create hash based on message, level, and source (excluding timestamp)
    const hashData = `${log.level}|${log.message}|${log.source || ""}`;
    return btoa(hashData).replace(/[+/=]/g, ""); // Simple base64 hash without special chars
  }

  private cleanExpiredCache(now: number): void {
    for (const [hash, timestamp] of this.logCache.entries()) {
      if (now - timestamp >= this.deduplicationWindowMs) {
        this.logCache.delete(hash);
      }
    }
  }

  private async sendWithRetry(logs: LogEntry[]): Promise<void> {
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        await axios.post(`${APP_CONFIG.apiBaseUrl}${this.apiEndpoint}`, logs, {
          headers: { "Content-Type": "application/json" },
        });
        return; // Success
      } catch (error) {
        const isLastAttempt = attempt === this.retryConfig.maxRetries;

        if (isLastAttempt) {
          console.error(
            "Failed to send logs to external API after all retries:",
            error
          );
          return;
        }

        const delay =
          this.retryConfig.baseDelayMs *
          Math.pow(this.retryConfig.backoffMultiplier, attempt);
        console.warn(
          `Log API attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
