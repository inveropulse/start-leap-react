import type { ManageableUser } from "@/shared/types";
import { useFindUserSessionsRequest } from "@/api/user-management";

export interface UserProfileSessionsTabProps {
  user: ManageableUser;
}

export default function UserProfileSessionsTab(
  props: UserProfileSessionsTabProps
) {
  const sessionsRequest = useFindUserSessionsRequest(props.user.id);
  const sessions = sessionsRequest.data?.data || [];

  return (
    <div>
      <div className="font-semibold mb-2">Active Sessions</div>
      {sessions.length === 0 ? (
        <div className="text-gray-500">No active sessions.</div>
      ) : (
        <ul className="space-y-1">
          {sessions.map((session, idx) => (
            <li key={idx} className="text-sm">
              <span className="font-medium">{session.device}</span> -{" "}
              {session.location}{" "}
              <span className="text-gray-400">({session.lastActive})</span>{" "}
              {session.isActive ? (
                <span className="text-green-600">●</span>
              ) : (
                <span className="text-gray-400">●</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
