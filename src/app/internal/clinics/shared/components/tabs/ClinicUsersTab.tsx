import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { UserCheck, Plus, Mail } from "lucide-react";
import { ClinicUser } from "@/shared/types/domains/clinic";

interface ClinicUsersTabProps {
  users: ClinicUser[];
  clinicId: string;
  isLoading: boolean;
  onUpdate: () => void;
}

export function ClinicUsersTab({
  users,
  clinicId,
  isLoading,
  onUpdate,
}: ClinicUsersTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-20 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Users ({users.length})</h3>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={user.status === "Active" ? "default" : "secondary"}
                  >
                    {user.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
