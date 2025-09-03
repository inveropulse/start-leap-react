import { DiaryAvailabilityDto } from "@/api/generated/models/DiaryAvailabilityDto";
import { AvailabilityStatus } from "@/api/generated/models/AvailabilityStatus";
import { format, isValid } from "date-fns";

export const getAvailabilityStatusText = (status: AvailabilityStatus | undefined) => {
  switch (status) {
    case AvailabilityStatus.UNAVAILABLE:
      return "Unavailable";
    case AvailabilityStatus.ON_LEAVE:
      return "On Leave";
    case AvailabilityStatus.MEETING:
      return "Meeting";
    case AvailabilityStatus.ATTENDING_WORKSHOP:
      return "Workshop";
    case AvailabilityStatus.CANCELLED:
      return "Cancelled";
    case AvailabilityStatus.RESCHEDULED:
      return "Rescheduled";
    case AvailabilityStatus.PERSONAL_REASON:
      return "Personal";
    default:
      return "Unknown";
  }
};

export const formatAvailabilityTime = (start: string | undefined, end: string | undefined) => {
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

export const getAvailabilityDuration = (start: string | undefined, end: string | undefined): number => {
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

export const isAvailabilityInTimeSlot = (
  availability: DiaryAvailabilityDto,
  slotTime: string,
  slotDurationMinutes = 60
): boolean => {
  if (!availability.start || !availability.end) return false;
  
  try {
    const availabilityStart = new Date(availability.start);
    const availabilityEnd = new Date(availability.end);
    
    if (!isValid(availabilityStart) || !isValid(availabilityEnd)) return false;
    
    // Convert availability times to minutes since midnight
    const availabilityStartMinutes = availabilityStart.getHours() * 60 + availabilityStart.getMinutes();
    const availabilityEndMinutes = availabilityEnd.getHours() * 60 + availabilityEnd.getMinutes();
    
    // Parse slot time (e.g., "09:00") and calculate slot range
    const [slotHour, slotMinute] = slotTime.split(":").map(Number);
    const slotStartMinutes = slotHour * 60 + slotMinute;
    const slotEndMinutes = slotStartMinutes + slotDurationMinutes;
    
    // Check for overlap: availability overlaps slot if availabilityStart < slotEnd AND availabilityEnd > slotStart
    return availabilityStartMinutes < slotEndMinutes && availabilityEndMinutes > slotStartMinutes;
  } catch (error) {
    return false;
  }
};

export const isAvailabilityStartInSlot = (
  availability: DiaryAvailabilityDto,
  slotTime: string,
  slotDurationMinutes = 60
): boolean => {
  if (!availability.start) return false;
  
  try {
    const availabilityStart = new Date(availability.start);
    if (!isValid(availabilityStart)) return false;
    
    const availabilityStartMinutes = availabilityStart.getHours() * 60 + availabilityStart.getMinutes();
    const [slotHour, slotMinute] = slotTime.split(":").map(Number);
    const slotStartMinutes = slotHour * 60 + slotMinute;
    const slotEndMinutes = slotStartMinutes + slotDurationMinutes;
    
    return availabilityStartMinutes >= slotStartMinutes && availabilityStartMinutes < slotEndMinutes;
  } catch (error) {
    return false;
  }
};

export const isAvailabilityContinuation = (
  availability: DiaryAvailabilityDto,
  slotTime: string,
  slotDurationMinutes = 60
): boolean => {
  return isAvailabilityInTimeSlot(availability, slotTime, slotDurationMinutes) && 
         !isAvailabilityStartInSlot(availability, slotTime, slotDurationMinutes);
};

export const getAvailabilitySummary = (availability: DiaryAvailabilityDto): string => {
  const statusText = getAvailabilityStatusText(availability.status);
  const sedationistName = availability.sedationistName || "Unknown Sedationist";
  
  return `${sedationistName} - ${statusText}`;
};