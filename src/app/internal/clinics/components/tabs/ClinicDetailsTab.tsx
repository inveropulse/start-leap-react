import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Building2, MapPin, Phone, Mail, Globe, Edit, Save, X } from "lucide-react";
import { Clinic, ClinicStatus, ClinicType } from "../../types/clinic.types";
import { useUpdateClinicRequest } from "../../hooks/useClinicRequests";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/utils/cn";

const updateClinicSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  contactPersonName: z.string().min(1, "Contact person name is required"),
  physicalAddress: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  emailAddress: z.string().email("Valid email is required"),
  website: z.string().optional(),
  type: z.nativeEnum(ClinicType),
  status: z.nativeEnum(ClinicStatus),
  comments: z.string().optional(),
});

type UpdateClinicFormData = z.infer<typeof updateClinicSchema>;

interface ClinicDetailsTabProps {
  clinic?: Clinic;
  isLoading: boolean;
  onUpdate: () => void;
}

export function ClinicDetailsTab({ clinic, isLoading, onUpdate }: ClinicDetailsTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const updateClinicMutation = useUpdateClinicRequest();

  const form = useForm<UpdateClinicFormData>({
    resolver: zodResolver(updateClinicSchema),
    defaultValues: {
      name: clinic?.name || "",
      contactPersonName: clinic?.contactPersonName || "",
      physicalAddress: clinic?.physicalAddress || "",
      city: clinic?.city || "",
      postalCode: clinic?.postalCode || "",
      phoneNumber: clinic?.phoneNumber || "",
      emailAddress: clinic?.emailAddress || "",
      website: clinic?.website || "",
      type: clinic?.type || ClinicType.GENERAL,
      status: clinic?.status || ClinicStatus.ACTIVE,
      comments: clinic?.comments || "",
    },
  });

  const getStatusColor = (status?: ClinicStatus) => {
    switch (status) {
      case ClinicStatus.ACTIVE:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case ClinicStatus.INACTIVE:
        return "bg-red-100 text-red-800 border-red-200";
      case ClinicStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const onSubmit = async (data: UpdateClinicFormData) => {
    if (!clinic?.id) return;

    try {
      await updateClinicMutation.mutateAsync({
        id: clinic.id,
        ...data,
      });
      toast({
        title: "Success",
        description: "Clinic updated successfully",
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update clinic",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    form.reset({
      name: clinic?.name || "",
      contactPersonName: clinic?.contactPersonName || "",
      physicalAddress: clinic?.physicalAddress || "",
      city: clinic?.city || "",
      postalCode: clinic?.postalCode || "",
      phoneNumber: clinic?.phoneNumber || "",
      emailAddress: clinic?.emailAddress || "",
      website: clinic?.website || "",
      type: clinic?.type || ClinicType.GENERAL,
      status: clinic?.status || ClinicStatus.ACTIVE,
      comments: clinic?.comments || "",
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!clinic) {
    return <div className="text-center text-muted-foreground py-8">No clinic data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Edit Controls */}
      <div className="flex justify-end gap-2">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Clinic
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={handleCancel} 
              variant="outline" 
              size="sm"
              disabled={updateClinicMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              size="sm"
              disabled={updateClinicMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateClinicMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Clinic Name *</Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="Enter clinic name"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-medium">{clinic.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={form.watch("status")}
                      onValueChange={(value) => form.setValue("status", value as ClinicStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ClinicStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(clinic.status))}>
                        {clinic.status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPersonName">Contact Person *</Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="contactPersonName"
                        {...form.register("contactPersonName")}
                        placeholder="Enter contact person name"
                      />
                      {form.formState.errors.contactPersonName && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.contactPersonName.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm">{clinic.contactPersonName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  {isEditing ? (
                    <Select
                      value={form.watch("type")}
                      onValueChange={(value) => form.setValue("type", value as ClinicType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select clinic type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ClinicType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm">{clinic.type}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="physicalAddress">Address *</Label>
                {isEditing ? (
                  <>
                    <Input
                      id="physicalAddress"
                      {...form.register("physicalAddress")}
                      placeholder="Enter full address"
                    />
                    {form.formState.errors.physicalAddress && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.physicalAddress.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm">{clinic.physicalAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="city"
                        {...form.register("city")}
                        placeholder="Enter city"
                      />
                      {form.formState.errors.city && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.city.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm">{clinic.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="postalCode"
                        {...form.register("postalCode")}
                        placeholder="Enter postal code"
                      />
                      {form.formState.errors.postalCode && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.postalCode.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm">{clinic.postalCode}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Phone *
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="phoneNumber"
                        {...form.register("phoneNumber")}
                        placeholder="Enter phone number"
                      />
                      {form.formState.errors.phoneNumber && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.phoneNumber.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm">{clinic.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email *
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="emailAddress"
                        type="email"
                        {...form.register("emailAddress")}
                        placeholder="Enter email address"
                      />
                      {form.formState.errors.emailAddress && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.emailAddress.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm">{clinic.emailAddress}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Website
                </Label>
                {isEditing ? (
                  <Input
                    id="website"
                    {...form.register("website")}
                    placeholder="Enter website URL (optional)"
                  />
                ) : (
                  <p className="text-sm">{clinic.website || "Not provided"}</p>
                )}
              </div>

              {(isEditing || clinic.comments) && (
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  {isEditing ? (
                    <Textarea
                      id="comments"
                      {...form.register("comments")}
                      placeholder="Enter any additional comments (optional)"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm">{clinic.comments || "No additional comments"}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}