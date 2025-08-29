import { IDestinationService, LogEntry, LogLevel } from "../types";

export class ConsoleDestination implements IDestinationService {
  public async sendAsync(entryOrEntries: LogEntry | LogEntry[]): Promise<void> {
    let logs = [];
    if (Array.isArray(entryOrEntries)) {
      logs = [...entryOrEntries];
    } else {
      logs = [entryOrEntries];
    }

    logs.forEach((log) => this.consoleLog(log));
  }

  private consoleLog(logEntry: LogEntry): void {
    try {
      const style = this.getConsoleStyle(logEntry.level);
      const timestamp = new Date(logEntry.timestamp).toLocaleTimeString();

      console.group(
        `%c[${logEntry.level.toUpperCase()}] ${timestamp} - ${
          logEntry.message
        }`,
        style
      );

      if (logEntry.context && Object.keys(logEntry.context).length > 0) {
        console.log("Context:", logEntry.context);
      }

      if (logEntry.data) {
        console.log("Data:", logEntry.data);
      }

      console.groupEnd();
    } catch (err) {
      console.log(
        `[${logEntry.level.toUpperCase()}]`,
        logEntry.message,
        logEntry.data
      );
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      debug: "color: #6B7280; font-weight: normal;",
      info: "color: #3B82F6; font-weight: bold;",
      warn: "color: #F59E0B; font-weight: bold;",
      error: "color: #EF4444; font-weight: bold;",
      fatal: "color: #DC2626; font-weight: bold; background: #FEE2E2;",
    };
    return styles[level];
  }
}
