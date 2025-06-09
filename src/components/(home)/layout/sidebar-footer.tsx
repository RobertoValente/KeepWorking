"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppContext } from "@/components/(home)/layout/app-context-provider"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ExternalLink, LogOut, Monitor, Moon, Sun } from "lucide-react"
import { signOut, useSession } from "@/lib/auth/client"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { toast } from "sonner"
import Link from "next/link"

export function SidebarFooter() {
    const {data, isPending} = useSession();
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
            {(!isPending && data?.user?.id && data.user.email === "robertovalennte@gmail.com") && (
                <>
                    <SidebarMenuItem key="GoogleDocsIntershipSeasonBtn">
                        <Link href={"https://docs.google.com/document/d/1WIwUwPvxslJLO5uslRsDUAbsqJ5a0vN9rK5Wkp4RGbs/edit?tab=t.0"} target="_blank">
                            <Button
                                variant="outline"
                                className="w-full hover:cursor-pointer justify-start"
                            >
                                <ExternalLink className="size-4" />
                                🚀 Época Estágio
                            </Button>
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem key="GoogleDocsBrainBtn">
                        <Link href={"https://docs.google.com/document/d/1D9N3p33j0uiRuVCob-txz8dWlRaKjH4b-xBAWwIOndY/edit?tab=t.ioldll5tn8iu"} target="_blank">
                            <Button
                                variant="outline"
                                className="w-full hover:cursor-pointer justify-start"
                            >
                                <ExternalLink className="size-4" />
                                🧠 Cérebro
                            </Button>
                        </Link>
                    </SidebarMenuItem>
                </>
            )}
            <SidebarMenuItem key="GoogleCalendarBtn">
                <Link href={"https://calendar.google.com/calendar/u/0/r"} target="_blank">
                    <Button
                        variant="outline"
                        className="w-full hover:cursor-pointer justify-start"
                    >
                        <ExternalLink className="size-4" />
                        📆 Google Calendar
                    </Button>
                </Link>
            </SidebarMenuItem>
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