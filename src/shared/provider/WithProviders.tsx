import { PropsWithChildren } from "react";
import TanstackProvider from "./TanstackProvider";
import AxiosClientProvider from "./AxiosClientProvider";
import { PageErrorBoundary, ErrorProvider } from "../components/Error";

export default function WithProviders(props: PropsWithChildren) {
  return (
    <ErrorProvider>
      <PageErrorBoundary level="page">
        <TanstackProvider>
          <AxiosClientProvider>{props.children}</AxiosClientProvider>
        </TanstackProvider>
      </PageErrorBoundary>
    </ErrorProvider>
  );
}
