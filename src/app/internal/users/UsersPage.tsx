import { useCallback, useState } from "react";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";
import { UsersListView } from "./components/UsersListView";
import { CreateUserModal } from "./components/CreateUserModal";

export default function UsersPage() {
  const [openAddUser, setOpenAddUser] = useState(false);

  const handleQA = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.ADD_USER:
        setOpenAddUser(true);
        break;
      // handle more quick actions here
    }
  }, []);

  useQuickAction(handleQA);

  return (
    <div className="space-y-6 p-6">
      <UsersListView 
        onAddUser={() => setOpenAddUser(true)} 
      />
      
      <CreateUserModal 
        open={openAddUser}
        onOpenChange={setOpenAddUser}
      />
    </div>
  );
}