import { useState, useCallback } from 'react';
import { CheckCircle2, Edit, User, Building, Stethoscope, UserCog, Calendar, DollarSign, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { Separator } from '@/shared/components/ui/separator';
import { WizardStepProps } from '../../../types/wizard.types';
import { useBookAppointmentRequest } from '../../../hooks/useBookAppointmentRequest';

export function ReviewConfirmStep({ data, onPrevious }: WizardStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bookAppointmentMutation = useBookAppointmentRequest();

  const handleSubmit = useCallback(async () => {
    if (!data.patient || !data.clinic || !data.doctor || !data.sedationist || !data.appointmentDetails) {
      return;
    }

    setIsSubmitting(true);
    try {
      const appointmentData = {
        patientFirstName: data.patient.firstName,
        patientLastName: data.patient.lastName,
        patientEmail: data.patient.email,
        patientPhone: data.patient.phone,
        patientDateOfBirth: data.patient.dateOfBirth,
        doctorId: data.doctor.id,
        clinicId: data.clinic.id,
        appointmentDate: data.appointmentDetails.date,
        appointmentTime: data.appointmentDetails.time,
        duration: data.appointmentDetails.duration.toString(),
        type: data.appointmentDetails.type,
        procedure: data.appointmentDetails.procedure,
        notes: [
          `Sedationist: ${data.sedationist.firstName} ${data.sedationist.lastName}`,
          `Caller: ${data.appointmentDetails.callerName}`,
          `Estimated Cost: $${data.appointmentDetails.estimatedCost}`,
          `Booking Form: ${data.appointmentDetails.bookingFormReceived ? 'Received' : 'Pending'}`,
          `Patient Pack: ${data.appointmentDetails.patientPackReceived ? 'Received' : 'Pending'}`,
          `Payment: ${data.appointmentDetails.paymentReceived ? 'Received' : 'Pending'}`,
          data.appointmentDetails.notes ? `Notes: ${data.appointmentDetails.notes}` : '',
        ].filter(Boolean).join('\n'),
      };

      await bookAppointmentMutation.mutateAsync(appointmentData);
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [data, bookAppointmentMutation]);

  const EditButton = ({ onClick, section }: { onClick: () => void; section: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="text-portal-internal-primary hover:bg-portal-internal-primary/10"
    >
      <Edit className="h-3 w-3 mr-1" />
      Edit {section}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Review & Confirm</h2>
        <p className="text-muted-foreground">Please review all appointment details before submitting</p>
      </div>

      {/* Patient Information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-portal-internal-primary" />
              Patient Information
            </CardTitle>
            <EditButton onClick={() => {}} section="Patient" />
          </div>
        </CardHeader>
        <CardContent>
          {data.patient && (
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={data.patient.avatar} alt={`${data.patient.firstName} ${data.patient.lastName}`} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{data.patient.firstName} {data.patient.lastName}</h3>
                <p className="text-muted-foreground">{data.patient.email}</p>
                <p className="text-muted-foreground">{data.patient.phone}</p>
                <p className="text-sm text-muted-foreground">DOB: {format(new Date(data.patient.dateOfBirth), 'PPP')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clinic & Doctor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-portal-internal-primary" />
                Clinic
              </CardTitle>
              <EditButton onClick={() => {}} section="Clinic" />
            </div>
          </CardHeader>
          <CardContent>
            {data.clinic && (
              <div className="space-y-2">
                <h3 className="font-semibold">{data.clinic.name}</h3>
                <p className="text-sm text-muted-foreground">{data.clinic.address}</p>
                <p className="text-sm text-muted-foreground">{data.clinic.phone}</p>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{data.clinic.rating} rating</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-portal-internal-primary" />
                Doctor
              </CardTitle>
              <EditButton onClick={() => {}} section="Doctor" />
            </div>
          </CardHeader>
          <CardContent>
            {data.doctor && (
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={data.doctor.avatar} alt={`${data.doctor.firstName} ${data.doctor.lastName}`} />
                  <AvatarFallback>
                    <Stethoscope className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{data.doctor.firstName} {data.doctor.lastName}</h3>
                  <p className="text-sm text-portal-internal-primary">{data.doctor.specialization}</p>
                  <p className="text-sm text-muted-foreground">{data.doctor.experience} years experience</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sedationist */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-portal-internal-primary" />
              Sedationist
            </CardTitle>
            <EditButton onClick={() => {}} section="Sedationist" />
          </div>
        </CardHeader>
        <CardContent>
          {data.sedationist && (
            <div className="flex items-center space-x-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={data.sedationist.avatar} alt={`${data.sedationist.firstName} ${data.sedationist.lastName}`} />
                <AvatarFallback>
                  <UserCog className="h-7 w-7" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{data.sedationist.firstName} {data.sedationist.lastName}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span>{data.sedationist.experience} years exp.</span>
                  <span>{data.sedationist.successRate}% success rate</span>
                  <span>{data.sedationist.currentCaseload} current cases</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {data.sedationist.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-portal-internal-primary" />
              Appointment Details
            </CardTitle>
            <EditButton onClick={() => {}} section="Details" />
          </div>
        </CardHeader>
        <CardContent>
          {data.appointmentDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(data.appointmentDetails.date), 'PPP')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time & Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {data.appointmentDetails.time} ({data.appointmentDetails.duration} min)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Estimated Cost</p>
                    <p className="text-sm text-muted-foreground">
                      ${data.appointmentDetails.estimatedCost}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Procedure</p>
                  <p className="text-sm text-muted-foreground">{data.appointmentDetails.procedure}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Caller</p>
                  <p className="text-sm text-muted-foreground">{data.appointmentDetails.callerName}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Requirements Status</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={data.appointmentDetails.bookingFormReceived ? "default" : "secondary"}>
                    Booking Form: {data.appointmentDetails.bookingFormReceived ? 'Received' : 'Pending'}
                  </Badge>
                  <Badge variant={data.appointmentDetails.patientPackReceived ? "default" : "secondary"}>
                    Patient Pack: {data.appointmentDetails.patientPackReceived ? 'Received' : 'Pending'}
                  </Badge>
                  <Badge variant={data.appointmentDetails.paymentReceived ? "default" : "secondary"}>
                    Payment: {data.appointmentDetails.paymentReceived ? 'Received' : 'Pending'}
                  </Badge>
                </div>
              </div>
              
              {data.appointmentDetails.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">Additional Notes</p>
                  <p className="text-sm text-muted-foreground">{data.appointmentDetails.notes}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="bg-gradient-portal-internal text-white px-8 hover:opacity-90"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Submit Appointment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}