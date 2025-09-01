import { useCallback, useState } from "react";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";

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
    <div>
      <button onClick={() => setOpenAddPatient(true)}>Add Patient</button>
      <div> openAddPatient : {openAddPatient.toString()}</div>
    </div>
  );
}
