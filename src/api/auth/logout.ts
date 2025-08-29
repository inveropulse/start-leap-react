import { useMutation } from "@tanstack/react-query";

export const useLogoutRequest = () => {
  return useMutation({
    mutationKey: ["logout.user.request"],
    mutationFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { user: { email: "user@example.com" } } });
        }, 1000);
      });
    },
  });
};
