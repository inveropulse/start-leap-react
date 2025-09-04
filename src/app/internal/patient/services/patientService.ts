import { Patient, PatientPaginationResponse, CreatePatientRequest, UpdatePatientRequest, PatientsQueryParams } from "../types/patient.types";
import { Title } from "@/api/generated/models/Title";
import { Sex } from "@/api/generated/models/Sex";
import { SmokingStatus } from "@/api/generated/models/SmokingStatus";
import { AlcoholStatus } from "@/api/generated/models/AlcoholStatus";

// Mock data generation
const mockPatients: Patient[] = Array.from({ length: 87 }, (_, index) => {
  const id = `patient-${String(index + 1).padStart(3, '0')}`;
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const age = Math.floor(Math.random() * 70) + 18;
  const birthYear = new Date().getFullYear() - age;
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1;
  
  return {
    id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    bmi: Math.round((Math.random() * 15 + 18) * 10) / 10,
    title: Math.random() > 0.5 ? Title.MR : Title.MRS,
    dateOfBirth: `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`,
    sex: Math.random() > 0.5 ? Sex.MALE : Sex.FEMALE,
    age,
    address: `${Math.floor(Math.random() * 999) + 1} Main St`,
    town: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'][Math.floor(Math.random() * 5)],
    country: 'United Kingdom',
    postCode: `${['SW', 'NW', 'SE', 'NE', 'W', 'E'][Math.floor(Math.random() * 6)]}${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 9)}${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}`,
    phoneNumber: `+44 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
    alternativePhoneNumber: Math.random() > 0.7 ? `+44 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}` : null,
    businessName: null,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    medicalHistory: Math.random() > 0.5 ? ['Hypertension', 'Diabetes', 'Asthma', 'Heart Disease'][Math.floor(Math.random() * 4)] : null,
    allergies: Math.random() > 0.6 ? ['Penicillin', 'Peanuts', 'Latex', 'Shellfish'][Math.floor(Math.random() * 4)] : null,
    medications: Math.random() > 0.4 ? ['Lisinopril', 'Metformin', 'Albuterol', 'Atorvastatin'][Math.floor(Math.random() * 4)] : null,
    anestheticHistory: Math.random() > 0.7 ? 'Previous general anesthesia for appendectomy' : null,
    asaClassification: Math.floor(Math.random() * 3) + 1,
    smokingStatus: [SmokingStatus.NEVER, SmokingStatus.FORMER, SmokingStatus.YES][Math.floor(Math.random() * 3)],
    alcoholStatus: [AlcoholStatus.NEVER, AlcoholStatus.FORMER, AlcoholStatus.YES][Math.floor(Math.random() * 3)],
    lastMealAgoInHours: Math.random() > 0.5 ? Math.floor(Math.random() * 12) + 1 : null,
    lastFluidAgoInHours: Math.random() > 0.5 ? Math.floor(Math.random() * 6) + 1 : null,
    occupation: ['Teacher', 'Engineer', 'Doctor', 'Nurse', 'Accountant', 'Manager', 'Retired'][Math.floor(Math.random() * 7)],
    heightFormat: 'cm',
    height: Math.floor(Math.random() * 40) + 150,
    weightFormat: 'kg',
    weight: Math.floor(Math.random() * 50) + 50,
    ticketId: Math.random() > 0.8 ? `TKT-${Math.floor(Math.random() * 9999) + 1000}` : null,
    notes: Math.random() > 0.6 ? 'Patient is cooperative and follows instructions well.' : null,
    createdDateTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    smokingNote: null,
    alcoholNote: null,
  };
});

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const patientService = {
  async getPatients(params: PatientsQueryParams = {}): Promise<PatientPaginationResponse> {
    await delay(300);
    
    const { searchText = '', pageNo = 1, pageSize = 10 } = params;
    
    // Filter patients based on search text
    let filteredPatients = mockPatients;
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredPatients = mockPatients.filter(patient => 
        patient.firstName?.toLowerCase().includes(searchLower) ||
        patient.lastName?.toLowerCase().includes(searchLower) ||
        patient.fullName?.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower) ||
        patient.phoneNumber?.includes(searchText)
      );
    }
    
    // Paginate results
    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);
    
    return {
      payload: paginatedPatients,
      page: pageNo,
      pageSize,
      totalCount: filteredPatients.length,
      totalPages: Math.ceil(filteredPatients.length / pageSize),
    };
  },

  async getPatient(id: string): Promise<Patient | null> {
    await delay(200);
    
    const patient = mockPatients.find(p => p.id === id);
    return patient || null;
  },

  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    await delay(400);
    
    const newPatient: Patient = {
      id: `patient-${String(mockPatients.length + 1).padStart(3, '0')}`,
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
      bmi: data.weight && data.height ? Math.round((data.weight / Math.pow(data.height / 100, 2)) * 10) / 10 : 0,
      age: new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear(),
      createdDateTime: new Date().toISOString(),
      lastMealAgoInHours: null,
      lastFluidAgoInHours: null,
      ticketId: null,
      town: data.town || null,
      country: data.country || null,
      postCode: data.postCode || null,
      phoneNumber: data.phoneNumber || null,
      alternativePhoneNumber: data.alternativePhoneNumber || null,
      businessName: data.businessName || null,
      email: data.email || null,
      medicalHistory: data.medicalHistory || null,
      allergies: data.allergies || null,
      medications: data.medications || null,
      anestheticHistory: data.anestheticHistory || null,
      asaClassification: data.asaClassification || 1,
      smokingStatus: data.smokingStatus || SmokingStatus.NEVER,
      alcoholStatus: data.alcoholStatus || AlcoholStatus.NEVER,
      occupation: data.occupation || null,
      heightFormat: data.heightFormat || 'cm',
      height: data.height || 0,
      weightFormat: data.weightFormat || 'kg',
      weight: data.weight || 0,
      notes: data.notes || null,
      smokingNote: data.smokingNote || null,
      alcoholNote: data.alcoholNote || null,
      address: data.address || null,
    };
    
    mockPatients.push(newPatient);
    return newPatient;
  },

  async updatePatient(data: UpdatePatientRequest): Promise<Patient> {
    await delay(300);
    
    const index = mockPatients.findIndex(p => p.id === data.id);
    if (index === -1) {
      throw new Error('Patient not found');
    }
    
    const updatedPatient: Patient = {
      ...mockPatients[index],
      ...data,
      fullName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : mockPatients[index].fullName,
      bmi: data.weight && data.height ? Math.round((data.weight / Math.pow(data.height / 100, 2)) * 10) / 10 : mockPatients[index].bmi,
      age: data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : mockPatients[index].age,
    };
    
    mockPatients[index] = updatedPatient;
    return updatedPatient;
  },

  async deletePatient(id: string): Promise<void> {
    await delay(250);
    
    const index = mockPatients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Patient not found');
    }
    
    mockPatients.splice(index, 1);
  },
};