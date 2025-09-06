import { useState } from "react";
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
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useToast } from "@/shared/hooks/use-toast";
import { useCreateClinicRequest } from "../hooks/useClinicRequests";
import { ClinicStatus, ClinicType } from "../types/clinic.types";

const createClinicSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  contactPersonName: z.string().min(1, "Contact person name is required"),
  physicalAddress: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  emailAddress: z.string().email("Valid email is required"),
  website: z.string().optional(),
  type: z.nativeEnum(ClinicType),
  status: z.nativeEnum(ClinicStatus),
  comments: z.string().optional(),
});

type CreateClinicFormData = z.infer<typeof createClinicSchema>;

interface CreateClinicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateClinicModal({ open, onOpenChange }: CreateClinicModalProps) {
  const { toast } = useToast();
  const createClinicMutation = useCreateClinicRequest();

  const form = useForm<CreateClinicFormData>({
    resolver: zodResolver(createClinicSchema),
    defaultValues: {
      name: "",
      contactPersonName: "",
      physicalAddress: "",
      city: "",
      postalCode: "",
      phoneNumber: "",
      emailAddress: "",
      website: "",
      type: ClinicType.GENERAL,
      status: ClinicStatus.ACTIVE,
      comments: "",
    },
  });

  const onSubmit = async (data: CreateClinicFormData) => {
    try {
      await createClinicMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Clinic created successfully",
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create clinic",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Clinic</DialogTitle>
          <DialogDescription>
            Create a new clinic record with all the necessary information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Clinic Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter clinic name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPersonName">Contact Person *</Label>
                <Input
                  id="contactPersonName"
                  {...form.register("contactPersonName")}
                  placeholder="Enter contact person name"
                />
                {form.formState.errors.contactPersonName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.contactPersonName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Clinic Type</Label>
                <Select
                  value={form.watch("type")}
                  onValueChange={(value) => form.setValue("type", value as ClinicType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select clinic type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClinicType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value as ClinicStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClinicStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="physicalAddress">Physical Address *</Label>
              <Input
                id="physicalAddress"
                {...form.register("physicalAddress")}
                placeholder="Enter full address"
              />
              {form.formState.errors.physicalAddress && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.physicalAddress.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...form.register("city")}
                  placeholder="Enter city"
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  {...form.register("postalCode")}
                  placeholder="Enter postal code"
                />
                {form.formState.errors.postalCode && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.postalCode.message}
                  </p>
                )}
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
                <Label htmlFor="emailAddress">Email Address *</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  {...form.register("emailAddress")}
                  placeholder="Enter email address"
                />
                {form.formState.errors.emailAddress && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.emailAddress.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...form.register("website")}
                placeholder="Enter website URL (optional)"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                {...form.register("comments")}
                placeholder="Enter any additional comments (optional)"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createClinicMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createClinicMutation.isPending}
            >
              {createClinicMutation.isPending ? "Creating..." : "Create Clinic"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}