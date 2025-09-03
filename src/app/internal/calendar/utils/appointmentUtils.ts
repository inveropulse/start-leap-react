import { DiaryAppointmentDto } from "@/api/generated/models/DiaryAppointmentDto";
import { AppointmentStatus } from "@/api/generated/models/AppointmentStatus";
import { format, parse, isValid } from "date-fns";

export const getAppointmentStatusColor = (status: AppointmentStatus | undefined) => {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return "bg-green-500";
    case AppointmentStatus.PENDING:
      return "bg-yellow-500";
    case AppointmentStatus.CANCELLED:
      return "bg-red-500";
    case AppointmentStatus.COMPLETED:
      return "bg-blue-500";
    case AppointmentStatus.RESCHEDULED:
      return "bg-purple-500";
    default:
      return "bg-muted";
  }
};

export const getAppointmentStatusText = (status: AppointmentStatus | undefined) => {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return "Confirmed";
    case AppointmentStatus.PENDING:
      return "Pending";
    case AppointmentStatus.CANCELLED:
      return "Cancelled";
    case AppointmentStatus.COMPLETED:
      return "Completed";
    case AppointmentStatus.RESCHEDULED:
      return "Rescheduled";
    default:
      return "Unknown";
  }
};

export const formatAppointmentTime = (start: string | undefined, end: string | undefined) => {
  if (!start) return "";
  
  try {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    
    if (!isValid(startDate)) return "";
    
    const startTime = format(startDate, "HH:mm");
    
    if (endDate && isValid(endDate)) {
      const endTime = format(endDate, "HH:mm");
      return `${startTime} - ${endTime}`;
    }
    
    return startTime;
  } catch (error) {
    return "";
  }
};

export const getAppointmentDuration = (start: string | undefined, end: string | undefined): number => {
  if (!start || !end) return 60; // Default 60 minutes
  
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (!isValid(startDate) || !isValid(endDate)) return 60;
    
    const durationMs = endDate.getTime() - startDate.getTime();
    return Math.max(15, durationMs / (1000 * 60)); // Minimum 15 minutes
  } catch (error) {
    return 60;
  }
};

export const isAppointmentInTimeSlot = (
  appointment: DiaryAppointmentDto,
  slotTime: string,
  slotDurationMinutes = 60
): boolean => {
  if (!appointment.start || !appointment.end) return false;
  
  try {
    const appointmentStart = new Date(appointment.start);
    const appointmentEnd = new Date(appointment.end);
    
    if (!isValid(appointmentStart) || !isValid(appointmentEnd)) return false;
    
    // Convert appointment times to minutes since midnight
    const appointmentStartMinutes = appointmentStart.getHours() * 60 + appointmentStart.getMinutes();
    const appointmentEndMinutes = appointmentEnd.getHours() * 60 + appointmentEnd.getMinutes();
    
    // Parse slot time (e.g., "09:00") and calculate slot range
    const [slotHour, slotMinute] = slotTime.split(":").map(Number);
    const slotStartMinutes = slotHour * 60 + slotMinute;
    const slotEndMinutes = slotStartMinutes + slotDurationMinutes;
    
    // Check for overlap: appointment overlaps slot if appointmentStart < slotEnd AND appointmentEnd > slotStart
    return appointmentStartMinutes < slotEndMinutes && appointmentEndMinutes > slotStartMinutes;
  } catch (error) {
    return false;
  }
};

export const isAppointmentStartInSlot = (
  appointment: DiaryAppointmentDto,
  slotTime: string,
  slotDurationMinutes = 60
): boolean => {
  if (!appointment.start) return false;
  
  try {
    const appointmentStart = new Date(appointment.start);
    if (!isValid(appointmentStart)) return false;
    
    const appointmentStartMinutes = appointmentStart.getHours() * 60 + appointmentStart.getMinutes();
    const [slotHour, slotMinute] = slotTime.split(":").map(Number);
    const slotStartMinutes = slotHour * 60 + slotMinute;
    const slotEndMinutes = slotStartMinutes + slotDurationMinutes;
    
    return appointmentStartMinutes >= slotStartMinutes && appointmentStartMinutes < slotEndMinutes;
  } catch (error) {
    return false;
  }
};

export const isAppointmentContinuation = (
  appointment: DiaryAppointmentDto,
  slotTime: string,
  slotDurationMinutes = 60
): boolean => {
  return isAppointmentInTimeSlot(appointment, slotTime, slotDurationMinutes) && 
         !isAppointmentStartInSlot(appointment, slotTime, slotDurationMinutes);
};

export const formatPatientName = (appointment: DiaryAppointmentDto): string => {
  const { patientTitle, patientName } = appointment;
  
  if (!patientName) return "Unknown Patient";
  
  const titleStr = patientTitle ? `${patientTitle} ` : "";
  return `${titleStr}${patientName}`;
};

export const getAppointmentSummary = (appointment: DiaryAppointmentDto): string => {
  const patientName = formatPatientName(appointment);
  const procedure = appointment.procedure || appointment.treatment;
  
  if (procedure) {
    return `${patientName} - ${procedure}`;
  }
  
  return patientName;
};

// Calculate visual height for an appointment based on duration
export const calculateAppointmentHeight = (appointment: DiaryAppointmentDto, slotHeightPx: number = 60, slotDurationMinutes: number = 30): number => {
  const duration = getAppointmentDuration(appointment.start, appointment.end);
  const slots = Math.ceil(duration / slotDurationMinutes);
  return slots * slotHeightPx;
};