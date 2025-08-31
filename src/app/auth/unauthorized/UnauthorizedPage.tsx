import { Link } from "react-router-dom";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useUnauthorizedState } from "./hooks/useUnauthorizedState";
import { useUnauthorizedActions } from "./hooks/useUnauthorizedActions";

export default function UnauthorizedPage() {
  const { fromPath, attemptedAction, isAuthenticated, location } =
    useUnauthorizedState();
  const {
    handleGoBack,
    handleGoToPortals,
    handleLogout,
    handleSignIn,
    handleRegister,
    handleGoHome,
    user,
  } = useUnauthorizedActions();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
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
          <CardTitle className="text-2xl text-destructive">
            Access Denied
          </CardTitle>
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
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Current User:
                  </h4>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Role: {user.role}
                  </p>
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
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-primary"
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
                    <h3 className="text-sm font-medium text-primary">
                      Authentication Required
                    </h3>
                    <div className="mt-2 text-sm text-primary/80">
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
                  onClick={() => handleSignIn(location)}
                  className="w-full"
                >
                  Sign In
                </Button>

                <Button
                  onClick={handleRegister}
                  variant="outline"
                  className="w-full"
                >
                  Create Account
                </Button>

                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link
                to="/contact"
                className="text-primary hover:text-primary/80 font-medium"
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
