import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, DollarSign, User, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar as CalendarComponent } from '@/shared/components/ui/calendar';
import { cn } from '@/shared/utils/cn';
import { WizardStepProps, AppointmentType } from '../../../types/wizard.types';

const appointmentDetailsSchema = z.object({
  date: z.date(),
  time: z.string().min(1, "Appointment time is required"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  type: z.nativeEnum(AppointmentType),
  procedure: z.string().min(3, "Procedure must be at least 3 characters"),
  estimatedCost: z.number().min(0, "Cost must be a positive number"),
  callerName: z.string().min(2, "Caller name must be at least 2 characters"),
  bookingFormReceived: z.boolean(),
  patientPackReceived: z.boolean(),
  paymentReceived: z.boolean(),
  notes: z.string().optional(),
});

type AppointmentDetailsFormData = z.infer<typeof appointmentDetailsSchema>;

export function AppointmentDetailsStep({ data, onDataChange, onNext, onPrevious }: WizardStepProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const form = useForm<AppointmentDetailsFormData>({
    resolver: zodResolver(appointmentDetailsSchema),
    defaultValues: {
      date: data.appointmentDetails?.date ? new Date(data.appointmentDetails.date) : undefined,
      time: data.appointmentDetails?.time || '',
      duration: data.appointmentDetails?.duration || 30,
      type: (data.appointmentDetails?.type as AppointmentType) || AppointmentType.CONSULTATION,
      procedure: data.appointmentDetails?.procedure || '',
      estimatedCost: data.appointmentDetails?.estimatedCost || 0,
      callerName: data.appointmentDetails?.callerName || '',
      bookingFormReceived: data.appointmentDetails?.bookingFormReceived || false,
      patientPackReceived: data.appointmentDetails?.patientPackReceived || false,
      paymentReceived: data.appointmentDetails?.paymentReceived || false,
      notes: data.appointmentDetails?.notes || '',
    },
  });

  const handleNext = useCallback(() => {
    form.handleSubmit((formData) => {
      const appointmentDetails = {
        date: formData.date.toISOString().split('T')[0],
        time: formData.time,
        duration: formData.duration,
        type: formData.type,
        procedure: formData.procedure,
        estimatedCost: formData.estimatedCost,
        callerName: formData.callerName,
        bookingFormReceived: formData.bookingFormReceived,
        patientPackReceived: formData.patientPackReceived,
        paymentReceived: formData.paymentReceived,
        notes: formData.notes,
      };
      
      onDataChange({ appointmentDetails });
      onNext();
    })();
  }, [form, onDataChange, onNext]);

  const ToggleButton = ({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`
        flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200
        ${checked 
          ? 'bg-portal-internal-primary/10 border-portal-internal-primary text-portal-internal-primary' 
          : 'bg-background border-border hover:bg-muted'
        }
      `}
    >
      {checked ? (
        <ToggleRight className="h-5 w-5" />
      ) : (
        <ToggleLeft className="h-5 w-5" />
      )}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Appointment Details</h2>
        <p className="text-muted-foreground">Fill in the appointment information</p>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-portal-internal-primary" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsDatePickerOpen(false);
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={AppointmentType.CONSULTATION}>Consultation</SelectItem>
                        <SelectItem value={AppointmentType.FOLLOW_UP}>Follow Up</SelectItem>
                        <SelectItem value={AppointmentType.PROCEDURE}>Procedure</SelectItem>
                        <SelectItem value={AppointmentType.ROUTINE_CHECK}>Routine Check</SelectItem>
                        <SelectItem value={AppointmentType.EMERGENCY}>Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Right Column - Details & Cost */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-portal-internal-primary" />
                Details & Cost
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="procedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Procedure</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Routine check-up, Blood pressure monitoring..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Cost</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-10"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="callerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caller Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Person who made the booking..." className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information or special requirements..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Toggle Switches */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bookingFormReceived"
                render={({ field }) => (
                  <FormItem>
                    <ToggleButton
                      checked={field.value}
                      onToggle={() => field.onChange(!field.value)}
                      label="Booking Form Received"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientPackReceived"
                render={({ field }) => (
                  <FormItem>
                    <ToggleButton
                      checked={field.value}
                      onToggle={() => field.onChange(!field.value)}
                      label="Patient Pack Received"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentReceived"
                render={({ field }) => (
                  <FormItem>
                    <ToggleButton
                      checked={field.value}
                      onToggle={() => field.onChange(!field.value)}
                      label="Payment Received"
                    />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </Form>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-portal-internal-primary hover:bg-portal-internal-primary/90"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
}