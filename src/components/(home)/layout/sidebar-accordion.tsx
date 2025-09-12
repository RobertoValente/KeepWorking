import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight, CircleDot, Plus } from "lucide-react";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
    title: string,
    content: { id: string, name: string, color: string }[] | null,
    action: () => void,
    isOpen: boolean,
    handleOpen: (this: unknown) => void,
}

export function SidebarAccordion({ title, content, action, isOpen, handleOpen }: Props) {
    const pathname = usePathname();

    function getHexCode(color: string | undefined) {
        const ColorHex = {
            "red": "#f14445",
            "green": "#20c45f",
            "blue": "#3a81f6",
            "orange": "#f87103",
            "yellow": "#f9cc21",
            "purple": "#a957f7",
        };
    
        return ColorHex[color as keyof typeof ColorHex] || ColorHex["blue"];
    }

    return (
        <>
            <SidebarGroup className="select-none py-1">
                <SidebarGroupLabel className="flex items-center justify-between p-0">
                    <div className="flex items-center gap-1 flex-1 cursor-pointer h-8 hover:text-accent-foreground" onClick={handleOpen}>
                        {isOpen ? <ChevronDown className="!size-4" /> : <ChevronRight className="!size-4" />}
                        {title}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="!size-8 cursor-pointer hover:!bg-transparent"
                        onClick={action}
                    >
                        <Plus className="!size-4 !-mr-3" />
                    </Button>
                </SidebarGroupLabel>
                {isOpen && (
                    <SidebarGroupContent 
                        className="flex flex-col gap-2 overflow-y-auto pr-2
                            [&::-webkit-scrollbar]:w-2
                            [&::-webkit-scrollbar-track]:bg-gray-100
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-gray-300
                            [&::-webkit-scrollbar-track]:rounded-full
                            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                        "
                        style={{ maxHeight: 'calc(100vh - 300px)' }}
                    >
                        <SidebarMenu>
                            {!content || content?.length === 0 ? (
                                <span className="text-center text-[13px] mx-2 text-muted-foreground mt-1">
                                    Nothing found.
                                </span>
                            ) : (
                                content.map(project => (
                                    
                                        
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
                )}
            </SidebarGroup>
        </>
    );
}