import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/shared/components/ui/dialog';
import { WizardStep } from '../../types/wizard.types';
import { useAppointmentWizard } from '../../hooks/useAppointmentWizard';
import { WizardProgressIndicator } from './WizardProgressIndicator';
import { PatientSelectionStep } from './steps/PatientSelectionStep';
import { ClinicSelectionStep } from './steps/ClinicSelectionStep';
import { DoctorSelectionStep } from './steps/DoctorSelectionStep';
import { SedationistSelectionStep } from './steps/SedationistSelectionStep';
import { AppointmentDetailsStep } from './steps/AppointmentDetailsStep';
import { ReviewConfirmStep } from './steps/ReviewConfirmStep';

interface BookAppointmentWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookAppointmentWizard({ isOpen, onClose }: BookAppointmentWizardProps) {
  const {
    currentStep,
    data,
    updateData,
    updateStepValidation,
    goToStep,
    nextStep,
    previousStep,
    resetWizard,
    getCompletedSteps,
  } = useAppointmentWizard();

  // Reset wizard when dialog closes
  useEffect(() => {
    if (!isOpen) {
      resetWizard();
    }
  }, [isOpen, resetWizard]);

  // Update step validation based on data
  useEffect(() => {
    // Patient step validation
    updateStepValidation(WizardStep.PATIENT_SELECTION, {
      isValid: !!data.patient,
      errors: data.patient ? [] : ['Please select a patient'],
    });

    // Clinic step validation
    updateStepValidation(WizardStep.CLINIC_SELECTION, {
      isValid: !!data.clinic,
      errors: data.clinic ? [] : ['Please select a clinic'],
    });

    // Doctor step validation
    updateStepValidation(WizardStep.DOCTOR_SELECTION, {
      isValid: !!data.doctor,
      errors: data.doctor ? [] : ['Please select a doctor'],
    });

    // Sedationist step validation
    updateStepValidation(WizardStep.SEDATIONIST_SELECTION, {
      isValid: !!data.sedationist,
      errors: data.sedationist ? [] : ['Please select a sedationist'],
    });

    // Appointment details validation
    const detailsValid = !!(
      data.appointmentDetails?.date &&
      data.appointmentDetails?.time &&
      data.appointmentDetails?.procedure &&
      data.appointmentDetails?.callerName
    );
    
    updateStepValidation(WizardStep.APPOINTMENT_DETAILS, {
      isValid: detailsValid,
      errors: detailsValid ? [] : ['Please fill in all required appointment details'],
    });
  }, [data, updateStepValidation]);

  const renderCurrentStep = () => {
    const stepProps = {
      data,
      onDataChange: updateData,
      onNext: nextStep,
      onPrevious: previousStep,
    };

    switch (currentStep) {
      case WizardStep.PATIENT_SELECTION:
        return <PatientSelectionStep {...stepProps} />;
      case WizardStep.CLINIC_SELECTION:
        return <ClinicSelectionStep {...stepProps} />;
      case WizardStep.DOCTOR_SELECTION:
        return <DoctorSelectionStep {...stepProps} />;
      case WizardStep.SEDATIONIST_SELECTION:
        return <SedationistSelectionStep {...stepProps} />;
      case WizardStep.APPOINTMENT_DETAILS:
        return <AppointmentDetailsStep {...stepProps} />;
      case WizardStep.REVIEW_CONFIRM:
        return <ReviewConfirmStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="p-0">
          <WizardProgressIndicator
            currentStep={currentStep}
            completedSteps={getCompletedSteps()}
            onStepClick={goToStep}
          />
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}