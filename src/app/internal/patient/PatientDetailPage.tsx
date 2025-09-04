import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePatientRequest } from "./hooks/usePatientRequest";
import { PatientEditModal } from "./components/PatientEditModal";
import { PatientDeleteDialog } from "./components/PatientDeleteDialog";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Separator } from "@/shared/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  User, 
  Heart, 
  AlertTriangle,
  FileText,
  Clock,
  Shield
} from "lucide-react";

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editingPatient, setEditingPatient] = useState(false);
  const [deletingPatient, setDeletingPatient] = useState(false);

  const { data: patient, isLoading, error } = usePatientRequest(id!);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/internal/patients">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Link>
          </Button>
        </div>
        <Card className="border-destructive">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Patient Not Found</h3>
            <p className="text-muted-foreground">
              The patient you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/internal/patients">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {patient.title} {patient.firstName} {patient.lastName}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">
                Age {calculateAge(patient.dateOfBirth)}
              </Badge>
              <Badge variant="outline">{patient.sex}</Badge>
              <span className="text-sm text-muted-foreground">ID: {patient.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setEditingPatient(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={() => setDeletingPatient(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{patient.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{patient.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {(patient.emergencyContactName || patient.emergencyContactPhone) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patient.emergencyContactName && (
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">{patient.emergencyContactName}</p>
                    </div>
                  )}
                  {patient.emergencyContactPhone && (
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{patient.emergencyContactPhone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medical History */}
          {patient.medicalHistory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{patient.medicalHistory}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {patient.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{patient.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Appointments Section - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Appointments</h3>
                <p className="text-muted-foreground">
                  This patient has no appointments scheduled.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Health Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Smoking Status</p>
                <Badge variant="outline" className="mt-1">
                  {patient.smokingStatus}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Alcohol Status</p>
                <Badge variant="outline" className="mt-1">
                  {patient.alcoholStatus}
                </Badge>
              </div>
              {patient.allergies && patient.allergies.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Allergies</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {patient.medications && patient.medications.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Medications</p>
                    <div className="space-y-1">
                      {patient.medications.map((medication, index) => (
                        <Badge key={index} variant="secondary" className="text-xs block w-fit">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Record Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Record Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(patient.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(patient.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <PatientEditModal
        open={editingPatient}
        onOpenChange={setEditingPatient}
        patient={patient}
      />

      <PatientDeleteDialog
        open={deletingPatient}
        onOpenChange={(open) => {
          setDeletingPatient(open);
          if (!open && !patient) {
            // If patient was deleted, navigate back to patients list
            navigate('/internal/patients');
          }
        }}
        patient={patient}
      />
    </div>
  );
}