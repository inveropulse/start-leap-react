import {
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus,
} from "@/shared/types/domains/sedation";

// Status configuration for consistent display across use-cases
export const statusConfig = {
  [SedationistStatus.ACTIVE]: {
    label: "Active",
    variant: "default" as const,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  [SedationistStatus.INACTIVE]: {
    label: "Inactive",
    variant: "secondary" as const,
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  [SedationistStatus.ON_LEAVE]: {
    label: "On Leave",
    variant: "outline" as const,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  [SedationistStatus.IN_TRAINING]: {
    label: "Training",
    variant: "secondary" as const,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
};

// Specialty labels for consistent display across use-cases
export const specialtyLabels = {
  [SedationistSpecialty.GENERAL_ANAESTHESIA]: "General Anaesthesia",
  [SedationistSpecialty.CONSCIOUS_SEDATION]: "Conscious Sedation",
  [SedationistSpecialty.IV_SEDATION]: "IV Sedation",
  [SedationistSpecialty.NITROUS_OXIDE]: "Nitrous Oxide",
  [SedationistSpecialty.PEDIATRIC_SEDATION]: "Pediatric Sedation",
  [SedationistSpecialty.CARDIAC_SEDATION]: "Cardiac Sedation",
};

// Certification status configuration
export const certificationStatusConfig = {
  [CertificationStatus.VALID]: {
    label: "Valid",
    variant: "default" as const,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  [CertificationStatus.EXPIRING_SOON]: {
    label: "Expiring Soon",
    variant: "outline" as const,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  [CertificationStatus.EXPIRED]: {
    label: "Expired",
    variant: "destructive" as const,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  [CertificationStatus.PENDING_RENEWAL]: {
    label: "Pending Renewal",
    variant: "secondary" as const,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
};

// Utility functions for sedationist data formatting
export const sedationistUtils = {
  // Get full name
  getFullName: (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  },

  // Get initials for avatar
  getInitials: (firstName: string, lastName: string) => {
    return `${firstName[0]?.toUpperCase() || ""}${
      lastName[0]?.toUpperCase() || ""
    }`;
  },

  // Format phone number (basic formatting)
  formatPhone: (phone?: string) => {
    if (!phone) return "";
    // Basic formatting for display - could be enhanced
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return phone;
  },

  // Format rating display
  formatRating: (rating: number) => {
    return `${rating.toFixed(1)}/5.0`;
  },

  // Format experience display
  formatExperience: (years?: number) => {
    if (!years) return "Not specified";
    return years === 1 ? "1 year" : `${years} years`;
  },

  // Get status configuration
  getStatusConfig: (status: SedationistStatus) => {
    return statusConfig[status];
  },

  // Get specialty label
  getSpecialtyLabel: (specialty: SedationistSpecialty) => {
    return specialtyLabels[specialty];
  },

  // Get certification status config
  getCertificationStatusConfig: (status: CertificationStatus) => {
    return certificationStatusConfig[status];
  },

  // Check if certification is expiring (within 30 days)
  isCertificationExpiring: (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    return expiry <= thirtyDaysFromNow && expiry > now;
  },

  // Check if certification is expired
  isCertificationExpired: (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  },
};
