import { useState } from "react";
import { useCreateUserRequest } from "@/api/user-management";
import type { CreateUserRequest } from "@/api/user-management/types";
import {
  UserRole,
  UserStatus,
  Department,
  PermissionLevel,
} from "@/shared/types";
import type { BaseUserFields } from "@/shared/types";

export interface CreateUserFormData extends Omit<BaseUserFields, "status"> {
  sendWelcomeEmail: boolean;
}

export interface CreateUserFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  department?: string;
  permissionLevel?: string;
  notes?: string;
}

/**
 * Hook for managing the create user use case
 * Encapsulates all business logic for user creation
 */
export const useCreateUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default form data
  const [formData, setFormData] = useState<CreateUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: UserRole.CLINIC,
    phone: "",
    department: Department.UNASSIGNED,
    permissionLevel: PermissionLevel.UNASSIGNED,
    notes: "",
    sendWelcomeEmail: true,
  });

  const [errors, setErrors] = useState<CreateUserFormErrors>({});

  const createUserMutation = useCreateUserRequest();

  // Validation
  const validateForm = (): boolean => {
    const newErrors: CreateUserFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Actions
  const openModal = () => {
    setIsOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: UserRole.CLINIC,
      phone: "",
      department: Department.UNASSIGNED,
      permissionLevel: PermissionLevel.UNASSIGNED,
      notes: "",
      sendWelcomeEmail: true,
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const updateField = <K extends keyof CreateUserFormData>(
    field: K,
    value: CreateUserFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    const errorKey = field as keyof CreateUserFormErrors;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);

    try {
      const createRequest: CreateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone || undefined,
        department: formData.department,
        permissionLevel: formData.permissionLevel,
        notes: formData.notes || undefined,
        status: UserStatus.PENDING_ACTIVATION, // New users start as pending
        sendWelcomeEmail: formData.sendWelcomeEmail,
      };

      await createUserMutation.mutateAsync(createRequest);
      closeModal();
      return true;
    } catch (error) {
      console.error("Failed to create user:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    isOpen,
    formData,
    errors,
    isSubmitting,
    isLoading: createUserMutation.isPending,

    // Actions
    openModal,
    closeModal,
    resetForm,
    updateField,
    submitForm,

    // Computed
    hasErrors: Object.keys(errors).length > 0,
    canSubmit:
      !isSubmitting &&
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim(),
  };
};
