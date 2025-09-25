// DeactivateUser types for use-case specific logic

export type DeactivateUserRequest = {
  userId: string;
  reason?: string;
};

export type DeactivateUserResponse = {
  success: boolean;
  message?: string;
};
