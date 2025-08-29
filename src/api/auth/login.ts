import { useMutation } from "@tanstack/react-query";

export interface LoginRequest {
  email: string;
  password: string;
}

export const useLoginRequest = () => {
  return useMutation({
    mutationKey: ["login.user.request"],
    mutationFn: (req: LoginRequest) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { user: { email: req.email } } });
        }, 1000);
      });
    },
  });
};
