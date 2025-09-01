import { PublicConfig } from "./types";
import LoginPage from "@/app/auth/login/LoginPage";
import { RegisterPage } from "@/app/auth/register";
import { NotFoundPage } from "@/app/auth/not-found";
import { VerifyEmailPage } from "@/app/auth/verify-email";
import { UnauthorizedPage } from "@/app/auth/unauthorized";
import { ResetPasswordPage } from "@/app/auth/reset-password";
import { ForgotPasswordPage } from "@/app/auth/forgot-password";

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
