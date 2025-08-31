import { APP_CONFIG } from "@/shared/AppConfig";
import baseAxios, { AxiosInstance } from "axios";
import { logger } from "../services/logging/logger";
import { request } from "@/api/generated/core/request";
import { ApiClient, CancelablePromise } from "@/api/generated";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { AuthError, AuthErrorFactory } from "../utils/errorHandling";
import { AxiosHttpRequest } from "@/api/generated/core/AxiosHttpRequest";
import { ApiRequestOptions } from "@/api/generated/core/ApiRequestOptions";
import {
  createFakeApiRefreshResponse,
  createRefreshResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/api/auth/refresh";

export type AxiosClientContextType = {
  readonly apiClient: ApiClient;
  readonly axios: AxiosInstance;
  readonly isLoading: boolean;
};

const AxiosClientContext = createContext<AxiosClientContextType>(undefined!);

/**
 * Simple loading manager to track active API requests
 */
class LoadingManager {
  private activeRequests = 0;
  private updateCallback: ((isLoading: boolean) => void) | null = null;

  setUpdateCallback(callback: (isLoading: boolean) => void) {
    this.updateCallback = callback;
  }

  increment(url?: string) {
    if (url?.includes("/api/Log")) return;
    this.activeRequests++;
    this.updateCallback?.(true);
  }

  decrement(url?: string) {
    if (url?.includes("/api/Log")) return;
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    this.updateCallback?.(this.activeRequests > 0);
  }
}

const loadingManager = new LoadingManager();

/**
 * Enhanced token refresh manager to handle race conditions
 */
class TokenRefreshManager {
  private refreshPromise: Promise<string> | null = null;
  private pendingRequests: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
    request: any;
  }> = [];
  private apiClient: ApiClient | null = null;

  /**
   * Initialize with API client instance
   */
  initialize(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Handles token refresh with proper race condition management
   */
  async handleTokenRefresh(originalRequest: any): Promise<any> {
    // If refresh is already in progress, queue this request
    if (this.refreshPromise) {
      return new Promise((resolve, reject) => {
        this.pendingRequests.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          },
          reject,
          request: originalRequest,
        });
      });
    }

    // Start refresh process
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;

      // Process all pending requests with new token
      this.processPendingRequests(null, newToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axios(originalRequest);
    } catch (error) {
      // Process pending requests with error
      this.processPendingRequests(error, null);
      throw error;
    } finally {
      // Reset refresh state
      this.refreshPromise = null;
      this.pendingRequests = [];
    }
  }

  /**
   * Performs the actual token refresh using your API layer
   */
  private async performTokenRefresh(): Promise<string> {
    const { useAuthStore } = await import("@/shared/services/auth/store");
    const authState = useAuthStore.getState();

    if (!authState.refreshToken) {
      const error = AuthErrorFactory.tokenExpired({
        reason: "no_refresh_token",
      });
      await this.performLogout(); // Trigger logout API call
      authState.logout();
      throw error;
    }

    try {
      logger.info("Attempting token refresh", {
        hasRefreshToken: !!authState.refreshToken,
        source: "token-refresh-manager",
      });

      // Use your API layer instead of direct axios call
      const refreshResponse = await this.callRefreshTokenAPI({
        token: authState.accessToken || "",
        refreshToken: authState.refreshToken,
      });

      if (!refreshResponse?.token) {
        throw AuthErrorFactory.tokenExpired({
          reason: "invalid_refresh_response",
        });
      }

      // Update auth store with new tokens
      authState.update({
        accessToken: refreshResponse.token,
        refreshToken: refreshResponse.refresh,
        tokenExpiry: refreshResponse.tokenExpires,
        error: null,
        errorCode: null,
      });

      logger.info("Token refresh successful", {
        source: "token-refresh-manager",
      });

      return refreshResponse.token;
    } catch (error: any) {
      logger.error("Token refresh failed", error, {
        refreshStatus: error.response?.status,
        source: "token-refresh-manager",
      });

      // Convert to AuthError for consistent error handling
      const authError =
        error instanceof AuthError
          ? error
          : AuthErrorFactory.fromApiError(error, "token_refresh");

      // Clear auth state and trigger logout on refresh failure
      authState.update({
        error: authError.toUserMessage(),
        errorCode: authError.code,
      });

      // Trigger logout API call (fail silently if it fails)
      await this.performLogout();
      authState.logout();

      throw authError;
    }
  }

  /**
   * Calls the refresh token API using your API layer (mocked for now)
   */
  private async callRefreshTokenAPI(
    req: RefreshTokenRequest
  ): Promise<RefreshTokenResponse | null> {
    // TODO UNCOMMENT WHEN READY
    // if (this.apiClient) {
    //   try {
    //     const response = await this.apiClient.auth.postApiAuthRefreshToken(req);
    //     if (!response.successful) {
    //       throw new Error("Failed to refresh token");
    //     }
    //     return {
    //       token: response.data.token.token,
    //       tokenExpires: new Date(response.data.token.tokenExpiration).getTime(),
    //       refresh: response.data.refreshToken.token,
    //       refreshExpires: new Date(
    //         response.data.refreshToken.refreshTokenExpiration
    //       ).getTime(),
    //     };
    //   } catch (error) {
    // logger.error("Error calling refresh token API", error, {
    //   source: "token-refresh-manager",
    // });
    //     return null;
    //   }
    // }

    // Mock implementation matching your refresh.ts
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...createRefreshResponse(createFakeApiRefreshResponse()) });
      }, 500);
    });
  }

  /**
   * Triggers logout API call (fails silently)
   */
  private async performLogout(): Promise<void> {
    try {
      logger.info("Triggering logout API call", {
        source: "token-refresh-manager",
      });

      // Mock implementation matching your logout.ts
      // When ready, uncomment the real API call below:

      // if (this.apiClient) {
      //   await this.apiClient.auth.postApiAuthLogout();
      // }

      // Mock implementation
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { success: true } });
        }, 500);
      });

      logger.info("Logout API call successful", {
        source: "token-refresh-manager",
      });
    } catch (error: any) {
      // Fail silently but log the error
      logger.error("Logout API call failed - continuing silently", error, {
        source: "token-refresh-manager",
      });
    }
  }

  /**
   * Processes all pending requests after refresh completion
   */
  private processPendingRequests(error: any, token: string | null) {
    this.pendingRequests.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      } else {
        reject(new Error("Token refresh failed"));
      }
    });
  }

  /**
   * Checks if a refresh is currently in progress
   */
  isRefreshing(): boolean {
    return this.refreshPromise !== null;
  }

  /**
   * Gets the number of pending requests
   */
  getPendingRequestCount(): number {
    return this.pendingRequests.length;
  }
}

