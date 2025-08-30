import CryptoJS from "crypto-js";
import { APP_CONFIG } from "@/shared/AppConfig";

class SimpleSecureStorage {
  private key = APP_CONFIG.auth.encryptionKey;

  encrypt(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonString, this.key).toString();
    } catch (error) {
      console.error("Encryption failed:", error);
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
      if (!stored) return null;

      return this.decrypt(stored);
    } catch (error) {
      // Try parsing as regular JSON (fallback)
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
      } catch {
        // Clear corrupted data
        localStorage.removeItem(key);
        return null;
      }
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

export const secureStorage = new SimpleSecureStorage();
