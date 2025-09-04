import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useCreatePatientRequest } from "../hooks/useCreatePatientRequest";
import { CreatePatientRequest, Title, Sex, SmokingStatus, AlcoholStatus } from "../types/patient.types";
import { useNotifications } from "@/shared/providers/NotificationProvider";

const patientSchema = z.object({
  title: z.nativeEnum(Title),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  sex: z.nativeEnum(Sex),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(10, "Address is required"),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  smokingStatus: z.nativeEnum(SmokingStatus),
  alcoholStatus: z.nativeEnum(AlcoholStatus),
  medicalHistory: z.string().optional(),
  notes: z.string().optional(),
});

interface PatientCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientCreateModal({ open, onOpenChange }: PatientCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPatientMutation = useCreatePatientRequest();
  const { addToast } = useNotifications();

  const form = useForm<CreatePatientRequest>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      title: Title.MR,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      sex: Sex.MALE,
      email: "",
      phoneNumber: "",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      smokingStatus: SmokingStatus.NEVER,
      alcoholStatus: AlcoholStatus.NEVER,
      medicalHistory: "",
      notes: "",
    },
  });

  const onSubmit = async (data: CreatePatientRequest) => {
    setIsSubmitting(true);
    try {
      await createPatientMutation.mutateAsync(data);
      addToast({
        title: "Success",
        description: "Patient created successfully",
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to create patient",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's details to create a new record.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Title).map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Patient"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}