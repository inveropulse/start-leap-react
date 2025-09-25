import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteUserWarningProps {
  userName: string;
}

const DeleteUserWarning: React.FC<DeleteUserWarningProps> = ({ userName }) => (
  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
    <AlertTriangle className="text-red-600 w-6 h-6" />
    <div>
      <div className="font-semibold text-red-800">Delete User</div>
      <div className="text-red-700 text-sm mt-1">
        This action will <span className="font-bold">permanently delete</span>{" "}
        <span className="font-bold">{userName}</span> and all their records.
        <br />
        This cannot be undone. Are you absolutely sure?
      </div>
    </div>
  </div>
);

export default DeleteUserWarning;
