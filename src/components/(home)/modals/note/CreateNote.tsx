"use client"

import { CircleDot } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCreateNote } from "@/hooks/use-note";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
}

export default function CreateNoteModal({ isOpen, onOpenChange, projectId }: Props) {
    const {data, isPending} = useSession();
    const createNote = useCreateNote();

    const [content, setContent] = useState("");
    const [isPinned, setIsPinned] = useState(0);

    const handleCreate = (content: string, isPinned: number) => {
        if(isPending) return toast.error("Please wait, session is loading!");
        if(!data?.user?.id) return toast.error("User ID is not available!");

        if(!content.trim()) return toast.error("Note details is required!");

        createNote.mutate({
            userId: data.user.id,
            newNote: {
                content: content.trim(),
                isPinned,
                projectId: projectId,
            }
        }, {
            onSuccess: () => {
                toast.success("Note created successfully!");
                onOpenChange(false);
                setContent("");
                setIsPinned(0);
            },
            onError: (error) => {
                console.error("Error creating note:", error);
                toast.error("Failed to create note!");
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Create Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="block mb-2">Note Details</Label>
                        <Textarea
                            placeholder="Check ..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full max-h-18"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="block mb-2">Pinned</Label>
                        <Select
                            defaultValue={isPinned.toString()}
                            value={isPinned.toString()}
                            onValueChange={(value) => setIsPinned(value === "1" ? 1 : 0)}
                            required
                        >
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">
                                    <CircleDot className="!size-3"  color="red" fill="red" />
                                    No
                                </SelectItem>
                                <SelectItem value="1">
                                    <CircleDot className="!size-3"  color="#f9cc21" fill="orange" />
                                    Yes
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
                        onClick={() => handleCreate(content, isPinned)}
                    >
                        Create Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}