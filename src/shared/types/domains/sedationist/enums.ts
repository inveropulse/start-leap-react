// Sedation domain enums
export enum SedationistStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  ON_LEAVE = "On Leave",
  IN_TRAINING = "In Training",
}

export enum SedationistSpecialty {
  GENERAL_ANAESTHESIA = "General Anaesthesia",
  CONSCIOUS_SEDATION = "Conscious Sedation",
  IV_SEDATION = "IV Sedation",
  NITROUS_OXIDE = "Nitrous Oxide",
  PEDIATRIC_SEDATION = "Pediatric Sedation",
  CARDIAC_SEDATION = "Cardiac Sedation",
}

export enum CertificationStatus {
  VALID = "Valid",
  EXPIRING_SOON = "Expiring Soon",
  EXPIRED = "Expired",
  PENDING_RENEWAL = "Pending Renewal",
}

export enum DayOfWeek {
  SUNDAY = "Sunday",
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
}

export enum AvailabilityStatus {
  UNAVAILABLE = "Unavailable",
  ON_LEAVE = "On Leave",
  MEETING = "Meeting",
  ATTENDING_WORKSHOP = "Attending Workshop",
  CANCELLED = "Cancelled",
  RESCHEDULED = "Rescheduled",
  PERSONAL_REASON = "Personal Reason",
}

export enum SedationistTitle {
  DR = "Dr",
  PROF = "Prof",
  MR = "Mr",
  MRS = "Mrs",
  MS = "Ms",
  MISS = "Miss",
}
