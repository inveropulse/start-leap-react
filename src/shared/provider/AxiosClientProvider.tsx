import { logger } from "../services/logging/logger";
import { APP_CONFIG } from "@/shared/AppConfig";
import baseAxios, { AxiosInstance } from "axios";
import { request } from "@/api/generated/core/request";
import { ApiClient, CancelablePromise } from "@/api/generated";
import { createContext, PropsWithChildren, useContext } from "react";
import { AxiosHttpRequest } from "@/api/generated/core/AxiosHttpRequest";
import { ApiRequestOptions } from "@/api/generated/core/ApiRequestOptions";
import { AuthError, AuthErrorFactory } from "../utils/errorHandling";

export type AxiosClientContextType = {
  readonly apiClient: ApiClient;
  readonly axios: AxiosInstance;
};

const AxiosClientContext = createContext<AxiosClientContextType>(undefined!);

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
   * Performs the actual token refresh
   */
  private async performTokenRefresh(): Promise<string> {
    const { useAuthStore } = await import("@/shared/services/auth/store");
    const authState = useAuthStore.getState();

    if (!authState.refreshToken) {
      const error = AuthErrorFactory.tokenExpired({
        reason: "no_refresh_token",
      });
      authState.logout();
      throw error;
    }

    try {
      logger.info("Attempting token refresh", {
        hasRefreshToken: !!authState.refreshToken,
        source: "token-refresh-manager",
      });

      const refreshResponse = await axios.post(
        "/auth/refresh",
        {
          token: authState.accessToken,
          refreshToken: authState.refreshToken,
        },
        {
          _skipAuthRetry: true, // Prevent infinite loops
        } as any
      );

      const { token: newAccessToken, refresh: newRefreshToken } =
        refreshResponse.data.data;

      if (!newAccessToken) {
        throw AuthErrorFactory.tokenExpired({
          reason: "invalid_refresh_response",
        });
      }

      // Update auth store with new tokens
      authState.update({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenExpiry: Date.now() + 3600 * 1000, // Default 1 hour
        error: null,
        errorCode: null,
      });

      logger.info("Token refresh successful", {
        source: "token-refresh-manager",
      });

      return newAccessToken;
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

      // Clear auth state on refresh failure
      authState.update({
        error: authError.toUserMessage(),
        errorCode: authError.code,
      });
      authState.logout();

      throw authError;
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
    logger.error("API Request failed to send", error, {
      source: "axios-request-interceptor",
    });
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with proper race condition handling
axios.interceptors.response.use(
  (response) => {
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

export default function AxiosClientProvider(props: PropsWithChildren) {
  return (
    <AxiosClientContext.Provider value={{ apiClient, axios }}>
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
