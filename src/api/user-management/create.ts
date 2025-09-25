import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PortalType, UserStatus } from "@/shared/types";
import {
  CreateUserRequest,
  CreateUserResponse,
  USERS_REQUEST_BASE_QUERY_KEY,
} from "./types";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export const useCreateUserRequest = () => {
  const queryClient = useQueryClient();
  const { apiClient } = useAxiosClient();

  return useMutation({
    mutationKey: ["create.user.request"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...USERS_REQUEST_BASE_QUERY_KEY],
      });
    },
    mutationFn: async (req: CreateUserRequest): Promise<CreateUserResponse> => {
      return createFakeUserResponse(req);
    },
  });
};

const createFakeUserResponse = (req: CreateUserRequest): CreateUserResponse => {
  return {
    message: "User created successfully (fake response)",
    statusCode: 201,
    successful: true,
    data: {
      ...req,
      id: "fake-user-id",
      status: UserStatus.ACTIVE,
      fullName: `${req.firstName} ${req.lastName}`,
      avatar: undefined,
      department: req.department,
      email: req.email,
      firstName: req.firstName,
      lastName: req.lastName,
      role: req.role,
      notes: req.notes || "",
      phone: req.phone || undefined,
      permissionLevel: req.permissionLevel,
      lastLoginDate: undefined,
      lastPasswordChangeDate: undefined,
      portalAccess: {
        [PortalType.CLINIC]: false,
        [PortalType.INTERNAL]: true,
        [PortalType.PATIENT]: false,
        [PortalType.SEDATIONIST]: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
};
