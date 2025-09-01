import { useEffect } from "react";
import { QUICK_ACTION_PARAM_KEY } from "../utils/quickAction";
import { useLocation, useSearchParams } from "react-router-dom";

export function useQuickAction(onAction: (qa: string) => void) {
  const location = useLocation();
  const [params] = useSearchParams();

  useEffect(() => {
    const qaState = (location.state as any)?.qa as string | undefined;
    const qaQuery = params.get(QUICK_ACTION_PARAM_KEY) ?? undefined;
    const qa = qaState ?? qaQuery;
    if (qa) onAction(qa);
  }, [location.state, params, onAction]);
}
