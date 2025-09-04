import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePatientRequest } from "./hooks/usePatientRequest";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";
import { ArrowLeft, Edit, Calendar, FileText, NotebookPen, User, Phone, Mail, MapPin, Activity } from "lucide-react";
import { PatientEditModal } from "./components/PatientEditModal";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: patient, isLoading, error } = usePatientRequest(id!);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              {error ? `Error loading patient: ${error.message}` : "Patient not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "records", label: "Records", icon: FileText },
    { id: "notes", label: "Notes", icon: NotebookPen },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{patient.fullName}</h1>
            <p className="text-muted-foreground">Patient ID: {patient.id}</p>
          </div>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Patient
        </Button>
      </div>

      {/* Patient Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Personal Info</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Age: {patient.age} years</p>
                <p>Sex: {patient.sex}</p>
                <p>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Contact</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                {patient.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.phoneNumber && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{patient.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Medical Info</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>BMI: {patient.bmi}</p>
                <p>ASA: {patient.asaClassification}</p>
                <Badge variant="outline">{patient.smokingStatus}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex space-x-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">First Name</label>
                      <p className="text-sm">{patient.firstName || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                      <p className="text-sm">{patient.lastName || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Height</label>
                      <p className="text-sm">{patient.height} {patient.heightFormat}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Weight</label>
                      <p className="text-sm">{patient.weight} {patient.weightFormat}</p>
                    </div>
                  </div>
                  
                  {patient.address && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <div className="flex items-start gap-1 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="text-sm">
                          <p>{patient.address}</p>
                          {patient.town && <p>{patient.town}, {patient.postCode}</p>}
                          {patient.country && <p>{patient.country}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Medical History</label>
                    <p className="text-sm mt-1">{patient.medicalHistory || "No medical history recorded"}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Allergies</label>
                    <p className="text-sm mt-1">{patient.allergies || "No known allergies"}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Medications</label>
                    <p className="text-sm mt-1">{patient.medications || "No current medications"}</p>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Anesthetic History</label>
                    <p className="text-sm mt-1">{patient.anestheticHistory || "No anesthetic history"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "appointments" && (
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No appointments found for this patient.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === "records" && (
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No migrated records found for this patient.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === "notes" && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patient.notes ? (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm">{patient.notes}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {patient.createdDateTime ? new Date(patient.createdDateTime).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No notes available for this patient.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <PatientEditModal
        patient={patient}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}