import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useAuth } from "@/shared/services/auth/hooks";
import { logger } from "@/shared/services/logging/logger";

// Form validation schema
const formSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof formSchema>;

export function useLoginForm() {
  const { error, clearError } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Clear auth errors when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [form.watch("email"), form.watch("password"), error, clearError]);

  // Log form validation errors
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change" && name) {
        // Only log when there are validation errors
        const fieldError = form.formState.errors[name as keyof LoginFormData];
        if (fieldError) {
          logger.warn("Login form validation error", {
            fieldName: name,
            errorType: fieldError.type,
            errorMessage: fieldError.message,
            hasEmail: !!value.email,
            hasPassword: !!value.password,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return {
    form,
    formSchema,
  };
}
