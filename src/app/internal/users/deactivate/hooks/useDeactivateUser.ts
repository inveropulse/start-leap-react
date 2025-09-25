import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/use-toast";
import { deactivateUser } from "@/api/user-management/deactivate";
import type {
  DeactivateUserRequest,
  DeactivateUserResponse,
} from "@/app/internal/users/deactivate/types";

export const useDeactivateUser = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DeactivateUserResponse,
    Error,
    DeactivateUserRequest
  >({
    mutationFn: async (req) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await deactivateUser(req);
        toast({
          title: "User deactivated",
          description: "User deactivated successfully.",
          variant: "default",
        });
        return response;
      } catch (err: any) {
        setError(err.message || "Failed to deactivate user");
        toast({
          title: "Deactivation failed",
          description: err.message || "Failed to deactivate user",
          variant: "destructive",
        });
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    deactivateUser: mutation.mutateAsync,
    isSubmitting,
    error,
    reset: mutation.reset,
  };
};
