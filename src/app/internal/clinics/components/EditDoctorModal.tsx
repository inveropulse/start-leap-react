import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useToast } from "@/shared/hooks/use-toast";
import { ClinicDoctor } from "../types/clinic.types";

const editDoctorSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  status: z.enum(['Active', 'Inactive']),
});

type EditDoctorFormData = z.infer<typeof editDoctorSchema>;

interface EditDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: ClinicDoctor | null;
  onUpdate: () => void;
}

const specializations = [
  'Cardiology',
  'Neurology', 
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'General Practice',
  'Surgery',
  'Radiology',
  'Anesthesiology',
  'Emergency Medicine',
];

export function EditDoctorModal({ open, onOpenChange, doctor, onUpdate }: EditDoctorModalProps) {
  const { toast } = useToast();

  const form = useForm<EditDoctorFormData>({
    resolver: zodResolver(editDoctorSchema),
    defaultValues: {
      firstName: doctor?.firstName || "",
      lastName: doctor?.lastName || "",
      specialization: doctor?.specialization || "",
      phoneNumber: doctor?.phoneNumber || "",
      email: doctor?.email || "",
      status: doctor?.status || 'Active',
    },
  });

  // Update form when doctor changes
  React.useEffect(() => {
    if (doctor) {
      form.reset({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        specialization: doctor.specialization || "",
        phoneNumber: doctor.phoneNumber || "",
        email: doctor.email || "",
        status: doctor.status,
      });
    }
  }, [doctor, form]);

  const onSubmit = async (data: EditDoctorFormData) => {
    if (!doctor) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Dr. ${data.firstName} ${data.lastName} has been updated`,
      });
      
      onOpenChange(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update doctor",
        variant: "destructive",
      });
    }
  };

  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogDescription>
            Update the doctor's professional details and contact information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  placeholder="Enter first name"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  placeholder="Enter last name"
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select
                  value={form.watch("specialization")}
                  onValueChange={(value) => form.setValue("specialization", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.specialization && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.specialization.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value as 'Active' | 'Inactive')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  placeholder="Enter phone number"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter email address"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Updating..." : "Update Doctor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}