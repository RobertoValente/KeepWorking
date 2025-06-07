"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "@/hooks/use-task";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";
import { Task } from "@/lib/drizzle/type";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    task: Task;
}

export default function DeleteTaskModal({ isOpen, onOpenChange, projectId, task }: Props) {
    const {data, isPending} = useSession();
    const deleteTask = useDeleteTask();

    const handleDelete = () => {
        if (isPending) return toast.error("Please wait, session is loading!");
        if (!data?.user?.id) return toast.error("User ID is not available!");

        if (!projectId || !task.id) return toast.error("Project ID and Task ID are required!");

        deleteTask.mutate({
            taskId: task.id,
            projectId,
            userId: data.user.id
        }, {
            onSuccess: () => {
                toast.success("Task deleted successfully!");
                onOpenChange(false);
            },
            onError: (error) => {
                console.error("Error deleting task:", error);
                toast.error("Failed to delete task!");
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Edit Project</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    Are you sure you want to delete the task? This action cannot be undone.
                </div>
                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => handleDelete()}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}