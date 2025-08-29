import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/provider/AxiosClientProvider";

export interface SendLogRequest {
  logs: Record<string, any>[];
}

export const useSendLogRequest = () => {
  const client = useAxiosClient().apiClient;

  return useMutation({
    mutationKey: ["send.log.request"],
    mutationFn: async (req: SendLogRequest) =>
      await client.log.postApiLogAddLog(req),
  });
};
