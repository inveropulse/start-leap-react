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

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const logger = useLogging({
    feature: "NotFoundPage",
    metadata: { component: "NotFoundPage" },
  });

  const { isAuthenticated, user, currentPortal, switchPortal } = useAuth();

  const currentPath = location.pathname;

  useEffect(() => {
    logger.info("404 page accessed", {
      path: currentPath,
      isAuthenticated,
      user: user?.email || "anonymous",
      referrer: document.referrer,
      action: "404-access",
    });
  }, [logger, currentPath, isAuthenticated, user?.email]);

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

  const getSuggestions = () => {
    const suggestions = [];

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

  const suggestions = getSuggestions();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
          <CardTitle className="text-3xl text-gray-900">404</CardTitle>
          <CardDescription className="text-lg">
            Oops! The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Requested URL:
            </h4>
            <code className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
              {currentPath}
            </code>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              The page you're looking for might have been moved, deleted, or
              never existed.
            </p>

            <div className="space-y-3">
              <Button onClick={handleGoHome} className="w-full">
                {isAuthenticated ? "Go to My Portal" : "Go to Sign In"}
              </Button>

              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 text-center">
                Or try one of these:
              </h4>
              <div className="grid gap-2">
                {suggestions.map((suggestion, index) => (
                  <Link
                    key={index}
                    to={suggestion.path}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">{suggestion.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {suggestion.name}
                    </span>
                    <svg
                      className="ml-auto h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestion */}
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
                  Looking for something specific?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Double-check the URL for typos, or try navigating from the
                    main portal page.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Still can't find what you're looking for?{" "}
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
