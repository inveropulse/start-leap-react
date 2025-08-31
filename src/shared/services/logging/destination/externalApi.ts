import { IDestinationService, LogEntry } from "../types";
import axios, { AxiosInstance } from "axios";
import { APP_CONFIG } from "@/shared/AppConfig";

interface RetryConfig {
  readonly maxRetries: number;
  readonly baseDelayMs: number;
  readonly backoffMultiplier: number;
}

interface FailedBatch {
  logs: LogEntry[];
  timestamp: number;
  attempts: number;
  nextRetryTime: number;
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

  // Failed batch persistence
  private readonly failedBatches: Map<string, FailedBatch> = new Map();
  private readonly maxFailedBatches = 30; // Maximum failed batches to keep
  private readonly maxFailedBatchAge = 24 * 60 * 60 * 1000; // 24 hours
  private readonly maxLongTermRetries = 5; // Maximum long-term retry attempts
  private backgroundRetryInterval: number | null = null;

  constructor() {
    // Create optimized axios instance with base URL configured
    this.axiosInstance = axios.create({
      baseURL: APP_CONFIG.apiBaseUrl, // Configure base URL here
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

    // Start background retry process
    this.startBackgroundRetry();

    // Cleanup on page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        if (this.backgroundRetryInterval) {
          clearInterval(this.backgroundRetryInterval);
        }
      });
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

  private startBackgroundRetry(): void {
    // Run background retry every 30 minutes
    this.backgroundRetryInterval = setInterval(() => {
      this.processFailedBatches();
    }, 30 * 60 * 1000);
  }

  private async processFailedBatches(): Promise<void> {
    const now = Date.now();
    const batchesToRetry: string[] = [];

    // Find batches ready for retry
    for (const [batchId, failedBatch] of this.failedBatches.entries()) {
      // Remove expired batches
      if (now - failedBatch.timestamp > this.maxFailedBatchAge) {
        this.failedBatches.delete(batchId);
        continue;
      }

      // Remove batches that exceeded max attempts
      if (failedBatch.attempts >= this.maxLongTermRetries) {
        console.warn(
          `Dropping failed batch ${batchId} after ${failedBatch.attempts} attempts`
        );
        this.failedBatches.delete(batchId);
        continue;
      }

      // Check if ready for retry
      if (now >= failedBatch.nextRetryTime) {
        batchesToRetry.push(batchId);
      }
    }

    // Process ready batches
    for (const batchId of batchesToRetry) {
      const failedBatch = this.failedBatches.get(batchId);
      if (!failedBatch) continue;

      try {
        await this.axiosInstance.post(this.apiEndpoint, failedBatch.logs);

        // Success - remove from failed batches
        this.failedBatches.delete(batchId);
        console.info(`Successfully sent previously failed batch ${batchId}`);
      } catch (error) {
        // Update retry info
        failedBatch.attempts++;
        failedBatch.nextRetryTime =
          now + this.calculateLongTermDelay(failedBatch.attempts);

        console.warn(
          `Background retry failed for batch ${batchId}, attempt ${failedBatch.attempts}`
        );
      }
    }
  }

  private calculateLongTermDelay(attempts: number): number {
    // Progressive delay: 1h, 2h, 4h, 8h, 12h
    const delayHours = Math.min(Math.pow(2, attempts - 1), 12);
    return delayHours * 60 * 60 * 1000;
  }

  private prioritizeLogsForFailedBatch(logs: LogEntry[]): LogEntry[] {
    // Prioritize logs: Fatal -> Error -> Warn (ignore info/debug)
    const fatalLogs = logs.filter((log) => log.level === "fatal");
    const errorLogs = logs.filter((log) => log.level === "error");
    const warnLogs = logs.filter((log) => log.level === "warn");

    // Combine in priority order
    const prioritizedLogs = [...fatalLogs, ...errorLogs, ...warnLogs];

    // Limit total logs to prevent memory bloat (max 50 logs per failed batch)
    return prioritizedLogs.slice(0, 50);
  }

  private addToFailedBatches(logs: LogEntry[]): void {
    const now = Date.now();
    const batchId = `batch_${now}_${Math.random().toString(36).substr(2, 9)}`;

    // Enforce memory limits
    if (this.failedBatches.size >= this.maxFailedBatches) {
      // Remove oldest batch
      const oldestBatchId = this.failedBatches.keys().next().value;
      if (oldestBatchId) {
        this.failedBatches.delete(oldestBatchId);
      }
    }

    // Prioritize logs: Fatal -> Error -> Warn (ignore info/debug)
    const logsToKeep = this.prioritizeLogsForFailedBatch(logs);

    if (logsToKeep.length === 0) {
      // No logs worth keeping (all were info/debug)
      return;
    }

    const failedBatch: FailedBatch = {
      logs: logsToKeep,
      timestamp: now,
      attempts: 0,
      nextRetryTime: now + 60 * 60 * 1000, // First retry in 1 hour
    };

    this.failedBatches.set(batchId, failedBatch);
    console.warn(
      `Added ${logsToKeep.length} prioritized logs to failed batch queue ` +
        `(${this.failedBatches.size} total batches)`
    );
  }

  // Method to get status for debugging
  public getFailedBatchStatus(): {
    count: number;
    totalLogs: number;
    oldestBatch: number | null;
    logsByLevel: Record<string, number>;
  } {
    const now = Date.now();
    let totalLogs = 0;
    let oldestTimestamp: number | null = null;
    const logsByLevel: Record<string, number> = {
      fatal: 0,
      error: 0,
      warn: 0,
      info: 0,
      debug: 0,
    };

    for (const failedBatch of this.failedBatches.values()) {
      totalLogs += failedBatch.logs.length;

      // Count logs by level
      for (const log of failedBatch.logs) {
        logsByLevel[log.level] = (logsByLevel[log.level] || 0) + 1;
      }

      if (!oldestTimestamp || failedBatch.timestamp < oldestTimestamp) {
        oldestTimestamp = failedBatch.timestamp;
      }
    }

    return {
      count: this.failedBatches.size,
      totalLogs,
      oldestBatch: oldestTimestamp ? now - oldestTimestamp : null,
      logsByLevel,
    };
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
        await this.axiosInstance.post(this.apiEndpoint, logs);
        return; // Success
      } catch (error) {
        const isLastAttempt = attempt === this.retryConfig.maxRetries;

        if (isLastAttempt) {
          // Add to failed batches for long-term retry
          this.addToFailedBatches(logs);
          console.error(
            `Failed to send logs after ${
              this.retryConfig.maxRetries + 1
            } attempts, added to failed batch queue`,
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
