import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

const usefulLinks = {
    "🧠 Cérebro": "https://docs.google.com/document/d/1D9N3p33j0uiRuVCob-txz8dWlRaKjH4b-xBAWwIOndY/edit?tab=t.ioldll5tn8iu",
    "🗂️ PhpMyAdmin": "http://phpmyadmin.robertovalente.pt/",
    "📆 Google Calendar": "https://calendar.google.com/calendar/u/0/r",
}

export function SidebarPopover() {
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        size="icon"
                        className="size-8 w-full group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                        variant="outline"
                    >Quick Links</Button>
                </PopoverTrigger>
                <PopoverContent className="mt-1 w-[271px] md:w-56">
                    <div className="flex flex-col gap-2">
                        {Object.entries(usefulLinks).map(([name, url]) => (
                            <Link
                                key={name}
                                href={url}
                                target="_blank"
                            >
                                <Button variant="outline" className="w-full cursor-pointer justify-start">
                                    <ExternalLink className="" />
                                    {name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    )
}