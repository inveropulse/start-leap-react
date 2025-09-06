import { 
  Sedationist, 
  SedationistStatus, 
  SedationistSpecialty, 
  CertificationStatus,
  SedationistSearchParams,
  SedationistPaginationResponse,
  CreateSedationistData,
  UpdateSedationistData,
  SedationistCertification,
  SedationistAvailability,
  SedationistCase
} from '../types';

// Mock data
const mockSedationists: Sedationist[] = [
  {
    id: "sed-001",
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "s.johnson@medicenter.com",
    phone: "+44 20 7123 4567",
    licenseNumber: "GMC-7890123",
    status: SedationistStatus.ACTIVE,
    specialties: [SedationistSpecialty.GENERAL_ANAESTHESIA, SedationistSpecialty.CONSCIOUS_SEDATION],
    certifications: [
      {
        id: "cert-001",
        name: "General Medical Council License",
        issuingBody: "GMC",
        certificateNumber: "GMC-7890123",
        issueDate: "2020-01-15",
        expiryDate: "2025-01-15",
        status: CertificationStatus.VALID,
      },
      {
        id: "cert-002",
        name: "Advanced Cardiac Life Support",
        issuingBody: "Resuscitation Council UK",
        certificateNumber: "ACLS-2023-4567",
        issueDate: "2023-06-20",
        expiryDate: "2024-12-20",
        status: CertificationStatus.EXPIRING_SOON,
      }
    ],
    availability: [
      { id: "av-001", sedationistId: "sed-001", dayOfWeek: 1, startTime: "08:00", endTime: "17:00", isAvailable: true },
      { id: "av-002", sedationistId: "sed-001", dayOfWeek: 2, startTime: "08:00", endTime: "17:00", isAvailable: true },
      { id: "av-003", sedationistId: "sed-001", dayOfWeek: 3, startTime: "08:00", endTime: "17:00", isAvailable: true },
    ],
    recentCases: [
      {
        id: "case-001",
        appointmentId: "apt-123",
        procedureDate: "2024-01-05",
        procedureType: "General Anaesthesia for Surgery",
        duration: 180,
        patientName: "John Smith",
        outcome: "Successful",
        notes: "Patient responded well to anaesthesia"
      }
    ],
    joinDate: "2020-01-15",
    lastActiveDate: "2024-01-05",
    totalProcedures: 342,
    successRate: 99.1,
    patientRating: 4.8,
    notes: "Highly experienced anaesthetist with excellent patient outcomes",
  },
  {
    id: "sed-002",
    firstName: "Dr. Michael",
    lastName: "Chen",
    email: "m.chen@medicenter.com",
    phone: "+44 20 7123 4568",
    licenseNumber: "GMC-7890124",
    status: SedationistStatus.ACTIVE,
    specialties: [SedationistSpecialty.IV_SEDATION, SedationistSpecialty.PEDIATRIC_SEDATION],
    certifications: [
      {
        id: "cert-003",
        name: "General Medical Council License",
        issuingBody: "GMC",
        certificateNumber: "GMC-7890124",
        issueDate: "2019-03-20",
        expiryDate: "2024-03-20",
        status: CertificationStatus.VALID,
      },
      {
        id: "cert-004",
        name: "Pediatric Advanced Life Support",
        issuingBody: "RCPCH",
        certificateNumber: "PALS-2023-8901",
        issueDate: "2023-09-15",
        expiryDate: "2025-09-15",
        status: CertificationStatus.VALID,
      }
    ],
    availability: [
      { id: "av-004", sedationistId: "sed-002", dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isAvailable: true },
      { id: "av-005", sedationistId: "sed-002", dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isAvailable: true },
      { id: "av-006", sedationistId: "sed-002", dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isAvailable: true },
    ],
    recentCases: [
      {
        id: "case-002",
        appointmentId: "apt-124",
        procedureDate: "2024-01-04",
        procedureType: "IV Sedation for Dental Surgery",
        duration: 90,
        patientName: "Emma Davis",
        outcome: "Successful",
        notes: "Patient comfortable throughout procedure"
      }
    ],
    joinDate: "2019-03-20",
    lastActiveDate: "2024-01-04",
    totalProcedures: 256,
    successRate: 98.8,
    patientRating: 4.7,
    notes: "Specialist in pediatric sedation with gentle approach",
  },
  {
    id: "sed-003",
    firstName: "Dr. Emily",
    lastName: "Rodriguez",
    email: "e.rodriguez@medicenter.com",
    phone: "+44 20 7123 4569",
    licenseNumber: "GMC-7890125",
    status: SedationistStatus.ON_LEAVE,
    specialties: [SedationistSpecialty.CONSCIOUS_SEDATION, SedationistSpecialty.NITROUS_OXIDE],
    certifications: [
      {
        id: "cert-005",
        name: "General Medical Council License",
        issuingBody: "GMC",
        certificateNumber: "GMC-7890125",
        issueDate: "2021-07-10",
        expiryDate: "2026-07-10",
        status: CertificationStatus.VALID,
      },
      {
        id: "cert-006",
        name: "Conscious Sedation Certificate",
        issuingBody: "SAAD",
        certificateNumber: "CS-2022-1234",
        issueDate: "2022-04-12",
        expiryDate: "2024-01-12",
        status: CertificationStatus.EXPIRED,
      }
    ],
    availability: [],
    recentCases: [],
    joinDate: "2021-07-10",
    lastActiveDate: "2023-12-15",
    totalProcedures: 89,
    successRate: 97.8,
    patientRating: 4.6,
    notes: "Currently on maternity leave, expected return March 2024",
  },
  {
    id: "sed-004",
    firstName: "Dr. James",
    lastName: "Thompson",
    email: "j.thompson@medicenter.com",
    phone: "+44 20 7123 4570",
    licenseNumber: "GMC-7890126",
    status: SedationistStatus.IN_TRAINING,
    specialties: [SedationistSpecialty.CONSCIOUS_SEDATION],
    certifications: [
      {
        id: "cert-007",
        name: "General Medical Council License",
        issuingBody: "GMC",
        certificateNumber: "GMC-7890126",
        issueDate: "2023-08-01",
        expiryDate: "2028-08-01",
        status: CertificationStatus.VALID,
      },
      {
        id: "cert-008",
        name: "Basic Life Support",
        issuingBody: "Resuscitation Council UK",
        certificateNumber: "BLS-2024-5678",
        issueDate: "2024-01-10",
        expiryDate: "2025-01-10",
        status: CertificationStatus.VALID,
      }
    ],
    availability: [
      { id: "av-007", sedationistId: "sed-004", dayOfWeek: 1, startTime: "10:00", endTime: "16:00", isAvailable: true },
      { id: "av-008", sedationistId: "sed-004", dayOfWeek: 3, startTime: "10:00", endTime: "16:00", isAvailable: true },
    ],
    recentCases: [
      {
        id: "case-003",
        appointmentId: "apt-125",
        procedureDate: "2024-01-03",
        procedureType: "Conscious Sedation Training Case",
        duration: 60,
        patientName: "Robert Wilson",
        outcome: "Successful",
        notes: "Training case supervised by Dr. Johnson"
      }
    ],
    joinDate: "2023-08-01",
    lastActiveDate: "2024-01-03",
    totalProcedures: 12,
    successRate: 100.0,
    patientRating: 4.5,
    notes: "Junior sedationist in training program, showing excellent progress",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockSedationistService {
  static async getSedationists(params: SedationistSearchParams = {}): Promise<SedationistPaginationResponse> {
    await delay(300);

    let filtered = [...mockSedationists];

    // Apply filters
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.licenseNumber.toLowerCase().includes(searchLower)
      );
    }

    if (params.status && params.status.length > 0) {
      filtered = filtered.filter(s => params.status!.includes(s.status));
    }

    if (params.specialties && params.specialties.length > 0) {
      filtered = filtered.filter(s =>
        params.specialties!.some(spec => s.specialties.includes(spec))
      );
    }

    if (params.certificationStatus && params.certificationStatus.length > 0) {
      filtered = filtered.filter(s =>
        s.certifications.some(cert => params.certificationStatus!.includes(cert.status))
      );
    }

    if (params.availableOnly) {
      filtered = filtered.filter(s => 
        s.status === SedationistStatus.ACTIVE && s.availability.length > 0
      );
    }

    const totalCount = filtered.length;
    const pageSize = params.pageSize || 25;
    const pageNo = params.pageNo || 1;
    const totalPages = Math.ceil(totalCount / pageSize);

    // Apply pagination
    const startIndex = (pageNo - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items,
      totalCount,
      pageNo,
      pageSize,
      totalPages,
    };
  }

  static async getSedationist(id: string): Promise<Sedationist | null> {
    await delay(200);
    return mockSedationists.find(s => s.id === id) || null;
  }

  static async createSedationist(data: CreateSedationistData): Promise<Sedationist> {
    await delay(500);

    const newSedationist: Sedationist = {
      id: `sed-${Date.now()}`,
      ...data,
      status: SedationistStatus.ACTIVE,
      certifications: data.certifications.map((cert, index) => ({
        ...cert,
        id: `cert-${Date.now()}-${index}`,
        status: CertificationStatus.VALID,
      })),
      availability: [],
      recentCases: [],
      joinDate: new Date().toISOString().split('T')[0],
      totalProcedures: 0,
      successRate: 0,
      patientRating: 0,
    };

    mockSedationists.push(newSedationist);
    return newSedationist;
  }

  static async updateSedationist(data: UpdateSedationistData): Promise<Sedationist> {
    await delay(400);

    const index = mockSedationists.findIndex(s => s.id === data.id);
    if (index === -1) {
      throw new Error('Sedationist not found');
    }

    const updated = { ...mockSedationists[index], ...data };
    mockSedationists[index] = updated;
    return updated;
  }

  static async deleteSedationist(id: string): Promise<boolean> {
    await delay(300);

    const index = mockSedationists.findIndex(s => s.id === id);
    if (index === -1) {
      return false;
    }

    mockSedationists.splice(index, 1);
    return true;
  }

  static async getSedationistCertifications(sedationistId: string): Promise<SedationistCertification[]> {
    await delay(200);
    const sedationist = mockSedationists.find(s => s.id === sedationistId);
    return sedationist?.certifications || [];
  }

  static async getSedationistAvailability(sedationistId: string): Promise<SedationistAvailability[]> {
    await delay(200);
    const sedationist = mockSedationists.find(s => s.id === sedationistId);
    return sedationist?.availability || [];
  }

  static async getSedationistCases(sedationistId: string): Promise<SedationistCase[]> {
    await delay(200);
    const sedationist = mockSedationists.find(s => s.id === sedationistId);
    return sedationist?.recentCases || [];
  }
}