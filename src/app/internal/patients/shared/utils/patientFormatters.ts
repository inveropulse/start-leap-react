import { format } from "date-fns";

/**
 * Formats a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string or fallback message
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not specified";
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
};

/**
 * Calculates and formats patient age from date of birth
 * @param dateOfBirth - Patient's date of birth
 * @returns Formatted age string
 */
export const calculateAge = (dateOfBirth?: string): string => {
  if (!dateOfBirth) return "Unknown";
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
    return `${age} years old`;
  } catch {
    return "Unknown";
  }
};

/**
 * Formats patient's full name with optional title
 * @param title - Patient title (Mr, Mrs, etc.)
 * @param firstName - First name
 * @param lastName - Last name
 * @param fullName - Pre-calculated full name
 * @returns Formatted full name string
 */
export const formatPatientName = (
  title?: string,
  firstName?: string | null,
  lastName?: string | null,
  fullName?: string | null
): string => {
  if (fullName) {
    return title ? `${title} ${fullName}` : fullName;
  }

  const name = [firstName, lastName].filter(Boolean).join(" ");
  return title ? `${title} ${name}` : name;
};

/**
 * Formats patient's physical measurements
 * @param height - Height value
 * @param heightFormat - Height unit (cm, ft, etc.)
 * @returns Formatted height string
 */
export const formatHeight = (
  height?: number,
  heightFormat?: string | null
): string => {
  if (!height) return "Not specified";
  return `${height} ${heightFormat || "cm"}`;
};

/**
 * Formats patient's weight
 * @param weight - Weight value
 * @param weightFormat - Weight unit (kg, lbs, etc.)
 * @returns Formatted weight string
 */
export const formatWeight = (
  weight?: number,
  weightFormat?: string | null
): string => {
  if (!weight) return "Not specified";
  return `${weight} ${weightFormat || "kg"}`;
};

/**
 * Formats BMI value
 * @param bmi - BMI value
 * @returns Formatted BMI string
 */
export const formatBMI = (bmi?: number): string => {
  if (!bmi) return "Not calculated";
  return bmi.toFixed(1);
};

/**
 * Formats ASA classification
 * @param asaClassification - ASA classification number
 * @returns Formatted ASA string
 */
export const formatASA = (asaClassification?: number): string => {
  if (!asaClassification) return "Not specified";
  return `ASA ${asaClassification}`;
};

/**
 * Formats address components into a single string
 * @param address - Street address
 * @param town - Town/City
 * @param country - Country
 * @param postCode - Postal code
 * @returns Formatted address string
 */
export const formatAddress = (
  address?: string | null,
  town?: string | null,
  country?: string | null,
  postCode?: string | null
): string => {
  const parts = [address, town, country, postCode].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Not provided";
};

/**
 * Formats location (town/city and country)
 * @param town - Town/City
 * @param country - Country
 * @returns Formatted location string
 */
export const formatLocation = (
  town?: string | null,
  country?: string | null
): string => {
  const parts = [town, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Not specified";
};

/**
 * Formats pre-procedure timing
 * @param hours - Hours since last meal/fluid
 * @param type - Type of intake ('meal' or 'fluid')
 * @returns Formatted timing string
 */
export const formatPreProcedureTiming = (
  hours?: number | null,
  type: "meal" | "fluid" = "meal"
): string => {
  if (!hours) return "Not specified";
  return `${hours} hours ago`;
};

/**
 * Formats patient's physical measurements
 * @param patient - Patient object
 * @returns Object with formatted measurements
 */
export const formatPhysicalStats = (patient: any) => {
  return {
    height: formatHeight(patient.height, patient.heightFormat),
    weight: formatWeight(patient.weight, patient.weightFormat),
    bmi: formatBMI(patient.bmi),
  };
};

/**
 * Formats patient's contact information
 * @param patient - Patient object
 * @returns Object with formatted contact info
 */
export const formatContactInfo = (patient: any) => {
  return {
    primaryPhone: patient.phoneNumber || "Not provided",
    alternativePhone: patient.alternativePhoneNumber || "Not provided",
    email: patient.email || "Not provided",
    address: formatAddress(
      patient.address,
      patient.town,
      patient.country,
      patient.postCode
    ),
  };
};

/**
 * Formats medical information for display
 * @param patient - Patient object
 * @returns Object with formatted medical info
 */
export const formatMedicalInfo = (patient: any) => {
  return {
    medicalHistory: patient.medicalHistory || "No medical history recorded",
    allergies: patient.allergies || "No known allergies",
    medications: patient.medications || "No current medications",
    anestheticHistory:
      patient.anestheticHistory || "No anesthetic history recorded",
    asaClassification: patient.asaClassification
      ? `ASA ${patient.asaClassification}`
      : "Not specified",
  };
};

/**
 * Formats lifestyle information
 * @param patient - Patient object
 * @returns Object with formatted lifestyle info
 */
export const formatLifestyleInfo = (patient: any) => {
  return {
    smokingStatus: patient.smokingStatus || "Not specified",
    smokingNote: patient.smokingNote || null,
    alcoholStatus: patient.alcoholStatus || "Not specified",
    alcoholNote: patient.alcoholNote || null,
  };
};

/**
 * Formats pre-procedure information
 * @param patient - Patient object
 * @returns Object with formatted pre-procedure info
 */
export const formatPreProcedureInfo = (patient: any) => {
  return {
    lastMeal: patient.lastMealAgoInHours
      ? `${patient.lastMealAgoInHours} hours ago`
      : "Not specified",
    lastFluid: patient.lastFluidAgoInHours
      ? `${patient.lastFluidAgoInHours} hours ago`
      : "Not specified",
  };
};
