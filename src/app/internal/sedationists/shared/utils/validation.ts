import { z } from "zod";
import {
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus,
} from "@/shared/types/domains/sedationist";

// Common validation schemas used across sedationist forms
export const sedationistValidationSchemas = {
  // Personal information validation
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
  }),

  // Professional information validation
  professionalInfo: z.object({
    licenseNumber: z.string().min(1, "License number is required"),
    yearsOfExperience: z
      .number()
      .min(0, "Years of experience cannot be negative"),
    status: z.nativeEnum(SedationistStatus),
    bio: z.string().optional(),
  }),

  // Address validation
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  }),

  // Specialty validation
  specialty: z.object({
    type: z.nativeEnum(SedationistSpecialty),
    yearsOfExperience: z
      .number()
      .min(0, "Years of experience cannot be negative")
      .max(50, "Years of experience seems too high"),
    isActive: z.boolean(),
  }),

  // Certification validation
  certification: z.object({
    name: z.string().min(1, "Certification name is required"),
    issuedBy: z.string().min(1, "Issuing authority is required"),
    issueDate: z.string().min(1, "Issue date is required"),
    expiryDate: z.string().min(1, "Expiry date is required"),
    status: z.nativeEnum(CertificationStatus),
    documentUrl: z.string().optional(),
  }),

  // Emergency contact validation
  emergencyContact: z.object({
    name: z.string().min(1, "Emergency contact name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  }),
};

// Complete sedationist creation schema
export const createSedationistSchema = z.object({
  ...sedationistValidationSchemas.personalInfo.shape,
  ...sedationistValidationSchemas.professionalInfo.shape,
  address: sedationistValidationSchemas.address,
  specialties: z
    .array(sedationistValidationSchemas.specialty)
    .min(1, "At least one specialty is required"),
  certifications: z
    .array(sedationistValidationSchemas.certification)
    .optional(),
  emergencyContact: sedationistValidationSchemas.emergencyContact,
});

// Profile update schema (makes some fields optional)
export const updateSedationistSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required").optional(),
  licenseNumber: z.string().min(1, "License number is required").optional(),
  yearsOfExperience: z
    .number()
    .min(0, "Years of experience cannot be negative")
    .optional(),
  status: z.nativeEnum(SedationistStatus).optional(),
  bio: z.string().optional(),
  address: sedationistValidationSchemas.address.optional(),
  emergencyContact: sedationistValidationSchemas.emergencyContact.optional(),
});

// Specialty management schema
export const specialtySchema = sedationistValidationSchemas.specialty;

// Certification management schema
export const certificationSchema = sedationistValidationSchemas.certification;

// Validation utility functions
export const validationUtils = {
  // Validate date is not in the future (for birth dates, issue dates)
  validatePastDate: (date: string, fieldName: string = "Date") => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    if (selectedDate > today) {
      throw new Error(`${fieldName} cannot be in the future`);
    }
    return true;
  },

  // Validate expiry date is in the future
  validateFutureDate: (date: string, fieldName: string = "Expiry date") => {
    const selectedDate = new Date(date);
    const today = new Date();

    if (selectedDate <= today) {
      throw new Error(`${fieldName} must be in the future`);
    }
    return true;
  },

  // Validate expiry date is after issue date
  validateExpiryAfterIssue: (issueDate: string, expiryDate: string) => {
    const issue = new Date(issueDate);
    const expiry = new Date(expiryDate);

    if (expiry <= issue) {
      throw new Error("Expiry date must be after issue date");
    }
    return true;
  },

  // Validate phone number format (basic)
  validatePhoneFormat: (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    // Check if it's a valid length (10 or 11 digits for US numbers)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      throw new Error("Phone number must be 10-11 digits");
    }

    return true;
  },

  // Validate email domain (optional custom validation)
  validateEmailDomain: (email: string, allowedDomains?: string[]) => {
    if (!allowedDomains || allowedDomains.length === 0) {
      return true;
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain || !allowedDomains.includes(domain)) {
      throw new Error(
        `Email domain must be one of: ${allowedDomains.join(", ")}`
      );
    }

    return true;
  },

  // Validate age based on date of birth
  validateMinimumAge: (dateOfBirth: string, minimumAge: number = 18) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      actualAge--;
    }

    if (actualAge < minimumAge) {
      throw new Error(`Must be at least ${minimumAge} years old`);
    }

    return true;
  },
};

// Export types for form data
export type CreateSedationistFormData = z.infer<typeof createSedationistSchema>;
export type UpdateSedationistFormData = z.infer<typeof updateSedationistSchema>;
export type SpecialtyFormData = z.infer<typeof specialtySchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
