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
import { Form } from "@/shared/components/ui/form";
import { FormTextField, FormSelect } from "@/shared/components/form";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronLeft, ChevronRight, User, Shield, Settings, CheckCircle } from "lucide-react";
import { useCreateUserRequest } from "../hooks/useUserMutations";
import { Department, PermissionLevel } from "../types";
import { UserRole } from "@/shared/types";

const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  department: z.nativeEnum(Department).refine((val) => Object.values(Department).includes(val), {
    message: "Department is required"
  }),
  permissionLevel: z.nativeEnum(PermissionLevel).refine((val) => Object.values(PermissionLevel).includes(val), {
    message: "Permission level is required"
  }),
  notes: z.string().optional(),
  sendWelcomeEmail: z.boolean().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, title: "Basic Information", icon: User },
  { id: 2, title: "Role & Permissions", icon: Shield },
  { id: 3, title: "Account Settings", icon: Settings },
  { id: 4, title: "Review & Confirm", icon: CheckCircle },
];

const roleOptions = [
  { value: UserRole.ADMIN, label: "Administrator" },
  { value: UserRole.BOOKING_COORDINATOR, label: "Booking Coordinator" },
];

const departmentOptions = [
  { value: Department.ADMINISTRATION, label: "Administration" },
  { value: Department.BOOKING, label: "Booking" },
  { value: Department.OPERATIONS, label: "Operations" },
  { value: Department.IT, label: "IT" },
  { value: Department.MANAGEMENT, label: "Management" },
];

const permissionLevelOptions = [
  { value: PermissionLevel.FULL_ACCESS, label: "Full Access" },
  { value: PermissionLevel.LIMITED_ACCESS, label: "Limited Access" },
  { value: PermissionLevel.READ_ONLY, label: "Read Only" },
  { value: PermissionLevel.CUSTOM, label: "Custom" },
];

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const createUserMutation = useCreateUserRequest();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      department: Department.BOOKING,
      permissionLevel: PermissionLevel.LIMITED_ACCESS,
      notes: "",
      sendWelcomeEmail: true,
    },
  });

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: CreateUserFormData) => {
    try {
      await createUserMutation.mutateAsync(data);
      handleClose();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    setCurrentStep(1);
    onOpenChange(false);
  };

  const getFieldsForStep = (step: number): (keyof CreateUserFormData)[] => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "email", "phone"];
      case 2:
        return ["role", "department", "permissionLevel"];
      case 3:
        return ["notes"];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    const watchedValues = form.watch();

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormTextField
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="Enter first name"
                required
              />
              <FormTextField
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Enter last name"
                required
              />
            </div>
            <FormTextField
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              required
            />
            <FormTextField
              control={form.control}
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number (optional)"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FormSelect
              control={form.control}
              name="role"
              label="Role"
              placeholder="Select role"
              options={roleOptions}
              required
            />
            <FormSelect
              control={form.control}
              name="department"
              label="Department"
              placeholder="Select department"
              options={departmentOptions}
              required
            />
            <FormSelect
              control={form.control}
              name="permissionLevel"
              label="Permission Level"
              placeholder="Select permission level"
              options={permissionLevelOptions}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <FormTextField
              control={form.control}
              name="notes"
              label="Notes"
              placeholder="Add any additional notes about this user..."
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendWelcomeEmail"
                {...form.register("sendWelcomeEmail")}
                className="rounded border-gray-300"
              />
              <label htmlFor="sendWelcomeEmail" className="text-sm">
                Send welcome email with login instructions
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-3">User Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{watchedValues.firstName} {watchedValues.lastName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{watchedValues.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">{watchedValues.phone || "Not provided"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Role:</span>
                  <p className="font-medium">
                    {roleOptions.find(opt => opt.value === watchedValues.role)?.label}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Department:</span>
                  <p className="font-medium">
                    {departmentOptions.find(opt => opt.value === watchedValues.department)?.label}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Permission Level:</span>
                  <p className="font-medium">
                    {permissionLevelOptions.find(opt => opt.value === watchedValues.permissionLevel)?.label}
                  </p>
                </div>
              </div>
              {watchedValues.notes && (
                <div className="mt-3 pt-3 border-t">
                  <span className="text-muted-foreground">Notes:</span>
                  <p className="font-medium">{watchedValues.notes}</p>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {watchedValues.sendWelcomeEmail
                  ? "✓ A welcome email will be sent to the user with login instructions"
                  : "✗ No welcome email will be sent"}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account for internal staff members
          </DialogDescription>
        </DialogHeader>

        {/* Step Navigation */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                  ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                    'border-muted-foreground text-muted-foreground'}
                `}>
                  <Icon className="h-4 w-4" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-muted-foreground'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-1">
            {steps[currentStep - 1]?.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {renderStepContent()}

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {createUserMutation.isPending ? "Creating..." : "Create User"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}