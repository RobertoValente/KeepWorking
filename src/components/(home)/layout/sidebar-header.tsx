"use client";

import { SidebarTrigger } from "@/components/ui/sidebar"
import React from "react"

export function SidebarHeader() {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-50 bg-white dark:bg-neutral-950 rounded-t-xl">
            <div className="flex w-full items-center gap-1 px-4 py-2 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1 cursor-pointer" />
            </div>
        </header>
    )
}