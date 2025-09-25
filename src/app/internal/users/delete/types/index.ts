// DeleteUser types for use-case specific logic

export type DeleteUserRequest = {
  userId: string;
  reason?: string;
};

export type DeleteUserResponse = {
  success: boolean;
  message?: string;
};
