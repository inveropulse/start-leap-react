import { IDestinationService, LogEntry } from "../types";
import axios, { AxiosInstance } from "axios";
import { APP_CONFIG } from "@/shared/AppConfig";

interface RetryConfig {
  readonly maxRetries: number;
  readonly baseDelayMs: number;
  readonly backoffMultiplier: number;
}

export class ExternalApiLogDestination implements IDestinationService {
  private readonly axiosInstance: AxiosInstance;
  private readonly retryConfig: RetryConfig = {
    maxRetries: 1, // Reduced from 2 to 1
    baseDelayMs: 2000, // Increased from 1500 to 2000ms
    backoffMultiplier: 2,
  };

  private readonly apiEndpoint = "/api/Log/AddLog";
  private readonly deduplicationWindowMs = 30000; // Increased from 10s to 30s
  private readonly maxCacheSize = 100; // Increased from 25 to 100
  private readonly logCache = new Map<string, number>(); // hash -> timestamp

  // Add rate limiting
  private lastSendTime = 0;
  private readonly minSendIntervalMs = 2000; // Minimum 2 seconds between sends

  // Add payload size limits
  private readonly maxPayloadSize = 1024 * 1024; // 1MB limit
  private readonly maxBatchSize = 500; // Maximum logs per batch

  constructor() {
    // Create optimized axios instance
    this.axiosInstance = axios.create({
      timeout: 10000, // 10 second timeout
      maxRedirects: 2,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Add request compression if available
    if (typeof window !== "undefined" && "CompressionStream" in window) {
      this.axiosInstance.defaults.headers["Accept-Encoding"] = "gzip, deflate";
    }
  }

  public async sendAsync(entryOrEntries: LogEntry | LogEntry[]): Promise<void> {
    // Rate limiting check
    const now = Date.now();
    if (now - this.lastSendTime < this.minSendIntervalMs) {
      console.warn("Rate limiting: Skipping log send to prevent spam");
      return;
    }

    const logs = Array.isArray(entryOrEntries)
      ? entryOrEntries
      : [entryOrEntries];
    const uniqueLogs = this.filterDuplicateLogs(logs);

    if (uniqueLogs.length === 0) {
      return; // All logs were duplicates
    }

    // Split into optimized batches
    const batches = this.createOptimalBatches(uniqueLogs);

    this.lastSendTime = now;

    // Send batches sequentially to avoid overwhelming the server
    for (const batch of batches) {
      await this.sendWithRetry(batch);

      // Small delay between batches if multiple
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  public isReady(): boolean {
    return Boolean(APP_CONFIG?.apiBaseUrl);
  }

  private createOptimalBatches(logs: LogEntry[]): LogEntry[][] {
    const batches: LogEntry[][] = [];
    let currentBatch: LogEntry[] = [];
    let currentBatchSize = 0;

    for (const log of logs) {
      const logSize = JSON.stringify(log).length;

      // Start new batch if adding this log would exceed limits
      if (
        currentBatch.length >= this.maxBatchSize ||
        currentBatchSize + logSize > this.maxPayloadSize
      ) {
        if (currentBatch.length > 0) {
          batches.push(currentBatch);
        }
        currentBatch = [log];
        currentBatchSize = logSize;
      } else {
        currentBatch.push(log);
        currentBatchSize += logSize;
      }
    }

    // Add final batch
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    return batches;
  }

  private filterDuplicateLogs(logs: LogEntry[]): LogEntry[] {
    const now = Date.now();
    this.cleanExpiredCache(now);

    // Group by priority - keep all fatal/error logs, deduplicate others more aggressively
    const priorityLogs: LogEntry[] = [];
    const regularLogs: LogEntry[] = [];

    for (const log of logs) {
      if (log.level === "fatal" || log.level === "error") {
        priorityLogs.push(log);
      } else {
        regularLogs.push(log);
      }
    }

    // Always keep priority logs, deduplicate regular logs
    const deduplicatedRegular = regularLogs.filter((log) => {
      const logHash = this.generateLogHash(log);
      const lastSeen = this.logCache.get(logHash);

      if (lastSeen && now - lastSeen < this.deduplicationWindowMs) {
        return false;
      }

      // Enforce max cache size
      if (this.logCache.size >= this.maxCacheSize) {
        const oldestHash = this.logCache.keys().next().value;
        this.logCache.delete(oldestHash);
      }

      this.logCache.set(logHash, now);
      return true;
    });

    return [...priorityLogs, ...deduplicatedRegular];
  }

  private generateLogHash(log: LogEntry): string {
    // Create more comprehensive hash including relevant data
    const relevantData = log.data ? JSON.stringify(log.data).slice(0, 200) : "";
    const hashData = `${log.level}|${log.message}|${
      log.source || ""
    }|${relevantData}`;

    // Use a simple but effective hash
    let hash = 0;
    for (let i = 0; i < hashData.length; i++) {
      const char = hashData.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return hash.toString(36);
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
        await this.axiosInstance.post(
          `${APP_CONFIG.apiBaseUrl}${this.apiEndpoint}`,
          logs
        );
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

        // Exponential backoff with jitter
        const baseDelay =
          this.retryConfig.baseDelayMs *
          Math.pow(this.retryConfig.backoffMultiplier, attempt);
        const jitter = Math.random() * 1000; // Add up to 1s random jitter
        const delay = baseDelay + jitter;

        console.warn(
          `Log API attempt ${attempt + 1} failed, retrying in ${Math.round(
            delay
          )}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
