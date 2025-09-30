"use client"

import EditWebhookModal from "@/components/(home)/modals/webhook/EditWebhook";
import DeleteWebhookModal from "@/components/(home)/modals/webhook/DeleteWebhook";
import DeleteLogModal from "@/components/(home)/modals/webhook/DeleteLog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetWebhookById } from "@/hooks/use-webhook";
import { Loader2, Pencil, Trash2, X, RefreshCcw, Copy, CopyCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Log } from "@/lib/drizzle/type";
import { toast } from "sonner";

function formatDate(date: Date | string | undefined): string {
    if (!date) return null as unknown as string;
    
    if (typeof date === 'string') {
        date = new Date(date);
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return null as unknown as string;
    }
    
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

function formatLogContent(type: string, content: string) {
    if (type === 'external') {
        return (
            <span className="text-sm font-medium truncate w-full break-words whitespace-pre-line pr-2 sm:pr-3">
                {content}
            </span>
        );
    } else {
        try {
            const parsed = JSON.parse(content);
            return (
                <div className="flex flex-col gap-1 w-full">
                    <span className="font-semibold text-sm break-words whitespace-pre-line pr-2 sm:pr-3">
                        {parsed.title}
                    </span>
                    <span className="text-xs text-muted-foreground break-words whitespace-pre-line pr-2 sm:pr-3">
                        {parsed.description}
                    </span>
                </div>
            );
        } catch {
            return (
                <span className="text-sm font-medium truncate w-full break-words whitespace-pre-line pr-2 sm:pr-3">
                    {content}
                </span>
            );
        }
    }
}

export default function WebhookPage() {
    const params = useParams();

    const [editWebhook, setEditWebhook] = useState(false);
    const [deleteWebhook, setDeleteWebhook] = useState(false);

    const [deleteLog, setDeleteLog] = useState(false);
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const isAnyModalOpen = editWebhook || deleteWebhook || deleteLog;

    const { data: webhook, isLoading, error, isError, refetch, isFetching } = useGetWebhookById(params.idWebhook as string);
    if(isError) console.error("Error loading webhooks:", error);

    return (
        <>  
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="size-4 animate-spin m-auto mt-2" />
                </div>
            ) : isError ? (
                <span className="text-center text-[13px] text-muted-foreground mt-1">
                    Error loading webhook!
                </span>
            ) : !webhook ? (
                <span className="text-center text-[13px] mx-2 text-muted-foreground mt-1">
                    Nothing found!
                </span>
            ) : (
                <>
                    <div id="project-details" className={isAnyModalOpen ? "blur-xs transition-all" : "transition-all"}>
                        <div className="flex items-center justify-start gap-2 mb-4">
                            <Button
                                variant="outline"
                                size="icon"
                                className="cursor-pointer"
                                title={isCopied ? "Copied!" : "Copy Webhook URL"}
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/${webhook.id}`);
                                        setIsCopied(true);
                                        toast.success('Webhook URL copied to clipboard!');
                                        
                                        setTimeout(() => {
                                            setIsCopied(false);
                                        }, 2000);
                                    } catch {
                                        toast.error('Failed to copy URL to clipboard');
                                    }
                                }}
                            >
                                {isCopied ? (
                                    <CopyCheck className="size-4" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                            </Button>
                            <h1 className="text-4xl font-bold mr-2">{webhook.name}</h1>
                        </div>
                        <div className="text-base -mt-2">

                            <span className="italic text-gray-600 dark:text-gray-400">
                                Created on {formatDate(webhook.createdAt)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <Button
                                variant="outline" className="cursor-pointer hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-colors"
                                onClick={() => setEditWebhook(true)}
                            >
                                <Pencil className="size-4 text-yellow-500 dark:text-yellow-400" />
                                Edit Webhook
                            </Button>
                            <Button
                                onClick={() => setDeleteWebhook(true)}
                                variant="outline" className="cursor-pointer hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                            >
                                <Trash2 className="size-4 text-red-500 dark:text-red-400" />
                                Delete Webhook
                            </Button>
                        </div>
                    </div>

                    <div id="project-content" className={`mt-4 ${isAnyModalOpen ? "blur-sm pointer-events-none select-none transition-all" : "transition-all"}`}>
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold">Webhook Details</h2>
                        </div>

                        <Tabs defaultValue="logs">
                            <TabsList className="absolute right-6 -mt-13">
                                <TabsTrigger value="logs" className="cursor-pointer">Logs</TabsTrigger>
                            </TabsList>
                            <TabsContent value="logs">
                                <Card className="w-full p-2">
                                    <CardHeader className="p-2">
                                        <CardDescription>
                                            <Button 
                                                onClick={() => refetch()} 
                                                className="cursor-pointer w-full" 
                                                variant="outline"
                                                disabled={isFetching}
                                            >
                                                <RefreshCcw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
                                                {isFetching ? 'Refreshing...' : 'Refresh Logs'}
                                            </Button>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-2 text-center -mt-8 ">
                                        {!webhook.logs || webhook.logs.length === 0 ? (
                                            <span className="text-[13px] text-muted-foreground">
                                                No logs found!
                                            </span>
                                        ) : (
                                            <div className="flex flex-col gap-4 w-full">
                                                {webhook.logs.map(log => (
                                                    <div
                                                        key={log.id}
                                                        className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow-sm w-full max-w-full sm:max-w-none text-center sm:text-left flex-1 min-w-[280px]"
                                                    >
                                                        <div className="flex items-center gap-3 w-full">
                                                            <div className={`type-${log.type} flex flex-col justify-center flex-1 min-w-0 text-left`}>
                                                                {formatLogContent(log.type || '', log.content || '')}
                                                            </div>
                                                            <Button
                                                                onClick={() => {setSelectedLog(log); setDeleteLog(true)}}
                                                                className="cursor-pointer"
                                                                variant={"outline"}
                                                                size={"icon"}
                                                                title="Delete log"
                                                            >
                                                                <X className="size-4 text-red-500 dark:text-red-400" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <EditWebhookModal
                            isOpen={editWebhook}
                            onOpenChange={setEditWebhook}
                            webhook={webhook}
                        />

                        <DeleteWebhookModal
                            isOpen={deleteWebhook}
                            onOpenChange={setDeleteWebhook}
                            webhook={webhook}
                        />

                        <DeleteLogModal
                            isOpen={deleteLog}
                            onOpenChange={setDeleteLog}
                            webhookId={webhook.id}
                            log={selectedLog as Log}
                        />
                    </div>
                </>
            )}
        </>
    );
}