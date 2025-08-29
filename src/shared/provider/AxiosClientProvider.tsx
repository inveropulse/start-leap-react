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
    <div>
      <AxiosClientContext.Provider value={{ apiClient: apiClient, axios }}>
        {props.children}
      </AxiosClientContext.Provider>
    </div>
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

axios.interceptors.request.use((config) => {
  // Add any request interceptors here
  return config;
});

axios.interceptors.response.use((response) => {
  // Add any response interceptors here
  return response;
});

const httpRequest = class AxiosHttpRequestInstance extends AxiosHttpRequest {
  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return request(this.config, options, axios);
  }
};

const apiClient = new ApiClient(undefined, httpRequest);
