import { APP_CONFIG } from "../AppConfig";
import baseAxios, { AxiosInstance } from "axios";
import { createContext, PropsWithChildren, useContext } from "react";

export type AxiosClientContextType = {
  readonly axios: AxiosInstance;
};

const AxiosClientContext = createContext<AxiosClientContextType>(undefined!);

export default function AxiosClientProvider(props: PropsWithChildren) {
  return (
    <AxiosClientContext.Provider value={{ axios }}>
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

axios.interceptors.request.use((config) => {
  // Add any request interceptors here
  return config;
});

axios.interceptors.response.use((response) => {
  // Add any response interceptors here
  return response;
});
