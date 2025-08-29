// src/lib/logging/mockExternalService.ts
import type { LogEntry } from "../logger";

export class MockExternalLogService {
  private logs: LogEntry[] = [];
  private readonly serviceName: string;
  private readonly maxLogs: number = 1000; // Prevent memory leaks

  constructor(serviceName: string = "MockService") {
    this.serviceName = serviceName;
  }

  async send(logEntry: LogEntry): Promise<void> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));

      // Simulate occasional failures (5% failure rate)
      if (Math.random() < 0.05) {
        throw new Error(`${this.serviceName}: Simulated network error`);
      }

      // Add to logs with memory management
      this.logs.push(logEntry);

      // Keep only the most recent logs
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs);
      }

      // Only log in development to avoid console spam
      if (import.meta.env.DEV) {
        console.log(`📤 [${this.serviceName}] Log sent:`, {
          id: logEntry.id,
          level: logEntry.level,
          message: logEntry.message,
          timestamp: logEntry.timestamp,
        });
      }
    } catch (error) {
      // Re-throw to let the logger handle the error
      throw error;
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: string): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  getRecentLogs(count: number = 10): LogEntry[] {
    return this.logs.slice(-count);
  }

  clearLogs(): void {
    this.logs = [];
  }

  getStats(): { total: number; byLevel: Record<string, number> } {
    const byLevel = this.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.logs.length,
      byLevel,
    };
  }

  // Get logs from the last X minutes
  getRecentLogsByTime(minutes: number = 5): LogEntry[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.logs.filter((log) => new Date(log.timestamp) >= cutoff);
  }

  // Search logs by message content
  searchLogs(searchTerm: string): LogEntry[] {
    const term = searchTerm.toLowerCase();
    return this.logs.filter(
      (log) =>
        log.message.toLowerCase().includes(term) ||
        JSON.stringify(log.data).toLowerCase().includes(term)
    );
  }
}
