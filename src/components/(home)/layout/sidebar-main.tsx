"use client"

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { Plus, Loader2, CircleDot } from "lucide-react"
import { useSession } from "@/lib/auth/client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const ColorHex = {
    red: "#f14445",
    emerald: "#15ba81",
    blue: "#3a81f6",
    orange: "#f87103",
    yellow: "#f9cc21",
    purple: "#a957f7",
};

const actionItems = [
    {
        title: "Users",
        path: "/home/project/123",
        icon: <CircleDot className="!size-3" color={ColorHex.purple} fill={ColorHex.purple} />,
        tooltip: "Manage users",
        roles: ["superAdmin"],
    },
    {
        title: "Stations",
        path: "/home/project/123",
        icon: <CircleDot className="!size-3" color={ColorHex.blue} fill={ColorHex.blue} />,
        tooltip: "Manage stations",
        roles: ["superAdmin", "admin"],
    }
];

async function handleNewProject() {
    alert("New project creation is not implemented yet.");
}

export function SidebarMain() {
    const {data, isPending} = useSession();
    const pathname = usePathname();

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
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin m-auto mt-2" />
                    ) : (
                        actionItems
                        .map(item => (
                            <SidebarMenuItem key={`${item.title}SidebarBtn`}>
                                    <SidebarMenuButton
                                        asChild
                                        className="cursor-pointer"
                                        isActive={pathname.startsWith(item.path)}
                                        tooltip={item.tooltip}
                                        >
                                        <Link href={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
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