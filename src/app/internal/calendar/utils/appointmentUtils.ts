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
  if (!appointment.start) return false;
  
  try {
    const appointmentStart = new Date(appointment.start);
    if (!isValid(appointmentStart)) return false;
    
    const appointmentHour = appointmentStart.getHours();
    const appointmentMinute = appointmentStart.getMinutes();
    const appointmentTimeInMinutes = appointmentHour * 60 + appointmentMinute;
    
    // Parse slot time (e.g., "09:00")
    const [slotHour, slotMinute] = slotTime.split(":").map(Number);
    const slotTimeInMinutes = slotHour * 60 + slotMinute;
    
    return (
      appointmentTimeInMinutes >= slotTimeInMinutes &&
      appointmentTimeInMinutes < slotTimeInMinutes + slotDurationMinutes
    );
  } catch (error) {
    return false;
  }
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