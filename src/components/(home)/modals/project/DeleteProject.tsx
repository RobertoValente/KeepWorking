"use client"

import { Project } from "@/lib/drizzle/type";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProject } from "@/hooks/use-project";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project;
}

export default function DeleteProjectModal({ isOpen, onOpenChange, project }: Props) {
    const {data, isPending} = useSession();
    const deleteProject = useDeleteProject();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        if (isPending) return toast.error("Please wait, session is loading!");
        if (!data?.user?.id) return toast.error("User ID is not available!");

        setIsLoading(true);
        deleteProject.mutate({
            projectId: project.id,
            userId: data.user.id
        }, {
            onSuccess: () => {
                toast.success("Project deleted successfully!");
                onOpenChange(false);
                router.push('/home');
                setIsLoading(false);
            },
            onError: (error) => {
                console.error("Error deleting project:", error);
                toast.error("Failed to delete project!");
                setIsLoading(false);
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Edit Project</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    Are you sure you want to delete <b>{project.name}</b>? This action cannot be undone.
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
                        {isLoading ? (<><Loader2 className="animate-spin" /> {"Deleting..."}</>) : "Delete Project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}