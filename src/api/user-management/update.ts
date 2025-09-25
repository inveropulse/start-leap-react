import {
  UpdateUserRequest,
  UpdateUserResponse,
  USERS_REQUEST_BASE_QUERY_KEY,
} from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PortalType, UserStatus } from "@/shared/types";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export const useUpdateUserRequest = () => {
  const queryClient = useQueryClient();
  const { apiClient } = useAxiosClient();

  return useMutation({
    mutationKey: ["update.user.request"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...USERS_REQUEST_BASE_QUERY_KEY],
      });
    },
    mutationFn: async (req: UpdateUserRequest): Promise<UpdateUserResponse> => {
      return createFakeUserResponse(req);
    },
  });
};

const createFakeUserResponse = (req: UpdateUserRequest): UpdateUserResponse => {
  return {
    message: "User updated successfully (fake response)",
    statusCode: 201,
    successful: true,
    data: {
      ...req,
      id: req.id,
      status: req.status || UserStatus.ACTIVE,
      fullName: `${req.firstName} ${req.lastName}`,
      avatar: req.avatar || undefined,
      department: req.department,
      email: req.email,
      firstName: req.firstName,
      lastName: req.lastName,
      role: req.role,
      notes: req.notes || "",
      phone: req.phone || undefined,
      permissionLevel: req.permissionLevel,
      lastLoginDate: req.lastLoginDate || undefined,
      lastPasswordChangeDate: req.lastPasswordChangeDate || undefined,
      portalAccess: {
        [PortalType.CLINIC]: false,
        [PortalType.INTERNAL]: true,
        [PortalType.PATIENT]: false,
        [PortalType.SEDATIONIST]: false,
      },
      createdAt: req.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};
