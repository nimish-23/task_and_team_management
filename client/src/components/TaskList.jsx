import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeTask } from '../store/taskSlice';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon } from "lucide-react"

const TaskList = ({ tasks, filterStatus, filterPriority, search, sortBy, onEdit }) => {
  const dispatch = useDispatch();
  const [taskToDelete, setTaskToDelete] = useState(null);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
        const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'dateAsc') return new Date(a.dueDate) - new Date(b.dueDate);
        if (sortBy === 'dateDesc') return new Date(b.dueDate) - new Date(a.dueDate);
        return 0;
      });
  }, [tasks, filterStatus, filterPriority, search, sortBy]);

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      await dispatch(removeTask(taskToDelete)).unwrap();
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(error);
    } finally {
      setTaskToDelete(null);
    }
  };

  if (filteredAndSortedTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {filteredAndSortedTasks.map(task => (
          <li key={task._id} className="p-5 bg-card/50 hover:bg-card border border-border transition-colors rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold tracking-tight truncate">{task.title}</h4>
              <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{task.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-medium">
                <span className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground">
                  Status: {task.status}
                </span>
                <span className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground">
                  Priority: {task.priority}
                </span>
                <span className="px-3 py-1 rounded-md border border-border text-muted-foreground flex items-center">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <span className="px-3 py-1 rounded-md border border-border text-muted-foreground flex items-center">
                  Assigned to: {task.assignedUser?.name || 'Unassigned'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(task)}
                className="h-9"
              >
                Edit
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => setTaskToDelete(task._id)}
                className="h-9"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent className="p-0 border-none bg-transparent shadow-none overflow-hidden sm:max-w-md">
          <div className="bg-popover rounded-lg border border-border shadow-lg p-6 space-y-6">
            <Alert className="border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/20 dark:text-destructive">
              <AlertTriangleIcon className="h-4 w-4 stroke-destructive" />
              <AlertTitle>Warning: Delete Task?</AlertTitle>
              <AlertDescription className="text-destructive/90 dark:text-destructive/80">
                This action cannot be undone. This will permanently delete the task from the database.
              </AlertDescription>
            </Alert>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default React.memo(TaskList);
