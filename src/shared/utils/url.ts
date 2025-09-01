/**
 * Utility function to build URLs by combining a base path with an optional relative path
 * @param basePath - The base path (e.g., "/clinic")
 * @param relative - Optional relative path to append (e.g., "appointments")
 * @returns Combined URL path
 */
export const buildUrl = (basePath: string, relative?: string): string => {
  const base = basePath.replace(/\/$/, "");
  const rel = (relative ?? "").replace(/^\//, "");
  return rel ? `${base}/${rel}` : base;
};

/**
 * Additional URL utilities can be added here as needed
 */
export const isExternalUrl = (url: string): boolean => {
  try {
    return new URL(url).origin !== window.location.origin;
  } catch {
    return false;
  }
};

export const getQueryParams = (search: string): Record<string, string> => {
  return Object.fromEntries(new URLSearchParams(search));
};
