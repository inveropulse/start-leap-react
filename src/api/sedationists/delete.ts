import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiBooleanResponse } from "@/shared/types/shared-kernel/common";
import {
  SEDATIONISTS_QUERY_KEY,
  getSedationistsData,
  setSedationistsData,
} from "./findAll";
import { SEDATIONIST_QUERY_KEY } from "./findById";

// API function with inline mock logic
async function deleteSedationist(id: string): Promise<ApiBooleanResponse> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const sedationists = getSedationistsData();
    const index = sedationists.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Sedationist with id ${id} not found`);
    }

    const updatedSedationists = [...sedationists];
    updatedSedationists.splice(index, 1);
    setSedationistsData(updatedSedationists);

    return {
      successful: true,
      data: true,
    };
  } catch (error) {
    return {
      successful: false,
      data: false,
    };
  }
}

// Hook
export function useDeleteSedationistRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSedationist,
    onSuccess: (data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: [SEDATIONISTS_QUERY_KEY] });
      queryClient.removeQueries({
        queryKey: [SEDATIONIST_QUERY_KEY, deletedId],
      });
    },
  });
}
