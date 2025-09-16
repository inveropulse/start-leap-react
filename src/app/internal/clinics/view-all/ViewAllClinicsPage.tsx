import { useCallback, useState } from "react";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";
import { ClinicsListView } from "./ClinicsListView";
import { CreateClinicModal } from "../create/CreateClinicModal";
import { ClinicManagementModal } from "../manage/ClinicManagementModal";

export default function ViewAllClinicsPage() {
  const [openAddClinic, setOpenAddClinic] = useState(false);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);

  const handleQA = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.ADD_CLINIC:
        setOpenAddClinic(true);
        break;
      // handle more quick actions here
    }
  }, []);

  useQuickAction(handleQA);

  const handleViewClinic = (clinicId: string) => {
    setSelectedClinicId(clinicId);
  };

  const handleCloseManagement = () => {
    setSelectedClinicId(null);
  };

  return (
    <div className="space-y-6 p-6">
      <ClinicsListView
        onAddClinic={() => setOpenAddClinic(true)}
        onViewClinic={handleViewClinic}
      />

      <CreateClinicModal open={openAddClinic} onOpenChange={setOpenAddClinic} />

      <ClinicManagementModal
        clinicId={selectedClinicId}
        isOpen={!!selectedClinicId}
        onClose={handleCloseManagement}
      />
    </div>
  );
}
