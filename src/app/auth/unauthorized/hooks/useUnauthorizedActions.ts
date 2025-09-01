import { useNavigate } from "react-router-dom";
import { getPortalByType } from "@/routes/registry";
import { useAuth } from "@/shared/services/auth/hooks";
import { useLogging } from "@/shared/providers/LoggingProvider";

export function useUnauthorizedActions() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, currentPortal } = useAuth();

  const logger = useLogging({
    feature: "UnauthorizedPage",
    metadata: { component: "UnauthorizedPage" },
  });

  const handleGoBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate("/");
  };

  const handleGoToPortals = () => {
    if (isAuthenticated && currentPortal) {
      navigate(getPortalByType(currentPortal).basePath);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      logger.info("User logout from unauthorized page", {
        user: user?.email || "anonymous",
        action: "logout-from-unauthorized",
      });
      await logout();
      navigate("/login");
    } catch (error) {
      navigate("/login");
    }
  };

  const handleSignIn = (location: any) => {
    navigate("/login", {
      state: {
        from: location.state?.from || { pathname: "/" },
      },
    });
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return {
    handleGoBack,
    handleGoToPortals,
    handleLogout,
    handleSignIn,
    handleRegister,
    handleGoHome,
    user,
  };
}
