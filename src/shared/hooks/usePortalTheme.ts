import { PortalType } from "../types";

export type PortalTheme = {
  readonly name: string;
  readonly backgroundClass: string;
  readonly primaryClass: string;
  readonly secondaryClass: string;
  readonly accentClass: string;
  readonly gradientClass: string;
};

const portalThemes: Record<PortalType, PortalTheme> = {
  [PortalType.INTERNAL]: {
    name: "Internal Portal",
    backgroundClass: "bg-[hsl(var(--portal-internal-background))]",
    primaryClass: "bg-[hsl(var(--portal-internal-primary))]",
    secondaryClass: "border-2 border-[hsl(var(--portal-internal-secondary))] border-t-[hsl(var(--portal-internal-primary))]",
    accentClass: "text-[hsl(var(--portal-internal-primary))]",
    gradientClass: "bg-[var(--gradient-portal-internal)]",
  },
  [PortalType.CLINIC]: {
    name: "Clinic Portal",
    backgroundClass: "bg-[hsl(var(--portal-clinic-background))]",
    primaryClass: "bg-[hsl(var(--portal-clinic-primary))]",
    secondaryClass: "border-2 border-[hsl(var(--portal-clinic-secondary))] border-t-[hsl(var(--portal-clinic-primary))]",
    accentClass: "text-[hsl(var(--portal-clinic-primary))]",
    gradientClass: "bg-[var(--gradient-portal-clinic)]",
  },
  [PortalType.PATIENT]: {
    name: "Patient Portal",
    backgroundClass: "bg-[hsl(var(--portal-patient-background))]",
    primaryClass: "bg-[hsl(var(--portal-patient-primary))]",
    secondaryClass: "border-2 border-[hsl(var(--portal-patient-secondary))] border-t-[hsl(var(--portal-patient-primary))]",
    accentClass: "text-[hsl(var(--portal-patient-primary))]",
    gradientClass: "bg-[var(--gradient-portal-patient)]",
  },
  [PortalType.SEDATIONIST]: {
    name: "Sedationist Portal",
    backgroundClass: "bg-[hsl(var(--portal-sedationist-background))]",
    primaryClass: "bg-[hsl(var(--portal-sedationist-primary))]",
    secondaryClass: "border-2 border-[hsl(var(--portal-sedationist-secondary))] border-t-[hsl(var(--portal-sedationist-primary))]",
    accentClass: "text-[hsl(var(--portal-sedationist-primary))]",
    gradientClass: "bg-[var(--gradient-portal-sedationist)]",
  },
} as const;

export function usePortalTheme(portal: PortalType) {
  return portalThemes[portal];
}
