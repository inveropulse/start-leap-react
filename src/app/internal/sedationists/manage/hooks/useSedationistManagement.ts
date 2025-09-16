import { useState, useEffect } from "react";
import { useSedationistRequest } from "@/api/sedationists";
import { useUpdateSedationistRequest } from "@/api/sedationists";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import {
  SedationistStatus,
  SedationistSpecialty,
  type Sedationist,
} from "@/shared/types/domains/sedation";
import { type UpdateSedationistData } from "@/shared/types/domains/sedation/entities";

export interface SedationistManagementState {
  // Data
  sedationist: Sedationist | undefined;
  isLoading: boolean;
  error: Error | null;

  // UI State
  activeTab: string;
  isEditing: boolean;
  editForm: Partial<Sedationist>;
  isSaving: boolean;

  // Actions
  setActiveTab: (tab: string) => void;
  toggleEdit: () => void;
  updateEditForm: (updates: Partial<Sedationist>) => void;
  handleSave: () => Promise<void>;
  handleSpecialtyChange: (
    specialty: SedationistSpecialty,
    checked: boolean
  ) => void;
  handleStatusChange: (status: SedationistStatus) => void;
  resetForm: () => void;
}

export function useSedationistManagement(
  sedationistId: string | null
): SedationistManagementState {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Sedationist>>({});

  const {
    data: response,
    isLoading,
    error,
  } = useSedationistRequest(sedationistId);
  const updateMutation = useUpdateSedationistRequest();
  const { showSuccess, showError } = useNotifications();

  // Extract sedationist from API response
  const sedationist = response?.data;

  // Initialize edit form when sedationist data loads
  useEffect(() => {
    if (sedationist && !isEditing) {
      resetFormToSedationist(sedationist);
    }
  }, [sedationist, isEditing]);

  const resetFormToSedationist = (sedationistData: Sedationist) => {
    setEditForm({
      firstName: sedationistData.firstName,
      lastName: sedationistData.lastName,
      email: sedationistData.email,
      phone: sedationistData.phone,
      status: sedationistData.status,
      specialties: sedationistData.specialties,
      licenseNumber: sedationistData.licenseNumber,
      notes: sedationistData.notes,
      experience: sedationistData.experience,
    });
  };

  const toggleEdit = () => {
    if (isEditing && sedationist) {
      // Reset form if canceling edit
      resetFormToSedationist(sedationist);
    }
    setIsEditing(!isEditing);
  };

  const updateEditForm = (updates: Partial<Sedationist>) => {
    setEditForm((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSave = async () => {
    if (
      !sedationistId ||
      !editForm.firstName ||
      !editForm.lastName ||
      !editForm.email
    ) {
      showError("Please fill in all required fields.");
      return;
    }

    try {
      const updateData: UpdateSedationistData = {
        id: sedationistId,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone || "",
        status: editForm.status!,
        specialties: editForm.specialties || [],
        licenseNumber: editForm.licenseNumber!,
        notes: editForm.notes || "",
      };

      await updateMutation.mutateAsync(updateData);
      setIsEditing(false);
      showSuccess("Sedationist updated successfully.");
    } catch (error) {
      showError("Failed to update sedationist. Please try again.");
    }
  };

  const handleSpecialtyChange = (
    specialty: SedationistSpecialty,
    checked: boolean
  ) => {
    const currentSpecialties = editForm.specialties || [];
    if (checked) {
      updateEditForm({
        specialties: [...currentSpecialties, specialty],
      });
    } else {
      updateEditForm({
        specialties: currentSpecialties.filter((s) => s !== specialty),
      });
    }
  };

  const handleStatusChange = (status: SedationistStatus) => {
    updateEditForm({ status });
  };

  const resetForm = () => {
    if (sedationist) {
      resetFormToSedationist(sedationist);
    }
    setIsEditing(false);
  };

  return {
    // Data
    sedationist,
    isLoading,
    error,

    // UI State
    activeTab,
    isEditing,
    editForm,
    isSaving: updateMutation.isPending,

    // Actions
    setActiveTab,
    toggleEdit,
    updateEditForm,
    handleSave,
    handleSpecialtyChange,
    handleStatusChange,
    resetForm,
  };
}
