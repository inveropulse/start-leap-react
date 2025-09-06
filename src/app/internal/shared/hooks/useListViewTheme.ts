import { usePortalTheme, PortalTheme } from "@/shared/hooks/usePortalTheme";
import { PortalType } from "@/shared/types";

export type ListViewTheme = PortalTheme & {
  readonly textPrimaryClass: string;
  readonly textSecondaryClass: string;
  readonly borderClass: string;
  readonly hoverClass: string;
  readonly buttonPrimaryClass: string;
  readonly buttonSecondaryClass: string;
};

export function useListViewTheme(): ListViewTheme {
  const portalTheme = usePortalTheme(PortalType.INTERNAL);
  
  return {
    ...portalTheme,
    textPrimaryClass: "text-portal-internal-primary",
    textSecondaryClass: "text-portal-internal-secondary", 
    borderClass: "border-portal-internal-accent/20",
    hoverClass: "hover:bg-portal-internal-secondary/20",
    buttonPrimaryClass: "bg-portal-internal-primary text-primary-foreground hover:bg-portal-internal-primary/90",
    buttonSecondaryClass: "border-portal-internal-accent/20 hover:bg-portal-internal-secondary/20",
  };
}