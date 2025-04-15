
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Trash2, Edit, Clock, Calendar, Clipboard, CheckCircle2, CirclePlay, CircleDot } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { KanbanTaskItem } from "@/components/kanban/KanbanBoard";
import { Task } from "@/types/task";
import TaskEditDialog from "@/components/TaskEditDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TaskDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: KanbanTaskItem;
  onDelete: (taskId: string) => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  isOpen,
  onClose,
  task,
  onDelete,
  onUpdate,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getStatusIcon = () => {
    switch (task.status) {
      case "backlog":
        return <CircleDot className="h-5 w-5 text-gray-500" />;
      case "progress":
        return <CirclePlay className="h-5 w-5 text-blue-500" />;
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case "backlog":
        return "Backlog";
      case "progress":
        return "On Progress";
      case "done":
        return "Done";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">{task.taskName}</h3>
              <p className="text-sm text-muted-foreground">{task.project}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(parseISO(task.date), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{task.timeSpent.toFixed(1)} hours</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">{task.taskType}</Badge>
            </div>
            
            {task.notes && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clipboard className="h-4 w-4" />
                    <span className="font-medium">Notes</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{task.notes}</p>
                </div>
              </>
            )}
            
            {/* Display custom fields if any */}
            {task.customFields && Object.keys(task.customFields).length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(task.customFields)
                      .filter(([key]) => key !== "kanbanStatus") // Skip the kanban status field
                      .map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="text-muted-foreground">{key}: </span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      {showEditDialog && (
        <TaskEditDialog
          task={task}
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onUpdate={(updatedTask) => {
            // Make sure the kanban status is preserved
            const finalTask = {
              ...updatedTask,
              customFields: {
                ...(updatedTask.customFields || {}),
                kanbanStatus: task.status,
              }
            };
            onUpdate(finalTask);
            setShowEditDialog(false);
          }}
        />
      )}
      
      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(task.id);
                setShowDeleteDialog(false);
                onClose();
              }} 
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskDetailsDialog;
