import { PropsWithChildren } from "react";
import LoggingProvider from "./LoggingProvider";
import TanstackProvider from "./TanstackProvider";
import AxiosClientProvider from "./AxiosClientProvider";
import NotificationProvider from "./NotificationProvider";
import { ErrorBoundary } from "@/shared/components/error/ErrorBoundary";
import { GlobalApiLoadingIndicator } from "@/shared/components/GlobalApiLoadingIndicator";
import { AccessibilityMenu, FocusIndicator, SkipToContent, AccessibilityWrapper } from "@/shared/components/ui";

export default function WithProviders(props: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <LoggingProvider>
        <NotificationProvider>
          <TanstackProvider>
            <AxiosClientProvider>
              <AccessibilityWrapper>
                <FocusIndicator />
                <SkipToContent />
                <AccessibilityMenu />
                {props.children}
                <GlobalApiLoadingIndicator />
              </AccessibilityWrapper>
            </AxiosClientProvider>
          </TanstackProvider>
        </NotificationProvider>
      </LoggingProvider>
    </ErrorBoundary>
  );
}
