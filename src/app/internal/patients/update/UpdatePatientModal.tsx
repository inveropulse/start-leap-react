import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { FormTextField } from "@/shared/components/form/FormTextField";
import { FormSelect } from "@/shared/components/form/FormSelect";
import { FormTextArea } from "@/shared/components/form/FormTextArea";
import { FormDateField } from "@/shared/components/form/FormDateField";
import { usePatientRequest, useUpdatePatientRequest } from "@/api/patients";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  PatientAlcoholStatus,
  PatientSex,
  PatientSmokingStatus,
  PatientTitle,
} from "@/shared/types";

const updatePatientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.nativeEnum(PatientTitle).optional(),
  dateOfBirth: z.string().optional(),
  sex: z.nativeEnum(PatientSex).optional(),
  phoneNumber: z.string().optional(),
  alternativePhoneNumber: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  town: z.string().optional(),
  country: z.string().optional(),
  postCode: z.string().optional(),
  occupation: z.string().optional(),
  height: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  smokingStatus: z.nativeEnum(PatientSmokingStatus).optional(),
  alcoholStatus: z.nativeEnum(PatientAlcoholStatus).optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  notes: z.string().optional(),
});

type UpdatePatientFormData = z.infer<typeof updatePatientSchema>;

interface UpdatePatientModalProps {
  patientId: string | null;
  onClose: () => void;
}

export function UpdatePatientModal({
  patientId,
  onClose,
}: UpdatePatientModalProps) {
  const { showSuccess, showError } = useNotifications();
  const { data, isLoading, isError } = usePatientRequest(
    patientId || undefined
  );
  const patient = data?.data;
  const updatePatientMutation = useUpdatePatientRequest();

  const form = useForm<UpdatePatientFormData>({
    resolver: zodResolver(updatePatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "United Kingdom",
    },
  });

  // Update form when patient data is loaded
  useEffect(() => {
    if (patient) {
      form.reset({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        title: patient.title,
        dateOfBirth: patient.dateOfBirth || "",
        sex: patient.sex,
        phoneNumber: patient.phoneNumber || "",
        alternativePhoneNumber: patient.alternativePhoneNumber || "",
        email: patient.email || "",
        address: patient.address || "",
        town: patient.town || "",
        country: patient.country || "United Kingdom",
        postCode: patient.postCode || "",
        occupation: patient.occupation || "",
        height: patient.height || 0,
        weight: patient.weight || 0,
        smokingStatus: patient.smokingStatus,
        alcoholStatus: patient.alcoholStatus,
        medicalHistory: patient.medicalHistory || "",
        allergies: patient.allergies || "",
        medications: patient.medications || "",
        notes: patient.notes || "",
      });
    }
  }, [patient, form]);

  const onSubmit = async (data: UpdatePatientFormData) => {
    if (!patientId) return;

    try {
      await updatePatientMutation.mutateAsync({
        id: patientId,
        ...data,
      });
      showSuccess("Patient updated successfully");
      onClose();
    } catch (error) {
      showError("Failed to update patient. Please try again.");
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const titleOptions = Object.values(PatientTitle).map((title) => ({
    value: title,
    label: title,
  }));

  const sexOptions = Object.values(PatientSex).map((sex) => ({
    value: sex,
    label: sex,
  }));

  const smokingOptions = Object.values(PatientSmokingStatus).map((status) => ({
    value: status,
    label: status,
  }));

  const alcoholOptions = Object.values(PatientAlcoholStatus).map((status) => ({
    value: status,
    label: status,
  }));

  const isOpen = !!patientId;

  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-destructive mb-4">
              Failed to load patient data.
            </p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {isLoading ? "Loading..." : `Edit Patient: ${patient?.fullName}`}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormSelect
                    control={form.control}
                    name="title"
                    label="Title"
                    options={titleOptions}
                    placeholder="Select title"
                  />
                  <FormTextField
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    required
                  />
                  <FormTextField
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormDateField
                    control={form.control}
                    name="dateOfBirth"
                    label="Date of Birth"
                  />
                  <FormSelect
                    control={form.control}
                    name="sex"
                    label="Sex"
                    options={sexOptions}
                    placeholder="Select sex"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormTextField
                    control={form.control}
                    name="phoneNumber"
                    label="Phone Number"
                    type="tel"
                  />
                  <FormTextField
                    control={form.control}
                    name="alternativePhoneNumber"
                    label="Alternative Phone"
                    type="tel"
                  />
                </div>

                <FormTextField
                  control={form.control}
                  name="email"
                  label="Email Address"
                  type="email"
                />

                <FormTextField
                  control={form.control}
                  name="address"
                  label="Address"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormTextField
                    control={form.control}
                    name="town"
                    label="Town/City"
                  />
                  <FormTextField
                    control={form.control}
                    name="country"
                    label="Country"
                  />
                  <FormTextField
                    control={form.control}
                    name="postCode"
                    label="Post Code"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Personal Details
                </h3>

                <FormTextField
                  control={form.control}
                  name="occupation"
                  label="Occupation"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormTextField
                    control={form.control}
                    name="height"
                    label="Height (cm)"
                    type="number"
                  />
                  <FormTextField
                    control={form.control}
                    name="weight"
                    label="Weight (kg)"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSelect
                    control={form.control}
                    name="smokingStatus"
                    label="Smoking Status"
                    options={smokingOptions}
                    placeholder="Select smoking status"
                  />
                  <FormSelect
                    control={form.control}
                    name="alcoholStatus"
                    label="Alcohol Status"
                    options={alcoholOptions}
                    placeholder="Select alcohol status"
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Medical Information
                </h3>

                <FormTextArea
                  control={form.control}
                  name="medicalHistory"
                  label="Medical History"
                  placeholder="Enter patient's medical history..."
                />

                <FormTextArea
                  control={form.control}
                  name="allergies"
                  label="Allergies"
                  placeholder="Enter known allergies..."
                />

                <FormTextArea
                  control={form.control}
                  name="medications"
                  label="Current Medications"
                  placeholder="Enter current medications..."
                />

                <FormTextArea
                  control={form.control}
                  name="notes"
                  label="Additional Notes"
                  placeholder="Enter any additional notes..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updatePatientMutation.isPending}
                >
                  {updatePatientMutation.isPending
                    ? "Updating..."
                    : "Update Patient"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
