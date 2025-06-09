"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteNote } from "@/hooks/use-note";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";
import { Note } from "@/lib/drizzle/type";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    note: Note;
}

export default function DeleteNoteModal({ isOpen, onOpenChange, projectId, note }: Props) {
    const {data, isPending} = useSession();
    const deleteNote = useDeleteNote();

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        if (isPending) return toast.error("Please wait, session is loading!");
        if (!data?.user?.id) return toast.error("User ID is not available!");

        if (!projectId || !note.id) return toast.error("Project ID and Note ID are required!");

        setIsLoading(true);
        deleteNote.mutate({
            noteId: note.id,
            projectId,
            userId: data.user.id
        }, {
            onSuccess: () => {
                toast.success("Note deleted successfully!");
                onOpenChange(false);
                setIsLoading(false);
            },
            onError: (error) => {
                console.error("Error deleting note:", error);
                toast.error("Failed to delete note!");
                setIsLoading(false);
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Delete Note</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    Are you sure you want to delete the note? This action cannot be undone.
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
                        {isLoading ? (<><Loader2 className="animate-spin" /> {"Deleting..."}</>) : "Delete Note"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}