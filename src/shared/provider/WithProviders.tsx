import { PropsWithChildren } from "react";
import LoggingProvider from "./LoggingProvider";
import TanstackProvider from "./TanstackProvider";
import AxiosClientProvider from "./AxiosClientProvider";
import { ErrorBoundary } from "@/shared//components/Error/ErrorBoundary";

export default function WithProviders(props: PropsWithChildren) {
  return (
    <TanstackProvider>
      <AxiosClientProvider>
        <LoggingProvider>
          <ErrorBoundary>{props.children}</ErrorBoundary>
        </LoggingProvider>
      </AxiosClientProvider>
    </TanstackProvider>
  );
}
