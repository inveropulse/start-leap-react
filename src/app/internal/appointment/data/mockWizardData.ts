import { WizardPatient, WizardClinic, WizardDoctor, WizardSedationist } from '../types/wizard.types';
import { SedationistSpecialty, CertificationStatus, SedationistStatus, SedationistCertification } from "@/shared/types/domains/sedation";

// Mock Patients Data
export const mockPatients: WizardPatient[] = [
  {
    id: 'pat1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'pat2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: '1978-11-22',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'pat3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    dateOfBirth: '1992-07-08',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'pat4',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    phone: '+1 (555) 456-7890',
    dateOfBirth: '1980-01-30',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'pat5',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@email.com',
    phone: '+1 (555) 567-8901',
    dateOfBirth: '1987-09-12',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  }
];

// Mock Clinics Data
export const mockClinics: WizardClinic[] = [
  {
    id: 'clinic1',
    name: 'Downtown Medical Center',
    address: '123 Main Street, Downtown, NY 10001',
    phone: '+1 (555) 901-2345',
    rating: 4.8,
    specialties: ['General Surgery', 'Cardiology', 'Orthopedics', 'Dermatology'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&h=200&fit=crop'
  },
  {
    id: 'clinic2',
    name: 'Westside Health Clinic',
    address: '456 Oak Avenue, Westside, NY 10002',
    phone: '+1 (555) 012-3456',
    rating: 4.6,
    specialties: ['Pediatrics', 'Family Medicine', 'Internal Medicine'],
    image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727c7c?w=300&h=200&fit=crop'
  },
  {
    id: 'clinic3',
    name: 'Eastpark Medical',
    address: '789 Pine Road, Eastpark, NY 10003',
    phone: '+1 (555) 123-4567',
    rating: 4.9,
    specialties: ['Neurology', 'Psychiatry', 'Endocrinology'],
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=300&h=200&fit=crop'
  },
  {
    id: 'clinic4',
    name: 'Northpoint Specialty Center',
    address: '321 Cedar Lane, Northpoint, NY 10004',
    phone: '+1 (555) 234-5678',
    rating: 4.7,
    specialties: ['Oncology', 'Radiology', 'Gastroenterology'],
    image: 'https://images.unsplash.com/photo-1594736797933-d0f5e3c45fae?w=300&h=200&fit=crop'
  }
];

// Mock Doctors Data
export const mockDoctors: WizardDoctor[] = [
  {
    id: 'doc1',
    firstName: 'Dr. Sarah',
    lastName: 'Thompson',
    specialization: 'Cardiology',
    clinicId: 'clinic1',
    experience: 12,
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    credentials: ['MD', 'FACC', 'Board Certified'],
    status: 'Active' as const
  },
  {
    id: 'doc2',
    firstName: 'Dr. Michael',
    lastName: 'Harrison',
    specialization: 'Orthopedics',
    clinicId: 'clinic1',
    experience: 15,
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    credentials: ['MD', 'FAAOS', 'Sports Medicine Certified'],
    status: 'Active' as const
  },
  {
    id: 'doc3',
    firstName: 'Dr. Emily',
    lastName: 'Parker',
    specialization: 'Pediatrics',
    clinicId: 'clinic2',
    experience: 8,
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1594824019292-60f647afd842?w=150&h=150&fit=crop&crop=face',
    credentials: ['MD', 'FAAP', 'Pediatric Emergency Medicine'],
    status: 'Active' as const
  },
  {
    id: 'doc4',
    firstName: 'Dr. James',
    lastName: 'Mitchell',
    specialization: 'Neurology',
    clinicId: 'clinic3',
    experience: 20,
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    credentials: ['MD', 'PhD', 'Board Certified Neurologist'],
    status: 'Active' as const
  }
];

// Mock Sedationists Data
export const mockSedationists: WizardSedationist[] = [
  {
    id: 'sed1',
    firstName: 'Dr. Amanda',
    lastName: 'Foster',
    email: 'amanda.foster@medical.com',
    licenseNumber: 'MED123456',
    status: SedationistStatus.ACTIVE,
    specialties: [SedationistSpecialty.GENERAL_ANAESTHESIA, SedationistSpecialty.CONSCIOUS_SEDATION],
    availability: [],
    recentCases: [],
    joinDate: '2020-01-01',
    totalProcedures: 1250,
    patientRating: 4.9,
    experience: 10,
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    certifications: [
      { id: "1", name: "ASA Board Certified", issuingBody: "American Society of Anesthesiologists", certificateNumber: "ASA123", issueDate: "2020-01-01", expiryDate: "2025-01-01", status: CertificationStatus.VALID },
      { id: "2", name: "ACLS", issuingBody: "American Heart Association", certificateNumber: "AHA456", issueDate: "2022-01-01", expiryDate: "2024-01-01", status: CertificationStatus.VALID },
      { id: "3", name: "PALS", issuingBody: "American Academy of Pediatrics", certificateNumber: "PAL789", issueDate: "2021-01-01", expiryDate: "2024-01-01", status: CertificationStatus.VALID }
    ],
    successRate: 99.2,
    currentCaseload: 15
  },
  {
    id: 'sed2',
    firstName: 'Dr. Robert',
    lastName: 'Martinez',
    email: 'robert.martinez@medical.com',
    licenseNumber: 'MED789012',
    status: SedationistStatus.ACTIVE,
    specialties: [SedationistSpecialty.PEDIATRIC_SEDATION, SedationistSpecialty.IV_SEDATION, SedationistSpecialty.NITROUS_OXIDE],
    availability: [],
    recentCases: [],
    joinDate: '2018-01-01',
    totalProcedures: 2100,
    patientRating: 4.8,
    experience: 15,
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    certifications: [
      { id: "4", name: "ASA Board Certified", issuingBody: "American Society of Anesthesiologists", certificateNumber: "ASA987", issueDate: "2019-01-01", expiryDate: "2024-01-01", status: CertificationStatus.VALID },
      { id: "5", name: "Pediatric Advanced Life Support", issuingBody: "American Academy of Pediatrics", certificateNumber: "PALS654", issueDate: "2022-01-01", expiryDate: "2024-01-01", status: CertificationStatus.VALID }
    ],
    successRate: 98.8,
    currentCaseload: 12
  },
  {
    id: 'sed3',
    firstName: 'Dr. Jessica',
    lastName: 'Lee',
    email: 'jessica.lee@medical.com',
    licenseNumber: 'MED345678',
    status: SedationistStatus.ACTIVE,
    specialties: [SedationistSpecialty.CONSCIOUS_SEDATION, SedationistSpecialty.IV_SEDATION],
    availability: [],
    recentCases: [],
    joinDate: '2021-01-01',
    totalProcedures: 850,
    patientRating: 4.7,
    experience: 7,
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1594824019292-60f647afd842?w=150&h=150&fit=crop&crop=face',
    certifications: [
      { id: "6", name: "Board Certified", issuingBody: "American Dental Association", certificateNumber: "ADA321", issueDate: "2021-01-01", expiryDate: "2024-01-01", status: CertificationStatus.VALID },
      { id: "7", name: "ACLS", issuingBody: "American Heart Association", certificateNumber: "AHA111", issueDate: "2022-01-01", expiryDate: "2024-01-01", status: CertificationStatus.VALID },
      { id: "8", name: "Sedation Permit", issuingBody: "State Medical Board", certificateNumber: "SMB222", issueDate: "2020-01-01", expiryDate: "2025-01-01", status: CertificationStatus.VALID }
    ],
    successRate: 98.5,
    currentCaseload: 18
  },
  {
    id: 'sed4',
    firstName: 'Dr. Thomas',
    lastName: 'Brown',
    email: 'thomas.brown@medical.com',
    licenseNumber: 'MED901234',
    status: SedationistStatus.ACTIVE,
    specialties: [SedationistSpecialty.GENERAL_ANAESTHESIA, SedationistSpecialty.CONSCIOUS_SEDATION],
    availability: [],
    recentCases: [],
    joinDate: '2015-01-01',
    totalProcedures: 3200,
    patientRating: 4.9,
    experience: 18,
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    certifications: [
      { id: "9", name: "ASA Board Certified", issuingBody: "American Society of Anesthesiologists", certificateNumber: "ASA555", issueDate: "2018-01-01", expiryDate: "2025-01-01", status: CertificationStatus.VALID },
      { id: "10", name: "Pain Medicine Fellowship", issuingBody: "American Board of Anesthesiology", certificateNumber: "ABA777", issueDate: "2019-01-01", expiryDate: "2024-01-01", status: CertificationStatus.VALID }
    ],
    successRate: 99.5,
    currentCaseload: 10
  }
];

// Search functions with pagination
export const searchPatients = (query: string, page: number = 1, pageSize: number = 10) => {
  const filtered = mockPatients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    patient.email.toLowerCase().includes(query.toLowerCase()) ||
    (patient.phone && patient.phone.includes(query))
  );
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    data: filtered.slice(start, end),
    total,
    totalPages,
    currentPage: page,
    pageSize
  };
};

export const searchClinics = (query: string, page: number = 1, pageSize: number = 10) => {
  const filtered = mockClinics.filter(clinic =>
    clinic.name?.toLowerCase().includes(query.toLowerCase()) ||
    clinic.address?.toLowerCase().includes(query.toLowerCase()) ||
    (clinic.specialties && clinic.specialties.some(specialty => specialty.toLowerCase().includes(query.toLowerCase())))
  );
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    data: filtered.slice(start, end),
    total,
    totalPages,
    currentPage: page,
    pageSize
  };
};

export const getDoctorsByClinic = (clinicId: string) => {
  return mockDoctors.filter(doctor => doctor.clinicId === clinicId);
};

export const searchSedationists = (query: string, page: number = 1, pageSize: number = 10) => {
  const filtered = mockSedationists.filter(sedationist =>
    `${sedationist.firstName} ${sedationist.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    sedationist.specialties.some(specialty => specialty.toLowerCase().includes(query.toLowerCase())) ||
    sedationist.certifications.some(cert => cert.name.toLowerCase().includes(query.toLowerCase()))
  );
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    data: filtered.slice(start, end),
    total,
    totalPages,
    currentPage: page,
    pageSize
  };
};