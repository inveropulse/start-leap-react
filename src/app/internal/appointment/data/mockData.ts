import { Appointment, AppointmentStatus, AppointmentType, Patient, Doctor, Clinic } from '../types';

// Mock patients
const patients: Patient[] = [
  { id: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com', phone: '+44 7700 900123', dateOfBirth: '1985-03-15' },
  { id: '2', firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@email.com', phone: '+44 7700 900124', dateOfBirth: '1978-11-22' },
  { id: '3', firstName: 'Emma', lastName: 'Williams', email: 'emma.williams@email.com', phone: '+44 7700 900125', dateOfBirth: '1992-07-08' },
  { id: '4', firstName: 'James', lastName: 'Brown', email: 'james.brown@email.com', phone: '+44 7700 900126', dateOfBirth: '1965-12-03' },
  { id: '5', firstName: 'Olivia', lastName: 'Davis', email: 'olivia.davis@email.com', phone: '+44 7700 900127', dateOfBirth: '1989-05-18' },
  { id: '6', firstName: 'Robert', lastName: 'Miller', email: 'robert.miller@email.com', phone: '+44 7700 900128', dateOfBirth: '1973-09-12' },
  { id: '7', firstName: 'Sophie', lastName: 'Wilson', email: 'sophie.wilson@email.com', phone: '+44 7700 900129', dateOfBirth: '1996-01-25' },
  { id: '8', firstName: 'Daniel', lastName: 'Taylor', email: 'daniel.taylor@email.com', phone: '+44 7700 900130', dateOfBirth: '1981-08-07' },
  { id: '9', firstName: 'Grace', lastName: 'Anderson', email: 'grace.anderson@email.com', phone: '+44 7700 900131', dateOfBirth: '1987-04-14' },
  { id: '10', firstName: 'Thomas', lastName: 'Moore', email: 'thomas.moore@email.com', phone: '+44 7700 900132', dateOfBirth: '1970-10-30' }
];

// Mock doctors
const doctors: Doctor[] = [
  { id: '1', firstName: 'Dr. Emily', lastName: 'Roberts', specialization: 'Cardiology', status: 'Active' },
  { id: '2', firstName: 'Dr. David', lastName: 'Thompson', specialization: 'Neurology', status: 'Active' },
  { id: '3', firstName: 'Dr. Lisa', lastName: 'Garcia', specialization: 'Dermatology', status: 'Active' },
  { id: '4', firstName: 'Dr. Mark', lastName: 'Lee', specialization: 'Orthopedics', status: 'Active' },
  { id: '5', firstName: 'Dr. Rachel', lastName: 'White', specialization: 'General Practice', status: 'Active' }
];

// Mock clinics
const clinics: Clinic[] = [
  { id: '1', name: 'Central Medical Center', address: '123 High Street, London, SW1A 1AA', phone: '+44 20 7946 0958' },
  { id: '2', name: 'Riverside Health Clinic', address: '456 Thames Road, London, SE1 9NY', phone: '+44 20 7946 0959' },
  { id: '3', name: 'Park Lane Surgery', address: '789 Park Lane, London, W1K 1LB', phone: '+44 20 7946 0960' },
  { id: '4', name: 'Victoria Medical Centre', address: '321 Victoria Street, London, SW1E 6QP', phone: '+44 20 7946 0961' },
  { id: '5', name: 'Greenwich Healthcare', address: '654 Greenwich Road, London, SE10 8JA', phone: '+44 20 7946 0962' }
];

const procedures = [
  'Annual Health Check',
  'Blood Pressure Monitoring',
  'Cardiac Consultation',
  'Neurological Assessment',
  'Skin Cancer Screening',
  'Joint Pain Evaluation',
  'General Consultation',
  'Follow-up Examination',
  'Routine Blood Work',
  'Preventive Care Visit'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysFromNow: number = 0, range: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow + Math.floor(Math.random() * range) - Math.floor(range / 2));
  return date.toISOString().split('T')[0];
}

function getRandomTime(): string {
  const hours = 8 + Math.floor(Math.random() * 10); // 8 AM to 6 PM
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function generateMockAppointments(): Appointment[] {
  const appointments: Appointment[] = [];
  
  for (let i = 1; i <= 150; i++) {
    const patient = getRandomElement(patients);
    const doctor = getRandomElement(doctors);
    const clinic = getRandomElement(clinics);
    const procedure = getRandomElement(procedures);
    
    // Bias towards recent/upcoming appointments
    const dateOffset = i <= 30 ? 0 : i <= 80 ? -7 : -30;
    const appointmentDate = getRandomDate(dateOffset, 14);
    
    const appointment: Appointment = {
      id: i.toString(),
      reference: `APT-${(1000 + i).toString()}`,
      patient,
      doctor,
      clinic,
      appointmentDate,
      appointmentTime: getRandomTime(),
      duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
      type: getRandomElement(Object.values(AppointmentType)),
      status: getRandomElement(Object.values(AppointmentStatus)),
      procedure,
      notes: Math.random() > 0.7 ? `Additional notes for appointment ${i}` : undefined,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    appointments.push(appointment);
  }
  
  return appointments.sort((a, b) => 
    new Date(b.appointmentDate + ' ' + b.appointmentTime).getTime() - 
    new Date(a.appointmentDate + ' ' + a.appointmentTime).getTime()
  );
}

export const mockAppointments = generateMockAppointments();