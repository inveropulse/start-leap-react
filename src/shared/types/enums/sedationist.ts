// Shared sedationist-related enums
export enum SedationistStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ON_LEAVE = "on_leave",
  IN_TRAINING = "in_training",
}

export enum SedationistSpecialty {
  GENERAL_ANAESTHESIA = "general_anaesthesia",
  CONSCIOUS_SEDATION = "conscious_sedation",
  IV_SEDATION = "iv_sedation",
  NITROUS_OXIDE = "nitrous_oxide",
  PEDIATRIC_SEDATION = "pediatric_sedation",
  CARDIAC_SEDATION = "cardiac_sedation",
}

export enum CertificationStatus {
  VALID = "valid",
  EXPIRING_SOON = "expiring_soon",
  EXPIRED = "expired",
  PENDING_RENEWAL = "pending_renewal",
}

export enum SedationDetailStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
}

export enum RecoveryType {
  SPONTANEOUS = 'Spontaneous',
  REVERSAL = 'Reversal',
}