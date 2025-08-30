import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useLogging } from "@/shared/providers/LoggingProvider";
import { useAuth } from "@/shared/services/auth/hooks";
import { PORTALS } from "@/shared/services/auth/types";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const logger = useLogging({
    feature: "UnauthorizedPage",
    metadata: { component: "UnauthorizedPage" },
  });

  const { isAuthenticated, user, logout, currentPortal, switchPortal } =
    useAuth();

  const fromPath = location.state?.from?.pathname || "";
  const attemptedAction =
    location.state?.attemptedAction || "access this resource";

  useEffect(() => {
    logger.info("Unauthorized access attempt", {
      isAuthenticated,
      fromPath,
      attemptedAction,
      user: user?.email || "anonymous",
      action: "unauthorized-access",
    });
  }, [logger, isAuthenticated, fromPath, attemptedAction, user?.email]);

  const handleGoBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate("/");
  };

  const handleGoToPortals = () => {
    if (isAuthenticated && currentPortal) {
      navigate(PORTALS[currentPortal].route);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-10V7a3 3 0 013 3v0a3 3 0 01-3 3m-6 6h12a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
          <CardDescription className="text-base">
            {isAuthenticated
              ? `You don't have permission to ${attemptedAction}`
              : "You need to sign in to access this resource"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Insufficient Permissions
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Your account doesn't have the required permissions for
                        this action.
                        {fromPath && (
                          <>
                            <br />
                            <span className="font-medium">
                              Attempted to access:
                            </span>{" "}
                            {fromPath}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {user && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Current User:
                  </h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">Role: {user.role}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button onClick={handleGoToPortals} className="w-full">
                  Go to My Portals
                </Button>

                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="w-full"
                >
                  Go Back
                </Button>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Authentication Required
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Please sign in to your account to access this resource.
                        {fromPath && (
                          <>
                            <br />
                            <span className="font-medium">
                              You'll be redirected to:
                            </span>{" "}
                            {fromPath}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() =>
                    navigate("/login", {
                      state: {
                        from: location.state?.from || { pathname: "/" },
                      },
                    })
                  }
                  className="w-full"
                >
                  Sign In
                </Button>

                <Button
                  onClick={() => navigate("/register")}
                  variant="outline"
                  className="w-full"
                >
                  Create Account
                </Button>

                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <Link
                to="/contact"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
