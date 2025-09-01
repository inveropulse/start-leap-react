import { QuickActionKey } from "@/routes/types";

export const QUICK_ACTION_PARAM_KEY = "qa";

export const quickActionTo = (to: string, actionKey: QuickActionKey) => ({
  pathname: to,
  search: `?${new URLSearchParams({ [QUICK_ACTION_PARAM_KEY]: actionKey })}`,
});

export const quickActionState = (actionKey: QuickActionKey) => ({
  [QUICK_ACTION_PARAM_KEY]: actionKey,
});
