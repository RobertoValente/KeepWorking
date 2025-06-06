"use client"

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/home/use-getprojects";
import { useCreateProject } from "@/hooks/home/use-createprojects";
import { Plus, Loader2, CircleDot } from "lucide-react"
import { useSession } from "@/lib/auth/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

function getHexCode(color: string | undefined) {
    const ColorHex = {
        "red": "#f14445",
        "emerald": "#15ba81",
        "blue": "#3a81f6",
        "orange": "#f87103",
        "yellow": "#f9cc21",
        "purple": "#a957f7",
    };

    return ColorHex[color as keyof typeof ColorHex] || ColorHex["blue"];
}

export function SidebarMain() {
    const {data, isPending} = useSession();
    const pathname = usePathname();
    const createProject = useCreateProject();

    function handleNewProject() {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        (!data?.user?.id) ? toast.error("Was not possible to get UserId!") : createProject.mutate(data.user.id);
    }

    const { data: projects, isLoading, error, isError } = useProjects(data?.user.id || "");
    if(isError) console.error("Error loading projects:", error);

    return (
        <>
        <SidebarGroup className="-mb-4">
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <Button
                            size="icon"
                            className="size-8 w-full group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                            variant="outline"
                            onClick={handleNewProject}
                            disabled={createProject.isPending}
                        >
                            <Plus />
                            New Project
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
            <SidebarGroupLabel>
                Projects
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {isLoading || isPending ? (
                        <Loader2 className="size-4 animate-spin m-auto mt-2" />
                    ) : isError ? (
                        <span className="text-center text-[13px] text-muted-foreground mt-1">
                            Error loading projects!
                        </span>
                    ) : !projects || projects.length === 0 ? (
                        <span className="text-center text-[13px] mx-2 text-muted-foreground mt-1">
                            Nothing found.
                        </span>
                    ) : (
                        projects.map(project => (
                            <SidebarMenuItem key={`${project.id}-SideBarBtn`}>
                                <SidebarMenuButton
                                        asChild
                                        className="cursor-pointer"
                                        isActive={pathname === ("/home/projects/" + project.id)}
                                        tooltip={project.name}
                                    >
                                    <Link href={"/home/projects/" + project.id}>
                                        <CircleDot className="!size-3" color={getHexCode(project.color)} fill={getHexCode(project.color)} />
                                        <span>{project.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
        
        </>
    )
}