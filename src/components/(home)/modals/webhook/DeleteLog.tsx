"use client"

import { Log } from "@/lib/drizzle/type";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteLog } from "@/hooks/use-webhook";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    webhookId: string;
    log: Log | null;
}

export default function DeleteLogModal({ isOpen, onOpenChange, webhookId, log }: Props) {
    const {data, isPending} = useSession();
    const deleteLog = useDeleteLog();

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        if (isPending) return toast.error("Please wait, session is loading!");
        if (!data?.user?.id) return toast.error("User ID is not available!");
        if (!log?.id) return toast.error("Log ID is not available!");

        setIsLoading(true);
        deleteLog.mutate({
            logId: log.id,
            webhookId: webhookId
        }, {
            onSuccess: () => {
                toast.success("Log deleted successfully!");
                onOpenChange(false);
                setIsLoading(false);
            },
            onError: (error) => {
                console.error("Error deleting log:", error);
                toast.error("Failed to delete log!");
                setIsLoading(false);
            }
        });
    }

    if (!log) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Delete Log</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    Are you sure you want to delete this log? This action cannot be undone.
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
                        {isLoading ? (<><Loader2 className="animate-spin" /> {"Deleting..."}</>) : "Delete Log"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}