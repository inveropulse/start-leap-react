import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  FileText,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useState } from "react";

// New architecture imports
import { usePatientRequest } from "@/api/patients";
import { PatientAvatar } from "../shared/components";
import { UpdatePatientModal } from "../update";
import { DeletePatientDialog } from "../delete";
import {
  formatDate,
  calculateAge,
  formatPatientName,
  formatPhysicalStats,
  formatContactInfo,
  formatMedicalInfo,
  formatLifestyleInfo,
  formatPreProcedureInfo,
} from "../shared/utils/patientFormatters";

// Import existing tab components from shared components
import { PatientAppointmentsTab } from "../shared/components/tabs/PatientAppointmentsTab";
import { PatientRecordsTab } from "../shared/components/tabs/PatientRecordsTab";
import { PatientPrintExport } from "../shared/components/tabs/PatientPrintExport";
import { InternalRoute } from "@/routes/internal_routes";

export default function ViewPatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, isError } = usePatientRequest(id);

  const patient = data?.data;

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
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
              Patient Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The patient you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate("/internal/patients")}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patients
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use formatter utilities instead of inline logic
  const patientName = formatPatientName(
    patient.title,
    patient.firstName,
    patient.lastName,
    patient.fullName
  );
  const patientAge = calculateAge(patient.dateOfBirth);
  const physicalStats = formatPhysicalStats(patient);
  const contactInfo = formatContactInfo(patient);
  const medicalInfo = formatMedicalInfo(patient);
  const lifestyleInfo = formatLifestyleInfo(patient);
  const preProcedureInfo = formatPreProcedureInfo(patient);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(InternalRoute.PATIENTS)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Patient Details</h1>
            <p className="text-muted-foreground">
              Comprehensive patient information
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
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
            <PatientAvatar patient={patient} size="xl" />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-semibold">{patientName}</h2>
                <Badge variant="secondary">
                  {patient.sex || "Not specified"}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{patientAge}</p>

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
                      {[patient.town, patient.country]
                        .filter(Boolean)
                        .join(", ")}
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
                  <label className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </label>
                  <p>{formatDate(patient.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Age
                  </label>
                  <p>{patientAge}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Occupation
                  </label>
                  <p>{patient.occupation || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Business Name
                  </label>
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
                  <label className="text-sm font-medium text-muted-foreground">
                    Height
                  </label>
                  <p>{physicalStats.height}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Weight
                  </label>
                  <p>{physicalStats.weight}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    BMI
                  </label>
                  <p>{physicalStats.bmi}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    ASA Classification
                  </label>
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
                  <label className="text-sm font-medium text-muted-foreground">
                    Medical History
                  </label>
                  <p className="mt-1">{medicalInfo.medicalHistory}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Allergies
                  </label>
                  <p className="mt-1">{medicalInfo.allergies}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Current Medications
                  </label>
                  <p className="mt-1">{medicalInfo.medications}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Anesthetic History
                  </label>
                  <p className="mt-1">{medicalInfo.anestheticHistory}</p>
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
                    <label className="text-sm font-medium text-muted-foreground">
                      Smoking Status
                    </label>
                    <p>{lifestyleInfo.smokingStatus}</p>
                    {lifestyleInfo.smokingNote && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {lifestyleInfo.smokingNote}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Alcohol Status
                    </label>
                    <p>{lifestyleInfo.alcoholStatus}</p>
                    {lifestyleInfo.alcoholNote && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {lifestyleInfo.alcoholNote}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pre-Procedure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Meal
                    </label>
                    <p>{preProcedureInfo.lastMeal}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Fluid
                    </label>
                    <p>{preProcedureInfo.lastFluid}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <PatientAppointmentsTab
            patientId={patient.id!}
            patientPhone={patient.phoneNumber}
          />
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
                    <label className="text-sm font-medium text-muted-foreground">
                      Primary Phone
                    </label>
                    <p>{contactInfo.primaryPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Alternative Phone
                    </label>
                    <p>{contactInfo.alternativePhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <p>{contactInfo.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Address
                    </label>
                    <p>{contactInfo.address}</p>
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
                    <label className="text-sm font-medium text-muted-foreground">
                      Notes
                    </label>
                    <p className="mt-2 whitespace-pre-wrap">
                      {patient.notes || "No notes recorded"}
                    </p>
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

        <TabsContent value="records" className="space-y-4">
          <PatientRecordsTab patientId={patient.id!} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <UpdatePatientModal
        patientId={isEditModalOpen ? patient.id! : null}
        onClose={() => setIsEditModalOpen(false)}
      />

      <DeletePatientDialog
        patientId={isDeleteDialogOpen ? patient.id! : null}
        onClose={() => {
          setIsDeleteDialogOpen(false);
        }}
        onSuccess={() => {
          setIsDeleteDialogOpen(false);
          navigate(InternalRoute.PATIENTS);
        }}
      />
    </div>
  );
}
