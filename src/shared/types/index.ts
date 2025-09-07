// Main shared types - portal and user roles remain here as they're app-wide foundational types
export enum PortalType {
  CLINIC = "clinic",
  PATIENT = "patient",
  INTERNAL = "internal",
  SEDATIONIST = "sedationist",
}

export enum UserRole {
  ADMIN = "admin",
  CLINIC = "clinic",
  PATIENT = "patient",
  SEDATIONIST = "sedationist",
  BOOKING_COORDINATOR = "booking_coordinator",

  // TODO - NOT NEEDED NOW BUT CAN BE USEFUL LATER
  // MANAGER = "manager",
  // USER = "user",
  // DOCTOR = "doctor",
  // NURSE = "nurse",
}

// Re-export all shared types from consolidated structure
export * from './enums';
export * from './entities';
export * from './common';
export * from './filters';
export * from './ui';
