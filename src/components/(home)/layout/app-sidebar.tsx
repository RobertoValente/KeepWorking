import { Sidebar, SidebarContent, SidebarFooter as SidebarFooterShadcn, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { SidebarFooter } from "@/components/(home)/layout/sidebar-footer"
import { SidebarMain } from "@/components/(home)/layout/sidebar-main"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
 
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/home">
                                <Image src={"/logo.png"} alt="KeepWorking Logo" height={24} width={24} />
                                <span className="text-base font-semibold">KeepWorking.</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                    <SidebarMain />
            </SidebarContent>
            <SidebarFooterShadcn>
                    <SidebarFooter />
            </SidebarFooterShadcn>
        </Sidebar>
    )
}