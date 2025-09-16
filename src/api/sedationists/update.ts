import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/shared-kernel/common";
import {
  Sedationist,
  UpdateSedationistData,
} from "@/shared/types/domains/sedation";
import {
  SEDATIONISTS_QUERY_KEY,
  getSedationistsData,
  setSedationistsData,
} from "./findAll";
import { SEDATIONIST_QUERY_KEY } from "./findById";

export type UpdateSedationistResponse = ApiResponse<Sedationist>;

// API function with inline mock logic
async function updateSedationist(
  data: UpdateSedationistData
): Promise<UpdateSedationistResponse> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    const sedationists = getSedationistsData();
    const index = sedationists.findIndex((s) => s.id === data.id);

    if (index === -1) {
      throw new Error(`Sedationist with id ${data.id} not found`);
    }

    const updated = { ...sedationists[index], ...data };
    const updatedSedationists = [...sedationists];
    updatedSedationists[index] = updated;
    setSedationistsData(updatedSedationists);

    return {
      successful: true,
      message: "Sedationist updated successfully",
      data: updated,
    };
  } catch (error) {
    return {
      successful: false,
      message:
        error instanceof Error ? error.message : "Failed to update sedationist",
      data: undefined,
    };
  }
}

// Hook
export function useUpdateSedationistRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSedationist,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [SEDATIONISTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [SEDATIONIST_QUERY_KEY, variables.id],
      });
    },
  });
}
