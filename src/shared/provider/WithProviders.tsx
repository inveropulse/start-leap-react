import { PropsWithChildren } from "react";
import LoggingProvider from "./LoggingProvider";
import TanstackProvider from "./TanstackProvider";
import AxiosClientProvider from "./AxiosClientProvider";
import { ErrorBoundary } from "@/shared//components/Error/ErrorBoundary";

export default function WithProviders(props: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <LoggingProvider>
        <TanstackProvider>
          <AxiosClientProvider>{props.children}</AxiosClientProvider>
        </TanstackProvider>
      </LoggingProvider>
    </ErrorBoundary>
  );
}
