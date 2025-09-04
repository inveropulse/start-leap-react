import { useState } from "react";
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
import { useCreatePatientRequest } from "../hooks/usePatientRequests";
import { PatientTitle, PatientSex, PatientSmokingStatus, PatientAlcoholStatus } from "../types/patient.types";
import { useNotifications } from "@/shared/providers/NotificationProvider";

const createPatientSchema = z.object({
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

type CreatePatientFormData = z.infer<typeof createPatientSchema>;

interface PatientCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientCreateModal({ open, onOpenChange }: PatientCreateModalProps) {
  const { showSuccess, showError } = useNotifications();
  const createPatientMutation = useCreatePatientRequest();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "United Kingdom",
    },
  });

  const onSubmit = async (data: CreatePatientFormData) => {
    try {
      await createPatientMutation.mutateAsync(data);
      showSuccess("Patient created successfully");
      form.reset();
      setCurrentStep(1);
      onOpenChange(false);
    } catch (error) {
      showError("Failed to create patient. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    onOpenChange(false);
  };

  const titleOptions = Object.values(PatientTitle).map(title => ({
    value: title,
    label: title,
  }));

  const sexOptions = Object.values(PatientSex).map(sex => ({
    value: sex,
    label: sex,
  }));

  const smokingOptions = Object.values(PatientSmokingStatus).map(status => ({
    value: status,
    label: status,
  }));

  const alcoholOptions = Object.values(PatientAlcoholStatus).map(status => ({
    value: status,
    label: status,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add New Patient</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
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
              </div>
            )}

            {/* Step 2: Contact & Personal Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact & Personal Details</h3>
                
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
            )}

            {/* Step 3: Medical Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medical Information</h3>
                
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
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createPatientMutation.isPending}
                >
                  {createPatientMutation.isPending ? "Creating..." : "Create Patient"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}