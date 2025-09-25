import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeactivateUserWarningProps {
  userName: string;
}

const DeactivateUserWarning: React.FC<DeactivateUserWarningProps> = ({
  userName,
}) => (
  <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
    <AlertTriangle className="text-yellow-600 w-6 h-6" />
    <div>
      <div className="font-semibold text-yellow-800">Deactivate User</div>
      <div className="text-yellow-700 text-sm mt-1">
        Are you sure you want to deactivate{" "}
        <span className="font-bold">{userName}</span>?<br />
        This will immediately revoke their access to all portals. You can
        reactivate them later from the user profile.
      </div>
    </div>
  </div>
);

export default DeactivateUserWarning;
