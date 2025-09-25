import type { ManageableUser } from "@/shared/types";

export interface UserProfileAccessTabProps {
  user: ManageableUser;
}

export default function UserProfileAccessTab({
  user,
}: UserProfileAccessTabProps) {
  return (
    <div className="space-y-2">
      <div>
        <span className="font-semibold">Portal Access:</span>
      </div>
      <ul className="ml-4 list-disc">
        {Object.entries(user.portalAccess || {}).map(([portal, hasAccess]) => (
          <li
            key={portal}
            className={hasAccess ? "text-green-700" : "text-gray-400"}
          >
            {portal}: {hasAccess ? "Granted" : "Revoked"}
          </li>
        ))}
      </ul>
    </div>
  );
}
