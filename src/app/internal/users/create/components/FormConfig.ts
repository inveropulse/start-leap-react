import { z } from "zod";
import { User, Shield, Settings, CheckCircle } from "lucide-react";
import {
  Department,
  PermissionLevel,
  UserRole,
} from "@/shared/types/domains/user-access";

export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  permissionLevel: z.string().min(1, "Permission level is required"),
  notes: z.string().optional(),
  sendWelcomeEmail: z.boolean().optional(),
});

export const steps = [
  { id: 1, title: "Basic Information", icon: User },
  { id: 2, title: "Role & Permissions", icon: Shield },
  { id: 3, title: "Account Settings", icon: Settings },
  { id: 4, title: "Review & Confirm", icon: CheckCircle },
];

export const roleOptions = [
  { value: "Administrator", label: "Administrator" },
  { value: "Booking Coordinator", label: "Booking Coordinator" },
];

export const departmentOptions = [
  { value: "Administration", label: "Administration" },
  { value: "Booking", label: "Booking" },
  { value: "Operations", label: "Operations" },
  { value: "IT", label: "IT" },
  { value: "Management", label: "Management" },
];

export const permissionLevelOptions = [
  { value: "Full Access", label: "Full Access" },
  { value: "Limited Access", label: "Limited Access" },
  { value: "Read Only", label: "Read Only" },
  { value: "Custom", label: "Custom" },
];

export type CreateUserFormData = z.infer<typeof createUserSchema>;
