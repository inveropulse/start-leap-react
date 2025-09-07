// Shared patient-related enums - using API consistent values
export enum PatientTitle {
  MR = 'Mr',
  MISS = 'Miss',
  MRS = 'Mrs',
  PROF = 'Prof',
  DR = 'Dr',
  MS = 'Ms',
  LADY = 'Lady',
  LORD = 'Lord',
  MASTER = 'Master',
  SIR = 'Sir',
  DAME = 'Dame',
  SHEIKH = 'Sheikh',
  SHEIKHA = 'Sheikha',
  HRH = 'HRH',
}

export enum PatientSex {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum PatientSmokingStatus {
  YES = 'Yes',
  NEVER = 'Never',
  FORMER = 'Former',
}

export enum PatientAlcoholStatus {
  YES = 'Yes',
  NEVER = 'Never',
  FORMER = 'Former',
}