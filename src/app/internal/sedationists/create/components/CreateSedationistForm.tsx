import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { FormTextField } from "@/shared/components/form/FormTextField";
import { FormSelect } from "@/shared/components/form/FormSelect";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { X, Plus } from "lucide-react";
import { SedationistSpecialty } from "@/shared/types/domains/sedationist";
import { useCreateSedationistForm } from "../hooks/useCreateSedationistForm";

export interface CreateSedationistFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const specialtyOptions = [
  {
    value: SedationistSpecialty.GENERAL_ANAESTHESIA,
    label: "General Anaesthesia",
  },
  {
    value: SedationistSpecialty.CONSCIOUS_SEDATION,
    label: "Conscious Sedation",
  },
  { value: SedationistSpecialty.IV_SEDATION, label: "IV Sedation" },
  { value: SedationistSpecialty.NITROUS_OXIDE, label: "Nitrous Oxide" },
  {
    value: SedationistSpecialty.PEDIATRIC_SEDATION,
    label: "Pediatric Sedation",
  },
  { value: SedationistSpecialty.CARDIAC_SEDATION, label: "Cardiac Sedation" },
];

export default function CreateSedationistForm({
  open,
  onOpenChange,
}: CreateSedationistFormProps) {
  // Use extracted business logic hook
  const {
    form,
    certForm,
    activeTab,
    selectedSpecialties,
    certifications,
    isSubmitting,
    onSubmit,
    onReset,
    setActiveTab,
    addSpecialty,
    removeSpecialty,
    addCertification,
    removeCertification,
    canProceedToSpecialties,
    canProceedToCertifications,
    canSubmit,
  } = useCreateSedationistForm();

  const handleClose = () => {
    onReset();
    onOpenChange(false);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    if (!isSubmitting) {
      handleClose();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Sedationist</DialogTitle>
          <DialogDescription>
            Complete the following steps to add a new sedationist to the system.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger
              value="specialties"
              disabled={!canProceedToSpecialties}
            >
              Specialties
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              disabled={!canProceedToCertifications}
            >
              Certifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Form {...form}>
              <div className="grid grid-cols-2 gap-4">
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
              <FormTextField
                control={form.control}
                name="email"
                label="Email Address"
                type="email"
                required
              />
              <FormTextField
                control={form.control}
                name="phone"
                label="Phone Number"
                type="tel"
              />
              <FormTextField
                control={form.control}
                name="licenseNumber"
                label="License Number"
                required
              />
            </Form>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={() => setActiveTab("specialties")}
                disabled={!canProceedToSpecialties}
              >
                Next: Specialties
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="specialties" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Specialties</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the specialties this sedationist is qualified for.
              </p>

              <div className="space-y-2">
                {specialtyOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span>{option.label}</span>
                    <Button
                      size="sm"
                      variant={
                        selectedSpecialties.includes(option.value)
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        selectedSpecialties.includes(option.value)
                          ? removeSpecialty(option.value)
                          : addSpecialty(option.value)
                      }
                    >
                      {selectedSpecialties.includes(option.value)
                        ? "Remove"
                        : "Add"}
                    </Button>
                  </div>
                ))}
              </div>

              {selectedSpecialties.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Selected Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialties.map((specialty) => {
                      const option = specialtyOptions.find(
                        (opt) => opt.value === specialty
                      );
                      return (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {option?.label}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeSpecialty(specialty)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                Back
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setActiveTab("certifications")}
                  disabled={!canProceedToCertifications}
                >
                  Next: Certifications
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Certifications</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add relevant certifications (optional).
              </p>

              {/* Existing certifications list */}
              {certifications.length > 0 && (
                <div className="space-y-2 mb-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                    >
                      <div>
                        <div className="font-medium">{cert.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {cert.issuingBody} • {cert.certificateNumber}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCertification(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-4">
                You can skip this step and add certifications later.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("specialties")}
              >
                Back
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Sedationist"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
