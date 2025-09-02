import { lazy } from "react";
import { PublicConfig } from "./types";

const LoginPage = lazy(() => import("@/app/auth/login/LoginPage"));
const RegisterPage = lazy(() => import("@/app/auth/register/RegisterPage"));
const NotFoundPage = lazy(() => import("@/app/auth/not-found/NotFoundPage"));
const VerifyEmailPage = lazy(
  () => import("@/app/auth/verify-email/VerifyEmailPage")
);
const UnauthorizedPage = lazy(
  () => import("@/app/auth/unauthorized/UnauthorizedPage")
);
const ResetPasswordPage = lazy(
  () => import("@/app/auth/reset-password/ResetPasswordPage")
);
const ForgotPasswordPage = lazy(
  () => import("@/app/auth/forgot-password/ForgotPasswordPage")
);

export enum PublicRoute {
  ROOT = "/",
  LOGIN = "/login",
  NOT_FOUND = "/404",
  REGISTER = "/register",
  VERIFY_EMAIL = "/verify-email",
  UNAUTHORIZED = "/unauthorized",
  RESET_PASSWORD = "/reset-password",
  FORGOT_PASSWORD = "/forgot-password",
}

export const AUTH_CONFIG: PublicConfig = {
  key: "auth",
  basePath: PublicRoute.ROOT,
  routes: [
    {
      index: true,
      path: PublicRoute.ROOT,
      element: <LoginPage />,
      meta: { title: "Login", enabled: true },
    },
    {
      path: PublicRoute.LOGIN,
      element: <LoginPage />,
      meta: { title: "Login", enabled: true },
    },
    {
      path: PublicRoute.REGISTER,
      element: <RegisterPage />,
      meta: { title: "Register", enabled: true },
    },
    {
      path: PublicRoute.FORGOT_PASSWORD,
      element: <ForgotPasswordPage />,
      meta: { title: "Forgot Password", enabled: true },
    },
    {
      path: PublicRoute.RESET_PASSWORD,
      element: <ResetPasswordPage />,
      meta: { title: "Reset Password", enabled: true },
    },
    {
      path: PublicRoute.VERIFY_EMAIL,
      element: <VerifyEmailPage />,
      meta: { title: "Verify Email", enabled: true },
    },
    {
      path: PublicRoute.UNAUTHORIZED,
      element: <UnauthorizedPage />,
      meta: { title: "Unauthorized", enabled: true },
    },
    {
      path: PublicRoute.NOT_FOUND,
      element: <NotFoundPage />,
      meta: { title: "Not Found", enabled: true },
    },
  ],
} as const;
