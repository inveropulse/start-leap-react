import { IDestinationService, LogEntry } from "../types";
import type { SendLogRequest } from "@/api/logging/sendLog";

export class ExternalApiLogDestination implements IDestinationService {
  private sendLogFn: ((request: SendLogRequest) => void) | null = null;

  initialize(sendLogFn: (request: SendLogRequest) => void): void {
    this.sendLogFn = sendLogFn;
  }

  public async sendAsync(entryOrEntries: LogEntry | LogEntry[]): Promise<void> {
    if (!this.isReady()) {
      return;
    }

    if (Array.isArray(entryOrEntries)) {
      this.sendLogFn!({ logs: entryOrEntries });
    } else {
      this.sendLogFn!({ logs: [entryOrEntries] });
    }
  }

  isReady(): boolean {
    return this.sendLogFn !== null;
  }
}
