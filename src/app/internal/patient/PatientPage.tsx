import { useCallback, useState } from "react";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";
import { PatientListView } from "./components/PatientListView";
import { PatientCreateModal } from "./components/PatientCreateModal";

export default function PatientPage() {
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
      <PatientListView 
        onAddPatient={() => setOpenAddPatient(true)} 
      />
      
      <PatientCreateModal 
        open={openAddPatient}
        onOpenChange={setOpenAddPatient}
      />
    </div>
  );
}