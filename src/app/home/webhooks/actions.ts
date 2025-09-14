"use server"

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { Query } from "@/lib/drizzle/query";
import { Webhook } from "@/lib/drizzle/type";

export const getWebhooks = async (userId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const webhooks = await Query.getWebhooks(userId);
    return webhooks;
}

export const getWebhookById = async (webhookId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");

    const webhook = await Query.getWebhookById(webhookId, session.user.id);
    return webhook;
}

export const createWebhook = async (userId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const webhook = await Query.createWebhook(userId);
    return webhook;
}

export const updateWebhook = async (userId: string, updatedWebhook: Webhook) => {
    const session = await getUserSession();
    
    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const webhook = await Query.updateWebhook(userId, updatedWebhook.id, updatedWebhook);
    return webhook;
}

export const deleteWebhook = async (webhookId: string, userId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");
    if(session.user.id !== userId) throw new Error("UserId and SessionUserId are different!");

    const webhook = await Query.deleteWebhook(webhookId, userId);
    return webhook;
}

export const deleteLog = async (logId: string) => {
    const session = await getUserSession();

    if(!session || !session?.user) throw new Error("User not authenticated!");

    const log = await Query.deleteLog(logId);
    return log;
}

async function getUserSession() {
    return auth.api.getSession({
        headers: await headers(),
    });
}