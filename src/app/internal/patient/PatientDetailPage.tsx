// Update PatientDetailPage with new tabs
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Calendar, Activity, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { usePatientRequest } from "./hooks/usePatientRequests";
import { PatientAvatar } from "./components/PatientAvatar";
import { PatientEditModal } from "./components/PatientEditModal";
import { PatientDeleteDialog } from "./components/PatientDeleteDialog";
import { PatientAppointmentsTab } from "./components/PatientAppointmentsTab";
import { PatientRecordsTab } from "./components/PatientRecordsTab";
import { PatientPrintExport } from "./components/PatientPrintExport";
import { useState } from "react";
import { format } from "date-fns";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: patient, isLoading, isError } = usePatientRequest(id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-muted rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">Patient Not Found</h2>
            <p className="text-muted-foreground mb-6">The patient you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/internal/patients")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "Unknown";
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} years old`;
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/internal/patients")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Patient Details</h1>
            <p className="text-muted-foreground">Comprehensive patient information</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Patient
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Patient Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <PatientAvatar
              patient={patient}
              size="xl"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-semibold">
                  {patient.title && `${patient.title} `}
                  {patient.fullName || `${patient.firstName} ${patient.lastName}`}
                </h2>
                <Badge variant="secondary">{patient.sex || "Not specified"}</Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                {calculateAge(patient.dateOfBirth)}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {patient.phoneNumber && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.phoneNumber}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.email}</span>
                  </div>
                )}
                {(patient.town || patient.country) && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {[patient.town, patient.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>  
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p>{formatDate(patient.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Age</label>
                  <p>{patient.age || calculateAge(patient.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                  <p>{patient.occupation || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                  <p>{patient.businessName || "Not specified"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Physical Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Height</label>
                  <p>{patient.height ? `${patient.height} ${patient.heightFormat || 'cm'}` : "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Weight</label>
                  <p>{patient.weight ? `${patient.weight} ${patient.weightFormat || 'kg'}` : "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">BMI</label>
                  <p>{patient.bmi ? patient.bmi.toFixed(1) : "Not calculated"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ASA Classification</label>
                  <p>ASA {patient.asaClassification || "Not specified"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Medical History</label>
                  <p className="mt-1">{patient.medicalHistory || "No medical history recorded"}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Allergies</label>
                  <p className="mt-1">{patient.allergies || "No known allergies"}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Medications</label>
                  <p className="mt-1">{patient.medications || "No current medications"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Anesthetic History</label>
                  <p className="mt-1">{patient.anestheticHistory || "No anesthetic history recorded"}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lifestyle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Smoking Status</label>
                    <p>{patient.smokingStatus || "Not specified"}</p>
                    {patient.smokingNote && <p className="text-sm text-muted-foreground mt-1">{patient.smokingNote}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Alcohol Status</label>
                    <p>{patient.alcoholStatus || "Not specified"}</p>
                    {patient.alcoholNote && <p className="text-sm text-muted-foreground mt-1">{patient.alcoholNote}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pre-Procedure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Meal</label>
                    <p>{patient.lastMealAgoInHours ? `${patient.lastMealAgoInHours} hours ago` : "Not specified"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Fluid</label>
                    <p>{patient.lastFluidAgoInHours ? `${patient.lastFluidAgoInHours} hours ago` : "Not specified"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <PatientAppointmentsTab patientId={patient.id!} patientPhone={patient.phoneNumber} />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Primary Phone</label>
                    <p>{patient.phoneNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Alternative Phone</label>
                    <p>{patient.alternativePhoneNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p>{patient.email || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p>{patient.address || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Town/City</label>
                    <p>{patient.town || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p>{patient.country || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
                    <p>{patient.postCode || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <p className="mt-2 whitespace-pre-wrap">{patient.notes || "No notes recorded"}</p>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    <p>Created: {formatDate(patient.createdDateTime)}</p>
                    {patient.ticketId && <p>Ticket ID: {patient.ticketId}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <PatientPrintExport patient={patient} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <PatientEditModal
        patientId={isEditModalOpen ? patient.id! : null}
        onClose={() => setIsEditModalOpen(false)}
      />

      <PatientDeleteDialog
        patientId={isDeleteDialogOpen ? patient.id! : null}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          // Navigate back to patients list after successful deletion
          navigate("/internal/patients");
        }}
      />
    </div>
  );
}