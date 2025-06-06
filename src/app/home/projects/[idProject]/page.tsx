"use client"

import { ProjectDetails } from "@/components/(home)/project/project-details";
import { useGetProjectById } from "@/hooks/home/use-getprojectbyid";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProjectPage() {
    const params = useParams();
    
    const { data: project, isLoading, error, isError } = useGetProjectById(params.idProject as string);
    if(isError) console.error("Error loading projects:", error);

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="size-4 animate-spin m-auto mt-2" />
                </div>
            ) : isError ? (
                <span className="text-center text-[13px] text-muted-foreground mt-1">
                    Error loading project!
                </span>
            ) : !project ? (
                <span className="text-center text-[13px] mx-2 text-muted-foreground mt-1">
                    Nothing found!
                </span>
            ) : (
                <ProjectDetails project={project} />
            )}
        </>
    );
}