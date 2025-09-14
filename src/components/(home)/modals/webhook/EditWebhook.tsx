"use client"

import { CircleDot, Loader2 } from "lucide-react";
import { Webhook } from "@/lib/drizzle/type";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useUpdateWebhook } from "@/hooks/use-webhook";
import { toast } from "sonner";
import { useSession } from "@/lib/auth/client";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    webhook: Webhook;
}

export default function EditWebhookModal({ isOpen, onOpenChange, webhook }: Props) {
    const {data, isPending} = useSession();
    const updateWebhook = useUpdateWebhook();

    const [name, setName] = useState(webhook.name || "");
    const [description, setDescription] = useState(webhook.description || "");
    const [color, setColor] = useState(webhook.color || "blue");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = (updatedWebhook: { name: string; description: string; color: string }) => {
        if(isPending) return toast.error("Please wait, session is loading!");
        if(!data?.user?.id) return toast.error("User ID is not available!");

        if(!name.trim()) return toast.error("Webhook name is required!");
        if(!color) return toast.error("Webhook color is required!");

        setIsLoading(true);
        updateWebhook.mutate({
            userId: data.user.id,
            updatedWebhook: {
                ...webhook,
                name: updatedWebhook.name,
                description: updatedWebhook.description,
                color: updatedWebhook.color
            }
        }, {
            onSuccess: () => {
                toast.success("Webhook updated successfully!");
                onOpenChange(false);
                setIsLoading(false);
            },
            onError: (error) => {
                console.error("Error updating webhook:", error);
                toast.error("Failed to update webhook!");
                setIsLoading(false);
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl">Edit Webhook</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="block mb-2">Webhook Name</Label>
                        <Input
                            placeholder="Webhook Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="block mb-2">Description (Optional)</Label>
                        <Textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full"
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="block mb-2">Color</Label>
                        <Select
                            value={color}
                            onValueChange={(value) => setColor(value)}
                            disabled={isLoading}
                            required
                        >
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="red">
                                    <CircleDot className="!size-3"  color="#f14445" fill="#f14445" />
                                    Red
                                </SelectItem>
                                <SelectItem value="green">
                                    <CircleDot className="!size-3"  color="#15ba81" fill="#15ba81" />
                                    Green
                                </SelectItem>
                                <SelectItem value="blue">
                                    <CircleDot className="!size-3"  color="#3a81f6" fill="#3a81f6" />
                                    Blue
                                </SelectItem>
                                <SelectItem value="orange">
                                    <CircleDot className="!size-3"  color="#f87103" fill="#f87103" />
                                    Orange
                                </SelectItem>
                                <SelectItem value="yellow">
                                    <CircleDot className="!size-3"  color="#f9cc21" fill="#f9cc21" />
                                    Yellow
                                </SelectItem>
                                <SelectItem value="purple">
                                    <CircleDot className="!size-3"  color="#a957f7" fill="#a957f7" />
                                    Purple
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="cursor-pointer"
                        disabled={isLoading}
                        onClick={() => handleSave({ name, description, color })}
                    >
                        {isLoading ? (<><Loader2 className="animate-spin" /> {"Editing..."}</>) : "Edit Webhook"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}