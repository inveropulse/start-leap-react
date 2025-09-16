import { useCallback, useState } from "react";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";
import { SedationistsListView } from "./components/SedationistsListView";
import { CreateSedationistModal } from "./components/CreateSedationistModal";
import { SedationistManagementModal } from "./components/SedationistManagementModal";

export default function SedationistsPage() {
  const [openAddSedationist, setOpenAddSedationist] = useState(false);
  const [selectedSedationistId, setSelectedSedationistId] = useState<
    string | null
  >(null);

  const handleQA = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.ADD_SEDATIONIST:
        setOpenAddSedationist(true);
        break;
      // handle more quick actions here
    }
  }, []);

  useQuickAction(handleQA);

  const handleViewSedationist = (sedationistId: string) => {
    setSelectedSedationistId(sedationistId);
  };

  const handleCloseManagement = () => {
    setSelectedSedationistId(null);
  };

  return (
    <div className="space-y-6 p-6">
      <SedationistsListView
        onAddSedationist={() => setOpenAddSedationist(true)}
        onViewSedationist={handleViewSedationist}
      />

      <CreateSedationistModal
        open={openAddSedationist}
        onOpenChange={setOpenAddSedationist}
      />

      <SedationistManagementModal
        sedationistId={selectedSedationistId}
        isOpen={!!selectedSedationistId}
        onClose={handleCloseManagement}
      />
    </div>
  );
}
