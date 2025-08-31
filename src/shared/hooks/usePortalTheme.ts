import { PortalType } from "@/shared/services/auth/types";

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
    backgroundClass: "bg-portal-internal-background",
    primaryClass: "bg-portal-internal-primary",
    secondaryClass: "bg-portal-internal-secondary",
    accentClass: "bg-portal-internal-accent",
    gradientClass: "bg-gradient-portal-internal",
  },
  [PortalType.CLINIC]: {
    name: "Clinic Portal",
    backgroundClass: "bg-portal-clinic-background",
    primaryClass: "bg-portal-clinic-primary",
    secondaryClass: "bg-portal-clinic-secondary",
    accentClass: "bg-portal-clinic-accent",
    gradientClass: "bg-gradient-portal-clinic",
  },
  [PortalType.PATIENT]: {
    name: "Patient Portal",
    backgroundClass: "bg-portal-patient-background",
    primaryClass: "bg-portal-patient-primary",
    secondaryClass: "bg-portal-patient-secondary",
    accentClass: "bg-portal-patient-accent",
    gradientClass: "bg-gradient-portal-patient",
  },
  [PortalType.SEDATIONIST]: {
    name: "Sedationist Portal",
    backgroundClass: "bg-portal-sedationist-background",
    primaryClass: "bg-portal-sedationist-primary",
    secondaryClass: "bg-portal-sedationist-secondary",
    accentClass: "bg-portal-sedationist-accent",
    gradientClass: "bg-gradient-portal-sedationist",
  },
} as const;

export function usePortalTheme(portal: PortalType) {
  return portalThemes[portal];
}
