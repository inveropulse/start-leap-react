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

  // Add specific overlapping appointments for Michael Chen and Sarah Williams for today
  const today = new Date();
  if (startDate <= today && endDate >= today) {
    // Michael Chen (sed-1) - 3 hour appointment: 10:00 AM - 1:00 PM
    if (sedationistIds.includes("sed-1")) {
      const michaelStart = new Date(today);
      michaelStart.setHours(10, 0, 0, 0);
      const michaelEnd = new Date(michaelStart);
      michaelEnd.setHours(13, 0, 0, 0); // 3 hours

      appointments.push({
        id: `app-michael-special-${today.getTime()}`,
        patientName: "Alexander Moore",
        clinicName: "Harley Street Dental",
        sedationistName: "Michael Chen",
        sedationistId: "sed-1",
        procedure: "Full mouth reconstruction",
        start: michaelStart.toISOString(),
        end: michaelEnd.toISOString(),
        status: AppointmentStatus.CONFIRMED,
        patientTitle: Title.MR,
        doctorName: "Dr. Williams",
        clinicAddress: "123 Harley Street, London",
        notes: "Complex full mouth reconstruction - requires extended sedation monitoring",
      });
    }

    // Sarah Williams (sed-2) - 6 hour appointment: 12:00 PM - 6:00 PM (overlaps with Michael 12-1 PM)
    if (sedationistIds.includes("sed-2")) {
      const sarahStart = new Date(today);
      sarahStart.setHours(12, 0, 0, 0);
      const sarahEnd = new Date(sarahStart);
      sarahEnd.setHours(18, 0, 0, 0); // 6 hours

      appointments.push({
        id: `app-sarah-special-${today.getTime()}`,
        patientName: "Jessica White",
        clinicName: "Westminster Oral Surgery",
        sedationistName: "Sarah Williams",
        sedationistId: "sed-2",
        procedure: "Jaw reconstruction surgery",
        start: sarahStart.toISOString(),
        end: sarahEnd.toISOString(),
        status: AppointmentStatus.CONFIRMED,
        patientTitle: Title.MS,
        doctorName: "Dr. Smith",
        clinicAddress: "456 Westminster Avenue, London",
        notes: "Major jaw reconstruction - extensive sedation and monitoring required",
      });
    }
  }

  // Helper function to check if two appointments overlap
  const appointmentsOverlap = (apt1Start: Date, apt1End: Date, apt2Start: Date, apt2End: Date): boolean => {
    return apt1Start < apt2End && apt2Start < apt1End;
  };

  // Generate appointments for each sedationist
  sedationistIds.forEach((sedationistId) => {
    const sedationist = mockSedationists.find(s => s.id === sedationistId);
    if (!sedationist) return;

    // Generate appointments for the date range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Track existing appointments for this sedationist on this day
      const dayAppointments = appointments.filter(apt => 
        apt.sedationistId === sedationistId && 
        new Date(apt.start!).toDateString() === currentDate.toDateString()
      );

      // More appointments for today and near dates
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const appointmentsPerDay = isToday ? 
        Math.floor(Math.random() * 2) + 1 : // 1-2 for today (reduced since we added specific ones)
        Math.floor(Math.random() * 3) + 1;   // 1-3 for other days

      let attemptsForDay = 0;
      const maxAttemptsPerDay = 20; // Prevent infinite loops

      for (let i = 0; i < appointmentsPerDay && attemptsForDay < maxAttemptsPerDay; i++) {
        let appointmentCreated = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!appointmentCreated && attempts < maxAttempts) {
          attempts++;
          attemptsForDay++;

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

          // Check for conflicts with existing appointments for this sedationist
          const hasConflict = dayAppointments.some(existingApt => 
            appointmentsOverlap(
              appointmentStart,
              appointmentEnd,
              new Date(existingApt.start!),
              new Date(existingApt.end!)
            )
          );

          if (!hasConflict) {
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
            
            const newAppointment = {
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
            };

            appointments.push(newAppointment);
            dayAppointments.push(newAppointment); // Track for future conflict checking
            appointmentCreated = true;
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return appointments.sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime());
};