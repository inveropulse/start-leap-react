import { EnrichedLogData, LogEnrichmentOptions } from "./types";
import { APP_CONFIG } from "../../AppConfig";

interface AuthData {
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  sessionId?: string;
  currentPortal?: string;
  isAuthenticated?: boolean;
}

// Helper function to get auth data - will be updated once we implement auth store integration
const getAuthDataForLogging = (): AuthData => {
  try {
    // Try to get from localStorage/sessionStorage as fallback
    const authData =
      localStorage?.getItem("user") || sessionStorage?.getItem("user");
    if (authData) {
      const parsed = JSON.parse(authData);
      return {
        userId: parsed.id || parsed.userId,
        userEmail: parsed.email,
        userName: parsed.name || parsed.fullName,
        userRole: parsed.role || parsed.userRole,
        sessionId: parsed.sessionId,
        currentPortal: parsed.currentPortal,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.warn("Failed to get auth data for logging:", error);
  }

  return {
    sessionId: `fallback_${Date.now()}`,
    isAuthenticated: false,
  };
};

export class LogEnrichmentService {
  private static instance: LogEnrichmentService;
  private performanceStartTime: number =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  public static getInstance(): LogEnrichmentService {
    if (!LogEnrichmentService.instance) {
      LogEnrichmentService.instance = new LogEnrichmentService();
    }
    return LogEnrichmentService.instance;
  }

  public enrichLogData(options: LogEnrichmentOptions = {}): EnrichedLogData {
    try {
      const {
        includeUserData = true,
        includePerformanceData = true,
        includeDeviceData = true,
        includeLocationData = true,
        action,
        component,
        metadata,
      } = options;

      const now = new Date();
      const performanceNow =
        typeof performance !== "undefined" ? performance.now() : Date.now();

      const enrichedData: EnrichedLogData = {
        // Time Information (always included)
        timestamp: now.toISOString(),
        ...this.getTimezoneInfo(),

        // Performance (always basic info)
        performanceNow,

        // Application Context (always included)
        applicationName: APP_CONFIG.applicationName || "Unknown",
        environment: APP_CONFIG.environment || "Unknown",
        buildVersion:
          (globalThis as any)?.process?.env?.REACT_APP_VERSION ||
          APP_CONFIG.version,

        // Session ID (required field)
        sessionId: this.getUserInfo().sessionId || `session_${Date.now()}`,

        // Action/Event Context
        action,
        component,
        metadata,

        // Default values for required fields (will be overridden by conditional enrichment)
        url: "Unknown",
        pathname: "/",
        search: "",
        hash: "",
        referrer: "",
        userAgent: "Unknown",
        browser: "Unknown",
        platform: "Unknown",
        language: "en",
        languages: ["en"],
        cookieEnabled: false,
        onLine: true,
        screenWidth: 0,
        screenHeight: 0,
        viewportWidth: 0,
        viewportHeight: 0,
        pixelRatio: 1,
        colorDepth: 24,

        // Conditional enrichment (will override defaults)
        ...(includeUserData && this.getUserInfo()),
        ...(includeLocationData && this.getLocationInfo()),
        ...(includeDeviceData && this.getBrowserInfo()),
        ...(includeDeviceData && this.getDisplayInfo()),
        ...(includePerformanceData && this.getPerformanceInfo()),
      };

      return enrichedData;
    } catch (error) {
      console.warn("Failed to enrich log data:", error);
      return this.getFallbackEnrichedData(options);
    }
  }

  private getUserInfo(): Partial<EnrichedLogData> {
    try {
      // Get user info from auth store helper
      const authData = getAuthDataForLogging();

      return {
        userId: authData.userId,
        userEmail: authData.userEmail,
        userName: authData.userName,
        userRole: authData.userRole,
        sessionId: authData.sessionId || `session_${Date.now()}`,
      };
    } catch {
      return {
        sessionId: `fallback_${Date.now()}`,
      };
    }
  }

  private getTimezoneInfo(): Pick<EnrichedLogData, "timezone" | "utcOffset"> {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const utcOffset = -new Date().getTimezoneOffset(); // Flip sign for standard format

      return { timezone, utcOffset };
    } catch {
      return {
        timezone: "UTC",
        utcOffset: 0,
      };
    }
  }

  private getLocationInfo(): Pick<
    EnrichedLogData,
    "url" | "pathname" | "search" | "hash" | "referrer"
  > {
    if (typeof window === "undefined" || !window.location) {
      return {
        url: "Server",
        pathname: "/",
        search: "",
        hash: "",
        referrer: "",
      };
    }

    return {
      url: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      referrer: document.referrer || "",
    };
  }

  private getBrowserInfo(): Pick<
    EnrichedLogData,
    | "userAgent"
    | "browser"
    | "platform"
    | "language"
    | "languages"
    | "cookieEnabled"
    | "onLine"
  > {
    if (typeof navigator === "undefined") {
      return {
        userAgent: "Server",
        browser: "Server",
        platform: "Server",
        language: "en",
        languages: ["en"],
        cookieEnabled: false,
        onLine: true,
      };
    }

    // Parse user agent for browser info
    const userAgent = navigator.userAgent;
    let browser = "Unknown";

    if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
      browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      browser = "Safari";
    else if (userAgent.includes("Edg")) browser = "Edge";
    else if (userAgent.includes("Opera") || userAgent.includes("OPR"))
      browser = "Opera";

    return {
      userAgent,
      browser,
      platform: navigator.platform || "Unknown",
      language: navigator.language || "en",
      languages: [...(navigator.languages || ["en"])], // Convert readonly array to mutable
      cookieEnabled: navigator.cookieEnabled || false,
      onLine: navigator.onLine !== false,
    };
  }

  private getDisplayInfo(): Pick<
    EnrichedLogData,
    | "screenWidth"
    | "screenHeight"
    | "viewportWidth"
    | "viewportHeight"
    | "pixelRatio"
    | "colorDepth"
  > {
    if (typeof window === "undefined" || !window.screen) {
      return {
        screenWidth: 0,
        screenHeight: 0,
        viewportWidth: 0,
        viewportHeight: 0,
        pixelRatio: 1,
        colorDepth: 24,
      };
    }

    return {
      screenWidth: window.screen.width || 0,
      screenHeight: window.screen.height || 0,
      viewportWidth:
        window.innerWidth || document.documentElement?.clientWidth || 0,
      viewportHeight:
        window.innerHeight || document.documentElement?.clientHeight || 0,
      pixelRatio: window.devicePixelRatio || 1,
      colorDepth: window.screen.colorDepth || 24,
    };
  }

  private getPerformanceInfo(): Pick<EnrichedLogData, "memoryUsage"> {
    const performanceData: any = {};

    // Memory usage (Chrome/Edge only)
    if (typeof performance !== "undefined" && (performance as any).memory) {
      const memory = (performance as any).memory;
      performanceData.memoryUsage = {
        usedJSHeapSize: memory.usedJSHeapSize || 0,
        totalJSHeapSize: memory.totalJSHeapSize || 0,
        jsHeapSizeLimit: memory.jsHeapSizeLimit || 0,
      };
    }

    return performanceData;
  }

  private getFallbackEnrichedData(
    options: LogEnrichmentOptions
  ): EnrichedLogData {
    const authData = getAuthDataForLogging();

    return {
      sessionId: authData.sessionId || `fallback_${Date.now()}`,
      timestamp: new Date().toISOString(),
      timezone: "UTC",
      utcOffset: 0,
      url: "Unknown",
      pathname: "/",
      search: "",
      hash: "",
      referrer: "",
      userAgent: "Unknown",
      browser: "Unknown",
      platform: "Unknown",
      language: "en",
      languages: ["en"],
      cookieEnabled: false,
      onLine: true,
      screenWidth: 0,
      screenHeight: 0,
      viewportWidth: 0,
      viewportHeight: 0,
      pixelRatio: 1,
      colorDepth: 24,
      performanceNow: Date.now(),
      applicationName: APP_CONFIG.applicationName || "Unknown",
      environment: APP_CONFIG.environment || "Unknown",
      action: options.action,
      component: options.component,
      metadata: options.metadata,
      userId: authData.userId,
      userEmail: authData.userEmail,
      userName: authData.userName,
      userRole: authData.userRole,
    };
  }

  // Utility method to check if running in browser
  public isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  // Utility method to safely get performance timing
  public getPageLoadTime(): number | null {
    try {
      if (typeof performance !== "undefined" && performance.timing) {
        const timing = performance.timing;
        return timing.loadEventEnd - timing.navigationStart;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Method to get current memory usage percentage
  public getMemoryUsagePercentage(): number | null {
    try {
      if (typeof performance !== "undefined" && (performance as any).memory) {
        const memory = (performance as any).memory;
        return Math.round(
          (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        );
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const logEnrichment = LogEnrichmentService.getInstance();

// Export helper functions for common use cases
export const enrichForAuth = (
  action: string,
  metadata?: Record<string, any>
): EnrichedLogData =>
  logEnrichment.enrichLogData({
    action,
    component: "AuthService",
    metadata,
    includeUserData: true,
    includeLocationData: false, // Auth events don't need full location data
    includeDeviceData: true,
    includePerformanceData: false,
  });

export const enrichForNavigation = (
  action: string,
  metadata?: Record<string, any>
): EnrichedLogData =>
  logEnrichment.enrichLogData({
    action,
    component: "Router",
    metadata,
    includeUserData: true,
    includeLocationData: true,
    includeDeviceData: false, // Navigation doesn't need device details
    includePerformanceData: true,
  });

export const enrichForAPI = (
  action: string,
  metadata?: Record<string, any>
): EnrichedLogData =>
  logEnrichment.enrichLogData({
    action,
    component: "ApiClient",
    metadata,
    includeUserData: true,
    includeLocationData: false,
    includeDeviceData: false,
    includePerformanceData: true,
  });

export const enrichForError = (
  component: string,
  metadata?: Record<string, any>
): EnrichedLogData =>
  logEnrichment.enrichLogData({
    action: "error_boundary",
    component,
    metadata,
    includeUserData: true,
    includeLocationData: true,
    includeDeviceData: true,
    includePerformanceData: true, // Full data for error analysis
  });

export const enrichForUserAction = (
  action: string,
  component: string,
  metadata?: Record<string, any>
): EnrichedLogData =>
  logEnrichment.enrichLogData({
    action,
    component,
    metadata,
    includeUserData: true,
    includeLocationData: true,
    includeDeviceData: false,
    includePerformanceData: false,
  });
