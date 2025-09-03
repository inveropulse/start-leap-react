import { SedationistDto } from "@/api/generated/models/SedationistDto";
import { DiaryAppointmentDto } from "@/api/generated/models/DiaryAppointmentDto";
import { AppointmentStatus } from "@/api/generated/models/AppointmentStatus";
import { Title } from "@/api/generated/models/Title";

// Mock sedationists data
export const mockSedationists: SedationistDto[] = [
  {
    id: "sed-1",
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@example.com",
    phoneNumber: "+44 7700 900123",
    notes: "Specializes in Anaesthesia",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-2", 
    firstName: "Sarah",
    lastName: "Williams",
    email: "s.williams@example.com",
    phoneNumber: "+44 7700 900124",
    notes: "Specializes in Conscious Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-3",
    firstName: "James",
    lastName: "Thompson",
    email: "j.thompson@example.com", 
    phoneNumber: "+44 7700 900125",
    notes: "Specializes in IV Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-4",
    firstName: "Emma",
    lastName: "Davis",
    email: "e.davis@example.com",
    phoneNumber: "+44 7700 900126", 
    notes: "Specializes in Paediatric Sedation",
    createdDateTime: new Date().toISOString(),
  },
];

// Helper to generate mock appointments for a given date range
export const generateMockAppointments = (
  startDate: Date,
  endDate: Date,
  sedationistIds: string[]
): DiaryAppointmentDto[] => {
  const appointments: DiaryAppointmentDto[] = [];
  const appointmentTypes = [
    "Wisdom tooth extraction",
    "Dental implant surgery", 
    "Root canal treatment",
    "Multiple extractions",
    "Oral surgery",
  ];
  
  const clinics = [
    "Harley Street Dental",
    "Central London Clinic", 
    "Mayfair Dental Practice",
    "Westminster Oral Surgery",
    "Bloomsbury Dentistry",
  ];

  const patientNames = [
    "Sarah Johnson",
    "David Smith", 
    "Emma Brown",
    "Michael Wilson",
    "Lisa Taylor",
    "Robert Jones",
    "Maria Garcia",
    "John Davis",
  ];

  // Generate appointments for each sedationist
  sedationistIds.forEach((sedationistId, index) => {
    const sedationist = mockSedationists.find(s => s.id === sedationistId);
    if (!sedationist) return;

    // Generate 2-4 appointments per day for each sedationist
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const appointmentsPerDay = Math.floor(Math.random() * 3) + 2; // 2-4 appointments

      for (let i = 0; i < appointmentsPerDay; i++) {
        const startHour = 9 + Math.floor(Math.random() * 8); // 9 AM - 5 PM
        const duration = [60, 90, 120][Math.floor(Math.random() * 3)]; // 1-2 hours
        
        const appointmentStart = new Date(currentDate);
        appointmentStart.setHours(startHour, 0, 0, 0);
        
        const appointmentEnd = new Date(appointmentStart);
        appointmentEnd.setMinutes(appointmentEnd.getMinutes() + duration);

        const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
        const clinic = clinics[Math.floor(Math.random() * clinics.length)];
        const procedure = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
        
        appointments.push({
          id: `app-${sedationistId}-${currentDate.getTime()}-${i}`,
          patientName,
          clinicName: clinic,
          sedationistName: `${sedationist.firstName} ${sedationist.lastName}`,
          sedationistId,
          procedure,
          start: appointmentStart.toISOString(),
          end: appointmentEnd.toISOString(),
          status: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING][Math.floor(Math.random() * 2)],
          patientTitle: Title.MRS,
          doctorName: "Dr. Smith",
          clinicAddress: "123 Medical Street, London",
          notes: `${procedure} with IV sedation`,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return appointments.sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime());
};