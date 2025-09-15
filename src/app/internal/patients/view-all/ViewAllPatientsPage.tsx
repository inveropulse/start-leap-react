import { useCallback, useState } from "react";
import { CreatePatientModal } from "../create";
import { PatientListView } from "../shared/components";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";

export default function ViewAllPatientsPage() {
  const [openAddPatient, setOpenAddPatient] = useState(false);

  const handleQA = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.ADD_PATIENT:
        setOpenAddPatient(true);
        break;
      // handle more quick actions here
    }
  }, []);

  useQuickAction(handleQA);

  return (
    <div className="space-y-6 p-6">
      <PatientListView onAddPatient={() => setOpenAddPatient(true)} />

      <CreatePatientModal
        open={openAddPatient}
        onOpenChange={setOpenAddPatient}
      />
    </div>
  );
}
