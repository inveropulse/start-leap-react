import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/services/auth/hooks";
import { PORTALS } from "@/shared/services/auth/types";

interface Suggestion {
  name: string;
  path: string;
  icon: string;
}

export function useNotFoundActions() {
  const navigate = useNavigate();
  const { isAuthenticated, currentPortal } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated && currentPortal) {
      navigate(PORTALS[currentPortal].route);
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
      Object.entries(PORTALS).forEach(([portalType, portalInfo]) => {
        suggestions.push({
          name: portalInfo.name,
          path: portalInfo.route,
          icon: portalInfo.icon,
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
