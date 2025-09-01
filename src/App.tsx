import "./App.css";
import { NotFoundPage } from "@/app/auth/not-found";
import WithProviders from "./shared/providers/WithProviders";
import { PublicRoute } from "./shared/components/PublicRoute";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { getEnabledPortals, getEnabledPublicRoutes } from "./routes/registry";

export default function App() {
  return (
    <WithProviders>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppRoutes />
      </Router>
    </WithProviders>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {getEnabledPublicRoutes().map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<PublicRoute>{route.element}</PublicRoute>}
        />
      ))}

      {getEnabledPortals().map((portal) => {
        return portal.routes.map((route) => (
          <Route
            path={route.path}
            key={`${portal.key}-${route.path}`}
            element={
              <ProtectedRoute requiredPortal={portal.key}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ));
      })}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
