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

// Generate comprehensive mock appointments with more realistic data
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
    "Tooth extraction",
    "Periodontal surgery",
    "Bone graft procedure",
    "Full mouth reconstruction",
    "Complex oral surgery",
    "Multiple implant placement",
    "Jaw reconstruction surgery",
  ];
  
  const clinics = [
    "Harley Street Dental",
    "Central London Clinic", 
    "Mayfair Dental Practice",
    "Westminster Oral Surgery",
    "Bloomsbury Dentistry",
    "City Dental Centre",
    "Royal Dental Practice",
  ];

  const patientNames = [
    "Sarah Johnson", "David Smith", "Emma Brown", "Michael Wilson",
    "Lisa Taylor", "Robert Jones", "Maria Garcia", "John Davis",
    "Sophie Chen", "Alexander Moore", "Jessica White", "Daniel Clark",
    "Rachel Green", "Thomas Anderson", "Amy Rodriguez", "James Miller",
  ];

  const doctorNames = [
    "Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown",
    "Dr. Davis", "Dr. Miller", "Dr. Wilson", "Dr. Moore",
  ];

  // Generate appointments for each sedationist
  sedationistIds.forEach((sedationistId) => {
    const sedationist = mockSedationists.find(s => s.id === sedationistId);
    if (!sedationist) return;

    // Generate appointments for the date range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // More appointments for today and near dates
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const appointmentsPerDay = isToday ? 
        Math.floor(Math.random() * 4) + 3 : // 3-6 for today
        Math.floor(Math.random() * 3) + 1;   // 1-3 for other days

      for (let i = 0; i < appointmentsPerDay; i++) {
        // Realistic appointment times (9 AM - 6 PM)
        const availableHours = [9, 10, 11, 13, 14, 15, 16, 17, 18];
        const startHour = availableHours[Math.floor(Math.random() * availableHours.length)];
        const startMinute = [0, 30][Math.floor(Math.random() * 2)]; // On the hour or half hour
        // Varied appointment durations from 30 minutes to 6 hours
        const durationOptions = [30, 45, 60, 90, 120, 150, 180, 240, 300, 360]; // 30min to 6 hours
        const duration = durationOptions[Math.floor(Math.random() * durationOptions.length)];
        
        const appointmentStart = new Date(currentDate);
        appointmentStart.setHours(startHour, startMinute, 0, 0);
        
        const appointmentEnd = new Date(appointmentStart);
        appointmentEnd.setMinutes(appointmentEnd.getMinutes() + duration);

        const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
        const clinic = clinics[Math.floor(Math.random() * clinics.length)];
        const procedure = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
        const doctorName = doctorNames[Math.floor(Math.random() * doctorNames.length)];
        
        // More realistic status distribution
        const statusOptions = [
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.CONFIRMED, // Higher chance of confirmed
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.PENDING,
        ];
        
        appointments.push({
          id: `app-${sedationistId}-${currentDate.getTime()}-${i}`,
          patientName,
          clinicName: clinic,
          sedationistName: `${sedationist.firstName} ${sedationist.lastName}`,
          sedationistId,
          procedure,
          start: appointmentStart.toISOString(),
          end: appointmentEnd.toISOString(),
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          patientTitle: [Title.MR, Title.MRS, Title.MS, Title.DR][Math.floor(Math.random() * 4)],
          doctorName,
          clinicAddress: `${Math.floor(Math.random() * 999) + 1} Medical Street, London`,
          notes: `${procedure} with IV sedation - ${sedationist.notes}`,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return appointments.sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime());
};