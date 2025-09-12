"use client"

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { useGetProjects } from "@/hooks/use-project";
import { useCreateProject } from "@/hooks/use-project";
import { Loader2 } from "lucide-react"
import { useSession } from "@/lib/auth/client";
import { toast } from "sonner";
import { SidebarPopover } from "@/components/(home)/layout/sidebar-popover";
import { SidebarAccordion } from "@/components/(home)/layout/sidebar-accordion";
import { useState } from "react";

export function SidebarMain() {
    const {data, isPending} = useSession();
    const createProject = useCreateProject();
    const [openAccordion, setOpenAccordion] = useState<"projects" | "webhooks" | "both" | null>("projects");

    function handleOpenAccordion(type: "projects" | "webhooks" | "both") {
        const allowBothOpen = true;
        
        return (allowBothOpen)
            ? setOpenAccordion(prev => {
                if (prev === "both") {
                    return type === "projects" ? "webhooks" : "projects";
                } else if (prev === type) {
                    return null;
                } else if (prev === null) {
                    return type;
                } else {
                    return "both";
                }
            })
            : setOpenAccordion(prev => (prev === type ? null : type));
    }

    function handleNewProject() {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        (!data?.user?.id) ? toast.error("Was not possible to get UserId!") : createProject.mutate(data.user.id);
    }

    const { data: projects, isLoading, error, isError } = useGetProjects(data?.user.id || "");
    if(isError) console.error("Error loading projects:", error);
    
    return (
        <>
            {(!isPending && data?.user?.id && data.user.email === "robertovalennte@gmail.com") && (
                <SidebarGroup className="-mb-4">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="flex items-center gap-2 flex-col">
                                <SidebarPopover />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            )}
            {isLoading || isPending ? (
                <Loader2 className="size-4 animate-spin m-auto mt-3" />
            ) : isError ? (
                <span className="text-center text-[13px] text-muted-foreground mt-2">
                    Error loading projects!
                </span>
            ) : (
                <div className="flex flex-col pt-1">
                    <SidebarAccordion
                        title="Projects"
                        content={
                            projects
                                ? projects.map(project => ({ id: project.id, name: project.name ?? "", color: project.color ?? "" }))
                                : null
                        }
                        action={handleNewProject}
                        isOpen={openAccordion === "projects" || openAccordion === "both"}
                        handleOpen={() => handleOpenAccordion("projects")}
                    />
                    <SidebarAccordion
                        title="Webhooks"
                        content={
                            projects
                                ? projects.map(project => ({ id: project.id, name: project.name ?? "", color: project.color ?? "" }))
                                : null
                        }
                        action={handleNewProject}
                        isOpen={openAccordion === "webhooks" || openAccordion === "both"}
                        handleOpen={() => handleOpenAccordion("webhooks")}
                    />
                </div>
                
            )}
        </>
    )
}