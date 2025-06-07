"use client"

import { CircleDot } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCreateTask } from "@/hooks/use-task";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
}

export default function CreateTaskModal({ isOpen, onOpenChange, projectId }: Props) {
    const {data, isPending} = useSession();
    const createTask = useCreateTask();

    const [content, setContent] = useState("");
    const [priority, setPriority] = useState("normal");
    const [dueDate, setDueDate] = useState("");

    const handleCreate = (content: string, priority: string, dueDate: Date | null) => {
        if(isPending) return toast.error("Please wait, session is loading!");
        if(!data?.user?.id) return toast.error("User ID is not available!");

        if(!content.trim()) return toast.error("Task details is required!");
        if(!priority) return toast.error("Task priority is required!");
        if(!dueDate) dueDate = null;

        createTask.mutate({
            userId: data.user.id,
            newTask: {
                content,
                priority,
                dueDate,
                projectId,
            }
        }, {
            onSuccess: () => {
                toast.success("Task created successfully!");
                onOpenChange(false);
                setContent("");
                setPriority("normal");
                setDueDate("");
            },
            onError: (error) => {
                console.error("Error creating task:", error);
                toast.error("Failed to create task!");
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Create Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="block mb-2">Task Details</Label>
                        <Input
                            placeholder="I need to do ..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="block mb-2">Priority</Label>
                        <Select
                            defaultValue={priority}
                            value={priority}
                            onValueChange={(value) => setPriority(value)}
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
                            value={dueDate.toLocaleString()}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full"
                        />
                    </div>
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
                        onClick={() => handleCreate(content, priority, new Date(dueDate))}
                    >
                        Create Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}