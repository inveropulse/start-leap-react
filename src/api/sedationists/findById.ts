import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/shared-kernel/common";
import { Sedationist } from "@/shared/types/domains/sedationist";
import { getSedationistsData } from "./findAll";

export const SEDATIONIST_QUERY_KEY = "sedationist";

export type SedationistResponse = ApiResponse<Sedationist>;

// API function with inline mock logic
async function fetchSedationist(id: string): Promise<SedationistResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  const sedationists = getSedationistsData();
  const sedationist = sedationists.find((s) => s.id === id);

  if (!sedationist) {
    return {
      successful: false,
      message: "Sedationist not found",
      data: undefined,
    };
  }

  return {
    successful: true,
    message: null,
    data: sedationist,
  };
}

// Hook
export function useSedationistRequest(id: string) {
  return useQuery({
    queryKey: [SEDATIONIST_QUERY_KEY, id],
    queryFn: () => fetchSedationist(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
