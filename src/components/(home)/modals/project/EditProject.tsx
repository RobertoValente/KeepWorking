"use client"

import { CircleDot } from "lucide-react";
import { Project } from "@/lib/drizzle/type";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useUpdateProject } from "@/hooks/use-project";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project;
}

export default function EditProjectModal({ isOpen, onOpenChange, project }: Props) {
    const {data, isPending} = useSession();
    const updateProject = useUpdateProject();

    const [name, setName] = useState(project.name || "");
    const [description, setDescription] = useState(project.description || "");
    const [color, setColor] = useState(project.color || "blue");

    const handleSave = (updatedProject: { name: string; description: string; color: string }) => {
        if(isPending) return toast.error("Please wait, session is loading!");
        if(!data?.user?.id) return toast.error("User ID is not available!");

        if(!name.trim()) return toast.error("Project name is required!");
        if(!color) return toast.error("Project color is required!");

        updateProject.mutate({
            userId: data.user.id,
            updatedProject: {
                ...project,
                name: updatedProject.name,
                description: updatedProject.description,
                color: updatedProject.color
            }
        }, {
            onSuccess: () => {
                toast.success("Project updated successfully!");
                onOpenChange(false);
            },
            onError: (error) => {
                console.error("Error updating project:", error);
                toast.error("Failed to update project!");
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Edit Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="block mb-2">Project Name</Label>
                        <Input
                            placeholder="Project Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="block mb-2">Description (Optional)</Label>
                        <Input
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="block mb-2">Color</Label>
                        <Select
                            value={color}
                            onValueChange={(value) => setColor(value)}
                            required
                        >
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="red">
                                    <CircleDot className="!size-3"  color="#f14445" fill="#f14445" />
                                    Red
                                </SelectItem>
                                <SelectItem value="green">
                                    <CircleDot className="!size-3"  color="#15ba81" fill="#15ba81" />
                                    Green
                                </SelectItem>
                                <SelectItem value="blue">
                                    <CircleDot className="!size-3"  color="#3a81f6" fill="#3a81f6" />
                                    Blue
                                </SelectItem>
                                <SelectItem value="orange">
                                    <CircleDot className="!size-3"  color="#f87103" fill="#f87103" />
                                    Orange
                                </SelectItem>
                                <SelectItem value="yellow">
                                    <CircleDot className="!size-3"  color="#f9cc21" fill="#f9cc21" />
                                    Yellow
                                </SelectItem>
                                <SelectItem value="purple">
                                    <CircleDot className="!size-3"  color="#a957f7" fill="#a957f7" />
                                    Purple
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
                        onClick={() => handleSave({ name, description, color })}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}