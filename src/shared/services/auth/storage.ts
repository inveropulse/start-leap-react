import CryptoJS from "crypto-js";
import { APP_CONFIG } from "@/shared/AppConfig";

export enum StorageEventType {
  DECRYPT_ERROR = "decrypt_error",
  ENCRYPT_ERROR = "encrypt_error",
  CORRUPTED_DATA = "corrupted_data",
  EXTERNAL_DELETION = "external_deletion",
  EXTERNAL_MODIFICATION = "external_modification",
}

interface StorageEvent {
  type: StorageEventType;
  key: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

type StorageEventListener = (event: StorageEvent) => void;

class SimpleSecureStorage {
  private key = APP_CONFIG.auth.encryptionKey;
  private listeners: StorageEventListener[] = [];
  private storageListener: ((event: StorageEvent) => void) | null = null;
  private monitoredKeys: Set<string> = new Set();

  // Add event listener
  addListener(listener: StorageEventListener): void {
    this.listeners.push(listener);
  }

  // Remove event listener
  removeListener(listener: StorageEventListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  // Start monitoring a specific key for external changes
  startMonitoring(key: string): void {
    this.monitoredKeys.add(key);

    // Set up storage event listener if not already done
    if (!this.storageListener) {
      this.storageListener = (browserEvent: any) => {
        // Only handle storage events from other tabs/windows or direct manipulation
        if (browserEvent.key && this.monitoredKeys.has(browserEvent.key)) {
          // Check if the value was deleted
          if (
            browserEvent.newValue === null &&
            browserEvent.oldValue !== null
          ) {
            this.notify({
              type: StorageEventType.EXTERNAL_DELETION,
              key: browserEvent.key,
              timestamp: new Date(),
              success: false,
              error: "Storage key was manually deleted",
            });
          }
          // Check if the value was modified externally
          else if (
            browserEvent.newValue !== null &&
            browserEvent.oldValue !== null &&
            browserEvent.newValue !== browserEvent.oldValue
          ) {
            this.notify({
              type: StorageEventType.EXTERNAL_MODIFICATION,
              key: browserEvent.key,
              timestamp: new Date(),
              success: false,
              error: "Storage key was manually modified",
            });
          }
        }
      };

      // Add the storage event listener
      window.addEventListener("storage", this.storageListener as any);
    }
  }

  // Stop monitoring a specific key
  stopMonitoring(key: string): void {
    this.monitoredKeys.delete(key);

    // If no keys are being monitored, remove the listener
    if (this.monitoredKeys.size === 0 && this.storageListener) {
      window.removeEventListener("storage", this.storageListener as any);
      this.storageListener = null;
    }
  }

  // Notify all listeners
  private notify(event: StorageEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Storage event listener error:", error);
      }
    });
  }

  encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonString, this.key).toString();
    } catch (error) {
      console.error("Encryption failed:", error);
      this.notify({
        type: StorageEventType.ENCRYPT_ERROR,
        key: "unknown",
        timestamp: new Date(),
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown encryption error",
      });
      throw new Error("Failed to encrypt data");
    }
  }

  decrypt(encrypted: string): any {
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(encrypted, this.key);
      const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Failed to decrypt data");
    }
  }

  setItem(key: string, value: any): void {
    try {
      const encrypted = this.encrypt(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Storage write failed:", error);
      // Fallback to regular storage for non-sensitive data
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem(key: string): any {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        return null;
      }

      const result = this.decrypt(stored);
      return result;
    } catch (error) {
      // Try parsing as regular JSON (fallback)
      try {
        const stored = localStorage.getItem(key);
        const result = stored ? JSON.parse(stored) : null;

        this.notify({
          type: StorageEventType.DECRYPT_ERROR,
          key,
          timestamp: new Date(),
          success: false,
          error: "Decryption failed, possible data tampering",
        });

        return result;
      } catch {
        // Clear corrupted data
        localStorage.removeItem(key);

        this.notify({
          type: StorageEventType.CORRUPTED_DATA,
          key,
          timestamp: new Date(),
          success: false,
          error: "Data corrupted, removed from storage",
        });

        return null;
      }
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

export const secureStorage = new SimpleSecureStorage();
