"use client"

import { CircleDot, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useUpdateTask } from "@/hooks/use-task";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";
import { Task } from "@/lib/drizzle/type";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task;
}

export default function EditTaskModal({ isOpen, onOpenChange, task }: Props) {
    const {data, isPending} = useSession();
    const updateTask = useUpdateTask();

    const [content, setContent] = useState(task?.content || "");
    const [priority, setPriority] = useState(task?.priority || "normal");
    const [dueDate, setDueDate] = useState(task?.dueDate || "");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setContent(task?.content || "");
        setPriority(task?.priority || "normal");
        setDueDate(task?.dueDate || "");
    }, [task]);

    const handleEdit = (content: string, priority: string, dueDate: Date | null) => {
        if(isPending) return toast.error("Please wait, session is loading!");
        if(!data?.user?.id) return toast.error("User ID is not available!");

        if(!content.trim()) return toast.error("Task details is required!");
        if(!priority) return toast.error("Task priority is required!");
        if(!dueDate || isNaN(dueDate.getDate())) dueDate = null;

        setIsLoading(true);
        updateTask.mutate({
            userId: data.user.id,
            updatedTask: {
                ...task,
                content,
                priority,
                dueDate: dueDate,
            }
        }, {
            onSuccess: () => {
                toast.success("Task updated successfully!");
                onOpenChange(false);
                setIsLoading(false);
            },
            onError: (error) => {
                console.error("Error updating task:", error);
                toast.error("Failed to update task!");
                setIsLoading(false);
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Edit Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="block mb-2">Task Details</Label>
                        <Input
                            placeholder="I need to do ..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="block mb-2">Priority</Label>
                        <Select
                            defaultValue={priority}
                            value={priority}
                            onValueChange={(value) => setPriority(value.toLowerCase())}
                            disabled={isLoading}
                            required
                        >
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">
                                    <CircleDot className="!size-3"  color="green" fill="green" />
                                    Normal
                                </SelectItem>
                                <SelectItem value="important">
                                    <CircleDot className="!size-3"  color="orange" fill="orange" />
                                    Important
                                </SelectItem>
                                <SelectItem value="urgent">
                                    <CircleDot className="!size-3"  color="red" fill="red" />
                                    Urgent
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="block mb-2">Due Date (Optional)</Label>
                        <Input
                            type="date"
                            placeholder="Description"
                            value={typeof dueDate === "string" ? dueDate : dueDate?.toISOString().slice(0, 10) || ""}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full"
                            disabled={isLoading}
                        />
                    </div>
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
                        disabled={isLoading}
                        onClick={() => handleEdit(content, priority, new Date(dueDate))}
                    >
                        {isLoading ? (<><Loader2 className="animate-spin" /> {"Editing..."}</>) : "Edit Task"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}