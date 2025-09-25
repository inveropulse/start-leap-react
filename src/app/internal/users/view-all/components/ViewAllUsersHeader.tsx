import { useState } from "react";
import { CreateUserModal } from "../../create";
import { Button } from "@/shared/components/ui/button";

/**
 * Header component for ViewAllUsers page
 * Follows Single Responsibility Principle - handles only header display and actions
 * Refresh functionality moved to ViewAllUsersFilters component for better logical grouping
 */
export default function ViewAllUsersHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleAddUser = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage system users and their access</p>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button onClick={handleAddUser}>Add User</Button>
      </div>

      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
