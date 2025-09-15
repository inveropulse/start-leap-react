import { useCallback, useState } from "react";
import { CreatePatientModal } from "../create";
import { PatientListView } from "./components";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";

export default function ViewAllPatientsPage() {
  const [openAddPatient, setOpenAddPatient] = useState(false);

  const handleQuickAction = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.ADD_PATIENT:
        setOpenAddPatient(true);
        break;
      // handle more quick actions here
    }
  }, []);

  useQuickAction(handleQuickAction);

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
