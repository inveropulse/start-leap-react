import { useRef, useState, useCallback } from 'react';
import { WizardData, WizardStep, StepValidationResult } from '../types/wizard.types';

export function useAppointmentWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.PATIENT_SELECTION);
  const [isLoading, setIsLoading] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const stepValidationRef = useRef<Record<WizardStep, StepValidationResult>>({
    [WizardStep.PATIENT_SELECTION]: { isValid: false, errors: [] },
    [WizardStep.CLINIC_SELECTION]: { isValid: false, errors: [] },
    [WizardStep.DOCTOR_SELECTION]: { isValid: false, errors: [] },
    [WizardStep.SEDATIONIST_SELECTION]: { isValid: false, errors: [] },
    [WizardStep.APPOINTMENT_DETAILS]: { isValid: false, errors: [] },
    [WizardStep.REVIEW_CONFIRM]: { isValid: true, errors: [] },
  });

  const updateData = useCallback((updates: Partial<WizardData>) => {
    setWizardData(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const updateStepValidation = useCallback((step: WizardStep, validation: StepValidationResult) => {
    stepValidationRef.current[step] = validation;
  }, []);

  const canGoNext = useCallback(() => {
    return stepValidationRef.current[currentStep]?.isValid || false;
  }, [currentStep]);

  const canGoPrevious = useCallback(() => {
    return currentStep > WizardStep.PATIENT_SELECTION;
  }, [currentStep]);

  const goToStep = useCallback((step: WizardStep) => {
    // Only allow navigation to completed steps or next step
    const canNavigate = step <= currentStep || 
      (step === currentStep + 1 && canGoNext());
    
    if (canNavigate) {
      setCurrentStep(step);
    }
  }, [currentStep, canGoNext]);

  const nextStep = useCallback(() => {
    if (canGoNext() && currentStep < WizardStep.REVIEW_CONFIRM) {
      setCurrentStep(prev => prev + 1);
    }
  }, [canGoNext, currentStep]);

  const previousStep = useCallback(() => {
    if (canGoPrevious()) {
      setCurrentStep(prev => prev - 1);
    }
  }, [canGoPrevious]);

  const resetWizard = useCallback(() => {
    setCurrentStep(WizardStep.PATIENT_SELECTION);
    setWizardData({});
    stepValidationRef.current = {
      [WizardStep.PATIENT_SELECTION]: { isValid: false, errors: [] },
      [WizardStep.CLINIC_SELECTION]: { isValid: false, errors: [] },
      [WizardStep.DOCTOR_SELECTION]: { isValid: false, errors: [] },
      [WizardStep.SEDATIONIST_SELECTION]: { isValid: false, errors: [] },
      [WizardStep.APPOINTMENT_DETAILS]: { isValid: false, errors: [] },
      [WizardStep.REVIEW_CONFIRM]: { isValid: true, errors: [] },
    };
  }, []);

  const getCompletedSteps = useCallback(() => {
    return Object.entries(stepValidationRef.current)
      .filter(([_, validation]) => validation.isValid)
      .map(([step]) => parseInt(step) as WizardStep);
  }, []);

  return {
    currentStep,
    data: wizardData,
    isLoading,
    setIsLoading,
    updateData,
    updateStepValidation,
    canGoNext,
    canGoPrevious,
    goToStep,
    nextStep,
    previousStep,
    resetWizard,
    getCompletedSteps,
    validation: stepValidationRef.current,
  };
}