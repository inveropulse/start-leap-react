import { 
  Patient, 
  CreatePatientRequest, 
  UpdatePatientRequest, 
  PatientsQueryParams, 
  PatientPaginationResponse,
  Title,
  Sex,
  SmokingStatus,
  AlcoholStatus
} from "../types/patient.types";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: "1",
    title: Title.MR,
    firstName: "John",
    lastName: "Smith",
    dateOfBirth: "1985-06-15",
    sex: Sex.MALE,
    email: "john.smith@example.com",
    phoneNumber: "+44 7700 900123",
    address: "123 Main Street, London, SW1A 1AA",
    emergencyContactName: "Jane Smith",
    emergencyContactPhone: "+44 7700 900124",
    smokingStatus: SmokingStatus.NEVER,
    alcoholStatus: AlcoholStatus.OCCASIONAL,
    allergies: ["Penicillin", "Nuts"],
    medications: ["Lisinopril 10mg"],
    medicalHistory: "History of hypertension",
    notes: "Patient prefers morning appointments",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: Title.MRS,
    firstName: "Sarah",
    lastName: "Johnson",
    dateOfBirth: "1978-03-22",
    sex: Sex.FEMALE,
    email: "sarah.johnson@example.com",
    phoneNumber: "+44 7700 900125",
    address: "456 Oak Avenue, Manchester, M1 1AA",
    emergencyContactName: "Robert Johnson",
    emergencyContactPhone: "+44 7700 900126",
    smokingStatus: SmokingStatus.FORMER,
    alcoholStatus: AlcoholStatus.NEVER,
    allergies: [],
    medications: ["Metformin 500mg"],
    medicalHistory: "Type 2 diabetes",
    notes: "Requires wheelchair access",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "3",
    title: Title.DR,
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: "1965-11-08",
    sex: Sex.MALE,
    email: "dr.brown@example.com",
    phoneNumber: "+44 7700 900127",
    address: "789 Pine Road, Birmingham, B1 1AA",
    emergencyContactName: "Linda Brown",
    emergencyContactPhone: "+44 7700 900128",
    smokingStatus: SmokingStatus.CURRENT,
    alcoholStatus: AlcoholStatus.REGULAR,
    allergies: ["Latex"],
    medications: [],
    medicalHistory: "No significant medical history",
    notes: "Healthcare professional - doctor",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
  },
];

// Simulate patient service
export const patientService = {
  async getPatients(params: PatientsQueryParams = {}): Promise<PatientPaginationResponse> {
    await delay(800); // Simulate API delay

    const { search = "", page = 1, pageSize = 10 } = params;
    
    // Filter patients based on search
    let filteredPatients = mockPatients;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = mockPatients.filter(patient => 
        patient.firstName.toLowerCase().includes(searchLower) ||
        patient.lastName.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower) ||
        patient.phoneNumber.includes(search)
      );
    }

    // Calculate pagination
    const totalCount = filteredPatients.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredPatients.slice(startIndex, endIndex);

    return {
      items,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  async getPatient(id: string): Promise<Patient | null> {
    await delay(500); // Simulate API delay
    
    const patient = mockPatients.find(p => p.id === id);
    return patient || null;
  },

  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    await delay(1000); // Simulate API delay
    
    const newPatient: Patient = {
      ...data,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockPatients.push(newPatient);
    return newPatient;
  },

  async updatePatient(data: UpdatePatientRequest): Promise<Patient> {
    await delay(800); // Simulate API delay
    
    const index = mockPatients.findIndex(p => p.id === data.id);
    if (index === -1) {
      throw new Error("Patient not found");
    }

    const updatedPatient: Patient = {
      ...mockPatients[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockPatients[index] = updatedPatient;
    return updatedPatient;
  },

  async deletePatient(id: string): Promise<void> {
    await delay(600); // Simulate API delay
    
    const index = mockPatients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error("Patient not found");
    }

    mockPatients.splice(index, 1);
  },
};