import "./App.css";
import { AnimatePresence } from "framer-motion";
import NotFoundPage from "./app/auth/not-found/NotFoundPage";
import { useAppLoading } from "./shared/hooks/useAppLoading";
import WithProviders from "./shared/providers/WithProviders";
import { PublicRoute } from "./shared/components/PublicRoute";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { RouteTransition } from "./shared/components/RouteTransition";
import { AppLoadingOverlay } from "./shared/components/AppLoadingOverlay";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { getEnabledPortals, getEnabledPublicRoutes } from "./routes/registry";

export default function App() {
  const { isInitialLoading, showContent, isPortalSwitch } = useAppLoading();

  return (
    <WithProviders>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AnimatePresence mode="wait">
          {isInitialLoading ? (
            <AppLoadingOverlay
              key="loading"
              isLoading={isInitialLoading}
              isPortalSwitch={isPortalSwitch}
            />
          ) : showContent ? (
            <RouteTransition key="routes" isInitialLoad={true}>
              <WithRoutes />
            </RouteTransition>
          ) : null}
        </AnimatePresence>
      </Router>
    </WithProviders>
  );
}

function WithRoutes() {
  return (
    <Routes>
      {getEnabledPublicRoutes().map((route) => (
        <Route
          key={`public-${route.path}`}
          path={route.path}
          element={<PublicRoute>{route.element}</PublicRoute>}
        />
      ))}

      {getEnabledPortals().flatMap((portal) =>
        portal.routes.map((route) => (
          <Route
            path={route.path}
            key={`${portal.key}-${route.path}`}
            element={
              <ProtectedRoute requiredPortal={portal.key}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))
      )}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
