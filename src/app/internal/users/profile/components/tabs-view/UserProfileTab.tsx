import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from "@/shared/components/ui";
import { Edit, Save, X } from "lucide-react";
import { ManageableUser } from "@/shared/types";
import { Form } from "@/shared/components/ui/form";
import { useUpdateUserRequest } from "@/api/user-management";
import { FormSelect } from "@/shared/components/form/FormSelect";
import {
  Department,
  PermissionLevel,
  UserRole,
  UserStatus,
} from "@/shared/types/domains/user-access/enums";
import { FormTextField } from "@/shared/components/form/FormTextField";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { enumToOptions } from "@/shared/utils/enum-utils";

export interface UserProfileTabProps {
  user: ManageableUser;
}

export default function UserProfileTab({ user }: UserProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <UserProfileTabEditing user={user} setIsEditing={setIsEditing} />;
  }

  return <UserProfileTabView user={user} setIsEditing={setIsEditing} />;
}

export interface UserProfileTabViewProps {
  user: ManageableUser;
  setIsEditing: (isEditing: boolean) => void;
}

function UserProfileTabView({ user, setIsEditing }: UserProfileTabViewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* User Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Basic user details and account information
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
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
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="text-sm">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-sm">{user.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="text-sm">{user.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Role
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">
                    {user.role.replace("_", " ").toLowerCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Department
                </label>
                <p className="text-sm capitalize">
                  {user.department.replace("_", " ")}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Permission Level
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {user.permissionLevel.replace("_", " ").toLowerCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {user.notes && (
            <div className="pt-4 border-t">
              <label className="text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <p className="text-sm mt-1">{user.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Account activity and important dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={`
                    ${
                      user.status === UserStatus.ACTIVE
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      user.status === UserStatus.INACTIVE
                        ? "bg-gray-100 text-gray-800"
                        : ""
                    }
                    ${
                      user.status === UserStatus.SUSPENDED
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                    ${
                      user.status === UserStatus.PENDING_ACTIVATION
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                  `}
                    variant="secondary"
                  >
                    {user.status.replace("_", " ").toLowerCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Join Date
                </label>
                <p className="text-sm">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Login
                </label>
                <p className="text-sm">{formatDate(user.lastLoginDate)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Password Change
                </label>
                <p className="text-sm">
                  {formatDate(user.lastPasswordChangeDate)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  department: z.nativeEnum(Department),
  permissionLevel: z.nativeEnum(PermissionLevel),
  status: z.nativeEnum(UserStatus),
  notes: z.string().optional(),
});

export interface UserProfileTabEditingProps {
  user: ManageableUser;
  setIsEditing: (isEditing: boolean) => void;
}

function UserProfileTabEditing({
  user,
  setIsEditing,
}: UserProfileTabEditingProps) {
  const updateRequest = useUpdateUserRequest();

  const updateUserDefaultValues = useMemo(
    () => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      department: user.department,
      permissionLevel: user.permissionLevel,
      status: user.status,
      notes: user.notes || "",
    }),
    [user]
  );

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: updateUserDefaultValues,
  });

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const handleSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateRequest.mutateAsync({
        id: user.id,
        ...data,
      });
      setIsEditing(false);
      form.reset(updateUserDefaultValues);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Edit User Profile</CardTitle>
                <CardDescription>
                  Update user information and settings
                </CardDescription>
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
                  disabled={updateRequest.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateRequest.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 flex flex-col">
                <FormTextField
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  required
                />
                <FormSelect
                  control={form.control}
                  name="role"
                  label="Role"
                  options={enumToOptions(UserRole)}
                  required
                />
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
              </div>
              <div className="space-y-4 flex flex-col">
                <FormSelect
                  control={form.control}
                  name="department"
                  label="Department"
                  options={enumToOptions(Department)}
                  required
                />
                <FormSelect
                  control={form.control}
                  name="permissionLevel"
                  label="Permission Level"
                  options={enumToOptions(PermissionLevel)}
                  required
                />
                <FormSelect
                  control={form.control}
                  name="status"
                  label="Status"
                  options={enumToOptions(UserStatus)}
                  required
                />
                <FormTextField
                  control={form.control}
                  name="notes"
                  label="Notes"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
