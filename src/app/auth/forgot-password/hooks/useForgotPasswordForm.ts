import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/services/auth/hooks";

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function useForgotPasswordForm() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/clinic");
    }
  }, [isAuthenticated, navigate]);

  return {
    form,
  };
}
