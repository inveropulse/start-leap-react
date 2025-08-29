import { PropsWithChildren } from "react";
import TanstackProvider from "./TanstackProvider";
import AxiosClientProvider from "./AxiosClientProvider";
import { ErrorBoundary } from "@/shared//components/Error/ErrorBoundary";

export default function WithProviders(props: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <TanstackProvider>
        <AxiosClientProvider>{props.children}</AxiosClientProvider>
      </TanstackProvider>
    </ErrorBoundary>
  );
}
