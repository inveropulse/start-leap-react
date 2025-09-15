/**
 * Patient domain utility functions for business logic and calculations
 */

import { Patient } from "@/shared/types/domains/patient/entities";

/**
 * Calculates BMI from height and weight
 * @param height - Height in cm
 * @param weight - Weight in kg
 * @returns BMI value or null if calculation not possible
 */
export const calculateBMI = (
  height?: number,
  weight?: number
): number | null => {
  if (!height || !weight || height <= 0 || weight <= 0) {
    return null;
  }

  // Convert height from cm to meters for BMI calculation
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

/**
 * Calculates exact age in years from date of birth
 * @param dateOfBirth - Date of birth string
 * @returns Age in years or null if invalid date
 */
export const calculateAgeInYears = (dateOfBirth?: string): number | null => {
  if (!dateOfBirth) return null;

  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  } catch {
    return null;
  }
};

/**
 * Determines if patient is a pediatric case (under 18)
 * @param dateOfBirth - Date of birth string
 * @returns True if patient is under 18
 */
export const isPediatricPatient = (dateOfBirth?: string): boolean => {
  const age = calculateAgeInYears(dateOfBirth);
  return age !== null && age < 18;
};

/**
 * Determines if patient is a geriatric case (65 or older)
 * @param dateOfBirth - Date of birth string
 * @returns True if patient is 65 or older
 */
export const isGeriatricPatient = (dateOfBirth?: string): boolean => {
  const age = calculateAgeInYears(dateOfBirth);
  return age !== null && age >= 65;
};

/**
 * Validates if patient has complete basic information
 * @param patient - Patient object
 * @returns True if patient has minimum required info
 */
export const hasCompleteBasicInfo = (patient: Patient): boolean => {
  return !!(
    patient.firstName &&
    patient.lastName &&
    patient.dateOfBirth &&
    (patient.phoneNumber || patient.email)
  );
};

/**
 * Validates if patient has complete contact information
 * @param patient - Patient object
 * @returns True if patient has complete contact info
 */
export const hasCompleteContactInfo = (patient: Patient): boolean => {
  return !!(
    patient.phoneNumber &&
    patient.email &&
    patient.address &&
    patient.town &&
    patient.postCode
  );
};

/**
 * Validates if patient has complete medical information
 * @param patient - Patient object
 * @returns True if patient has essential medical info
 */
export const hasCompleteMedicalInfo = (patient: Patient): boolean => {
  return !!(patient.medicalHistory && patient.allergies && patient.medications);
};

/**
 * Gets patient completeness score (0-100)
 * @param patient - Patient object
 * @returns Completeness percentage
 */
export const getPatientCompletenessScore = (patient: Patient): number => {
  const fields = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "sex",
    "phoneNumber",
    "email",
    "address",
    "town",
    "postCode",
    "height",
    "weight",
    "occupation",
    "medicalHistory",
    "allergies",
    "medications",
    "smokingStatus",
    "alcoholStatus",
  ];

  const completedFields = fields.filter((field) => {
    const value = patient[field as keyof Patient];
    return value !== null && value !== undefined && value !== "";
  }).length;

  return Math.round((completedFields / fields.length) * 100);
};

/**
 * Checks if patient requires special attention based on age
 * @param patient - Patient object
 * @returns Object with age-related flags
 */
export const getAgeBasedFlags = (patient: Patient) => {
  return {
    isPediatric: isPediatricPatient(patient.dateOfBirth),
    isGeriatric: isGeriatricPatient(patient.dateOfBirth),
    requiresGuardian: isPediatricPatient(patient.dateOfBirth),
    requiresSpecialConsent:
      isGeriatricPatient(patient.dateOfBirth) ||
      isPediatricPatient(patient.dateOfBirth),
  };
};

/**
 * Determines risk level based on ASA classification
 * @param asaClassification - ASA classification (1-5)
 * @returns Risk level string
 */
export const getASARiskLevel = (asaClassification?: number): string => {
  if (!asaClassification) return "Unknown";

  switch (asaClassification) {
    case 1:
      return "Low Risk";
    case 2:
      return "Low-Moderate Risk";
    case 3:
      return "Moderate Risk";
    case 4:
      return "High Risk";
    case 5:
      return "Very High Risk";
    default:
      return "Unknown";
  }
};

/**
 * Generates patient initials
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Initials string (e.g., "JD")
 */
export const getPatientInitials = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
  return firstInitial + lastInitial;
};
