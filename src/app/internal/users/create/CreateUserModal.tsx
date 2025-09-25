import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCreateUserRequest } from "@/api/user-management";
import {
  UserRole,
  UserStatus,
  Department,
  PermissionLevel,
} from "@/shared/types/domains/user-access";
import { useToast } from "@/shared/hooks/use-toast";
import {
  StepNavigation,
  StepContent,
  createUserSchema,
  steps,
  CreateUserFormData,
} from "./components";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Main CreateUserModal component - Entry point for user creation workflow
 * Orchestrates multi-step form process using smaller components
 * Follows established architectural patterns with business logic separation
 */
export default function CreateUserModal({
  open,
  onOpenChange,
}: CreateUserModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const createUserMutation = useCreateUserRequest();
  const { toast } = useToast();

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "",
      department: "Booking",
      permissionLevel: "Limited Access",
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
      await createUserMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role as UserRole,
        department: data.department as Department,
        permissionLevel: data.permissionLevel as PermissionLevel,
        phone: data.phone,
        status: UserStatus.PENDING_ACTIVATION,
        notes: data.notes,
      });

      toast({
        title: "User Created",
        description: `${data.firstName} ${data.lastName} has been created successfully.`,
      });

      handleClose();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account for internal staff members
          </DialogDescription>
        </DialogHeader>

        <StepNavigation steps={steps} currentStep={currentStep} />

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
            <StepContent currentStep={currentStep} form={form} />

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
