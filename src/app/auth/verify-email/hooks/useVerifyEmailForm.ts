import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/services/auth/hooks";
import { useNotifications } from "@/shared/providers/NotificationProvider";

// Form validation schema for email input (when resending)
const verifyEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export type VerificationStatus =
  | "verifying"
  | "success"
  | "failed"
  | "expired"
  | "pending";

export function useVerifyEmailForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const notifications = useNotifications();

  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("pending");
  const [extractedEmail, setExtractedEmail] = useState<string>("");

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Extract verification details from URL or state
  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("t");
    const emailParam = searchParams.get("email") || searchParams.get("e");
    const stateEmail = location.state?.email;

    const userEmail = emailParam || stateEmail || "";
    setExtractedEmail(userEmail);

    // Set the form value if we have an email
    if (userEmail) {
      form.setValue("email", userEmail);
    }

    // Handle cases where verification should be attempted or redirect
    if (token && userEmail) {
      // Auto-verify if both token and email are present - will be handled by submit hook
      return;
    } else if (token && !userEmail) {
      // Token without email - still attempt verification
      return;
    } else if (!userEmail && !token) {
      // No email or token provided, redirect to register
      notifications.showError(
        "Invalid Verification Link",
        "Please use the verification link from your email"
      );
      navigate("/register");
    }
  }, [searchParams, location.state, navigate, notifications, form]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/clinic");
    }
  }, [isAuthenticated, navigate]);

  return {
    form,
    verificationStatus,
    setVerificationStatus,
    extractedEmail,
    searchParams,
  };
}
