"use client"

import { CircleDot } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useUpdateNote } from "@/hooks/use-note";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";
import { Note } from "@/lib/drizzle/type";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    note: Note;
}

export default function EditNoteModal({ isOpen, onOpenChange, note }: Props) {
    const {data, isPending} = useSession();
    const updateNote = useUpdateNote();

    const [content, setContent] = useState(note?.content || "");
    const [isPinned, setIsPinned] = useState(note?.isPinned || 0);

    useEffect(() => {
        setContent(note?.content || "");
        setIsPinned(note?.isPinned || 0);
    }, [note]);

    const handleEdit = (content: string, isPinned: number) => {
        if(isPending) return toast.error("Please wait, session is loading!");
        if(!data?.user?.id) return toast.error("User ID is not available!");

        if(!content.trim()) return toast.error("Task details is required!");

        updateNote.mutate({
            userId: data.user.id,
            updatedNote: {
                ...note,
                content,
                isPinned,
            }
        }, {
            onSuccess: () => {
                toast.success("Note updated successfully!");
                onOpenChange(false);
                setContent("");
                setIsPinned(0);
            },
            onError: (error) => {
                console.error("Error updating note:", error);
                toast.error("Failed to update note!");
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Edit Note</DialogTitle>
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
                                    <CircleDot className="!size-3"  color="orange" fill="orange" />
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
                        onClick={() => handleEdit(content, isPinned)}
                    >
                        Edit Note
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}