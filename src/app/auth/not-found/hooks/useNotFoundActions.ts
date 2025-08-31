import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/services/auth/hooks";
import { usePortalInfoAndRoutes } from "@/shared/hooks/usePortalInfoAndRoutes";

interface Suggestion {
  name: string;
  path: string;
  icon: string;
}

export function useNotFoundActions() {
  const navigate = useNavigate();
  const { isAuthenticated, currentPortal, availablePortals } = useAuth();
  const { PORTAL_INFO } = usePortalInfoAndRoutes();

  const handleGoHome = () => {
    if (isAuthenticated && currentPortal) {
      navigate(PORTAL_INFO[currentPortal].route);
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
      Object.entries(PORTAL_INFO).forEach(([portalType, portalInfo]) => {
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
