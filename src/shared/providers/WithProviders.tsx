import { PropsWithChildren } from "react";
import LoggingProvider from "./LoggingProvider";
import TanstackProvider from "./TanstackProvider";
import AxiosClientProvider from "./AxiosClientProvider";
import NotificationProvider from "./NotificationProvider";
import { ErrorBoundary } from "@/shared/components/error/ErrorBoundary";
import { GlobalApiLoadingIndicator } from "@/shared/components/GlobalApiLoadingIndicator";

export default function WithProviders(props: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <LoggingProvider>
        <NotificationProvider>
          <TanstackProvider>
            <AxiosClientProvider>
              {props.children}
              <GlobalApiLoadingIndicator />
            </AxiosClientProvider>
          </TanstackProvider>
        </NotificationProvider>
      </LoggingProvider>
    </ErrorBoundary>
  );
}
