import { AppContextProvider } from "@/components/(home)/layout/app-context-provider"
import { SidebarHeader } from "@/components/(home)/layout/sidebar-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/(home)/layout/app-sidebar"
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session || !session?.user) redirect("/sign-in");

    return (
        <SidebarProvider>
            <AppContextProvider>
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SidebarHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 p-2 md:gap-6 md:p-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </AppContextProvider>
        </SidebarProvider>
    )
}