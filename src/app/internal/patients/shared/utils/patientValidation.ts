/**
 * Patient validation utilities for form validation and data integrity
 */

import { z } from "zod";
import {
  PatientTitle,
  PatientSex,
  PatientSmokingStatus,
  PatientAlcoholStatus,
} from "@/shared/types/domains/patient/enums";

/**
 * Base patient schema for form validation
 */
export const basePatientSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name too long"),
  title: z.nativeEnum(PatientTitle).optional(),
  dateOfBirth: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, "Date of birth cannot be in the future"),
  sex: z.nativeEnum(PatientSex).optional(),
  phoneNumber: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true;
      // Basic phone validation - adjust regex based on requirements
      return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ""));
    }, "Invalid phone number format"),
  alternativePhoneNumber: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  address: z.string().optional(),
  town: z.string().optional(),
  country: z.string().optional(),
  postCode: z.string().optional(),
  occupation: z.string().optional(),
  height: z
    .number()
    .min(0, "Height must be positive")
    .max(300, "Height too large")
    .optional(),
  weight: z
    .number()
    .min(0, "Weight must be positive")
    .max(1000, "Weight too large")
    .optional(),
  smokingStatus: z.nativeEnum(PatientSmokingStatus).optional(),
  alcoholStatus: z.nativeEnum(PatientAlcoholStatus).optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  anestheticHistory: z.string().optional(),
  asaClassification: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
});

/**
 * Schema for creating a new patient
 */
export const createPatientSchema = basePatientSchema;

/**
 * Schema for updating an existing patient
 */
export const updatePatientSchema = basePatientSchema.partial().extend({
  id: z.string().min(1, "Patient ID is required"),
});

/**
 * Validation for required fields in basic patient info
 */
export const basicPatientInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

/**
 * Validation for contact information
 */
export const contactInfoSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(1, "Address is required"),
  town: z.string().min(1, "Town/City is required"),
  postCode: z.string().min(1, "Post code is required"),
});

/**
 * Validation for medical information
 */
export const medicalInfoSchema = z.object({
  medicalHistory: z.string().min(1, "Medical history is required"),
  allergies: z.string().min(1, "Allergy information is required"),
  medications: z.string().min(1, "Current medications information is required"),
});

/**
 * Type exports for form validation
 */
export type CreatePatientFormData = z.infer<typeof createPatientSchema>;
export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>;
export type BasicPatientInfo = z.infer<typeof basicPatientInfoSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type MedicalInfo = z.infer<typeof medicalInfoSchema>;

/**
 * Validates phone number format
 * @param phone - Phone number string
 * @returns True if valid phone number
 */
export const isValidPhoneNumber = (phone?: string): boolean => {
  if (!phone) return false;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  return /^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone);
};

/**
 * Validates email format
 * @param email - Email string
 * @returns True if valid email
 */
export const isValidEmail = (email?: string): boolean => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates date of birth
 * @param dateOfBirth - Date string
 * @returns True if valid date of birth
 */
export const isValidDateOfBirth = (dateOfBirth?: string): boolean => {
  if (!dateOfBirth) return false;

  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    return birthDate <= today && birthDate.getFullYear() > 1900;
  } catch {
    return false;
  }
};

/**
 * Validates height value
 * @param height - Height in cm
 * @returns True if valid height
 */
export const isValidHeight = (height?: number): boolean => {
  return height !== undefined && height > 0 && height <= 300;
};

/**
 * Validates weight value
 * @param weight - Weight in kg
 * @returns True if valid weight
 */
export const isValidWeight = (weight?: number): boolean => {
  return weight !== undefined && weight > 0 && weight <= 1000;
};

/**
 * Gets validation errors for patient data
 * @param patientData - Patient data to validate
 * @returns Object with field-specific error messages
 */
export const getPatientValidationErrors = (
  patientData: any
): Record<string, string[]> => {
  try {
    createPatientSchema.parse(patientData);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(issue.message);
      });
      return errors;
    }
    return {};
  }
};
