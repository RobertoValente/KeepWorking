"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteNote } from "@/hooks/use-note";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";
import { Note } from "@/lib/drizzle/type";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    note: Note;
}

export default function DeleteNoteModal({ isOpen, onOpenChange, projectId, note }: Props) {
    const {data, isPending} = useSession();
    const deleteNote = useDeleteNote();

    const handleDelete = () => {
        if (isPending) return toast.error("Please wait, session is loading!");
        if (!data?.user?.id) return toast.error("User ID is not available!");

        if (!projectId || !note.id) return toast.error("Project ID and Note ID are required!");

        deleteNote.mutate({
            noteId: note.id,
            projectId,
            userId: data.user.id
        }, {
            onSuccess: () => {
                toast.success("Note deleted successfully!");
                onOpenChange(false);
            },
            onError: (error) => {
                console.error("Error deleting note:", error);
                toast.error("Failed to delete note!");
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