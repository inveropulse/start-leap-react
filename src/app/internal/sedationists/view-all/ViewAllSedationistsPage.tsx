import { useCallback, useState } from "react";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";
import SedationistsListView from "./components/SedationistsListView";
import CreateSedationistModal from "../create/CreateSedationistModal";
import SedationistManagementModal from "../manage/SedationistManagementModal";

export default function ViewAllSedationistsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSedationistId, setSelectedSedationistId] = useState<
    string | null
  >(null);

  const handleQA = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.ADD_SEDATIONIST:
        setIsCreateModalOpen(true);
        break;
      // handle more quick actions here
    }
  }, []);

  useQuickAction(handleQA);

  // Handle creating new sedationist
  const handleAddSedationist = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = (open: boolean) => {
    setIsCreateModalOpen(open);
  };

  // Handle viewing sedationist
  const handleViewSedationist = (sedationistId: string) => {
    setSelectedSedationistId(sedationistId);
  };

  const handleCloseManagementModal = () => {
    setSelectedSedationistId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <SedationistsListView
        onAddSedationist={handleAddSedationist}
        onViewSedationist={handleViewSedationist}
      />

      {/* Create Modal */}
      <CreateSedationistModal
        open={isCreateModalOpen}
        onOpenChange={handleCloseCreateModal}
      />

      {/* Management Modal */}
      {selectedSedationistId && (
        <SedationistManagementModal
          sedationistId={selectedSedationistId}
          isOpen={!!selectedSedationistId}
          onClose={handleCloseManagementModal}
        />
      )}
    </div>
  );
}
