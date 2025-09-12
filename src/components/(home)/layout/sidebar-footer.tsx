"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppContext } from "@/components/(home)/layout/app-context-provider"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut, Monitor, Moon, Sun } from "lucide-react"
import { signOut /*, useSession*/ } from "@/lib/auth/client"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { toast } from "sonner"
//import Link from "next/link"

export function SidebarFooter() {
    //const {data, isPending} = useSession();
    const { theme, updateTheme } = useContext(AppContext);
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess() {
                    //console.log("Sign out success:", ctx);
                    router.push("/");
                },
                onError(ctx) {
                    //console.error("Sign out error:", ctx);
                    toast.error(ctx.error.message + "! Please contact support.");
                },
            }
        });
    };

    return (
        <SidebarMenu className="gap-2">
            <SidebarMenuItem key="ThemeSidebarSelect">
                <Select
                    defaultValue={theme}
                    onValueChange={(value) => updateTheme(value)}
                >
                    <SelectTrigger className="w-full hover:cursor-pointer">
                        <SelectValue placeholder="Change Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">
                            <Sun className="size-4" />
                            Light
                        </SelectItem>
                        <SelectItem value="dark">
                            <Moon className="size-4" />
                            Dark
                        </SelectItem>
                        <SelectItem value="system">
                            <Monitor className="size-4" />
                            System
                        </SelectItem>
                    </SelectContent>
                </Select>
            </SidebarMenuItem>
            <SidebarMenuItem key="LogoutSidebarBtn">
                <Button
                    variant={"outline"}
                    className="w-full  text-red-500 cursor-pointer hover:text-red-400"
                    onClick={handleLogout}
                >
                    <LogOut />
                    <span>Logout</span>
                </Button>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}