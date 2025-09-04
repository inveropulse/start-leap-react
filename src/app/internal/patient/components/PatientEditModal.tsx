import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { FormTextField, FormSelect, FormTextArea } from "@/shared/components/form";
import { useUpdatePatientRequest } from "../hooks/useUpdatePatientRequest";
import { Patient, UpdatePatientRequest, Title, Sex, SmokingStatus, AlcoholStatus } from "../types/patient.types";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.nativeEnum(Title),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  sex: z.nativeEnum(Sex),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  alternativePhoneNumber: z.string().optional(),
  address: z.string().optional(),
  town: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string().optional(),
  height: z.number().min(1, "Height is required").max(300, "Invalid height"),
  weight: z.number().min(1, "Weight is required").max(500, "Invalid weight"),
  heightFormat: z.string().optional(),
  weightFormat: z.string().optional(),
  occupation: z.string().optional(),
  smokingStatus: z.nativeEnum(SmokingStatus).optional(),
  alcoholStatus: z.nativeEnum(AlcoholStatus).optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  anestheticHistory: z.string().optional(),
  asaClassification: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientEditModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const titleOptions = [
  { label: "Mr", value: Title.MR },
  { label: "Mrs", value: Title.MRS },
  { label: "Ms", value: Title.MS },
  { label: "Dr", value: Title.DR },
];

const sexOptions = [
  { label: "Male", value: Sex.MALE },
  { label: "Female", value: Sex.FEMALE },
];

const smokingOptions = [
  { label: "Never", value: SmokingStatus.NEVER },
  { label: "Former", value: SmokingStatus.FORMER },
  { label: "Yes", value: SmokingStatus.YES },
];

const alcoholOptions = [
  { label: "Never", value: AlcoholStatus.NEVER },
  { label: "Former", value: AlcoholStatus.FORMER },
  { label: "Yes", value: AlcoholStatus.YES },
];

export function PatientEditModal({ patient, isOpen, onClose }: PatientEditModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const updatePatientMutation = useUpdatePatientRequest();
  const { showSuccess, showError } = useNotifications();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      title: patient.title,
      dateOfBirth: patient.dateOfBirth,
      sex: patient.sex,
      email: patient.email || "",
      phoneNumber: patient.phoneNumber || "",
      alternativePhoneNumber: patient.alternativePhoneNumber || "",
      address: patient.address || "",
      town: patient.town || "",
      postCode: patient.postCode || "",
      country: patient.country || "United Kingdom",
      height: patient.height,
      weight: patient.weight,
      heightFormat: patient.heightFormat || "cm",
      weightFormat: patient.weightFormat || "kg",
      occupation: patient.occupation || "",
      smokingStatus: patient.smokingStatus,
      alcoholStatus: patient.alcoholStatus,
      medicalHistory: patient.medicalHistory || "",
      allergies: patient.allergies || "",
      medications: patient.medications || "",
      anestheticHistory: patient.anestheticHistory || "",
      asaClassification: patient.asaClassification,
      notes: patient.notes || "",
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      const updateData: UpdatePatientRequest = {
        id: patient.id,
        ...data,
        email: data.email || undefined,
        phoneNumber: data.phoneNumber || undefined,
        alternativePhoneNumber: data.alternativePhoneNumber || undefined,
        address: data.address || undefined,
        town: data.town || undefined,
        postCode: data.postCode || undefined,
        country: data.country || undefined,
        occupation: data.occupation || undefined,
        medicalHistory: data.medicalHistory || undefined,
        allergies: data.allergies || undefined,
        medications: data.medications || undefined,
        anestheticHistory: data.anestheticHistory || undefined,
        notes: data.notes || undefined,
      };

      await updatePatientMutation.mutateAsync(updateData);
      showSuccess("Patient updated successfully");
      onClose();
    } catch (error) {
      showError("Failed to update patient");
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patient - {patient.fullName}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded ${
                  index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect
                    control={form.control}
                    name="title"
                    label="Title"
                    options={titleOptions}
                    required
                  />
                  <div></div>
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
                  <FormTextField
                    control={form.control}
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    required
                  />
                  <FormSelect
                    control={form.control}
                    name="sex"
                    label="Sex"
                    options={sexOptions}
                    required
                  />
                  <FormTextField
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                  />
                  <FormTextField
                    control={form.control}
                    name="phoneNumber"
                    label="Phone Number"
                  />
                  <FormTextField
                    control={form.control}
                    name="alternativePhoneNumber"
                    label="Alternative Phone"
                  />
                  <FormTextField
                    control={form.control}
                    name="occupation"
                    label="Occupation"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Physical & Address Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormTextField
                    control={form.control}
                    name="height"
                    label="Height"
                    type="number"
                    required
                  />
                  <FormTextField
                    control={form.control}
                    name="weight"
                    label="Weight"
                    type="number"
                    required
                  />
                  <FormTextField
                    control={form.control}
                    name="heightFormat"
                    label="Height Unit"
                    placeholder="cm"
                  />
                  <FormTextField
                    control={form.control}
                    name="weightFormat"
                    label="Weight Unit"
                    placeholder="kg"
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Address</h4>
                  <FormTextField
                    control={form.control}
                    name="address"
                    label="Street Address"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormTextField
                      control={form.control}
                      name="town"
                      label="Town/City"
                    />
                    <FormTextField
                      control={form.control}
                      name="postCode"
                      label="Post Code"
                    />
                  </div>
                  <FormTextField
                    control={form.control}
                    name="country"
                    label="Country"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medical Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect
                    control={form.control}
                    name="smokingStatus"
                    label="Smoking Status"
                    options={smokingOptions}
                  />
                  <FormSelect
                    control={form.control}
                    name="alcoholStatus"
                    label="Alcohol Status"
                    options={alcoholOptions}
                  />
                  <FormTextField
                    control={form.control}
                    name="asaClassification"
                    label="ASA Classification"
                    type="number"
                    min={1}
                    max={5}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormTextArea
                    control={form.control}
                    name="medicalHistory"
                    label="Medical History"
                    rows={3}
                  />
                  <FormTextArea
                    control={form.control}
                    name="allergies"
                    label="Allergies"
                    rows={2}
                  />
                  <FormTextArea
                    control={form.control}
                    name="medications"
                    label="Current Medications"
                    rows={2}
                  />
                  <FormTextArea
                    control={form.control}
                    name="anestheticHistory"
                    label="Anesthetic History"
                    rows={2}
                  />
                  <FormTextArea
                    control={form.control}
                    name="notes"
                    label="Additional Notes"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={updatePatientMutation.isPending}
                  >
                    {updatePatientMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Update Patient
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}