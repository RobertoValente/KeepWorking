"use client"

import { CircleDot, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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

    const [isLoading, setIsLoading] = useState(false);
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

        setIsLoading(true);
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
                setIsLoading(false);
            },
            onError: (error) => {
                console.error("Error updating note:", error);
                toast.error("Failed to update note!");
                setIsLoading(false);
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
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="block mb-2">Pinned</Label>
                        <Select
                            defaultValue={isPinned.toString()}
                            value={isPinned.toString()}
                            onValueChange={(value) => setIsPinned(value === "1" ? 1 : 0)}
                            disabled={isLoading}
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
                                    <CircleDot className="!size-3"  color="#f9cc21" fill="#f9cc21" />
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
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="cursor-pointer"
                        disabled={isLoading}
                        onClick={() => handleEdit(content, isPinned)}
                    >
                        {isLoading ? (<><Loader2 className="animate-spin" /> {"Editing..."}</>) : "Edit Note"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}