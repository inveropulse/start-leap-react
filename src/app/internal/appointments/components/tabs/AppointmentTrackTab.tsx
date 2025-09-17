import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, CheckCircle, AlertCircle, Info, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/shared/components/ui/dialog';
import { AppointmentActivity, ActivityType } from '../../types/management.types';
import { appointmentManagementService } from '../../services/appointmentManagementService';

interface AppointmentTrackTabProps {
  activities: AppointmentActivity[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function AppointmentTrackTab({
  activities,
  isLoading,
  onRefresh,
}: AppointmentTrackTabProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    setIsSubmitting(true);
    try {
      await appointmentManagementService.addActivity(activities[0]?.appointmentId || '', {
        type: ActivityType.NOTES_ADDED,
        title: 'Note Added',
        description: noteText.trim(),
        notes: noteText.trim()
      });
      
      setNoteText('');
      setIsAddingNote(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.STATUS_CHANGE:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case ActivityType.PATIENT_NOTIFICATION:
      case ActivityType.CLINIC_NOTIFICATION:
        return <Info className="h-4 w-4 text-blue-600" />;
      case ActivityType.DOCUMENT_UPLOADED:
      case ActivityType.DOCUMENT_SIGNED:
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case ActivityType.PAYMENT_RECEIVED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case ActivityType.NOTES_ADDED:
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="default" className="text-xs">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading activity timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Note Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Activity Timeline</h3>
        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Activity Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your note..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNote(false);
                    setNoteText('');
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Note'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Activity Timeline */}
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No activity recorded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4 pb-4 last:pb-0">
              {/* Timeline Icon */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-border">
                  {getActivityIcon(activity.type)}
                </div>
                {index < activities.length - 1 && (
                  <div className="w-px h-12 bg-border mt-2"></div>
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      {getActivityStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                    {activity.notes && (
                      <div className="bg-muted p-3 rounded-md text-sm mb-2">
                        {activity.notes}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{format(new Date(activity.createdAt), 'MMM dd, yyyy • HH:mm')}</span>
                      <span>by {activity.createdBy}</span>
                    </div>
                  </div>
                </div>

                {/* Activity Metadata */}
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {Object.entries(activity.metadata).map(([key, value]) => (
                      <div key={key} className="inline-block mr-4">
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workflow Status Summary */}
      <div className="border-t pt-4 mt-6">
        <h4 className="font-medium text-sm mb-3">Workflow Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium">Total Activities</div>
            <div className="text-muted-foreground">{activities.length}</div>
          </div>
          <div>
            <div className="font-medium">Completed</div>
            <div className="text-muted-foreground">
              {activities.filter(a => a.status === 'completed').length}
            </div>
          </div>
          <div>
            <div className="font-medium">Pending</div>
            <div className="text-muted-foreground">
              {activities.filter(a => a.status === 'pending').length}
            </div>
          </div>
          <div>
            <div className="font-medium">Last Activity</div>
            <div className="text-muted-foreground">
              {activities.length > 0 
                ? format(new Date(activities[0].createdAt), 'MMM dd, HH:mm')
                : 'None'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}