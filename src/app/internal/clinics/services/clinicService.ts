import { 
  Clinic, 
  ClinicSearchParams, 
  ClinicPaginationResponse, 
  CreateClinicRequest, 
  UpdateClinicRequest,
  ClinicStatus,
  ClinicType,
  ClinicDoctor,
  ClinicUser,
  ClinicActivity,
  ClinicManagementData
} from '../types/clinic.types';

// Mock data generation
const generateMockClinic = (id: number): Clinic => {
  const clinicNames = [
    'London Medical Centre', 'Brighton Health Clinic', 'Manchester Specialist Centre',
    'Birmingham Family Practice', 'Leeds Dental Surgery', 'Liverpool Medical Hub',
    'Sheffield Health Centre', 'Bristol General Practice', 'Cardiff Medical Centre',
    'Edinburgh Clinic', 'Glasgow Health Practice', 'Newcastle Medical Centre',
    'Oxford Health Clinic', 'Cambridge Medical Practice', 'Canterbury Dental Centre'
  ];

  const contactPersons = [
    'Dr. Sarah Johnson', 'Dr. Michael Brown', 'Dr. Emily Davis', 'Dr. James Wilson',
    'Dr. Emma Thompson', 'Dr. Robert Anderson', 'Dr. Lisa White', 'Dr. David Clark'
  ];

  const addresses = [
    '123 Harley Street, London', '45 Marine Parade, Brighton', '78 Oxford Road, Manchester',
    '156 High Street, Birmingham', '234 Woodhouse Lane, Leeds', '89 Bold Street, Liverpool',
    '67 Division Street, Sheffield', '145 Park Street, Bristol', '89 Queen Street, Cardiff',
    '234 Royal Mile, Edinburgh', '123 Sauchiehall Street, Glasgow', '67 Grey Street, Newcastle'
  ];

  const cities = [
    'London', 'Brighton', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool',
    'Sheffield', 'Bristol', 'Cardiff', 'Edinburgh', 'Glasgow', 'Newcastle'
  ];

  const statuses = Object.values(ClinicStatus);
  const types = Object.values(ClinicType);

  return {
    id: `clinic-${id}`,
    name: clinicNames[id % clinicNames.length],
    contactPersonName: contactPersons[id % contactPersons.length],
    physicalAddress: addresses[id % addresses.length],
    phoneNumber: `+44 ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
    postalCode: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    website: `https://www.${clinicNames[id % clinicNames.length].toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')}.co.uk`,
    emailAddress: `info@${clinicNames[id % clinicNames.length].toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')}.co.uk`,
    comments: Math.random() > 0.7 ? 'Specialized in emergency care and diagnostics' : null,
    status: statuses[id % statuses.length],
    type: types[id % types.length],
    city: cities[id % cities.length],
    country: 'United Kingdom',
    doctorCount: Math.floor(Math.random() * 15) + 2,
    activeAppointmentCount: Math.floor(Math.random() * 50) + 5,
    createdDateTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdatedDateTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

const generateMockClinics = (count: number = 50): Clinic[] => {
  return Array.from({ length: count }, (_, i) => generateMockClinic(i));
};

const generateMockDoctors = (clinicId: string, count: number = 5): ClinicDoctor[] => {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Emily'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Thompson', 'Anderson', 'White'];
  const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Practice'];

  return Array.from({ length: count }, (_, i) => ({
    id: `${clinicId}-doctor-${i}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    specialization: specializations[i % specializations.length],
    phoneNumber: `+44 ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@clinic.com`,
    status: Math.random() > 0.2 ? 'Active' : 'Inactive' as const,
    joinedDate: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const generateMockUsers = (clinicId: string, count: number = 3): ClinicUser[] => {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastNames = ['Brown', 'Green', 'White', 'Black', 'Gray', 'Blue'];
  const roles = ['Admin', 'Receptionist', 'Nurse', 'Manager'];

  return Array.from({ length: count }, (_, i) => ({
    id: `${clinicId}-user-${i}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@clinic.com`,
    role: roles[i % roles.length],
    status: Math.random() > 0.1 ? 'Active' : 'Inactive' as const,
    lastLogin: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  }));
};

const generateMockActivities = (clinicId: string, count: number = 10): ClinicActivity[] => {
  const types: ClinicActivity['type'][] = ['Created', 'Updated', 'Doctor Added', 'Doctor Removed', 'Status Changed'];
  const performers = ['John Admin', 'Sarah Manager', 'System', 'Michael Brown'];

  return Array.from({ length: count }, (_, i) => ({
    id: `${clinicId}-activity-${i}`,
    type: types[i % types.length],
    description: `Clinic ${types[i % types.length].toLowerCase()} by ${performers[i % performers.length]}`,
    performedBy: performers[i % performers.length],
    timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    details: { action: types[i % types.length], reason: 'Routine maintenance' },
  }));
};

// Mock storage
let mockClinics = generateMockClinics(60);

// Simulate network delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const clinicService = {
  async getClinics(params: ClinicSearchParams = {}): Promise<ClinicPaginationResponse> {
    await delay();

    let filteredClinics = [...mockClinics];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredClinics = filteredClinics.filter(clinic => 
        clinic.name?.toLowerCase().includes(searchLower) ||
        clinic.contactPersonName?.toLowerCase().includes(searchLower) ||
        clinic.physicalAddress?.toLowerCase().includes(searchLower) ||
        clinic.city?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (params.status) {
      filteredClinics = filteredClinics.filter(clinic => clinic.status === params.status);
    }

    // Apply type filter
    if (params.type) {
      filteredClinics = filteredClinics.filter(clinic => clinic.type === params.type);
    }

    // Apply city filter
    if (params.city) {
      filteredClinics = filteredClinics.filter(clinic => clinic.city === params.city);
    }

    // Apply sorting
    if (params.sortBy) {
      filteredClinics.sort((a, b) => {
        const aVal = a[params.sortBy!] ?? '';
        const bVal = b[params.sortBy!] ?? '';
        const result = aVal.toString().localeCompare(bVal.toString());
        return params.sortOrder === 'desc' ? -result : result;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 12;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedClinics = filteredClinics.slice(startIndex, endIndex);

    return {
      clinics: paginatedClinics,
      totalCount: filteredClinics.length,
      totalPages: Math.ceil(filteredClinics.length / pageSize),
      currentPage: page,
      pageSize,
    };
  },

  async getClinic(id: string): Promise<Clinic | null> {
    await delay(300);
    return mockClinics.find(clinic => clinic.id === id) || null;
  },

  async getClinicManagementData(id: string): Promise<ClinicManagementData | null> {
    await delay(600);
    const clinic = mockClinics.find(c => c.id === id);
    if (!clinic) return null;

    return {
      clinic,
      doctors: generateMockDoctors(id, clinic.doctorCount || 5),
      users: generateMockUsers(id, 3),
      activities: generateMockActivities(id, 15),
    };
  },

  async createClinic(data: CreateClinicRequest): Promise<Clinic> {
    await delay(1000);
    
    const newClinic: Clinic = {
      ...data,
      id: `clinic-${Date.now()}`,
      doctorCount: 0,
      activeAppointmentCount: 0,
      status: data.status || ClinicStatus.ACTIVE,
      createdDateTime: new Date().toISOString(),
      lastUpdatedDateTime: new Date().toISOString(),
    };

    mockClinics.push(newClinic);
    return newClinic;
  },

  async updateClinic(data: UpdateClinicRequest): Promise<Clinic> {
    await delay(800);
    
    const index = mockClinics.findIndex(clinic => clinic.id === data.id);
    if (index === -1) {
      throw new Error('Clinic not found');
    }

    const updatedClinic = {
      ...mockClinics[index],
      ...data,
      lastUpdatedDateTime: new Date().toISOString(),
    };

    mockClinics[index] = updatedClinic;
    return updatedClinic;
  },

  async deleteClinic(id: string): Promise<void> {
    await delay(500);
    
    const index = mockClinics.findIndex(clinic => clinic.id === id);
    if (index === -1) {
      throw new Error('Clinic not found');
    }

    mockClinics.splice(index, 1);
  },
};