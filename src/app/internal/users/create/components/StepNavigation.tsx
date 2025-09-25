interface StepNavigationProps {
  steps: Array<{
    id: number;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  currentStep: number;
}

/**
 * Step navigation indicator for multi-step form
 * Shows progress and completed steps with visual feedback
 */
export function StepNavigation({ steps, currentStep }: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-muted-foreground text-muted-foreground"
                }
              `}
            >
              <Icon className="h-4 w-4" />
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-px mx-2 ${
                  isCompleted ? "bg-green-500" : "bg-muted-foreground"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
