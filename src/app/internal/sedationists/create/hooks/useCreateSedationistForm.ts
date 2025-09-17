import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  SedationistSpecialty,
  CertificationStatus,
  SedationistCertification,
} from "@/shared/types/domains/sedationist";
import { useCreateSedationistRequest } from "@/api/sedationists";
import { useNotifications } from "@/shared/providers/NotificationProvider";

// Form schemas
const createSedationistSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  licenseNumber: z.string().min(1, "License number is required"),
});

const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuingBody: z.string().min(1, "Issuing body is required"),
  certificateNumber: z.string().min(1, "Certificate number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

export type CreateSedationistFormData = z.infer<typeof createSedationistSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;

export interface CreateSedationistFormState {
  // Form instances
  form: ReturnType<typeof useForm<CreateSedationistFormData>>;
  certForm: ReturnType<typeof useForm<CertificationFormData>>;

  // State
  activeTab: string;
  selectedSpecialties: SedationistSpecialty[];
  certifications: CertificationFormData[];
  newCertification: CertificationFormData;
  isSubmitting: boolean;

  // Actions
  onSubmit: (data: CreateSedationistFormData) => Promise<void>;
  onReset: () => void;
  setActiveTab: (tab: string) => void;
  addSpecialty: (specialty: SedationistSpecialty) => void;
  removeSpecialty: (specialty: SedationistSpecialty) => void;
  addCertification: (certification: CertificationFormData) => void;
  removeCertification: (index: number) => void;

  // Validation
  canProceedToSpecialties: boolean;
  canProceedToCertifications: boolean;
  canSubmit: boolean;
}

const initialCertification: CertificationFormData = {
  name: "",
  issuingBody: "",
  certificateNumber: "",
  issueDate: "",
  expiryDate: "",
};

export function useCreateSedationistForm(): CreateSedationistFormState {
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedSpecialties, setSelectedSpecialties] = useState<
    SedationistSpecialty[]
  >([]);
  const [certifications, setCertifications] = useState<CertificationFormData[]>(
    []
  );
  const [newCertification, setNewCertification] =
    useState<CertificationFormData>(initialCertification);

  const { showSuccess, showError } = useNotifications();
  const createMutation = useCreateSedationistRequest();

  const form = useForm<CreateSedationistFormData>({
    resolver: zodResolver(createSedationistSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      licenseNumber: "",
    },
  });

  const certForm = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: initialCertification,
  });

  const onSubmit = async (data: CreateSedationistFormData) => {
    if (selectedSpecialties.length === 0) {
      showError("Please select at least one specialty");
      return;
    }

    try {
      // Convert form certifications to SedationistCertification format
      const convertedCertifications: SedationistCertification[] =
        certifications.map((cert) => ({
          ...cert,
          id: Math.random().toString(36).substr(2, 9), // Generate ID for new certification
          status: CertificationStatus.VALID, // Default to valid status
        }));

      await createMutation.mutateAsync({
        ...data,
        specialties: selectedSpecialties,
        certifications: convertedCertifications,
      });

      showSuccess("Sedationist created successfully");
      onReset();
    } catch (error) {
      showError("Failed to create sedationist");
    }
  };

  const onReset = () => {
    form.reset();
    certForm.reset();
    setSelectedSpecialties([]);
    setCertifications([]);
    setNewCertification(initialCertification);
    setActiveTab("basic");
  };

  const addSpecialty = (specialty: SedationistSpecialty) => {
    if (!selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const removeSpecialty = (specialty: SedationistSpecialty) => {
    setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty));
  };

  const addCertification = (certification: CertificationFormData) => {
    setCertifications([...certifications, certification]);
    setNewCertification(initialCertification);
    certForm.reset();
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Validation logic
  const canProceedToSpecialties = Boolean(
    form.formState.isValid &&
      form.watch("firstName") &&
      form.watch("lastName") &&
      form.watch("email") &&
      form.watch("licenseNumber")
  );

  const canProceedToCertifications = selectedSpecialties.length > 0;

  const canSubmit = canProceedToCertifications;

  return {
    // Form instances
    form,
    certForm,

    // State
    activeTab,
    selectedSpecialties,
    certifications,
    newCertification,
    isSubmitting: createMutation.isPending,

    // Actions
    onSubmit,
    onReset,
    setActiveTab,
    addSpecialty,
    removeSpecialty,
    addCertification,
    removeCertification,

    // Validation
    canProceedToSpecialties,
    canProceedToCertifications,
    canSubmit,
  };
}
