import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { FormTextField, FormSelect } from "@/shared/components/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Edit, Save, X } from "lucide-react";
import { InternalUser, Department, PermissionLevel, UserStatus } from "../types";
import { UserRole } from "@/shared/types";
import { useUpdateUserRequest } from "../hooks/useUserMutations";

const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  department: z.nativeEnum(Department),
  permissionLevel: z.nativeEnum(PermissionLevel),
  status: z.nativeEnum(UserStatus),
  notes: z.string().optional(),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UserProfileTabProps {
  user: InternalUser;
}

const roleOptions = [
  { value: UserRole.ADMIN, label: "Administrator" },
  { value: UserRole.BOOKING_COORDINATOR, label: "Booking Coordinator" },
];

const departmentOptions = [
  { value: Department.ADMINISTRATION, label: "Administration" },
  { value: Department.BOOKING, label: "Booking" },
  { value: Department.OPERATIONS, label: "Operations" },
  { value: Department.IT, label: "IT" },
  { value: Department.MANAGEMENT, label: "Management" },
];

const permissionLevelOptions = [
  { value: PermissionLevel.FULL_ACCESS, label: "Full Access" },
  { value: PermissionLevel.LIMITED_ACCESS, label: "Limited Access" },
  { value: PermissionLevel.READ_ONLY, label: "Read Only" },
  { value: PermissionLevel.CUSTOM, label: "Custom" },
];

const statusOptions = [
  { value: UserStatus.ACTIVE, label: "Active" },
  { value: UserStatus.INACTIVE, label: "Inactive" },
  { value: UserStatus.SUSPENDED, label: "Suspended" },
  { value: UserStatus.PENDING_ACTIVATION, label: "Pending Activation" },
];

export function UserProfileTab({ user }: UserProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateUserMutation = useUpdateUserRequest();

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      department: user.department,
      permissionLevel: user.permissionLevel,
      status: user.status,
      notes: user.notes || "",
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    // Reset form with current user data
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      department: user.department,
      permissionLevel: user.permissionLevel,
      status: user.status,
      notes: user.notes || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const handleSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        ...data,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  if (isEditing) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Edit User Profile</CardTitle>
                  <CardDescription>Update user information and settings</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={updateUserMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                type="tel"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  name="role"
                  label="Role"
                  options={roleOptions}
                  required
                />
                <FormSelect
                  control={form.control}
                  name="department"
                  label="Department"
                  options={departmentOptions}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  name="permissionLevel"
                  label="Permission Level"
                  options={permissionLevelOptions}
                  required
                />
                <FormSelect
                  control={form.control}
                  name="status"
                  label="Status"
                  options={statusOptions}
                  required
                />
              </div>

              <FormTextField
                control={form.control}
                name="notes"
                label="Notes"
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Basic user details and account information</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-sm">{user.firstName} {user.lastName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm">{user.phone || "Not provided"}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{user.role.replace('_', ' ').toLowerCase()}</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Department</label>
                <p className="text-sm capitalize">{user.department.replace('_', ' ')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Permission Level</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{user.permissionLevel.replace('_', ' ').toLowerCase()}</Badge>
                </div>
              </div>
            </div>
          </div>

          {user.notes && (
            <div className="pt-4 border-t">
              <label className="text-sm font-medium text-muted-foreground">Notes</label>
              <p className="text-sm mt-1">{user.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Account activity and important dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`
                    ${user.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-800' : ''}
                    ${user.status === UserStatus.INACTIVE ? 'bg-gray-100 text-gray-800' : ''}
                    ${user.status === UserStatus.SUSPENDED ? 'bg-red-100 text-red-800' : ''}
                    ${user.status === UserStatus.PENDING_ACTIVATION ? 'bg-yellow-100 text-yellow-800' : ''}
                  `} variant="secondary">
                    {user.status.replace('_', ' ').toLowerCase()}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                <p className="text-sm">{formatDate(user.joinDate)}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Login</label>
                <p className="text-sm">{formatDate(user.lastLogin)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Password Change</label>
                <p className="text-sm">{formatDate(user.lastPasswordChange)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}