import { logger } from "../services/logging/logger";
import { APP_CONFIG } from "@/shared/AppConfig";
import baseAxios, { AxiosInstance } from "axios";
import { request } from "@/api/generated/core/request";
import { ApiClient, CancelablePromise } from "@/api/generated";
import { createContext, PropsWithChildren, useContext } from "react";
import { AxiosHttpRequest } from "@/api/generated/core/AxiosHttpRequest";
import { ApiRequestOptions } from "@/api/generated/core/ApiRequestOptions";

export type AxiosClientContextType = {
  readonly apiClient: ApiClient;
  readonly axios: AxiosInstance;
};

const AxiosClientContext = createContext<AxiosClientContextType>(undefined!);

export default function AxiosClientProvider(props: PropsWithChildren) {
  return (
    <AxiosClientContext.Provider value={{ apiClient: apiClient, axios }}>
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

const axios = baseAxios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: APP_CONFIG.apiTimeout,
});

axios.interceptors.request.use(
  (config) => {
    // Log API requests
    logger.info("API Request started", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      timeout: config.timeout,
      source: "axios-interceptor",
    });

    // Add timestamp for response time calculation
    (config as any).requestStartTime = Date.now();

    return config;
  },
  (error) => {
    // Log request errors
    logger.error("API Request failed to send", error, {
      source: "axios-request-interceptor",
    });
    return Promise.reject(error);
  }
);

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
  (error) => {
    // Calculate response time for errors too
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
      source: "axios-interceptor",
    });

    return Promise.reject(error);
  }
);

const httpRequest = class AxiosHttpRequestInstance extends AxiosHttpRequest {
  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return request(this.config, options, axios);
  }
};

const apiClient = new ApiClient(undefined, httpRequest);
