import { PropsWithChildren } from "react";
import MobileLayout from "./mobile/MobileLayout";
import DesktopLayout from "./desktop/DesktopLayout";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export function Layout(props: PropsWithChildren) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout>{props.children}</MobileLayout>;
  }

  return <DesktopLayout>{props.children}</DesktopLayout>;
}
