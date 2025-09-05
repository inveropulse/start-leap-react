// Mock appointment service for patient appointments
export interface PatientAppointment {
  id: string;
  patientId: string;
  dateTime: string;
  duration: number; // in minutes
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show';
  doctorName: string;
  doctorId: string;
  clinicName: string;
  clinicId: string;
  procedure?: string;
  sedationistName?: string;
  notes?: string;
  fee?: number;
  reference?: string;
}

export interface PatientAppointmentsResponse {
  upcoming: PatientAppointment[];
  past: PatientAppointment[];
}

// Mock data generator
function generateMockAppointments(patientId: string): PatientAppointmentsResponse {
  const doctors = [
    'Sarah Johnson', 'Michael Chen', 'Emma Williams', 'David Rodriguez', 
    'Lisa Thompson', 'James Wilson', 'Maria Garcia', 'Robert Taylor'
  ];
  
  const clinics = [
    'Downtown Medical Center', 'City Dental Practice', 'Westfield Surgery',
    'Central Health Clinic', 'Riverside Medical', 'Metro Dental Care'
  ];
  
  const procedures = [
    'Routine Dental Cleaning', 'Wisdom Tooth Extraction', 'Crown Preparation',
    'Root Canal Treatment', 'Dental Implant Consultation', 'Orthodontic Consultation',
    'Periodontal Treatment', 'Oral Surgery', 'Emergency Dental Care'
  ];

  const statuses: PatientAppointment['status'][] = ['confirmed', 'pending', 'completed', 'cancelled'];
  
  // Generate upcoming appointments (next 6 months)
  const upcoming: PatientAppointment[] = [];
  const upcomingCount = Math.floor(Math.random() * 4) + 1; // 1-4 upcoming appointments
  
  for (let i = 0; i < upcomingCount; i++) {
    const daysFromNow = Math.floor(Math.random() * 180) + 1; // 1-180 days from now
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + daysFromNow);
    appointmentDate.setHours(9 + Math.floor(Math.random() * 8), Math.random() > 0.5 ? 0 : 30);
    
    upcoming.push({
      id: `apt-${patientId}-upcoming-${i + 1}`,
      patientId,
      dateTime: appointmentDate.toISOString(),
      duration: [30, 45, 60, 90, 120][Math.floor(Math.random() * 5)],
      status: ['confirmed', 'pending'][Math.floor(Math.random() * 2)] as PatientAppointment['status'],
      doctorName: doctors[Math.floor(Math.random() * doctors.length)],
      doctorId: `doc-${Math.floor(Math.random() * 100)}`,
      clinicName: clinics[Math.floor(Math.random() * clinics.length)],
      clinicId: `clinic-${Math.floor(Math.random() * 100)}`,
      procedure: procedures[Math.floor(Math.random() * procedures.length)],
      sedationistName: Math.random() > 0.6 ? 'Dr. ' + doctors[Math.floor(Math.random() * doctors.length)] : undefined,
      notes: Math.random() > 0.7 ? 'Patient requested morning appointment' : undefined,
      fee: Math.floor(Math.random() * 500) + 100,
      reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
  }
  
  // Generate past appointments (last 2 years)
  const past: PatientAppointment[] = [];
  const pastCount = Math.floor(Math.random() * 12) + 3; // 3-15 past appointments
  
  for (let i = 0; i < pastCount; i++) {
    const daysAgo = Math.floor(Math.random() * 730) + 1; // 1-730 days ago
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() - daysAgo);
    appointmentDate.setHours(9 + Math.floor(Math.random() * 8), Math.random() > 0.5 ? 0 : 30);
    
    past.push({
      id: `apt-${patientId}-past-${i + 1}`,
      patientId,
      dateTime: appointmentDate.toISOString(),
      duration: [30, 45, 60, 90, 120][Math.floor(Math.random() * 5)],
      status: ['completed', 'cancelled', 'no-show'][Math.floor(Math.random() * 3)] as PatientAppointment['status'],
      doctorName: doctors[Math.floor(Math.random() * doctors.length)],
      doctorId: `doc-${Math.floor(Math.random() * 100)}`,
      clinicName: clinics[Math.floor(Math.random() * clinics.length)],
      clinicId: `clinic-${Math.floor(Math.random() * 100)}`,
      procedure: procedures[Math.floor(Math.random() * procedures.length)],
      sedationistName: Math.random() > 0.6 ? 'Dr. ' + doctors[Math.floor(Math.random() * doctors.length)] : undefined,
      notes: Math.random() > 0.8 ? 'Procedure completed successfully' : undefined,
      fee: Math.floor(Math.random() * 500) + 100,
      reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });
  }
  
  return {
    upcoming: upcoming.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
    past: past.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
  };
}

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory cache for appointments
const appointmentCache = new Map<string, PatientAppointmentsResponse>();

export const appointmentService = {
  async getPatientAppointments(patientId: string): Promise<PatientAppointmentsResponse> {
    await delay(400);
    
    // Check cache first
    if (appointmentCache.has(patientId)) {
      return appointmentCache.get(patientId)!;
    }
    
    // Generate and cache mock data
    const appointments = generateMockAppointments(patientId);
    appointmentCache.set(patientId, appointments);
    
    return appointments;
  },
  
  async bookAppointment(patientId: string, appointmentData: Partial<PatientAppointment>): Promise<PatientAppointment> {
    await delay(500);
    
    const newAppointment: PatientAppointment = {
      id: `apt-${Date.now()}`,
      patientId,
      dateTime: appointmentData.dateTime || new Date().toISOString(),
      duration: appointmentData.duration || 60,
      status: 'pending',
      doctorName: appointmentData.doctorName || 'Dr. Smith',
      doctorId: appointmentData.doctorId || 'doc-1',
      clinicName: appointmentData.clinicName || 'Main Clinic',
      clinicId: appointmentData.clinicId || 'clinic-1',
      procedure: appointmentData.procedure,
      notes: appointmentData.notes,
      fee: appointmentData.fee || 150,
      reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };
    
    // Update cache
    const cached = appointmentCache.get(patientId);
    if (cached) {
      cached.upcoming.push(newAppointment);
      cached.upcoming.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }
    
    return newAppointment;
  },
  
  async updateAppointment(appointmentId: string, updates: Partial<PatientAppointment>): Promise<PatientAppointment> {
    await delay(400);
    
    // In a real implementation, this would update the appointment in the database
    // For now, we'll just return the updated appointment
    return {
      id: appointmentId,
      ...updates,
    } as PatientAppointment;
  },
  
  async cancelAppointment(appointmentId: string): Promise<void> {
    await delay(300);
    
    // In a real implementation, this would mark the appointment as cancelled
    // For now, we'll simulate success
  }
};