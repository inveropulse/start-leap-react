import { Check } from 'lucide-react';
import { WizardStep } from '../../types/wizard.types';

interface WizardProgressIndicatorProps {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  onStepClick: (step: WizardStep) => void;
}

const stepLabels = {
  [WizardStep.PATIENT_SELECTION]: 'Patient',
  [WizardStep.CLINIC_SELECTION]: 'Clinic',
  [WizardStep.DOCTOR_SELECTION]: 'Doctor',
  [WizardStep.SEDATIONIST_SELECTION]: 'Sedationist',
  [WizardStep.APPOINTMENT_DETAILS]: 'Details',
  [WizardStep.REVIEW_CONFIRM]: 'Review',
};

export function WizardProgressIndicator({ 
  currentStep, 
  completedSteps, 
  onStepClick 
}: WizardProgressIndicatorProps) {
  const steps = Object.values(WizardStep).filter(step => typeof step === 'number') as WizardStep[];
  
  return (
    <div className="relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-portal-internal rounded-t-xl opacity-90" />
      
      <div className="relative px-6 py-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = completedSteps.includes(step);
            const canNavigate = isCompleted || step <= currentStep;
            
            return (
              <div key={step} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => canNavigate && onStepClick(step)}
                  disabled={!canNavigate}
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold
                    transition-all duration-300 ease-in-out
                    ${isActive 
                      ? 'bg-white text-portal-internal-primary scale-110 shadow-lg' 
                      : isCompleted
                        ? 'bg-white/90 text-portal-internal-primary hover:bg-white hover:scale-105'
                        : canNavigate
                          ? 'bg-white/50 text-white hover:bg-white/70 cursor-pointer'
                          : 'bg-white/20 text-white/60 cursor-not-allowed'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                  
                  {/* Active Step Glow */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
                  )}
                </button>
                
                {/* Step Label */}
                <div className="ml-3 hidden sm:block">
                  <div className={`
                    text-sm font-medium transition-colors duration-300
                    ${isActive 
                      ? 'text-white' 
                      : isCompleted
                        ? 'text-white/90'
                        : 'text-white/70'
                    }
                  `}>
                    {stepLabels[step]}
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    hidden sm:block w-12 h-0.5 mx-4 transition-colors duration-300
                    ${isCompleted
                      ? 'bg-white/80'
                      : 'bg-white/30'
                    }
                  `} />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Mobile Step Labels */}
        <div className="sm:hidden mt-4 text-center">
          <div className="text-white/90 text-sm font-medium">
            Step {currentStep}: {stepLabels[currentStep]}
          </div>
        </div>
      </div>
    </div>
  );
}