const tokenRefreshManager = new TokenRefreshManager();

// Create axios instance with enhanced configuration
const axios = baseAxios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: APP_CONFIG.apiTimeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor with enhanced logging and auth
axios.interceptors.request.use(
  async (config) => {
    // Increment loading counter
    loadingManager.increment(config.url);

    // Add auth token to requests - import auth store dynamically to avoid circular dependencies
    try {
      const { useAuthStore } = await import("@/shared/services/auth/store");
      const authState = useAuthStore.getState();
      if (authState.accessToken && authState.isAuthenticated) {
        config.headers.Authorization = `Bearer ${authState.accessToken}`;
      }
    } catch (error) {
      // Auth store not available yet, continue without token
    }

    // Log API requests
    logger.info("API Request started", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      timeout: config.timeout,
      hasAuth: !!config.headers.Authorization,
      source: "axios-interceptor",
    });

    // Add timestamp for response time calculation
    (config as any).requestStartTime = Date.now();

    return config;
  },
  (error) => {
    // Decrement loading counter on request error
    loadingManager.decrement(error.config?.url);

    logger.error("API Request failed to send", error, {
      source: "axios-request-interceptor",
    });
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with proper race condition handling
axios.interceptors.response.use(
  (response) => {
    // Decrement loading counter on success
    loadingManager.decrement(response.config.url);

    // Calculate response time
    const startTime = (response.config as any).requestStartTime;
    const responseTime = startTime ? Date.now() - startTime : undefined;

    // Log successful API responses
    logger.info("API Request completed successfully", {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      responseTime,
      source: "axios-interceptor",
    });

    return response;
  },
  async (error) => {
    // Decrement loading counter on error
    loadingManager.decrement(error.config?.url);

    const originalRequest = error.config;
    const startTime = (error.config as any)?.requestStartTime;
    const responseTime = startTime ? Date.now() - startTime : undefined;

    // Log API errors
    logger.error("API Request failed", error, {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseTime,
      errorMessage: error.message,
      isAuthError: error.response?.status === 401,
      source: "axios-interceptor",
    });

    // Handle 401 (unauthorized) errors with enhanced token refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRetry
    ) {
      originalRequest._retry = true;

      try {
        // Increment loading counter for retry
        loadingManager.increment(originalRequest.url);
        return await tokenRefreshManager.handleTokenRefresh(originalRequest);
      } catch (refreshError) {
        logger.debug("Request failed after token refresh attempt", {
          url: originalRequest.url,
          error:
            refreshError instanceof Error
              ? refreshError.message
              : "Unknown error",
          source: "axios-interceptor",
        });
        return Promise.reject(refreshError);
      }
    }

    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"] || 5;
      logger.warn("Rate limited - will retry", {
        retryAfter,
        url: originalRequest.url,
        source: "axios-interceptor",
      });

      throw AuthErrorFactory.rateLimited({
        retryAfter: parseInt(retryAfter),
        endpoint: originalRequest.url,
      });
    }

    // Handle server errors (5xx)
    if (error.response?.status >= 500) {
      logger.error("Server error encountered", error, {
        status: error.response.status,
        url: originalRequest.url,
        source: "axios-interceptor",
      });

      throw AuthErrorFactory.serverError({
        status: error.response.status,
        endpoint: originalRequest.url,
      });
    }

    return Promise.reject(error);
  }
);

// Create custom HTTP request implementation
const httpRequest = class AxiosHttpRequestInstance extends AxiosHttpRequest {
  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return request(this.config, options, axios);
  }
};

// Create API client with custom HTTP request
const apiClient = new ApiClient(undefined, httpRequest);

// Initialize token refresh manager with API client
tokenRefreshManager.initialize(apiClient);

export default function AxiosClientProvider(props: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize loading manager callback
  loadingManager.setUpdateCallback(setIsLoading);

  return (
    <AxiosClientContext.Provider value={{ apiClient, axios, isLoading }}>
      {props.children}
    </AxiosClientContext.Provider>
  );
}

export function useAxiosClient() {
  const context = useContext(AxiosClientContext);

  if (context == null) {
    throw new Error(
      `Invocations to ${useAxiosClient.name} should be within a node that is a child of ${AxiosClientProvider.name}`
    );
  }

  return context;
}
