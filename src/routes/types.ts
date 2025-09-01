import React from "react";
import { LucideProps } from "lucide-react";
import { PortalType } from "@/shared/types";

export type AppRoute = {
  readonly path: string;
  readonly index?: boolean;
  readonly element: React.ReactNode;
  readonly meta: {
    readonly title: string;
    readonly enabled: boolean;
    readonly description?: string;
    readonly icon?: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  };
};

export type QuickAction = {
  readonly path: string;
  readonly title: string;
  readonly enabled?: boolean;
  readonly icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export type PortalConfig = {
  readonly key: PortalType;
  readonly name: string;
  readonly icon?: string;
  readonly basePath: `/${string}`;
  readonly roles?: readonly string[];
  readonly summaryDescription?: string;
  readonly description?: string;
  readonly enabled: boolean;
  readonly isAuthRequired: boolean;
  readonly routes: readonly AppRoute[];
  readonly quickActions?: readonly QuickAction[];
};

export type PublicConfig = {
  readonly key: "auth";
  readonly basePath: `/${string}` | "/";
  readonly routes: readonly AppRoute[];
};

export type PortalRegistry = {
  readonly public: PublicConfig;
  readonly portals: readonly PortalConfig[];
};
