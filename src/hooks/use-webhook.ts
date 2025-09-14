import { Webhook } from '@/lib/drizzle/type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWebhooks, getWebhookById, createWebhook, updateWebhook, deleteWebhook, deleteLog } from '@/app/home/webhooks/actions';

export const useGetWebhooks = (userId: string) => {
    return useQuery({
        queryKey: ['webhooks', userId],
        queryFn: async () => getWebhooks(userId),
        enabled: !!userId
    });
}

export const useGetWebhookById = (webhookId: string) => {
    return useQuery({
        queryKey: ['webhook', webhookId],
        queryFn: async () => getWebhookById(webhookId),
        enabled: !!webhookId,
    });
}

export const useCreateWebhook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => createWebhook(userId),
        onSuccess: (newWebhook, userId) => {
            queryClient.invalidateQueries({ queryKey: ['webhooks', userId] });
            queryClient.setQueryData(['webhooks', userId], (oldData: Webhook[]) => {
                return [newWebhook, ...(oldData || [])];
            });
        },
    });
}

export function useUpdateWebhook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({userId, updatedWebhook} :  { userId: string, updatedWebhook: Webhook }) => updateWebhook(userId, updatedWebhook),
        onSuccess: (nullValueIdkWhy, variables) => {
            queryClient.invalidateQueries({ queryKey: ['webhooks', variables.userId] });
            queryClient.setQueryData(['webhooks', variables.userId], (oldData: Webhook[]) => {
                return oldData?.map(webhook => webhook.id === variables.updatedWebhook.id ? variables.updatedWebhook : webhook) || [];
            });
            queryClient.setQueryData(['webhook', variables.updatedWebhook.id], variables.updatedWebhook);
        }
    });
}

export function useDeleteWebhook() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ webhookId, userId }: { webhookId: string; userId: string }) => deleteWebhook(webhookId, userId),
        onSuccess: (deletedWebhook, variables) => {
            queryClient.invalidateQueries({ queryKey: ['webhooks', variables.userId] });
            queryClient.setQueryData(['webhooks', variables.userId], (oldData: Webhook[]) => {
                return oldData?.filter(webhook => webhook.id !== variables.webhookId) || [];
            });
            queryClient.removeQueries({ queryKey: ['webhook', variables.webhookId] });
        },
    });
}

export function useDeleteLog() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ logId }: { logId: string; webhookId: string }) => deleteLog(logId),
        onSuccess: (deletedLog, variables) => {
            queryClient.invalidateQueries({ queryKey: ['webhook', variables.webhookId] });
        },
    });
}