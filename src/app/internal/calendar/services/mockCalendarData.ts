import { SedationistDto } from "@/api/generated/models/SedationistDto";
import { DiaryAppointmentDto } from "@/api/generated/models/DiaryAppointmentDto";
import { DiaryAvailabilityDto } from "@/api/generated/models/DiaryAvailabilityDto";
import { AppointmentStatus } from "@/api/generated/models/AppointmentStatus";
import { AvailabilityStatus } from "@/api/generated/models/AvailabilityStatus";
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
  {
    id: "sed-5",
    firstName: "David",
    lastName: "Rodriguez",
    email: "d.rodriguez@example.com",
    phoneNumber: "+44 7700 900127",
    notes: "Specializes in General Anaesthesia",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-6",
    firstName: "Lisa",
    lastName: "Anderson",
    email: "l.anderson@example.com",
    phoneNumber: "+44 7700 900128",
    notes: "Specializes in Inhalation Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-7",
    firstName: "Robert",
    lastName: "Martinez",
    email: "r.martinez@example.com",
    phoneNumber: "+44 7700 900129",
    notes: "Specializes in Deep Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-8",
    firstName: "Jennifer",
    lastName: "Taylor",
    email: "j.taylor@example.com",
    phoneNumber: "+44 7700 900130",
    notes: "Specializes in Oral Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-9",
    firstName: "Christopher",
    lastName: "Brown",
    email: "c.brown@example.com",
    phoneNumber: "+44 7700 900131",
    notes: "Specializes in Monitored Anaesthesia Care",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-10",
    firstName: "Amanda",
    lastName: "Wilson",
    email: "a.wilson@example.com",
    phoneNumber: "+44 7700 900132",
    notes: "Specializes in Sedation for Special Needs",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-11",
    firstName: "Daniel",
    lastName: "Garcia",
    email: "d.garcia@example.com",
    phoneNumber: "+44 7700 900133",
    notes: "Specializes in Emergency Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-12",
    firstName: "Rachel",
    lastName: "Miller",
    email: "r.miller@example.com",
    phoneNumber: "+44 7700 900134",
    notes: "Specializes in Geriatric Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-13",
    firstName: "Kevin",
    lastName: "Johnson",
    email: "k.johnson@example.com",
    phoneNumber: "+44 7700 900135",
    notes: "Specializes in Complex Procedures",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-14",
    firstName: "Michelle",
    lastName: "Lee",
    email: "m.lee@example.com",
    phoneNumber: "+44 7700 900136",
    notes: "Specializes in Minimal Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-15",
    firstName: "Paul",
    lastName: "White",
    email: "p.white@example.com",
    phoneNumber: "+44 7700 900137",
    notes: "Specializes in Moderate Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-16",
    firstName: "Karen",
    lastName: "Harris",
    email: "k.harris@example.com",
    phoneNumber: "+44 7700 900138",
    notes: "Specializes in Anxiety Management",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-17",
    firstName: "Steven",
    lastName: "Clark",
    email: "s.clark@example.com",
    phoneNumber: "+44 7700 900139",
    notes: "Specializes in Pain Management",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-18",
    firstName: "Nicole",
    lastName: "Lewis",
    email: "n.lewis@example.com",
    phoneNumber: "+44 7700 900140",
    notes: "Specializes in Regional Anaesthesia",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-19",
    firstName: "Mark",
    lastName: "Walker",
    email: "m.walker@example.com",
    phoneNumber: "+44 7700 900141",
    notes: "Specializes in Cardiac Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-20",
    firstName: "Stephanie",
    lastName: "Hall",
    email: "s.hall@example.com",
    phoneNumber: "+44 7700 900142",
    notes: "Specializes in Respiratory Monitoring",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-21",
    firstName: "Andrew",
    lastName: "Young",
    email: "a.young@example.com",
    phoneNumber: "+44 7700 900143",
    notes: "Specializes in Outpatient Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-22",
    firstName: "Jessica",
    lastName: "King",
    email: "j.king@example.com",
    phoneNumber: "+44 7700 900144",
    notes: "Specializes in Dental Phobia Treatment",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-23",
    firstName: "Brian",
    lastName: "Wright",
    email: "b.wright@example.com",
    phoneNumber: "+44 7700 900145",
    notes: "Specializes in High-Risk Patients",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-24",
    firstName: "Ashley",
    lastName: "Lopez",
    email: "a.lopez@example.com",
    phoneNumber: "+44 7700 900146",
    notes: "Specializes in Adolescent Sedation",
    createdDateTime: new Date().toISOString(),
  },
  {
    id: "sed-25",
    firstName: "Matthew",
    lastName: "Hill",
    email: "m.hill@example.com",
    phoneNumber: "+44 7700 900147",
    notes: "Specializes in Long Duration Procedures",
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

  // Track all appointments per sedationist to prevent conflicts
  const sedationistAppointments = new Map<string, DiaryAppointmentDto[]>();

  // Initialize tracking for each sedationist
  sedationistIds.forEach(id => {
    sedationistAppointments.set(id, appointments.filter(apt => apt.sedationistId === id));
  });

  // Generate appointments for each sedationist
  sedationistIds.forEach((sedationistId) => {
    const sedationist = mockSedationists.find(s => s.id === sedationistId);
    if (!sedationist) return;

    const existingAppointments = sedationistAppointments.get(sedationistId) || [];

    // Generate appointments for the date range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // More appointments for today and near dates
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const appointmentsPerDay = isToday ? 
        Math.floor(Math.random() * 2) + 1 : // 1-2 for today (reduced since we added specific ones)
        Math.floor(Math.random() * 3) + 1;   // 1-3 for other days

      // Generate time slots for the day to ensure no overlaps
      const dayTimeSlots: { start: Date; end: Date; used: boolean }[] = [];
      
      // Create 30-minute time slots from 9 AM to 9 PM
      for (let hour = 9; hour <= 21; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, minute, 0, 0);
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);
          
          dayTimeSlots.push({ start: slotStart, end: slotEnd, used: false });
        }
      }

      // Mark slots as used for existing appointments
      existingAppointments.forEach(apt => {
        const aptStart = new Date(apt.start!);
        const aptEnd = new Date(apt.end!);
        
        if (aptStart.toDateString() === currentDate.toDateString()) {
          dayTimeSlots.forEach(slot => {
            if (appointmentsOverlap(slot.start, slot.end, aptStart, aptEnd)) {
              slot.used = true;
            }
          });
        }
      });

      let appointmentsCreated = 0;
      let attempts = 0;
      const maxAttempts = 50;

      while (appointmentsCreated < appointmentsPerDay && attempts < maxAttempts) {
        attempts++;

        // Find available consecutive slots
        const availableSlots = dayTimeSlots.filter(slot => !slot.used);
        if (availableSlots.length === 0) break;

        // Pick a random starting slot
        const startSlotIndex = Math.floor(Math.random() * availableSlots.length);
        const startSlot = availableSlots[startSlotIndex];
        
        // Determine appointment duration (1-8 slots = 30min to 4 hours)
        const maxDurationSlots = Math.min(8, availableSlots.length - startSlotIndex);
        const durationSlots = Math.floor(Math.random() * maxDurationSlots) + 1;
        
        const appointmentStart = new Date(startSlot.start);
        const appointmentEnd = new Date(startSlot.start);
        appointmentEnd.setMinutes(appointmentEnd.getMinutes() + (durationSlots * 30));

        // Check if all required slots are available
        let canCreateAppointment = true;
        const requiredSlots: typeof dayTimeSlots = [];
        
        for (let i = 0; i < durationSlots; i++) {
          const slotIndex = dayTimeSlots.findIndex(slot => 
            slot.start.getTime() === startSlot.start.getTime() + (i * 30 * 60 * 1000)
          );
          
          if (slotIndex === -1 || dayTimeSlots[slotIndex].used) {
            canCreateAppointment = false;
            break;
          }
          requiredSlots.push(dayTimeSlots[slotIndex]);
        }

        if (canCreateAppointment) {
          // Mark slots as used
          requiredSlots.forEach(slot => slot.used = true);

          const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
          const clinic = clinics[Math.floor(Math.random() * clinics.length)];
          const procedure = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
          const doctorName = doctorNames[Math.floor(Math.random() * doctorNames.length)];
          
          const statusOptions = [
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.PENDING,
          ];
          
          const newAppointment: DiaryAppointmentDto = {
            id: `app-${sedationistId}-${currentDate.getTime()}-${appointmentsCreated}`,
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
          existingAppointments.push(newAppointment);
          appointmentsCreated++;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return appointments.sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime());
};

// Generate comprehensive mock availabilities
export const generateMockAvailabilities = (
  startDate: Date,
  endDate: Date,
  sedationistIds: string[]
): DiaryAvailabilityDto[] => {
  const availabilities: DiaryAvailabilityDto[] = [];

  // Add the specific Michelle Lee Meeting availability before her appointment
  const today = new Date();
  if (startDate <= today && endDate >= today && sedationistIds.includes("sed-14")) {
    const michelleStart = new Date(today);
    michelleStart.setHours(8, 30, 0, 0);
    const michelleEnd = new Date(today);
    michelleEnd.setHours(9, 15, 0, 0);

    availabilities.push({
      id: `avail-michelle-meeting-${today.getTime()}`,
      sedationistId: "sed-14",
      sedationistName: "Michelle Lee",
      status: AvailabilityStatus.MEETING,
      start: michelleStart.toISOString(),
      end: michelleEnd.toISOString(),
      notes: "Team meeting - unavailable for appointments",
      sedationistEmail: "m.lee@example.com",
    });
  }

  // Generate random availabilities for other sedationists
  sedationistIds.forEach((sedationistId) => {
    const sedationist = mockSedationists.find(s => s.id === sedationistId);
    if (!sedationist) return;

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // Skip today for Michelle Lee as we already added specific availability
      if (currentDate.toDateString() === today.toDateString() && sedationistId === "sed-14") {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      // 30% chance of having availability on any given day
      if (Math.random() < 0.3) {
        const availabilityStatuses = [
          AvailabilityStatus.UNAVAILABLE,
          AvailabilityStatus.ON_LEAVE,
          AvailabilityStatus.MEETING,
          AvailabilityStatus.ATTENDING_WORKSHOP,
          AvailabilityStatus.CANCELLED,
          AvailabilityStatus.RESCHEDULED,
          AvailabilityStatus.PERSONAL_REASON,
        ];

        const status = availabilityStatuses[Math.floor(Math.random() * availabilityStatuses.length)];
        
        // Random start time between 8:00 AM and 6:00 PM
        const startHour = Math.floor(Math.random() * 10) + 8; // 8-17
        const startMinute = Math.random() < 0.5 ? 0 : 30;
        
        const availabilityStart = new Date(currentDate);
        availabilityStart.setHours(startHour, startMinute, 0, 0);
        
        // Random duration between 30 minutes and 4 hours
        const durationMinutes = (Math.floor(Math.random() * 8) + 1) * 30; // 30min to 4 hours
        const availabilityEnd = new Date(availabilityStart);
        availabilityEnd.setMinutes(availabilityEnd.getMinutes() + durationMinutes);

        const availabilityNotes = {
          [AvailabilityStatus.UNAVAILABLE]: "Not available for appointments",
          [AvailabilityStatus.ON_LEAVE]: "On scheduled leave",
          [AvailabilityStatus.MEETING]: "Team meeting",
          [AvailabilityStatus.ATTENDING_WORKSHOP]: "Professional development workshop",
          [AvailabilityStatus.CANCELLED]: "Previously scheduled appointment cancelled",
          [AvailabilityStatus.RESCHEDULED]: "Appointment rescheduled",
          [AvailabilityStatus.PERSONAL_REASON]: "Personal unavailability",
        };

        availabilities.push({
          id: `avail-${sedationistId}-${currentDate.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
          sedationistId,
          sedationistName: `${sedationist.firstName} ${sedationist.lastName}`,
          status,
          start: availabilityStart.toISOString(),
          end: availabilityEnd.toISOString(),
          notes: availabilityNotes[status],
          sedationistEmail: sedationist.email,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return availabilities.sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime());
};