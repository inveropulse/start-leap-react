import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/shared/hooks/use-toast";
import { Sedationist } from "@/shared/types/domains/sedation";
import { sedationistUtils } from "../utils";

/**
 * Shared hook for common sedationist operations across use-cases
 */
export const useSedationistOperations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Navigate to different sedationist pages
  const navigateToView = useCallback(
    (sedationistId: string) => {
      navigate(`/internal/sedationists/manage/${sedationistId}`);
    },
    [navigate]
  );

  const navigateToEdit = useCallback(
    (sedationistId: string) => {
      navigate(`/internal/sedationists/manage/${sedationistId}?tab=profile`);
    },
    [navigate]
  );

  const navigateToDelete = useCallback(
    (sedationistId: string) => {
      navigate(`/internal/sedationists/delete/${sedationistId}`);
    },
    [navigate]
  );

  const navigateToList = useCallback(() => {
    navigate("/internal/sedationists");
  }, [navigate]);

  const navigateToCreate = useCallback(() => {
    navigate("/internal/sedationists/create");
  }, [navigate]);

  // Common toast notifications
  const showSuccessToast = useCallback((message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }, []);

  const showWarningToast = useCallback((message: string) => {
    toast({
      title: "Warning",
      description: message,
      variant: "default",
    });
  }, []);

  // Format sedationist data for display
  const formatSedationistForDisplay = useCallback(
    (sedationist: Sedationist) => {
      return {
        fullName: sedationistUtils.getFullName(
          sedationist.firstName,
          sedationist.lastName
        ),
        initials: sedationistUtils.getInitials(
          sedationist.firstName,
          sedationist.lastName
        ),
        formattedPhone: sedationistUtils.formatPhone(sedationist.phone),
        formattedRating: sedationistUtils.formatRating(sedationist.rating || 0),
        formattedExperience: sedationistUtils.formatExperience(
          sedationist.yearsOfExperience
        ),
        statusConfig: sedationistUtils.getStatusConfig(sedationist.status),
        specialtyLabels:
          sedationist.specialties?.map((s) =>
            sedationistUtils.getSpecialtyLabel(s)
          ) || [],
      };
    },
    []
  );

  // Check if sedationist has active cases (mock logic - replace with actual logic)
  const hasActiveCases = useCallback((sedationistId: string): boolean => {
    // This would typically check against actual appointment/case data
    // For now, return a mock value
    return Math.random() > 0.7; // 30% chance of having active cases
  }, []);

  // Get warning message for deletion
  const getDeletionWarnings = useCallback(
    (sedationist: Sedationist): string[] => {
      const warnings: string[] = [];

      // Check for active cases
      if (hasActiveCases(sedationist.id)) {
        warnings.push(
          "This sedationist has active cases that may be affected."
        );
      }

      // Check for upcoming appointments (mock logic)
      const hasUpcomingAppointments = Math.random() > 0.6; // 40% chance
      if (hasUpcomingAppointments) {
        warnings.push("This sedationist has upcoming appointments scheduled.");
      }

      // Check for recent activity (mock logic)
      const hasRecentActivity = Math.random() > 0.5; // 50% chance
      if (hasRecentActivity) {
        warnings.push("This sedationist has recent activity in the system.");
      }

      return warnings;
    },
    [hasActiveCases]
  );

  // Validate before deletion
  const validateDeletion = useCallback(
    (sedationist: Sedationist): { canDelete: boolean; warnings: string[] } => {
      const warnings = getDeletionWarnings(sedationist);

      // For now, always allow deletion but show warnings
      // In production, you might prevent deletion in certain cases
      return {
        canDelete: true,
        warnings,
      };
    },
    [getDeletionWarnings]
  );

  return {
    // Navigation
    navigateToView,
    navigateToEdit,
    navigateToDelete,
    navigateToList,
    navigateToCreate,

    // Toast notifications
    showSuccessToast,
    showErrorToast,
    showWarningToast,

    // Data formatting
    formatSedationistForDisplay,

    // Validation
    hasActiveCases,
    getDeletionWarnings,
    validateDeletion,
  };
};
