import { PropsWithChildren } from "react";
import TanstackProvider from "./TanstackProvider";
import { ErrorBoundary } from "../components/Error";
import AxiosClientProvider from "./AxiosClientProvider";

export default function WithProviders(props: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <TanstackProvider>
        <AxiosClientProvider>{props.children}</AxiosClientProvider>
      </TanstackProvider>
    </ErrorBoundary>
  );
}
