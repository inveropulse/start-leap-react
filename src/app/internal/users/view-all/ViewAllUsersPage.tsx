import { useCallback, useState } from "react";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";
import ViewAllUsers from "./components/ViewAllUsers";
import CreateUserModal from "../create/CreateUserModal";

/**
 * Main users page that orchestrates different use cases
 * Acts as a container component following Composition pattern
 */
export default function ViewAllUsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleQA = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.ADD_USER:
        setIsCreateModalOpen(true);
        break;
      // handle more quick actions here
    }
  }, []);

  useQuickAction(handleQA);

  return (
    <div className="p-6">
      <ViewAllUsers />

      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
          }
        }}
      />
    </div>
  );
}
