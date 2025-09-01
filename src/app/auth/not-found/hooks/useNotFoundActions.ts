import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/services/auth/hooks";
import { getEnabledPortals, getPortalByType } from "@/routes/registry";

export interface Suggestion {
  name: string;
  path: string;
  icon: string;
}

export function useNotFoundActions() {
  const navigate = useNavigate();
  const { isAuthenticated, currentPortal, availablePortals } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated && currentPortal) {
      navigate(getPortalByType(currentPortal).basePath);
    } else {
      navigate("/login");
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  const getSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];

    if (isAuthenticated) {
      // Show all available portals
      getEnabledPortals().forEach((portal) => {
        suggestions.push({
          name: portal.name,
          path: portal.basePath,
          icon: portal.icon,
        });
      });
    } else {
      suggestions.push(
        { name: "Sign In", path: "/login", icon: "🔐" },
        { name: "Create Account", path: "/register", icon: "✨" }
      );
    }

    return suggestions;
  };

  return {
    handleGoHome,
    handleGoBack,
    getSuggestions,
    isAuthenticated,
  };
}
