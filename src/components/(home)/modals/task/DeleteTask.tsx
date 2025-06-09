"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "@/hooks/use-task";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";
import { Task } from "@/lib/drizzle/type";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    task: Task;
}

export default function DeleteTaskModal({ isOpen, onOpenChange, projectId, task }: Props) {
    const {data, isPending} = useSession();
    const deleteTask = useDeleteTask();

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        if (isPending) return toast.error("Please wait, session is loading!");
        if (!data?.user?.id) return toast.error("User ID is not available!");

        if (!projectId || !task.id) return toast.error("Project ID and Task ID are required!");

        setIsLoading(true);
        deleteTask.mutate({
            taskId: task.id,
            projectId,
            userId: data.user.id
        }, {
            onSuccess: () => {
                toast.success("Task deleted successfully!");
                onOpenChange(false);
                setIsLoading(false);
            },
            onError: (error) => {
                console.error("Error deleting task:", error);
                toast.error("Failed to delete task!");
                setIsLoading(false);
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Delete Task</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    Are you sure you want to delete the task? This action cannot be undone.
                </div>
                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="cursor-pointer"
                        variant="destructive"
                        disabled={isLoading}
                        onClick={() => handleDelete()}
                    >
                        {isLoading ? (<><Loader2 className="animate-spin" /> {"Deleting..."}</>) : "Delete Task"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}