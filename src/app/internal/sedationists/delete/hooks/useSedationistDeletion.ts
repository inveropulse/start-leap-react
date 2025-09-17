import { useState } from "react";
import { useSedationistRequest } from "@/api/sedationists";
import { useDeleteSedationistRequest } from "@/api/sedationists";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { type Sedationist } from "@/shared/types/domains/sedationist";

export interface SedationistDeletionState {
  // Data
  sedationist: Sedationist | undefined;
  isLoading: boolean;
  error: Error | null;

  // UI State
  isDeleting: boolean;
  showConfirmation: boolean;
  confirmationText: string;

  // Actions
  setConfirmationText: (text: string) => void;
  showDeleteConfirmation: () => void;
  hideDeleteConfirmation: () => void;
  handleDelete: () => Promise<void>;
  canDelete: boolean;

  // Safety checks
  hasActiveCases: boolean;
  hasUpcomingAppointments: boolean;
  warningMessages: string[];
}

export function useSedationistDeletion(
  sedationistId: string | null
): SedationistDeletionState {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const {
    data: response,
    isLoading,
    error,
  } = useSedationistRequest(sedationistId);
  const deleteMutation = useDeleteSedationistRequest();
  const { showSuccess, showError } = useNotifications();

  // Extract sedationist from API response
  const sedationist = response?.data;

  // Calculate deletion safety checks
  const hasActiveCases = sedationist?.recentCases?.length > 0 || false;
  const hasUpcomingAppointments = false; // TODO: Check appointment service

  const warningMessages: string[] = [];
  if (hasActiveCases) {
    warningMessages.push(
      "This sedationist has active cases that may be affected."
    );
  }
  if (hasUpcomingAppointments) {
    warningMessages.push(
      "This sedationist has upcoming appointments that will need to be reassigned."
    );
  }
  if (sedationist?.totalProcedures && sedationist.totalProcedures > 0) {
    warningMessages.push(
      `This sedationist has completed ${sedationist.totalProcedures} procedures. Historical data will be preserved.`
    );
  }

  // Check if user has typed the full name for confirmation
  const expectedConfirmation = sedationist
    ? `${sedationist.firstName} ${sedationist.lastName}`
    : "";
  const canDelete =
    confirmationText.trim().toLowerCase() ===
      expectedConfirmation.toLowerCase() && confirmationText.trim() !== "";

  const showDeleteConfirmation = () => {
    setShowConfirmation(true);
    setConfirmationText("");
  };

  const hideDeleteConfirmation = () => {
    setShowConfirmation(false);
    setConfirmationText("");
  };

  const handleDelete = async () => {
    if (!sedationistId || !canDelete) {
      showError(
        "Please confirm deletion by typing the sedationist's full name."
      );
      return;
    }

    try {
      await deleteMutation.mutateAsync(sedationistId);
      showSuccess("Sedationist deleted successfully.");
      hideDeleteConfirmation();
    } catch (error) {
      showError("Failed to delete sedationist. Please try again.");
    }
  };

  return {
    // Data
    sedationist,
    isLoading,
    error,

    // UI State
    isDeleting: deleteMutation.isPending,
    showConfirmation,
    confirmationText,

    // Actions
    setConfirmationText,
    showDeleteConfirmation,
    hideDeleteConfirmation,
    handleDelete,
    canDelete,

    // Safety checks
    hasActiveCases,
    hasUpcomingAppointments,
    warningMessages,
  };
}
