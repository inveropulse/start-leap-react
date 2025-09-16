// Main sedationists module - provides access to all use-cases
import { lazy } from "react";

// Lazy load all use-case components for better performance
export const SedationistsListView = lazy(() =>
  import("./view-all").then((module) => ({
    default: module.SedationistsListView,
  }))
);

export const ManageSedationistModal = lazy(() =>
  import("./manage").then((module) => ({
    default: module.ManageSedationistModal,
  }))
);

export const DeleteSedationistDialog = lazy(() =>
  import("./delete").then((module) => ({
    default: module.DeleteSedationistDialog,
  }))
);

// Export all use-case modules for direct access
export * as ViewAll from "./view-all";
export * as Create from "./create";
export * as Manage from "./manage";
export * as Delete from "./delete";
export * as Shared from "./shared";

// Re-export types for convenience
export * from "./types";

// Backwards compatibility - export the main list component as default
export { SedationistsListView as default };
