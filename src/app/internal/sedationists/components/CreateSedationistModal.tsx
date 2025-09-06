import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { X, Plus } from "lucide-react";
import { SedationistSpecialty } from '../types';
import { useCreateSedationistRequest } from '../hooks/useSedationistMutations';
import { useNotifications } from '@/shared/providers/NotificationProvider';

const createSedationistSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  licenseNumber: z.string().min(1, 'License number is required'),
});

const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuingBody: z.string().min(1, 'Issuing body is required'),
  certificateNumber: z.string().min(1, 'Certificate number is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
});

type CreateSedationistFormData = z.infer<typeof createSedationistSchema>;
type CertificationFormData = z.infer<typeof certificationSchema>;

interface CreateSedationistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const specialtyOptions = [
  { value: SedationistSpecialty.GENERAL_ANAESTHESIA, label: 'General Anaesthesia' },
  { value: SedationistSpecialty.CONSCIOUS_SEDATION, label: 'Conscious Sedation' },
  { value: SedationistSpecialty.IV_SEDATION, label: 'IV Sedation' },
  { value: SedationistSpecialty.NITROUS_OXIDE, label: 'Nitrous Oxide' },
  { value: SedationistSpecialty.PEDIATRIC_SEDATION, label: 'Pediatric Sedation' },
  { value: SedationistSpecialty.CARDIAC_SEDATION, label: 'Cardiac Sedation' },
];

export function CreateSedationistModal({ open, onOpenChange }: CreateSedationistModalProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedSpecialties, setSelectedSpecialties] = useState<SedationistSpecialty[]>([]);
  const [certifications, setCertifications] = useState<CertificationFormData[]>([]);
  const [newCertification, setNewCertification] = useState<CertificationFormData>({
    name: '',
    issuingBody: '',
    certificateNumber: '',
    issueDate: '',
    expiryDate: '',
  });

  const { showSuccess, showError } = useNotifications();
  const createMutation = useCreateSedationistRequest();

  const form = useForm<CreateSedationistFormData>({
    resolver: zodResolver(createSedationistSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
    },
  });

  const certForm = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: newCertification,
  });

  const onSubmit = async (data: CreateSedationistFormData) => {
    if (selectedSpecialties.length === 0) {
      showError('Please select at least one specialty');
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...data,
        specialties: selectedSpecialties,
        certifications: certifications,
      });

      showSuccess('Sedationist created successfully');
      handleClose();
    } catch (error) {
      showError('Failed to create sedationist');
    }
  };

  const handleClose = () => {
    form.reset();
    certForm.reset();
    setSelectedSpecialties([]);
    setCertifications([]);
    setNewCertification({
      name: '',
      issuingBody: '',
      certificateNumber: '',
      issueDate: '',
      expiryDate: '',
    });
    setActiveTab('basic');
    onOpenChange(false);
  };

  const addSpecialty = (specialty: SedationistSpecialty) => {
    if (!selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const removeSpecialty = (specialty: SedationistSpecialty) => {
    setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
  };

  const addCertification = (certification: CertificationFormData) => {
    setCertifications([...certifications, certification]);
    setNewCertification({
      name: '',
      issuingBody: '',
      certificateNumber: '',
      issueDate: '',
      expiryDate: '',
    });
    certForm.reset();
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const canProceedToSpecialties = form.formState.isValid && 
    form.watch('firstName') && 
    form.watch('lastName') && 
    form.watch('email') && 
    form.watch('licenseNumber');

  const canProceedToCertifications = selectedSpecialties.length > 0;

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
            <TabsTrigger value="specialties" disabled={!canProceedToSpecialties}>
              Specialties
            </TabsTrigger>
            <TabsTrigger value="certifications" disabled={!canProceedToCertifications}>
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
                placeholder="+44 20 1234 5678"
              />
              <FormTextField
                control={form.control}
                name="licenseNumber"
                label="License Number"
                placeholder="GMC-1234567"
                required
              />
            </Form>
            <div className="flex justify-end">
              <Button 
                onClick={() => setActiveTab('specialties')}
                disabled={!canProceedToSpecialties}
              >
                Next: Specialties
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="specialties" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Select Specialties</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Choose one or more areas of specialization for this sedationist.
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {specialtyOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedSpecialties.includes(option.value) ? 'default' : 'outline'}
                    onClick={() => {
                      if (selectedSpecialties.includes(option.value)) {
                        removeSpecialty(option.value);
                      } else {
                        addSpecialty(option.value);
                      }
                    }}
                    className="justify-start h-auto p-3"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {selectedSpecialties.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Selected Specialties:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialties.map((specialty) => {
                      const option = specialtyOptions.find(opt => opt.value === specialty);
                      return (
                        <Badge key={specialty} variant="default" className="cursor-pointer">
                          {option?.label}
                          <X 
                            className="h-3 w-3 ml-1" 
                            onClick={() => removeSpecialty(specialty)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('basic')}>
                Back
              </Button>
              <Button 
                onClick={() => setActiveTab('certifications')}
                disabled={selectedSpecialties.length === 0}
              >
                Next: Certifications
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Add Certifications</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add professional certifications and licenses (optional).
              </p>

              {/* Existing Certifications */}
              {certifications.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h5 className="text-sm font-medium">Added Certifications:</h5>
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{cert.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {cert.issuingBody} • {cert.certificateNumber}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Valid: {cert.issueDate} to {cert.expiryDate}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Certification Form */}
              <Form {...certForm}>
                <div className="space-y-4 p-4 border rounded-lg">
                  <h5 className="text-sm font-medium">Add New Certification</h5>
                  <FormTextField
                    control={certForm.control}
                    name="name"
                    label="Certification Name"
                    placeholder="e.g., General Medical Council License"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormTextField
                      control={certForm.control}
                      name="issuingBody"
                      label="Issuing Body"
                      placeholder="e.g., GMC"
                    />
                    <FormTextField
                      control={certForm.control}
                      name="certificateNumber"
                      label="Certificate Number"
                      placeholder="e.g., GMC-1234567"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormTextField
                      control={certForm.control}
                      name="issueDate"
                      label="Issue Date"
                      type="date"
                    />
                    <FormTextField
                      control={certForm.control}
                      name="expiryDate"
                      label="Expiry Date"
                      type="date"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={certForm.handleSubmit(addCertification)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              </Form>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('specialties')}>
                Back
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Sedationist'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
