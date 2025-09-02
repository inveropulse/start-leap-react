import { QuickActionKey } from "@/routes/types";

export const QUICK_ACTION_PARAM_KEY = "qa";

export const quickActionTo = (to: string, actionKey: QuickActionKey, additionalParams?: Record<string, string>) => {
  const searchParams = new URLSearchParams({ [QUICK_ACTION_PARAM_KEY]: actionKey });
  
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
  }
  
  return {
    pathname: to,
    search: `?${searchParams}`,
  };
};

export const quickActionState = (actionKey: QuickActionKey, additionalData?: Record<string, any>) => ({
  [QUICK_ACTION_PARAM_KEY]: actionKey,
  ...additionalData,
});
