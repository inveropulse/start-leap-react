import { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Save, X, Calendar, Clock, User, Phone, Mail, MapPin, Stethoscope } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import { Appointment, AppointmentStatus, AppointmentType } from '../../types';
import { PatientTitle } from '../../types/management.types';

interface AppointmentDetailsTabProps {
  appointment: Appointment;
  isLoading: boolean;
  onSave?: (appointment: Appointment) => void;
}

export function AppointmentDetailsTab({
  appointment,
  isLoading,
  onSave,
}: AppointmentDetailsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(appointment);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(appointment);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(appointment);
  };

  const formatAppointmentDateTime = (date: string, time: string): string => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return format(dateTime, 'EEEE, MMMM dd, yyyy • HH:mm');
    } catch {
      return `${date} • ${time}`;
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  const getStatusOptions = () => {
    return Object.values(AppointmentStatus).map((status) => ({
      value: status,
      label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    }));
  };

  const getTypeOptions = () => {
    return Object.values(AppointmentType).map((type) => ({
      value: type,
      label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    }));
  };

  const getTitleOptions = () => {
    return Object.values(PatientTitle).map((title) => ({
      value: title,
      label: title,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Appointment Details</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit2 className="h-4 w-4" />
              Edit Details
            </Button>
          )}
        </div>
      </div>

      {/* Appointment Time & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            Date & Time
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={editData.appointmentDate}
                  onChange={(e) => setEditData({ ...editData, appointmentDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={editData.appointmentTime}
                  onChange={(e) => setEditData({ ...editData, appointmentTime: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="text-sm pl-6">
              {formatAppointmentDateTime(appointment.appointmentDate, appointment.appointmentTime)}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-primary" />
            Duration
          </div>
          {isEditing ? (
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={editData.duration}
                onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) })}
              />
            </div>
          ) : (
            <div className="text-sm pl-6">
              {formatDuration(appointment.duration)}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Status & Type</div>
          {isEditing ? (
            <div className="space-y-2">
              <Select
                value={editData.status}
                onValueChange={(value: AppointmentStatus) => setEditData({ ...editData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getStatusOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={editData.type}
                onValueChange={(value: AppointmentType) => setEditData({ ...editData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="text-sm space-y-1">
              <div>{appointment.status.replace('_', ' ')}</div>
              <div className="text-muted-foreground">{appointment.type.replace('_', ' ')}</div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Patient Information */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <User className="h-4 w-4 text-primary" />
          Patient Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-6">
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="patientTitle">Title</Label>
                <Select
                  value={editData.patient.firstName.split(' ')[0] || PatientTitle.MR}
                  onValueChange={(value) => {
                    const firstName = editData.patient.firstName;
                    const nameWithoutTitle = firstName.replace(/^(Mr|Mrs|Ms|Dr|Prof)\s+/, '');
                    setEditData({
                      ...editData,
                      patient: {
                        ...editData.patient,
                        firstName: `${value} ${nameWithoutTitle}`.trim()
                      }
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getTitleOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editData.patient.firstName.replace(/^(Mr|Mrs|Ms|Dr|Prof)\s+/, '')}
                  onChange={(e) => {
                    const title = editData.patient.firstName.match(/^(Mr|Mrs|Ms|Dr|Prof)/)?.[0] || '';
                    setEditData({
                      ...editData,
                      patient: {
                        ...editData.patient,
                        firstName: title ? `${title} ${e.target.value}` : e.target.value
                      }
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editData.patient.lastName}
                  onChange={(e) => setEditData({
                    ...editData,
                    patient: { ...editData.patient, lastName: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.patient.email}
                  onChange={(e) => setEditData({
                    ...editData,
                    patient: { ...editData.patient, email: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editData.patient.phone}
                  onChange={(e) => setEditData({
                    ...editData,
                    patient: { ...editData.patient, phone: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={editData.patient.dateOfBirth}
                  onChange={(e) => setEditData({
                    ...editData,
                    patient: { ...editData.patient, dateOfBirth: e.target.value }
                  })}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="font-medium">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  DOB: {format(new Date(appointment.patient.dateOfBirth), 'MMM dd, yyyy')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{appointment.patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{appointment.patient.email}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Medical Information */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <Stethoscope className="h-4 w-4 text-primary" />
          Medical Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="procedure">Procedure</Label>
                <Input
                  id="procedure"
                  value={editData.procedure}
                  onChange={(e) => setEditData({ ...editData, procedure: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editData.notes || ''}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-sm font-medium">Procedure</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {appointment.procedure}
                </div>
              </div>
              {appointment.notes && (
                <div>
                  <div className="text-sm font-medium">Notes</div>
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md mt-1">
                    {appointment.notes}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Healthcare Team */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <User className="h-4 w-4 text-primary" />
          Healthcare Team
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  id="doctorName"
                  value={`${editData.doctor.firstName} ${editData.doctor.lastName}`}
                  onChange={(e) => {
                    const [firstName, ...lastNameParts] = e.target.value.split(' ');
                    setEditData({
                      ...editData,
                      doctor: {
                        ...editData.doctor,
                        firstName: firstName || '',
                        lastName: lastNameParts.join(' ') || ''
                      }
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={editData.doctor.specialization}
                  onChange={(e) => setEditData({
                    ...editData,
                    doctor: { ...editData.doctor, specialization: e.target.value }
                  })}
                />
              </div>
            </>
          ) : (
            <div>
              <div className="font-medium">
                {appointment.doctor.firstName} {appointment.doctor.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {appointment.doctor.specialization}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Clinic Information */}
      <div>
        <div className="flex items-center gap-2 text-sm font-medium mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          Clinic Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="clinicName">Clinic Name</Label>
                <Input
                  id="clinicName"
                  value={editData.clinic.name}
                  onChange={(e) => setEditData({
                    ...editData,
                    clinic: { ...editData.clinic, name: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="clinicPhone">Clinic Phone</Label>
                <Input
                  id="clinicPhone"
                  value={editData.clinic.phone}
                  onChange={(e) => setEditData({
                    ...editData,
                    clinic: { ...editData.clinic, phone: e.target.value }
                  })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="clinicAddress">Clinic Address</Label>
                <Textarea
                  id="clinicAddress"
                  value={editData.clinic.address}
                  onChange={(e) => setEditData({
                    ...editData,
                    clinic: { ...editData.clinic, address: e.target.value }
                  })}
                  rows={2}
                />
              </div>
            </>
          ) : (
            <div className="md:col-span-2 space-y-2">
              <div className="font-medium">{appointment.clinic.name}</div>
              <div className="text-sm text-muted-foreground">
                {appointment.clinic.address}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>{appointment.clinic.phone}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}