import type { ManageableUser } from "@/shared/types";
import { useFindUserActivitiesRequest } from "@/api/user-management";

export interface UserProfileActivityTabProps {
  user: ManageableUser;
}

export default function UserProfileActivityTab(
  props: UserProfileActivityTabProps
) {
  const activitiesRequest = useFindUserActivitiesRequest(props.user.id);
  const activities = activitiesRequest.data?.data || [];
  return (
    <div>
      <div className="font-semibold mb-2">Recent Activity</div>
      {activities.length === 0 ? (
        <div className="text-gray-500">No recent activity.</div>
      ) : (
        <ul className="space-y-1">
          {activities.map((activity, idx) => (
            <li key={idx} className="text-sm">
              <span className="font-medium">{activity.action}</span> -{" "}
              {activity.description}{" "}
              <span className="text-gray-400">({activity.timestamp})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
